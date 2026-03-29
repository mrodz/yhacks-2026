const TYPE_ICONS = {
  field:     '✏️',
  signature: '✍️',
  checkbox:  '☑️',
  warning:   '⚠️',
  note:      '📝',
  review:    '🔍',
  info:      'ℹ️',
}

const CONFIDENCE_COLORS = {
  high:   { color: 'var(--green)',  bg: 'var(--green-light)' },
  medium: { color: '#854d0e',       bg: '#fef9c3' },
  low:    { color: 'var(--gray-400)', bg: 'var(--gray-100)' },
}

function ConfidenceBadge({ level }) {
  if (!level) return null
  const s = CONFIDENCE_COLORS[level] ?? CONFIDENCE_COLORS.low
  return (
    <span style={{
      fontSize: '0.6875rem', fontWeight: 600, padding: '0.1rem 0.5rem',
      borderRadius: '20px', background: s.bg, color: s.color,
      textTransform: 'uppercase', letterSpacing: '0.03em',
    }}>
      {level}
    </span>
  )
}

function StepCard({ step, index, onStepClick }) {
  const icon = TYPE_ICONS[step.type] ?? '•'
  return (
    <div
      onClick={() => onStepClick?.(step)}
      style={{
        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        padding: '0.75rem', borderRadius: '8px',
        background: step.type === 'warning' ? '#fef9c3' : 'var(--gray-50)',
        border: `1px solid ${step.type === 'warning' ? '#fde047' : 'var(--gray-200)'}`,
        marginBottom: '0.625rem',
        cursor: onStepClick ? 'pointer' : 'default',
      }}>
      <div style={{
        flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
        background: 'var(--white)', border: '1px solid var(--gray-200)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.875rem',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-800)' }}>
            {step.stepNumber != null ? `${step.stepNumber}. ` : ''}{step.title}
          </span>
          <ConfidenceBadge level={step.confidence} />
        </div>
        {step.description && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', margin: 0, lineHeight: '1.5' }}>
            {step.description}
          </p>
        )}
        {step.pageHint > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.25rem', display: 'block' }}>
            Page {step.pageHint}
          </span>
        )}
      </div>
    </div>
  )
}

export default function AnalysisPanel({ analysis, onStepClick }) {
  if (!analysis) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="spinner" />
    </div>
  )

  const { documentSummary, eta, step0, steps, unanchoredNotes } = analysis

  return (
    <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', height: '100%' }}>

      {/* Document summary */}
      {documentSummary && (
        <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>
            {documentSummary.title}
          </div>
          {documentSummary.documentType && (
            <span className="badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
              {documentSummary.documentType}
            </span>
          )}
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0, lineHeight: '1.6' }}>
            {documentSummary.shortDescription}
          </p>
        </div>
      )}

      {/* ETA */}
      {eta && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0.875rem', borderRadius: '8px',
          background: 'var(--blue-light)', marginBottom: '1.25rem',
        }}>
          <span style={{ fontSize: '1rem' }}>⏱</span>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--blue)' }}>
              ~{eta.minutes} min para rellenar
            </span>
            {eta.basis && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--blue)', opacity: 0.8 }}> · {eta.basis}</span>
            )}
          </div>
        </div>
      )}

      {/* Step 0 — before you begin */}
      {step0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="info-label" style={{ marginBottom: '0.625rem' }}>Antes de empezar</div>
          <div style={{
            padding: '0.875rem', borderRadius: '8px',
            background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-800)' }}>{step0.title}</span>
              <ConfidenceBadge level={step0.confidence} />
            </div>
            {step0.description && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', margin: '0 0 0.5rem', lineHeight: '1.5' }}>
                {step0.description}
              </p>
            )}
            {step0.items?.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: '1.125rem' }}>
                {step0.items.map((item, i) => (
                  <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--gray-700)', lineHeight: '1.55', marginBottom: '0.15rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Steps */}
      {steps?.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="info-label" style={{ marginBottom: '0.625rem' }}>Pasos ({steps.length})</div>
          {steps.map((step, i) => <StepCard key={i} step={step} index={i} onStepClick={onStepClick} />)}
        </div>
      )}

      {/* Unanchored notes */}
      {unanchoredNotes?.length > 0 && (
        <div>
          <div className="info-label" style={{ marginBottom: '0.625rem' }}>Notes</div>
          {unanchoredNotes.map((note, i) => (
            <div key={i} style={{
              padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem',
              background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
            }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.2rem' }}>
                {note.title}
              </div>
              {note.description && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', margin: '0 0 0.25rem', lineHeight: '1.5' }}>
                  {note.description}
                </p>
              )}
              {note.reason && (
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', margin: 0, fontStyle: 'italic' }}>
                  {note.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
