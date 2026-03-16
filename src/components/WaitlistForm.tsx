'use client'

import { useState, FormEvent } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { addToWaitlist } from '@/lib/supabaseClient'
import styles from './WaitlistForm.module.css'

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'invalid' | 'duplicate'

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function WaitlistForm() {
  const { locale, t } = useLanguage()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [honeypot, setHoneypot] = useState('') // Bot trap

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Bot check - honeypot should be empty
    if (honeypot) {
      // Silently fail for bots
      return
    }

    // Validate email
    const trimmedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setState('invalid')
      return
    }

    setState('loading')

    const result = await addToWaitlist(trimmedEmail, locale)

    if (result.success) {
      setState('success')
      setEmail('')
    } else {
      setState(result.error === 'duplicate' ? 'duplicate' : result.error === 'invalid' ? 'invalid' : 'error')
    }
  }

  const getErrorMessage = (): string | null => {
    switch (state) {
      case 'invalid':
        return t('waitlistErrorInvalid')
      case 'duplicate':
        return t('waitlistErrorDuplicate')
      case 'error':
        return t('waitlistErrorGeneric')
      default:
        return null
    }
  }

  const isError = state === 'error' || state === 'invalid' || state === 'duplicate'
  const errorMessage = getErrorMessage()

  // Success state
  if (state === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className={styles.successMessage}>{t('waitlistSuccess')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Clear error state when user starts typing
                if (isError) setState('idle')
              }}
              placeholder={t('waitlistPlaceholder')}
              className={`${styles.input} ${isError ? styles.inputError : ''}`}
              disabled={state === 'loading'}
              aria-invalid={isError}
              aria-describedby={isError ? 'waitlist-error' : undefined}
              required
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {/* Honeypot field - hidden from real users */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className={styles.honeypot}
              aria-hidden="true"
            />
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={state === 'loading' || !email.trim()}
          >
            {state === 'loading' ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>{t('waitlistButtonLoading')}</span>
              </>
            ) : (
              t('waitlistButton')
            )}
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <p id="waitlist-error" className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}

        {/* Consent text */}
        <p className={styles.consent}>{t('waitlistConsent')}</p>
      </form>
    </div>
  )
}
