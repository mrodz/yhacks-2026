import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authHeaders, clearToken, getToken } from '../auth'

const BACKEND = 'http://localhost:8080'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      navigate('/login')
      return
    }
    fetch(`${BACKEND}/users/me`, {
      headers: authHeaders(),
    })
      .then(res => {
        if (res.status === 401) {
          clearToken()
          navigate('/login')
          return null
        }
        if (!res.ok) throw new Error('Failed to load profile')
        return res.json()
      })
      .then(data => { if (data) setUser(data) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Loading your profile…</p>
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
            Go home
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
    <div className="page">
      <div className="card">
        <div className="logo" style={{ marginBottom: '1.5rem' }}>App Name</div>

        <div className="profile-header">
          <div className="avatar">{initials}</div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-row">
            <span className="info-label">University</span>
            <span className="info-value">{user.schoolName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">School code</span>
            <span className="info-value">
              <span className="badge">{user.schoolCode}</span>
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Account ID</span>
            <span className="info-value" style={{ color: 'var(--gray-400)', fontFamily: 'monospace', fontSize: '0.875rem' }}>#{user.id}</span>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={handleLogout} style={{ marginTop: '2rem' }}>
          Sign out
        </button>
      </div>
    </div>
  )
}
