'use client'

import { useLanguage } from '@/i18n/LanguageProvider'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

/** Keyed by the stable `id` in messages/*.json so translations can't reorder art. */
const ART: Record<string, string> = {
  vintage: '/art/vintage.svg',
  cooking: '/art/cooking.svg',
  jdm: '/art/jdm.svg',
}

export function Experiences() {
  const { t } = useLanguage()
  const { labels } = t.experiences

  return (
    <section className="section" id="experiences" aria-labelledby="experiences-title">
      <div className="shell">
        <SectionHead
          eyebrow={t.experiences.eyebrow}
          title={t.experiences.heading}
          lead={t.experiences.lead}
          id="experiences-title"
        />

        <div className="exp-grid">
          {t.experiences.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <article className="md-card md-card--elevated exp-card">
                <div className="exp-media">
                  {/* Placeholder artwork — swap the src for WebP photography. */}
                  <img
                    src={ART[item.id]}
                    alt=""
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="exp-media__index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="exp-body">
                  <h3 className="exp-title">{item.title}</h3>
                  <p className="exp-price">{item.price}</p>

                  <ul className="exp-facts">
                    <li className="md-chip">
                      <Icon name="clock" />
                      <span className="visually-hidden">{labels.duration}: </span>
                      {item.duration}
                    </li>
                    <li className="md-chip">
                      <Icon name="users" />
                      <span className="visually-hidden">{labels.group}: </span>
                      {item.group}
                    </li>
                  </ul>

                  <p className="exp-desc">{item.description}</p>

                  <div className="exp-lists">
                    <div>
                      <p className="exp-list__title">{labels.included}</p>
                      <ul className="exp-list exp-list--yes">
                        {item.included.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="exp-list__title">{labels.notIncluded}</p>
                      <ul className="exp-list exp-list--no">
                        {item.notIncluded.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="exp-cta">
                    <a className="md-btn md-btn--outlined md-btn--block md-state" href="#how">
                      {labels.book}
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
