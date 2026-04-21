'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './StatsStrip.module.css'

export function StatsStrip() {
  const { locale } = useLanguage()
  const sl = locale === 'sl'

  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        <div className={styles.item}>
          <span className={styles.icon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 10l9-5 9 5v9l-9 5-9-5v-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4v16M3 10l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.text}><strong>{sl ? '6 regij' : '6 regions'}</strong></span>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.text}><strong>iOS &amp; Android</strong></span>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.text}><strong>{sl ? 'GPS snemanje' : 'GPS recording'}</strong></span>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className={styles.text}><strong>{sl ? 'Brezplačno' : 'Free forever'}</strong></span>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="8" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 20c0-3 2.5-5 6-5h8c3.5 0 6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.text}><strong>{sl ? 'Skupinske vožnje' : 'Group rides'}</strong></span>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.text}><strong>{sl ? 'Koledar tekem' : 'Race calendar'}</strong></span>
        </div>
      </div>
    </div>
  )
}
