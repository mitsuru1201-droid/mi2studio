'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { LOCALE_META, type Locale } from '@/i18n/config'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Icon } from './Icon'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const current = LOCALE_META.find((m) => m.code === locale) ?? LOCALE_META[0]

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        rootRef.current?.querySelector<HTMLButtonElement>('.lang__btn')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (next: Locale) => {
    setLocale(next)
    setOpen(false)
  }

  // Roving focus with the arrow keys inside the open menu.
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const options = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('.lang__option'),
    )
    const idx = options.indexOf(document.activeElement as HTMLButtonElement)
    const next = e.key === 'ArrowDown' ? idx + 1 : idx - 1
    options[(next + options.length) % options.length]?.focus()
  }

  return (
    <div className="lang" ref={rootRef}>
      <button
        type="button"
        className="lang__btn"
        aria-label={t.langSwitcher.label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="globe" className="lang__globe" />
        <span className="lang__code">{current.code.toUpperCase()}</span>
        <Icon name="caret" className="lang__caret" strokeWidth={2.2} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            className="lang__menu"
            role="listbox"
            aria-label={t.langSwitcher.heading}
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <p className="lang__heading">{t.langSwitcher.heading}</p>
            {LOCALE_META.map((meta) => {
              const selected = meta.code === locale
              return (
                <button
                  key={meta.code}
                  type="button"
                  className="lang__option"
                  role="option"
                  aria-selected={selected}
                  lang={meta.htmlLang}
                  onClick={() => choose(meta.code)}
                >
                  <span className="lang__flag" aria-hidden="true">
                    {meta.flag}
                  </span>
                  <span className="lang__name">{meta.name}</span>
                  {selected && <Icon name="check" className="lang__check" strokeWidth={2.4} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
