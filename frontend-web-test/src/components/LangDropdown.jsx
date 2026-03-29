import { useLang } from '../LangContext'

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'zh', label: '🇨🇳 中文' },
  { code: 'ar', label: 'العربية 🇸🇦' },
  { code: 'pt', label: '🇧🇷 Português' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'ja', label: '🇯🇵 日本語' },
  { code: 'ko', label: '🇰🇷 한국어' },
  { code: 'hi', label: '🇮🇳 हिन्दी' },
]

export default function LangDropdown() {
  const { lang, changeLang } = useLang()
  return (
    <select
      value={lang}
      onChange={e => changeLang(e.target.value)}
      style={{
        border: '1px solid var(--gray-200)',
        borderRadius: '6px',
        padding: '0.375rem 0.625rem',
        fontSize: '0.8125rem',
        background: 'var(--white)',
        color: 'var(--gray-800)',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {LANGUAGES.map(({ code, label }) => (
        <option key={code} value={code}>{label}</option>
      ))}
    </select>
  )
}
