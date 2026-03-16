'use client'

import { useState } from 'react'
import styles from './support.module.css'

const EMAIL = 'nabajk.si@gmail.com'
const GMAIL_URL = `https://mail.google.com/mail/?view=cm&to=${EMAIL}`

export function SupportEmail() {
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
          {copied ? 'Kopirano! / Copied!' : 'Kopiraj / Copy'}
        </button>
        <a href={`mailto:${EMAIL}`} className={styles.mailLink}>
          Odpri v Mail / Open in Mail
        </a>
        <a href={GMAIL_URL} target="_blank" rel="noopener noreferrer" className={styles.gmailLink}>
          Odpri v Gmail / Open in Gmail
        </a>
      </div>
    </div>
  )
}
