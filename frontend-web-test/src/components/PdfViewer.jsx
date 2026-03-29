import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { authHeaders } from '../auth'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const BACKEND = 'https://api.formfriend.xyz'

function buildAnchors(parsed, steps) {
  if (!parsed || !steps?.length) return []
  const byId = {}
  for (const line of parsed) {
    for (const block of line) {
      if (block.id) byId[block.id] = block
    }
  }
  const result = []
  for (const step of steps) {
    for (const id of step.targetElementIds ?? []) {
      if (byId[id]) {
        result.push({ step, block: byId[id] })
        break
      }
    }
  }
  return result
}

function StepMarker({ stepNumber, title, description, x, y, pageWidth, active, hoverEnabled, onDismiss }) {
  const [hovered, setHovered] = useState(false)
  const open = (hoverEnabled && hovered) || active
  const flipLeft = pageWidth && x > pageWidth / 2
  const markerRef = useRef(null)

  useEffect(() => {
    if (active && markerRef.current) {
      markerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    function handleMouseDown(e) {
      if (markerRef.current && !markerRef.current.contains(e.target)) {
        onDismiss?.()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [active, onDismiss])

  return (
    <div
      ref={markerRef}
      style={{
        position: 'absolute',
        left: Math.max(11, x),
        top: Math.max(11, y),
        transform: 'translate(-50%, -50%)',
        zIndex: open ? 1001 : 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--blue)',
          color: '#fff',
          fontSize: '0.625rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: '2px solid #fff',
          boxShadow: '0 1px 6px rgba(37,99,235,0.55)',
        }}
      >
        {stepNumber}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            ...(flipLeft ? { right: '26px' } : { left: '26px' }),
            top: '0',
            zIndex: 1000,
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: '8px',
            padding: '0.625rem 0.75rem',
            width: '210px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--gray-800)',
              marginBottom: '0.4rem',
              lineHeight: 1.4,
            }}
          >
            {stepNumber}. {title}
          </div>
          {description && (
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--gray-600)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function PdfPage({ pageNumber, pageAnchors, containerWidth, activeStepNumber, hoverEnabled, onDismiss }) {
  const [dims, setDims] = useState(null)

  return (
    <div style={{ position: 'relative', marginBottom: '0.75rem', lineHeight: 0 }}>
      <Page
        pageNumber={pageNumber}
        width={containerWidth}
        onRenderSuccess={({ width, height }) => setDims({ width, height })}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
      {dims &&
        pageAnchors.map(({ step, block }, i) => {
          const bb = block.boundingBox
          if (!bb) return null

          return (
            <StepMarker
              key={`${pageNumber}-${step.stepNumber}-${i}`}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              x={bb.left * dims.width}
              y={bb.top * dims.height}
              pageWidth={dims.width}
              active={activeStepNumber === step.stepNumber}
              hoverEnabled={hoverEnabled}
              onDismiss={onDismiss}
            />
          )
        })}
    </div>
  )
}

export default function PdfViewer({ uploadId, parsed, steps, activeStepNumber, hoverEnabled, onDismiss }) {
  const containerRef = useRef(null)

  const [pdfData, setPdfData] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [containerWidth, setContainerWidth] = useState(600)

  const anchors = useMemo(() => buildAnchors(parsed, steps), [parsed, steps])
  const file = useMemo(() => (pdfData ? { data: pdfData } : null), [pdfData])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateWidth = () => {
      const w = el.getBoundingClientRect().width
      if (w > 0) setContainerWidth(Math.max(200, Math.floor(w) - 32))
    }

    updateWidth()

    const ro = new ResizeObserver(() => updateWidth())
    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!uploadId) return

    let cancelled = false
    setPdfData(null)
    setNumPages(null)

    ;(async () => {
      try {
        const res = await fetch(`${BACKEND}/contracts/${uploadId}/download`, {
          headers: authHeaders(),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const buffer = await res.arrayBuffer()
        if (!cancelled) setPdfData(new Uint8Array(buffer))
      } catch (err) {
        console.error('PdfViewer: fetch failed', err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [uploadId])

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', overflowY: 'auto', background: '#555', padding: '1rem' }}
    >
      {!file ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div className="spinner" />
        </div>
      ) : (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '2rem' }}>
              <div className="spinner" />
            </div>
          }
          error={<div style={{ color: 'white', padding: '2rem' }}>Failed to load PDF file.</div>}
        >
          {numPages &&
            Array.from({ length: numPages }, (_, i) => (
              <PdfPage
                key={i}
                pageNumber={i + 1}
                containerWidth={containerWidth}
                pageAnchors={anchors.filter(a => a.block.page === i + 1)}
                activeStepNumber={activeStepNumber}
                hoverEnabled={hoverEnabled}
                onDismiss={onDismiss}
              />
            ))}
        </Document>
      )}
    </div>
  )
}