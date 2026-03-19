'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import styles from './delete-account.module.css'
import legalStyles from '../legal.module.css'

const EMAIL = 'nabajk.si@gmail.com'

export function DeleteAccountContent() {
  const { t } = useLanguage()

  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=${encodeURIComponent(t('deleteEmailSubject'))}`

  return (
    <article className={legalStyles.article}>
      <h1 className={legalStyles.title}>{t('deleteTitle')}</h1>
      <p className={legalStyles.lastUpdated}>{t('deleteSubtitle')}</p>

      {/* In-app deletion */}
      <section className={legalStyles.section}>
        <h2 className={legalStyles.sectionTitle}>{t('deleteInAppTitle')}</h2>
        <p>{t('deleteInAppDesc')}</p>
        <ol className={styles.steps}>
          <li className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <span>{t('deleteStep1')}</span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <span>{t('deleteStep2')}</span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <span>{t('deleteStep3')}</span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber}>4</span>
            <span>{t('deleteStep4')}</span>
          </li>
        </ol>
      </section>

      {/* What gets deleted */}
      <section className={legalStyles.section}>
        <div className={styles.warningBox}>
          <p className={styles.warningTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('deleteWarningTitle')}
          </p>
          <ul className={styles.warningList}>
            <li>{t('deleteWarning1')}</li>
            <li>{t('deleteWarning2')}</li>
            <li>{t('deleteWarning3')}</li>
            <li>{t('deleteWarning4')}</li>
          </ul>
          <p className={styles.warningNote}>{t('deleteWarningNote')}</p>
        </div>
      </section>

      {/* Email fallback */}
      <section className={legalStyles.section}>
        <h2 className={legalStyles.sectionTitle}>{t('deleteEmailTitle')}</h2>
        <p>{t('deleteEmailDesc')}</p>
        <div className={styles.emailBlock}>
          <p className={styles.emailAddress}>{EMAIL}</p>
          <div className={styles.emailMeta}>
            <span className={styles.emailMetaLabel}>{t('deleteEmailSubjectLabel')}</span>
            <span className={styles.emailMetaValue}>{t('deleteEmailSubject')}</span>
          </div>
          <div className={styles.emailMeta}>
            <span className={styles.emailMetaLabel}>{t('deleteEmailBodyLabel')}</span>
            <span className={styles.emailMetaValue}>{t('deleteEmailBody')}</span>
          </div>
          <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className={styles.gmailButton}>
            {t('contactModalOpenGmail')}
          </a>
        </div>
        <p className={styles.responseNote}>{t('deleteResponseNote')}</p>
      </section>

      <Link href="/" className={legalStyles.backLink}>
        {t('deleteBack')}
      </Link>
    </article>
  )
}
