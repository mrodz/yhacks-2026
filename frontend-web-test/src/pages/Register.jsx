import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../LangContext'

const BACKEND = 'https://api.formfriend.xyz'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLang()
  const incomplete = location.state?.incomplete
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [personalEmail, setPersonalEmail] = useState('')
  const [language, setLanguage] = useState('en')

  const [code, setCode] = useState('')

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = { name, email, password, phoneNumber }
      if (personalEmail.trim()) body.personalEmail = personalEmail.trim()

      const res = await fetch(`${BACKEND}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || data.title || 'Sign up failed')
      }

      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/users/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, language }),
      }).catch(e => { console.error(e) })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || data.title || 'Verification failed')
      }

      navigate('/login', { state: { registered: true } })
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
        <div className="subtitle">{t('create_account_sub')}</div>

        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'done' : ''}`} />
          <div className={`step-dot ${step === 2 ? 'active' : ''}`} />
        </div>

        {incomplete && <div className="alert alert-error">Your account setup wasn't completed. Please register again.</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>{t('full_name')}</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>{t('email')}</label>
              <input
                type="email"
                placeholder="jsmith@email.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('password')}</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="form-group">
              <label>{t('phone_number')}</label>
              <input
                type="tel"
                placeholder="+12025551234"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
              <p className="hint">{t('phone_hint')}</p>
            </div>
            <div className="form-group">
              <label>{t('recovery_email')} <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>{t('optional')}</span></label>
              <input
                type="email"
                placeholder="jane@gmail.com"
                value={personalEmail}
                onChange={e => setPersonalEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('preferred_language')}</label>
              <select value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
                <option value="pt">Português</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? t('sending_code') : t('continue')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm}>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.25rem', textAlign: 'center' }}>
              {t('code_sent_to')}<br />
              <strong style={{ color: 'var(--gray-800)' }}>{email}</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.25rem', textAlign: 'center' }}>
              {t('code_delay')}
            </p>
            <div className="form-group">
              <label>{t('verification_code')}</label>
              <input
                className="code-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoFocus
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading || code.length < 6}>
              {loading ? t('verifying') : t('verify_create')}
            </button>
            <div style={{ textAlign: 'center', marginTop: '0.875rem' }}>
              <button type="button" className="text-link" onClick={() => { setStep(1); setError(''); setCode('') }}>
                {t('back')}
              </button>
            </div>
          </form>
        )}

        <div className="link-row">
          {t('have_account')} <Link to="/login">{t('sign_in')}</Link>
        </div>
      </div>
    </div>
  )
}
