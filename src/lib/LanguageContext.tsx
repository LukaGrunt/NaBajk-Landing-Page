'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, translations, TranslationKey } from './i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'nabajk-locale'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('sl')
  const [isHydrated, setIsHydrated] = useState(false)

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && (saved === 'sl' || saved === 'en')) {
      setLocaleState(saved)
    }
    setIsHydrated(true)
  }, [])

  // Save preference when it changes
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    // Update html lang attribute
    document.documentElement.lang = newLocale
  }

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[locale][key]
  }

  // Update html lang on mount and locale change
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.lang = locale
    }
  }, [locale, isHydrated])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
