'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  STORAGE_KEY,
  dictionaries,
  isLocale,
  resolveLocale,
  type Locale,
  type Messages,
} from './config'

type LanguageContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  t: Messages
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always render English first so server and client markup agree; the effect
  // below upgrades to the stored / browser locale after hydration.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    let next: Locale = DEFAULT_LOCALE
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (isLocale(stored)) next = stored
      else next = resolveLocale(navigator.languages ?? [navigator.language])
    } catch {
      next = resolveLocale(navigator.languages ?? [navigator.language])
    }
    setLocaleState(next)
  }, [])

  useEffect(() => {
    const meta = LOCALE_META.find((m) => m.code === locale)
    document.documentElement.lang = meta?.htmlLang ?? 'en'
    document.documentElement.dataset.locale = locale
    ensureFont(locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* Safari private mode and similar — the choice just won't persist. */
    }
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

/**
 * Korean and Traditional Chinese webfonts are large, so they are only fetched
 * when someone actually switches to that language. Latin faces ship in the
 * document head.
 */
const CJK_FONTS: Partial<Record<Locale, string>> = {
  ko: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap',
  'zh-TW': 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap',
}

function ensureFont(locale: Locale) {
  const href = CJK_FONTS[locale]
  if (!href || document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
