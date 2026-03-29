import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authHeaders, getToken } from '../auth'
import { useLang } from '../LangContext'
import AnalysisPanel from '../components/AnalysisPanel'
import PdfViewer from '../components/PdfViewer'
import Header from '../components/Header'

const BACKEND = 'https://api.formfriend.xyz'

function PdfThumbnail({ uploadId }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    fetch(`${BACKEND}/contracts/${uploadId}/file`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setUrl(data.url))
      .catch(() => {})
  }, [uploadId])

  if (!url) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--gray-100)', color: 'var(--gray-400)', fontSize: '0.75rem'
      }}>
        Loading…
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <iframe
        src={url}
        title="PDF preview"
        style={{
          width: '794px', height: '1123px', border: 'none',
          transform: 'scale(0.22)', transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function DocumentModal({ uploadId, filename, onClose }) {
  const { t } = useLang()
  const [parsed, setParsed] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [tab, setTab] = useState('analysis')
  const [activeStepNumber, setActiveStepNumber] = useState(null)
  const [hoverEnabled, setHoverEnabled] = useState(true)
  const overlayRef = useRef(null)

  useEffect(() => {
    fetch(`${BACKEND}/contracts/${uploadId}/parsed`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setParsed(d)).catch(() => {})
    fetch(`${BACKEND}/contracts/${uploadId}/analysis`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setAnalysis(d)).catch(() => {})
  }, [uploadId])

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose()
  }

  const tabStyle = active => ({
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0.5rem 0.875rem',
    fontSize: '0.8125rem', fontWeight: 600,
    color: active ? 'var(--blue)' : 'var(--gray-400)',
    borderBottom: active ? '2px solid var(--blue)' : '2px solid transparent',
    transition: 'color 0.15s',
  })

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{
        background: 'var(--white)', borderRadius: '12px',
        width: '100%', maxWidth: '1100px', height: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem', flexShrink: 0,
          borderBottom: '1px solid var(--gray-200)',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: '0.9375rem' }}>{filename}</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--gray-400)', fontSize: '1.25rem', lineHeight: 1, padding: '0.25rem',
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {/* PDF pane */}
          <div style={{ flex: '0 0 55%', borderRight: '1px solid var(--gray-200)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.75rem', borderBottom: '1px solid var(--gray-200)', flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', userSelect: 'none' }}>{t('hover_tooltips')}</span>
              <button
                onClick={() => setHoverEnabled(v => !v)}
                style={{
                  width: '32px', height: '18px', borderRadius: '9px', border: 'none',
                  background: hoverEnabled ? 'var(--blue)' : 'var(--gray-300)',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute', top: '2px',
                  left: hoverEnabled ? '16px' : '2px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                }} />
              </button>
            </div>
            <PdfViewer uploadId={uploadId} parsed={parsed} steps={analysis?.steps} activeStepNumber={activeStepNumber} hoverEnabled={hoverEnabled} onDismiss={() => setActiveStepNumber(null)} />
          </div>

          {/* Right pane */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {/* Tabs */}
            <div style={{
              display: 'flex', alignItems: 'flex-end',
              borderBottom: '1px solid var(--gray-200)', flexShrink: 0, gap: '0.25rem',
              padding: '0 0.5rem',
            }}>
              <button style={tabStyle(tab === 'analysis')} onClick={() => setTab('analysis')}>
                {t('analysis')}
              </button>
              <button style={tabStyle(tab === 'json')} onClick={() => setTab('json')}>
                {t('raw_json')}
              </button>
              {tab === 'json' && parsed && (
                <button
                  className="text-link"
                  style={{ fontSize: '0.75rem', marginLeft: 'auto', marginBottom: '0.5rem' }}
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' })
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = filename.replace(/\.pdf$/i, '.json')
                    a.click()
                  }}
                >
                  {t('download')}
                </button>
              )}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
              {tab === 'analysis' && (
                <AnalysisPanel
                  analysis={analysis}
                  onStepClick={step => setActiveStepNumber(step.stepNumber)}
                />
              )}
              {tab === 'json' && (
                <div style={{ height: '100%', overflow: 'auto', padding: '0.75rem 1rem' }}>
                  {parsed
                    ? <pre style={{
                        margin: 0, fontFamily: 'monospace', fontSize: '0.75rem',
                        lineHeight: '1.55', color: 'var(--gray-800)',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      }}>
                        {JSON.stringify(parsed, null, 2)}
                      </pre>
                    : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div className="spinner" />
                      </div>
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContractGallery() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeUpload, setActiveUpload] = useState(null)

  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    fetch(`${BACKEND}/contracts`, { headers: authHeaders() })
      .then(async res => {
        if (res.status === 401) { navigate('/login'); return null }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.detail || `Error ${res.status}`)
        }
        return res.json()
      })
      .then(data => { if (data) setUploads(data) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) return (
    <div className="page"><div className="card" style={{ textAlign: 'center' }}>
      <div className="spinner" />
    </div></div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gray-50)' }}>
      <Header>
        <Link to="/contracts/upload" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          {t('upload_pdf')}
        </Link>
        <Link to="/profile" className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          {t('profile')}
        </Link>
      </Header>
    <div style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%', paddingTop: '2rem', alignSelf: 'stretch' }}>

      {error && <div className="alert alert-error" style={{ margin: '0 1rem 1rem' }}>{error}</div>}

      {uploads.length === 0 && !error ? (
        <div style={{ textAlign: 'center', color: 'var(--gray-400)', marginTop: '4rem' }}>
          <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('no_documents')}</p>
          <Link to="/contracts/upload" className="btn btn-primary" style={{ width: 'auto', display: 'inline-block', padding: '0.6rem 1.5rem' }}>
            {t('upload_first')}
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
          gap: '1.25rem',
          padding: '0 1rem',
        }}>
          {uploads.map(upload => (
            <button
              key={upload.id}
              onClick={() => setActiveUpload(upload)}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '10px',
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                textAlign: 'left',
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
            >
              <div style={{ height: '175px', background: 'var(--gray-50)' }}>
                <PdfThumbnail uploadId={upload.id} />
              </div>
              <div style={{ padding: '0.625rem 0.75rem', borderTop: '1px solid var(--gray-200)' }}>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-800)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {upload.filename}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.2rem' }}>
                  {new Date(upload.createdAt).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeUpload && (
        <DocumentModal
          uploadId={activeUpload.id}
          filename={activeUpload.filename}
          onClose={() => setActiveUpload(null)}
        />
      )}
    </div>
    </div>
  )
}
