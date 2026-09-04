'use client'

import { useLanguage } from '@/i18n/LanguageProvider'
import { SectionHead } from './SectionHead'

export function Faq() {
  const { t } = useLanguage()

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="shell">
        <SectionHead
          eyebrow={t.faq.eyebrow}
          title={t.faq.heading}
          lead={t.faq.lead}
          id="faq-title"
        />

        <div className="faq-list">
          {t.faq.items.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary className="md-state">
                <span className="faq-item__q" aria-hidden="true">
                  Q
                </span>
                <span className="faq-item__text">{item.q}</span>
                <span className="faq-item__sign" aria-hidden="true" />
              </summary>
              <div className="faq-item__a">
                <span className="mark" aria-hidden="true">
                  A
                </span>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
