'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './ScreenshotRail.module.css'

export function ScreenshotRail() {
  const { t } = useLanguage()

  // Screenshots configuration
  // Uses placeholders with gradient backgrounds if images are not available
  const screenshots = [
    {
      id: 'login',
      src: '/screenshots/login.png',
      alt: 'NaBajk login screen',
    },
    {
      id: 'home',
      src: '/screenshots/home.png',
      alt: 'NaBajk home screen with routes',
    },
    {
      id: 'route',
      src: '/screenshots/route.png',
      alt: 'NaBajk route detail',
    },
  ]

  return (
    <section className={styles.section} id="app">
      <div className={styles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.tagline}>{t('showcaseTagline')}</span>
          <h2 className={styles.title}>{t('showcaseTitle')}</h2>
          <p className={styles.description}>{t('showcaseDescription')}</p>
        </div>

        {/* Screenshots */}
        <div className={styles.rail}>
          <div className={styles.railInner}>
            {screenshots.map((screenshot, index) => (
              <div
                key={screenshot.id}
                className={styles.phoneFrame}
                style={{ '--index': index } as React.CSSProperties}
              >
                <div className={styles.phoneNotch} aria-hidden="true" />
                <div className={styles.phoneScreen}>
                  {/* Image with fallback gradient */}
                  <picture>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      className={styles.screenshot}
                      loading="lazy"
                      onError={(e) => {
                        // Hide broken image and show gradient fallback
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  </picture>
                  {/* Gradient fallback (hidden by default) */}
                  <div className={styles.fallback} style={{ display: 'none' }}>
                    <div className={styles.fallbackIcon}>
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M24 4L28 14L38 16L30 24L32 34L24 30L16 34L18 24L10 16L20 14L24 4Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className={styles.fallbackText}>Screenshot</span>
                  </div>
                </div>
                {/* Phone frame glow effect */}
                <div className={styles.phoneGlow} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
