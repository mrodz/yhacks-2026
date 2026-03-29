import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authHeaders, clearToken, getToken } from '../auth'
import { useLang } from '../LangContext'
import Header from '../components/Header'

const BACKEND = 'https://api.formfriend.xyz'

export default function Profile() {
  const navigate = useNavigate()
  const { t, refreshLang } = useLang()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    fetch(`${BACKEND}/users/me`, { headers: authHeaders() })
      .then(async res => {
        if (res.status === 401) { clearToken(); navigate('/login'); return null }
        if (res.status === 404) { clearToken(); navigate('/register', { state: { incomplete: true } }); return null }
        if (!res.ok) {
          let msg = `Error ${res.status}`
          try { const body = await res.json(); msg = body.detail || body.title || msg } catch (_) {}
          throw new Error(msg)
        }
        return res.json()
      })
      .then(data => {
        if (data) {
          setUser(data)
          refreshLang()
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate, refreshLang])

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{t('loading_profile')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="card">
          <div className="alert alert-error">{error}</div>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            {t('go_home')}
          </button>
        </div>
      </div>
    )
  }

  if (!user) return null

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gray-50)' }}>
      <Header />
      <div className="page" style={{ flex: 1 }}>
      <div className="card">
        <div className="profile-header">
          <div className="avatar">{initials}</div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-row">
            <span className="info-label">{t('university')}</span>
            <span className="info-value">{user.schoolName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('school_code')}</span>
            <span className="info-value">
              <span className="badge">{user.schoolCode}</span>
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('email')}</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('account_id')}</span>
            <span className="info-value" style={{ color: 'var(--gray-400)', fontFamily: 'monospace', fontSize: '0.875rem' }}>#{user.id}</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/contracts')} style={{ marginTop: '2rem' }}>
          {t('my_documents')}
        </button>

        <button className="btn btn-secondary" onClick={handleLogout} style={{ marginTop: '0.75rem' }}>
          {t('sign_out')}
        </button>
      </div>
      </div>
    </div>
  )
}
