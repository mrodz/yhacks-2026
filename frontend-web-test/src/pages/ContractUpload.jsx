import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authHeaders, getToken } from '../auth'

const BACKEND = 'https://api.formfriend.xyz'

export default function ContractUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lines, setLines] = useState(null)

  if (!getToken()) {
    navigate('/login')
    return null
  }

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (selected && selected.type !== 'application/pdf') {
      setError('Only PDF files are accepted.')
      setFile(null)
      return
    }
    setError('')
    setFile(selected ?? null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')
    setLines(null)

    const body = new FormData()
    body.append('file', file)

    try {
      const res = await fetch(`${BACKEND}/contracts/parse`, {
        method: 'POST',
        headers: authHeaders(),
        body,
      })

      if (res.status === 401) {
        navigate('/login')
        return
      }
      if (res.status === 415) {
        setError('Server rejected the file — only PDFs are accepted.')
        return
      }
      if (!res.ok) {
        const text = await res.text()
        setError(text || `Error ${res.status}`)
        return
      }

      const data = await res.json()
      setLines(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ justifyContent: 'flex-start', paddingTop: '3rem' }}>
      <div className="card" style={{ maxWidth: '640px' }}>
        <div className="logo" style={{ marginBottom: '1.5rem' }}>FormFriend</div>
        <h2>Parse Contract PDF</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pdf-upload">PDF file</label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ padding: '0.5rem 0.75rem', cursor: 'pointer' }}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!file || loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Parsing…' : 'Upload & Parse'}
          </button>
        </form>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('/profile')}
          style={{ marginTop: '0.75rem' }}
        >
          Back to profile
        </button>

        {lines && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="info-label">Extracted text — {lines.filter(b => b.blockType === 'LINE').length} lines ({lines.length} blocks)</span>
              <button
                className="text-link"
                style={{ fontSize: '0.8125rem' }}
                onClick={() => {
                  const blob = new Blob([JSON.stringify(lines, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'contract-parse.json'
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                Download JSON
              </button>
            </div>
            <div style={{
              background: 'var(--gray-50)',
              border: '1px solid var(--gray-200)',
              borderRadius: '8px',
              padding: '1rem',
              maxHeight: '400px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {lines
                .filter(b => b.blockType === 'LINE')
                .sort((a, b) => (a.page ?? 0) - (b.page ?? 0) || (a.boundingBox?.top ?? 0) - (b.boundingBox?.top ?? 0))
                .map((b, i) => (
                  <div key={i}>{b.text}</div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
