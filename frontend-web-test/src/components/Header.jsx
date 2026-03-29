import LangDropdown from './LangDropdown'

export default function Header({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2rem', background: 'var(--white)',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '-0.5px' }}>
        FormFriend
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {children}
        <LangDropdown />
      </div>
    </div>
  )
}
