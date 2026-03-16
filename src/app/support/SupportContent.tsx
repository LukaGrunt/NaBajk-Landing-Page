'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { SupportEmail } from './SupportEmail'
import styles from '../legal.module.css'

const FAQ_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

export function SupportContent() {
  const { t } = useLanguage()

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{t('supportTitle')}</h1>
      <p className={styles.lastUpdated}>{t('supportSubtitle')}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('supportContactTitle')}</h2>
        <p>{t('supportContactDesc')}</p>
        <SupportEmail
          copyLabel={t('contactModalCopy')}
          copiedLabel={t('contactModalCopied')}
          gmailLabel={t('contactModalOpenGmail')}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('supportFaqTitle')}</h2>
        {FAQ_KEYS.map((n) => (
          <p key={n}>
            <strong>{t(`supportQ${n}` as Parameters<typeof t>[0])}</strong>
            <br />
            {t(`supportA${n}` as Parameters<typeof t>[0])}
          </p>
        ))}
      </section>

      <Link href="/" className={styles.backLink}>
        {t('supportBack')}
      </Link>
    </article>
  )
}
