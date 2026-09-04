'use client'

import { useLanguage } from '@/i18n/LanguageProvider'
import { Icon, type IconName } from './Icon'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

const STEP_ICONS: IconName[] = ['compass', 'user', 'id', 'card', 'mail', 'pin', 'star']

/** Which steps sit under which phase chip — 1-indexed, inclusive. */
const PHASE_RANGES: Array<[number, number]> = [
  [1, 2],
  [3, 5],
  [6, 7],
]

export function BookingFlow() {
  const { t } = useLanguage()

  return (
    <section className="section flow" id="how" aria-labelledby="how-title">
      <div className="shell">
        <SectionHead
          eyebrow={t.flow.eyebrow}
          title={t.flow.heading}
          lead={t.flow.lead}
          id="how-title"
        />

        {/* Phase overview: the seven steps at a glance before the detail. */}
        <ul className="flow-phases">
          {t.flow.phases.map((phase, i) => {
            const [from, to] = PHASE_RANGES[i]
            return (
              <li className="flow-phase-chip" key={phase}>
                <span className="num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="label">{phase}</span>
                <span className="range">
                  {t.flow.stepLabel} {from}–{to}
                </span>
              </li>
            )
          })}
        </ul>

        <ol className="flow-rail">
          {t.flow.steps.map((step, i) => (
            <li className="flow-step" key={step.title}>
              <span className="flow-step__node" aria-hidden="true">
                {i + 1}
              </span>
              <Reveal className="md-card md-card--outlined flow-step__card" delay={i * 40}>
                <span className="flow-step__label">
                  {t.flow.stepLabel} {i + 1}
                </span>
                <div className="flow-step__head">
                  <Icon name={STEP_ICONS[i]} className="flow-step__icon" />
                  <h3 className="flow-step__title">{step.title}</h3>
                </div>
                <p className="flow-step__body">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="flow-cta">
          <a className="md-btn md-btn--filled md-state" href="#experiences">
            {t.flow.cta}
            <Icon name="arrow" className="md-btn__arrow" strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  )
}
