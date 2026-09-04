'use client'

import { useLanguage } from '@/i18n/LanguageProvider'
import { Icon } from './Icon'

export function FinalCta() {
  const { t } = useLanguage()

  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="shell cta-band__inner">
        <h2 id="cta-title">{t.finalCta.heading}</h2>
        <p>{t.finalCta.body}</p>
        <a className="btn btn--primary" href="#experiences">
          {t.finalCta.button}
          <Icon name="arrow" className="btn__arrow" strokeWidth={2} />
        </a>
      </div>
    </section>
  )
}
