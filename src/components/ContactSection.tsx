'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './ContactSection.module.css'

export function ContactSection() {
  const { locale } = useLanguage()
  const sl = locale === 'sl'

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <h2 className={styles.title}>{sl ? 'Stopi v stik' : 'Get in touch'}</h2>
          <p className={styles.desc}>
            {sl
              ? 'Vprašanja, povratne informacije ali partnerske poizvedbe — radi jih slišimo.'
              : 'Questions, feedback, or partnership inquiries — we\'d love to hear from you.'}
          </p>
          <a href="mailto:nabajk.si@gmail.com" className={styles.btn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {sl ? 'Pošlji sporočilo' : 'Send a message'}
          </a>
        </div>
      </div>
    </section>
  )
}
