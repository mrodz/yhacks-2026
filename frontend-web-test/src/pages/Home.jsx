import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page">
      <div className="card">
        <div className="logo">FormFriend</div>
        <p style={{ textAlign: 'center', color: 'var(--gray-600)', fontSize: '0.9375rem', margin: '0.5rem 0 2rem' }}>
          A happy go lucky phrase can go here
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Create account
          </Link>
          <Link to="/login" className="btn btn-outline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
