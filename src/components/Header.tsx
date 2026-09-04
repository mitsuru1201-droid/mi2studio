'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

const NAV = [
  { href: '#experiences', key: 'experiences' },
  { href: '#why', key: 'why' },
  { href: '#how', key: 'how' },
  { href: '#notices', key: 'notices' },
  { href: '#faq', key: 'faq' },
] as const

export function Header() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="shell header-inner">
        <a className="brand" href="#top">
          <span className="brand__seal" aria-hidden="true" />
          <span>
            REAL JAPAN <span className="brand__now">NOW</span>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {t.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="btn btn--primary btn--sm header-cta" href="#how">
            {t.hero.cta}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
