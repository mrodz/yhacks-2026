import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authHeaders, getToken } from './auth'
import { normalizeLang, t as _t } from './i18n'

const BACKEND = 'https://api.formfriend.xyz'

const LangContext = createContext({ lang: 'en', t: (key) => key, refreshLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')

  const refreshLang = useCallback(async () => {
    if (!getToken()) return
    try {
      const res = await fetch(`${BACKEND}/users/me`, { headers: authHeaders() })
      if (res.ok) {
        const user = await res.json()
        if (user?.language) setLang(normalizeLang(user.language))
      }
    } catch {}
  }, [])

  useEffect(() => { refreshLang() }, [refreshLang])

  const t = useCallback((key, vars) => _t(lang, key, vars), [lang])

  return (
    <LangContext.Provider value={{ lang, t, refreshLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
