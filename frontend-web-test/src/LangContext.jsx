import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authHeaders, getToken } from './auth'
import { normalizeLang, t as _t } from './i18n'

const BACKEND = 'https://api.formfriend.xyz'

const LangContext = createContext({ lang: 'en', t: (key) => key, refreshLang: () => {}, changeLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  const [userId, setUserId] = useState(null)

  const refreshLang = useCallback(async () => {
    if (!getToken()) return
    try {
      const res = await fetch(`${BACKEND}/users/me`, { headers: authHeaders() })
      if (res.ok) {
        const user = await res.json()
        if (user?.id) setUserId(user.id)
        if (user?.language) setLang(normalizeLang(user.language))
      }
    } catch {}
  }, [])

  useEffect(() => { refreshLang() }, [refreshLang])

  const changeLang = useCallback(async (code) => {
    setLang(code)
    if (!userId || !getToken()) return
    try {
      await fetch(`${BACKEND}/users/${userId}`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: code }),
      })
    } catch {}
  }, [userId])

  const t = useCallback((key, vars) => _t(lang, key, vars), [lang])

  return (
    <LangContext.Provider value={{ lang, t, refreshLang, changeLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
