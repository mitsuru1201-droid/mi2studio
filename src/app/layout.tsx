import type { Metadata, Viewport } from 'next'
import en from '../../messages/en.json'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { Analytics, GtmNoScript } from '@/components/Analytics'
import { JsonLd } from '@/components/JsonLd'
import { ServiceWorker } from '@/components/ServiceWorker'
import './globals.css'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://realjapannow.example'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: en.meta.title,
  description: en.meta.description,
  keywords: en.meta.keywords.split(',').map((k) => k.trim()),
  applicationName: 'REAL JAPAN NOW',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'REAL JAPAN NOW',
    title: en.meta.title,
    description: en.meta.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'REAL JAPAN NOW' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: en.meta.title,
    description: en.meta.description,
    images: ['/og.png'],
  },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-locale="en">
      <head>
        {/* Marks the document as script-capable before first paint so the
            scroll-reveal styles never hide content from a no-JS visitor. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.setAttribute('data-js','')",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Latin faces only; the KR/TC faces load on demand from LanguageProvider. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap"
        />
        <JsonLd />
      </head>
      <body>
        <GtmNoScript />
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
        <ServiceWorker />
      </body>
    </html>
  )
}
