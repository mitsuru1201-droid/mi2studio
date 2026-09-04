'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Mobile-only bar. Appears once the hero has scrolled away and hides again
 * over the footer so it never covers the legal links.
 */
export function StickyCta() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.7
      const nearBottom =
        window.innerHeight + window.scrollY > document.body.scrollHeight - 320
      setVisible(past && !nearBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="bottom-bar" data-visible={visible} aria-hidden={!visible}>
      <div className="bottom-bar__price">
        {/* The price string is self-describing in every language ("From ¥…",
            "1인 ¥…부터"), so it needs no separate label. */}
        <span className="val">{t.experiences.items[0].price}</span>
      </div>
      <a className="md-fab md-state" href="#how" tabIndex={visible ? 0 : -1}>
        {t.hero.cta}
      </a>
    </div>
  )
}
