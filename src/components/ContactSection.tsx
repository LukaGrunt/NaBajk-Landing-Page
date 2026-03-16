'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import styles from './ContactSection.module.css'

const EMAIL = 'nabajk.si@gmail.com'
const GMAIL_URL = `https://mail.google.com/mail/?view=cm&to=${EMAIL}`

export function ContactSection() {
  const { t } = useLanguage()
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  function openModal() {
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setCopied(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>{t('contactTitle')}</h2>
            <p className={styles.description}>{t('contactDescription')}</p>
            <button onClick={openModal} className={styles.button}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('contactButton')}</span>
            </button>
          </div>
        </div>
      </section>

      {showModal && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{t('contactModalTitle')}</h3>
              <button onClick={closeModal} className={styles.modalClose} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.emailLabel}>{t('contactModalEmail')}</p>
              <p className={styles.emailAddress}>{EMAIL}</p>
              <div className={styles.modalActions}>
                <button onClick={handleCopy} className={styles.copyButton}>
                  {copied ? t('contactModalCopied') : t('contactModalCopy')}
                </button>
                <a href={`mailto:${EMAIL}`} className={styles.mailLink}>
                  {t('contactModalOpenMail')}
                </a>
                <a href={GMAIL_URL} target="_blank" rel="noopener noreferrer" className={styles.gmailLink}>
                  {t('contactModalOpenGmail')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
