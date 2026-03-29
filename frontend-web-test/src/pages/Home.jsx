import { Link } from 'react-router-dom'
import { useLang } from '../LangContext'
import Header from '../components/Header'

export default function Home() {
  const { t } = useLang()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', flexDirection: 'column' }}>

      {/* WIP Banner */}
      <div style={{
        background: '#fef3c7', borderBottom: '1px solid #fde68a',
        padding: '0.5rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        fontSize: '0.8125rem', color: '#92400e', fontWeight: 500, textAlign: 'center',
      }}>
        <span>🚧</span>
        <span>{t('wip_banner')}</span>
        <span>🚧</span>
      </div>

      {/* Nav */}
      <Header>
        <Link to="/login" className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
          {t('sign_in')}
        </Link>
        <Link to="/register" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
          {t('get_started')}
        </Link>
      </Header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 1.5rem 5rem' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'var(--blue-light)', color: 'var(--blue)',
          padding: '0.375rem 1rem', borderRadius: '20px',
          fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.75rem',
        }}>
          <span>📱</span> {t('ios_badge')}
        </div>

        {/* Hero */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 800, color: 'var(--gray-800)',
          textAlign: 'center', letterSpacing: '-1px',
          lineHeight: 1.15, maxWidth: '720px', marginBottom: '1.25rem',
        }}>
          {t('hero_line1')}<br />
          <span style={{ color: 'var(--blue)' }}>{t('hero_line2')}</span>
        </h1>

        <p style={{
          fontSize: '1.0625rem', color: 'var(--gray-600)',
          textAlign: 'center', maxWidth: '520px',
          lineHeight: 1.65, marginBottom: '2.5rem',
        }}>
          {t('hero_sub')}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '5rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem', fontSize: '1rem' }}>
            {t('try_preview')}
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ width: 'auto', padding: '0.75rem 2rem', fontSize: '1rem' }}>
            {t('sign_in')}
          </Link>
        </div>

        {/* iOS showcase */}
        <div style={{
          display: 'flex', gap: '4rem', alignItems: 'center',
          flexWrap: 'wrap', justifyContent: 'center',
          maxWidth: '860px', width: '100%', marginBottom: '5rem',
        }}>
          {/* iPhone mockup */}
          <div style={{
            width: '210px', height: '430px',
            border: '8px solid #1c1c1e', borderRadius: '40px',
            background: '#fff', position: 'relative',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            flexShrink: 0, overflow: 'hidden',
          }}>
            {/* Dynamic island */}
            <div style={{
              position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
              width: '72px', height: '20px', background: '#1c1c1e',
              borderRadius: '12px', zIndex: 2,
            }} />
            {/* Screen */}
            <div style={{ padding: '38px 10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: '7px', background: '#f2f2f7' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--blue)', marginBottom: '1px', paddingLeft: '2px' }}>FormFriend</div>
              <div style={{ background: '#fff', borderRadius: '10px', padding: '8px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '2px' }}>I-20 Student Visa Form</div>
                <div style={{ fontSize: '0.52rem', color: '#6b7280' }}>Step 3 of 8 · ~12 min left</div>
                <div style={{ marginTop: '6px', height: '3px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '37.5%', height: '100%', background: 'var(--blue)', borderRadius: '2px' }} />
                </div>
              </div>
              {[
                { n: 1, label: 'Student full name', done: true },
                { n: 2, label: 'Date of birth',     done: true },
                { n: 3, label: 'Program of study',  active: true },
                { n: 4, label: 'Entry date',         done: false },
                { n: 5, label: 'Advisor signature',  done: false },
              ].map(s => (
                <div key={s.n} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 7px',
                  background: s.active ? '#eff6ff' : s.done ? '#f0fdf4' : '#fff',
                  border: `1px solid ${s.active ? '#93c5fd' : s.done ? '#86efac' : '#e5e7eb'}`,
                  borderRadius: '7px',
                }}>
                  <span style={{
                    width: '15px', height: '15px', borderRadius: '50%',
                    background: s.active ? 'var(--blue)' : s.done ? '#16a34a' : '#e5e7eb',
                    color: s.active || s.done ? '#fff' : '#9ca3af',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.48rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {s.done ? '✓' : s.n}
                  </span>
                  <span style={{
                    fontSize: '0.54rem',
                    fontWeight: s.active ? 700 : 500,
                    color: s.active ? 'var(--blue)' : s.done ? '#15803d' : '#6b7280',
                  }}>
                    {s.label}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 'auto', background: 'var(--blue)', borderRadius: '9px', padding: '7px', textAlign: 'center', fontSize: '0.56rem', color: '#fff', fontWeight: 700 }}>
                {t('continue')} →
              </div>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '360px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-400)' }}>
              {t('ios_feat_title')}
            </div>
            {[
              { icon: '📷', titleKey: 'feat_scan',  subKey: 'feat_scan_sub' },
              { icon: '🔍', titleKey: 'feat_ocr',   subKey: 'feat_ocr_sub' },
              { icon: '🧭', titleKey: 'feat_guide', subKey: 'feat_guide_sub' },
              { icon: '🌐', titleKey: 'feat_lang',  subKey: 'feat_lang_sub' },
            ].map(f => (
              <div key={f.titleKey} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--blue-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.125rem', flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--gray-800)', marginBottom: '0.2rem' }}>{t(f.titleKey)}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.55 }}>{t(f.subKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Web WIP callout */}
        <div style={{
          background: 'var(--white)', border: '1px solid var(--gray-200)',
          borderRadius: '12px', padding: '1.75rem 2rem',
          maxWidth: '600px', width: '100%', textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.6rem' }}>
            {t('about_web_title')}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            {t('about_web_body')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
              {t('try_preview')}
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
              {t('sign_in')}
            </Link>
          </div>
        </div>
      </main>

      <footer style={{
        padding: '1.25rem 2rem', borderTop: '1px solid var(--gray-200)',
        textAlign: 'center', fontSize: '0.8125rem', color: 'var(--gray-400)',
        background: 'var(--white)',
      }}>
        {t('footer')}
      </footer>
    </div>
  )
}
