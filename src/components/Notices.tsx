'use client'

import { useLanguage } from '@/i18n/LanguageProvider'
import { Icon, type IconName } from './Icon'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

const ICON_MAP: Record<string, IconName> = {
  id: 'id',
  health: 'heart',
  camera: 'camera',
  shield: 'shield',
}

export function Notices() {
  const { t } = useLanguage()

  return (
    <section className="section section--sand" id="notices" aria-labelledby="notices-title">
      <div className="shell">
        <SectionHead
          eyebrow={t.notices.eyebrow}
          title={t.notices.heading}
          lead={t.notices.lead}
          id="notices-title"
        />

        <div className="notice-grid">
          {t.notices.groups.map((group, i) => {
            const isConduct = group.icon === 'shield'
            return (
              <Reveal key={group.title} delay={i * 60}>
                <div className={`notice${isConduct ? ' notice--conduct' : ''}`}>
                  <div className="notice__head">
                    <Icon name={ICON_MAP[group.icon] ?? 'shield'} className="notice__icon" />
                    <h3 className="notice__title">{group.title}</h3>
                  </div>
                  {'intro' in group && group.intro ? (
                    <p className="notice__intro">{group.intro}</p>
                  ) : null}
                  <ul className="notice__list">
                    {group.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
