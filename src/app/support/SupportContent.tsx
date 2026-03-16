'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { SupportEmail } from './SupportEmail'
import styles from '../legal.module.css'

export function SupportContent() {
  const { t } = useLanguage()

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{t('supportTitle')}</h1>
      <p className={styles.lastUpdated}>{t('supportSubtitle')}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('supportContactTitle')}</h2>
        <p>{t('supportContactDesc')}</p>
        <SupportEmail copyLabel={t('contactModalCopy')} copiedLabel={t('contactModalCopied')} gmailLabel={t('contactModalOpenGmail')} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('supportFaqTitle')}</h2>
        <p><strong>{t('supportQ1')}</strong><br />{t('supportA1')}</p>
        <p><strong>{t('supportQ2')}</strong><br />{t('supportA2')}</p>
      </section>

      <Link href="/" className={styles.backLink}>
        {t('supportBack')}
      </Link>
    </article>
  )
}
