'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './FeatureNarrative.module.css'

// Icon: Routes/Map
const RoutesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 8L12 4L20 8L28 4V24L20 28L12 24L4 28V8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 4V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 8V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Icon: Weather/Wind
const WeatherIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 16H18C20.2091 16 22 14.2091 22 12C22 9.79086 20.2091 8 18 8C17.2316 8 16.5131 8.2019 15.8988 8.55399"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 20H22C24.2091 20 26 21.7909 26 24C26 26.2091 24.2091 28 22 28H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M4 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Icon: Calendar/Events
const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M4 12H28" stroke="currentColor" strokeWidth="2" />
    <path d="M10 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="18" r="2" fill="currentColor" />
    <circle cx="16" cy="18" r="2" fill="currentColor" />
    <circle cx="22" cy="18" r="2" fill="currentColor" />
    <circle cx="10" cy="24" r="2" fill="currentColor" />
  </svg>
)

export function FeatureNarrative() {
  const { t } = useLanguage()

  const features = [
    {
      icon: <RoutesIcon />,
      title: t('feature1Title'),
      description: t('feature1Description'),
    },
    {
      icon: <WeatherIcon />,
      title: t('feature2Title'),
      description: t('feature2Description'),
    },
    {
      icon: <CalendarIcon />,
      title: t('feature3Title'),
      description: t('feature3Description'),
    },
  ]

  return (
    <section className={styles.section} id="features">
      <div className={styles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.tagline}>{t('featuresTagline')}</span>
          <h2 className={styles.title}>{t('featuresTitle')}</h2>
          <p className={styles.problem}>{t('featuresProblem')}</p>
        </div>

        {/* Features grid */}
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
