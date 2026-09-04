'use client'

import { useLanguage } from '@/i18n/LanguageProvider'
import { Icon, type IconName } from './Icon'

const SCENES = [
  { src: '/art/vintage.svg', tone: 'vintage' },
  { src: '/art/cooking.svg', tone: 'cooking' },
  { src: '/art/jdm.svg', tone: 'jdm' },
] as const

const TRUST_ICONS: IconName[] = ['shield', 'users', 'lang', 'clock']

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="hero" id="top">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="md-chip md-chip--tonal hero-eyebrow">{t.hero.eyebrow}</p>

          <h1 className="hero-title">{t.hero.title}</h1>
          <p className="hero-sub">{t.hero.subtitle}</p>

          <div className="hero-actions">
            <a className="md-btn md-btn--md md-btn--filled md-state" href="#how">
              {t.hero.cta}
              <Icon name="arrow" className="md-btn__arrow" strokeWidth={2} />
            </a>
            <a className="md-btn md-btn--md md-btn--outlined md-state" href="#experiences">
              {t.hero.ctaSecondary}
            </a>
          </div>

          <ul className="trust">
            {t.hero.trust.map((label, i) => (
              <li className="md-chip" key={label}>
                <Icon name={TRUST_ICONS[i]} strokeWidth={2} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-art" aria-hidden="true">
          {SCENES.map((scene, i) => (
            <figure className="hero-panel" key={scene.tone}>
              {/* Placeholder artwork — swap the src for WebP photography. */}
              <img
                src={scene.src}
                alt=""
                width={400}
                height={300}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <figcaption className="hero-panel__tag">{t.hero.scenes[i]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
