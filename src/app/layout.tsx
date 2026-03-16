import type { Metadata, Viewport } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://nabajk.si'),
  title: 'NaBajk — Najlepše ceste za cestno kolesarjenje v Sloveniji',
  description: 'Izbrane kolesarske poti po regijah. Brez brskanja po naključnih segmentih — samo najboljše ceste, pripravljene za tvoj naslednji izlet.',
  keywords: ['kolesarjenje', 'cestno kolesarjenje', 'Slovenija', 'kolesarske poti', 'cycling', 'road cycling', 'Slovenia', 'routes'],
  authors: [{ name: 'NaBajk' }],
  creator: 'NaBajk',
  publisher: 'NaBajk',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'sl_SI',
    alternateLocale: 'en_US',
    url: 'https://nabajk.si',
    siteName: 'NaBajk',
    title: 'NaBajk — Najlepše ceste za cestno kolesarjenje v Sloveniji',
    description: 'Izbrane kolesarske poti po regijah. Brez brskanja po naključnih segmentih — samo najboljše ceste.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NaBajk - Road cycling routes in Slovenia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaBajk — Road cycling routes in Slovenia',
    description: 'Curated cycling routes by region. The best roads, ready for your next ride.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sl" className="dark">
      <body>
        <LanguageProvider>
          {children}
          {/* Subtle grain texture overlay */}
          <div className="grain-overlay" aria-hidden="true" />
        </LanguageProvider>
      </body>
    </html>
  )
}
