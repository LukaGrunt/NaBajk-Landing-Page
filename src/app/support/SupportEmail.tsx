'use client'

import { useState } from 'react'
import styles from './support.module.css'

const EMAIL = 'nabajk.si@gmail.com'
const GMAIL_URL = `https://mail.google.com/mail/?view=cm&to=${EMAIL}`

interface Props {
  copyLabel: string
  copiedLabel: string
  gmailLabel: string
}

export function SupportEmail({ copyLabel, copiedLabel, gmailLabel }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.emailBlock}>
      <p className={styles.emailAddress}>{EMAIL}</p>
      <div className={styles.emailActions}>
        <button onClick={handleCopy} className={styles.copyButton}>
          {copied ? copiedLabel : copyLabel}
        </button>
        <a href={GMAIL_URL} target="_blank" rel="noopener noreferrer" className={styles.gmailLink}>
          {gmailLabel}
        </a>
      </div>
    </div>
  )
}
