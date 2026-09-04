'use client'

import { useLanguage } from '@/i18n/LanguageProvider'
import { Icon, type IconName } from './Icon'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

const ICONS: IconName[] = ['tea', 'shield', 'users', 'chat']

export function Features() {
  const { t } = useLanguage()

  return (
    <section className="section section--mist" id="why" aria-labelledby="why-title">
      <div className="shell">
        <SectionHead
          eyebrow={t.features.eyebrow}
          title={t.features.heading}
          lead={t.features.lead}
          id="why-title"
        />

        <div className="feat-grid">
          {t.features.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="feat">
                <div className="feat__icon">
                  <Icon name={ICONS[i]} />
                </div>
                <h3 className="feat__title">{item.title}</h3>
                <p className="feat__body">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
