'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { LanguageToggle } from './LanguageToggle'
import { WaitlistForm } from './WaitlistForm'
import styles from './Hero.module.css'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className={styles.hero}>
      {/* Background Image */}
      <div className={styles.imageContainer} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-poster.png"
          alt=""
          className={styles.backgroundImage}
        />
        <div className={styles.imageOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Header with logo, Instagram, and language toggle */}
        <header className={styles.header}>
          <div className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="NaBajk"
              className={styles.logoImage}
            />
          </div>
          <div className={styles.headerRight}>
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
            </a>
            <LanguageToggle />
          </div>
        </header>

        {/* Main hero content */}
        <div className={styles.main}>
          <div className={styles.textContent}>
            {/* Headline */}
            <h1 className={styles.headline}>{t('heroHeadline')}</h1>

            {/* Subtitle */}
            <p className={styles.subtitle}>
              {t('heroSubheadlinePrefix')}
              <span className={styles.subtitleAccent}>{t('heroSubheadlineAccent')}</span>
            </p>

            {/* Description */}
            <p className={styles.description}>{t('heroDescription')}</p>

            {/* Waitlist Form */}
            <div className={styles.waitlistWrapper}>
              <WaitlistForm />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollLine} />
        </div>
      </div>
    </section>
  )
}
