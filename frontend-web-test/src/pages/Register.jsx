import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const BACKEND = 'https://api.formfriend.xyz'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const incomplete = location.state?.incomplete
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [nickname, setNickname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  // const [preferredUsername, setPreferredUsername] = useState('')
  // const [website, setWebsite] = useState('')
  const [personalEmail, setPersonalEmail] = useState('')
  const [language, setLanguage] = useState('en')

  // Step 2 fields
  const [code, setCode] = useState('')

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = {
        name,
        email,
        password,
        // nickname,
        phoneNumber,
        // preferredUsername,
        // website,
      }
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
      }).catch(e => {
        console.error(e)
      })

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
        <div className="subtitle">Create your account</div>

        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'done' : ''}`} />
          <div className={`step-dot ${step === 2 ? 'active' : ''}`} />
        </div>

        {incomplete && <div className="alert alert-error">Your account setup wasn't completed. Please register again.</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>Full name</label>
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
              <label>Email</label>
              <input
                type="email"
                placeholder="jsmith@email.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
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
              <label>Phone number</label>
              <input
                type="tel"
                placeholder="+12025551234"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
              <p className="hint">Include country code, e.g. +1</p>
            </div>
            <div className="form-group">
              <label>Recovery email <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="email"
                placeholder="jane@gmail.com"
                value={personalEmail}
                onChange={e => setPersonalEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Preferred language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="zh">Chinese</option>
                <option value="ar">Arabic</option>
                <option value="pt">Portuguese</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Sending code…' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm}>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.25rem', textAlign: 'center' }}>
              We sent a 6-digit code to<br />
              <strong style={{ color: 'var(--gray-800)' }}>{email}</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.25rem', textAlign: 'center' }}>
              The code may take 30 seconds to arrive.<br/>Please be patient. 
            </p>
            <div className="form-group">
              <label>Verification code</label>
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
              {loading ? 'Verifying…' : 'Verify & create account'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '0.875rem' }}>
              <button type="button" className="text-link" onClick={() => { setStep(1); setError(''); setCode('') }}>
                ← Back
              </button>
            </div>
          </form>
        )}

        <div className="link-row">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
