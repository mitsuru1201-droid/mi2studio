'use client'

import { useLanguage } from '@/i18n/LanguageProvider'

/** Replace with real routes once the legal pages exist. */
const LEGAL_HREFS = [
  '/terms',
  '/privacy',
  '/cancellation-policy',
  '/code-of-conduct',
  '/disclaimer',
  '/contact',
]
const SOCIAL_HREFS = ['#instagram', '#tiktok', '#x', '#line']

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand">
              <span className="brand__seal" aria-hidden="true" />
              <span>
                REAL JAPAN <span className="brand__now">NOW</span>
              </span>
            </span>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>

          <nav aria-labelledby="footer-legal">
            <p className="footer-heading" id="footer-legal">
              {t.footer.legalHeading}
            </p>
            <ul className="footer-links">
              {t.footer.legal.map((label, i) => (
                <li key={label}>
                  <a href={LEGAL_HREFS[i]}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="footer-heading" id="footer-social">
              {t.footer.followHeading}
            </p>
            <div className="footer-social" role="list" aria-labelledby="footer-social">
              {t.footer.social.map((label, i) => (
                <a key={label} role="listitem" href={SOCIAL_HREFS[i]}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.copyright}</span>
          <span>Tokyo, Japan</span>
        </div>
      </div>
    </footer>
  )
}
