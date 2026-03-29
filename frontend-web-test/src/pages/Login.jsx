import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { setToken } from '../auth'
import { useLang } from '../LangContext'

const BACKEND = 'https://api.formfriend.xyz'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, refreshLang } = useLang()
  const justRegistered = location.state?.registered
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || data.title || 'Login failed')
      }
      setToken(data.accessToken)
      await refreshLang()
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="logo">FormFriend</div>
        <div className="subtitle">{t('sign_in_subtitle')}</div>

        {justRegistered && <div className="alert alert-success">{t('account_created')}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              placeholder="jsmith@email.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? t('signing_in') : t('sign_in')}
          </button>
        </form>

        <div className="link-row">
          {t('no_account')} <Link to="/register">{t('create_one')}</Link>
        </div>
      </div>
    </div>
  )
}
