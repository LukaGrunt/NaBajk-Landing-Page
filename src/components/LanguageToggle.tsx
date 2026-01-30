'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './LanguageToggle.module.css'

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className={styles.toggle} role="group" aria-label="Language selection">
      <button
        type="button"
        className={`${styles.button} ${locale === 'sl' ? styles.active : ''}`}
        onClick={() => setLocale('sl')}
        aria-pressed={locale === 'sl'}
        aria-label="Slovenščina"
      >
        {t('langSlo')}
      </button>
      <button
        type="button"
        className={`${styles.button} ${locale === 'en' ? styles.active : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        aria-label="English"
      >
        {t('langEng')}
      </button>
      <div
        className={styles.indicator}
        style={{
          transform: `translateX(${locale === 'en' ? '100%' : '0'})`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}
