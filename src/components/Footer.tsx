'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './Footer.module.css'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top section */}
        <div className={styles.top}>
          {/* Logo and tagline */}
          <div className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="NaBajk"
              className={styles.logo}
            />
            <p className={styles.tagline}>{t('footerTagline')}</p>
          </div>

          {/* Instagram link */}
          <a
            href="https://www.instagram.com/nabajk.si/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramLink}
            aria-label="Follow NaBajk on Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
            </svg>
            <span>Instagram</span>
          </a>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom section */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>{t('footerCopyright')}</p>
        </div>
      </div>
    </footer>
  )
}
