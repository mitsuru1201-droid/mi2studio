import en from '../../messages/en.json'
import ko from '../../messages/ko.json'
import zhTW from '../../messages/zh-TW.json'
import fr from '../../messages/fr.json'

/** Message shape is derived from English, so every locale is checked against it. */
export type Messages = typeof en

export const LOCALES = ['en', 'ko', 'zh-TW', 'fr'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const dictionaries: Record<Locale, Messages> = {
  en,
  ko: ko as Messages,
  'zh-TW': zhTW as Messages,
  fr: fr as Messages,
}

export type LocaleMeta = {
  code: Locale
  /** Native name shown in the switcher. */
  name: string
  flag: string
  /** Value for the <html lang> attribute. */
  htmlLang: string
}

export const LOCALE_META: LocaleMeta[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', htmlLang: 'en' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', htmlLang: 'ko' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼', htmlLang: 'zh-Hant-TW' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', htmlLang: 'fr' },
]

/**
 * Maps anything the browser reports (`navigator.languages`) onto a supported
 * locale. `zh-HK` and `zh-Hant-*` fall back to Traditional Chinese; plain `zh`
 * (usually Simplified) deliberately does not.
 */
export function resolveLocale(candidates: readonly string[]): Locale {
  for (const raw of candidates) {
    const tag = raw.toLowerCase()
    if (tag.startsWith('ko')) return 'ko'
    if (tag.startsWith('fr')) return 'fr'
    if (tag.startsWith('en')) return 'en'
    if (tag.startsWith('zh')) {
      const traditional =
        tag.includes('hant') || tag.includes('-tw') || tag.includes('-hk') || tag.includes('-mo')
      if (traditional) return 'zh-TW'
    }
  }
  return DEFAULT_LOCALE
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

export const STORAGE_KEY = 'rjn.locale'
