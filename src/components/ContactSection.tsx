'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './ContactSection.module.css'

export function ContactSection() {
  const { t } = useLanguage()

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>{t('contactTitle')}</h2>
          <p className={styles.description}>{t('contactDescription')}</p>
          <a
            href="mailto:nabajk.si@gmail.com"
            className={styles.button}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{t('contactButton')}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
