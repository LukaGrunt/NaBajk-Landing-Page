'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './AppPreview.module.css'

export function AppPreview() {
  const { t } = useLanguage()

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.tagline}>{t('previewTagline')}</span>
          <h2 className={styles.title}>{t('previewTitle')}</h2>
          <p className={styles.description}>{t('previewDescription')}</p>
        </div>
        <div className={styles.imageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mobile-showcase.png"
            alt="NaBajk app screenshots"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  )
}
