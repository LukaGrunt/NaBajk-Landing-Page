'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import styles from './Footer.module.css'

export function Footer() {
  const { locale } = useLanguage()
  const sl = locale === 'sl'

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.wrap}>
          {/* Top: logo left, store buttons + instagram right */}
          <div className={styles.top}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NaBajk" className={styles.logo} />
            <div className={styles.right}>
              <a
                href="https://apps.apple.com/us/app/nabajk/id6758962078"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeBtn}
              >
                <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                  <path d="M20.5 14.8c-.02-2.88 2.35-4.27 2.45-4.34-1.34-1.95-3.42-2.22-4.15-2.25-1.77-.18-3.45 1.04-4.35 1.04-.9 0-2.3-1.02-3.78-.99-1.95.03-3.75 1.13-4.75 2.86-2.03 3.5-.52 8.7 1.46 11.55.97 1.39 2.12 2.95 3.63 2.9 1.46-.06 2.01-.94 3.77-.94 1.76 0 2.27.94 3.8.91 1.57-.03 2.56-1.41 3.52-2.81 1.11-1.61 1.57-3.17 1.59-3.25-.04-.02-3.04-1.16-3.07-4.62l-.12-.06z" fill="white"/>
                  <path d="M17.67 6.5c.8-.97 1.35-2.32 1.2-3.67-1.16.05-2.57.78-3.4 1.74-.75.86-1.4 2.23-1.22 3.55 1.29.1 2.61-.66 3.42-1.62z" fill="white"/>
                </svg>
                <span>
                  <span className={styles.storeSub}>App Store</span>
                  <span className={styles.storeName}>iOS</span>
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.nabajk.app"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeBtn}
              >
                <svg width="14" height="14" viewBox="0 0 26 26" fill="none">
                  <path d="M3.5 2.3c-.3.3-.5.8-.5 1.4v18.6c0 .6.2 1.1.5 1.4l.1.1 10.4-10.4v-.2L3.6 2.2l-.1.1z" fill="#4FC3F7"/>
                  <path d="M17.5 16.8l-3.5-3.5v-.2l3.5-3.5.1.1 4.1 2.3c1.2.7 1.2 1.8 0 2.4l-4.1 2.3-.1.1z" fill="#FFD54F"/>
                  <path d="M17.6 16.7L14 13 3.5 23.5c.4.4 1 .4 1.7.1l12.4-6.9z" fill="#F06292"/>
                  <path d="M17.6 9.3L5.2 2.4C4.5 2.1 3.9 2.1 3.5 2.5L14 13l3.6-3.7z" fill="#81C784"/>
                </svg>
                <span>
                  <span className={styles.storeSub}>Google Play</span>
                  <span className={styles.storeName}>Android</span>
                </span>
              </a>
              <a
                href="https://www.instagram.com/nabajk.si/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.igLink}
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <Link href="/privacy-policy" className={styles.link}>
              {sl ? 'Politika zasebnosti' : 'Privacy Policy'}
            </Link>
            <span className={styles.dot}>·</span>
            <Link href="/terms-of-service" className={styles.link}>
              {sl ? 'Pogoji uporabe' : 'Terms of Service'}
            </Link>
            <span className={styles.dot}>·</span>
            <Link href="/support" className={styles.link}>
              {sl ? 'Podpora' : 'Support'}
            </Link>
          </div>

          {/* Bottom */}
          <div className={styles.bottom}>
            <span className={styles.tagline}>{sl ? 'Narejeno za Slovenijo' : 'Made for Slovenia'}</span>
            <span className={styles.copy}>© 2026 NaBajk.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
