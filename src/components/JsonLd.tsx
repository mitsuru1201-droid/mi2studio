import en from '../../messages/en.json'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://realjapannow.example'

/** Numeric price for schema.org, parallel to the display strings in messages. */
const PRICES: Record<string, number> = { vintage: 18750, cooking: 22500, jdm: 37500 }

export function JsonLd() {
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#org`,
      name: 'REAL JAPAN NOW',
      url: SITE,
      areaServed: { '@type': 'City', name: 'Tokyo' },
      availableLanguage: ['en', 'ko', 'zh-Hant', 'fr'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'REAL JAPAN NOW',
      description: en.meta.description,
      publisher: { '@id': `${SITE}/#org` },
      inLanguage: ['en', 'ko', 'zh-Hant-TW', 'fr'],
    },
    ...en.experiences.items.map((item) => ({
      '@type': 'Product',
      '@id': `${SITE}/#${item.id}`,
      name: item.title,
      description: item.description,
      brand: { '@id': `${SITE}/#org` },
      offers: {
        '@type': 'Offer',
        price: PRICES[item.id],
        priceCurrency: 'JPY',
        availability: 'https://schema.org/InStock',
        url: `${SITE}/#experiences`,
      },
    })),
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: en.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ]

  return (
    <script
      type="application/ld+json"
      // Static, author-controlled content — no user input reaches this string.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  )
}
