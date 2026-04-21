'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './FeaturesGrid.module.css'

export function FeaturesGrid() {
  const { locale } = useLanguage()
  const sl = locale === 'sl'

  return (
    <section className={styles.section} id="features">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>{sl ? 'ZAKAJ NABAJK' : 'WHY NABAJK'}</span>
          <h2 className={styles.title}>
            {sl ? 'Vse za cestno kolesarjenje v Sloveniji.' : 'Everything for road cycling in Slovenia.'}
          </h2>
          <p className={styles.body}>
            {sl
              ? 'Poti razpršene po skupinah, PDF-jih in starih forumih. NaBajk zbere vse skupaj, da manj iščeš in več kolesariš.'
              : 'Routes scattered across groups, PDFs and old forums. NaBajk pulls it all together so you spend less time searching and more time riding.'}
          </p>
        </div>
        <div className={styles.grid}>
          <article className={styles.card}>
            <div className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M4 8L12 4L20 8L28 4V24L20 28L12 24L4 28V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4V24M20 8V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{sl ? 'Kurirane poti po regijah' : 'Curated routes by region'}</h3>
            <p className={styles.cardDesc}>
              {sl
                ? 'Ročno izbrane cestne ture po 6 regijah. Krog za kavo, legendarni klanci ali dolge vožnje. Brez šuma.'
                : 'Hand-picked road rides across 6 Slovenian regions. Coffee loops, famous climbs, or long days in the saddle. No noise.'}
            </p>
          </article>
          <article className={styles.card}>
            <div className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 4v4M16 24v4M4 16h4M24 16h4M7 7l3 3M22 22l3 3M7 25l3-3M22 10l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{sl ? 'GPS snemanje voženj' : 'GPS ride recording'}</h3>
            <p className={styles.cardDesc}>
              {sl
                ? 'Snemaj poti in vzpone z natančnimi podatki o višini, deli kot Instagram Stories in izvozi GPX datoteke.'
                : 'Record routes and climbs with accurate elevation data, share as Instagram Stories and export GPX files directly from your phone.'}
            </p>
          </article>
          <article className={styles.card}>
            <div className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="6" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 12H28M10 4V8M22 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="18" r="2" fill="currentColor"/>
                <circle cx="16" cy="18" r="2" fill="currentColor"/>
                <circle cx="22" cy="18" r="2" fill="currentColor"/>
                <circle cx="10" cy="24" r="2" fill="currentColor"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{sl ? 'Koledar rekreativnih tekem' : 'Amateur race calendar'}</h3>
            <p className={styles.cardDesc}>
              {sl
                ? 'Vsak slovenski amaterski cestni kolesarski dogodek na enem mestu — razvrščen po mesecih, z direktnimi povezavami.'
                : 'Every Slovenian amateur road event in one place, sorted by month and searchable by name, with direct links to organizers.'}
            </p>
          </article>
          <article className={styles.card}>
            <div className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="22" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 26c0-3.866 3.134-7 7-7h2M19 19h2c3.866 0 7 3.134 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="16" cy="14" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 28c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{sl ? 'Skupinske vožnje' : 'Group rides'}</h3>
            <p className={styles.cardDesc}>
              {sl
                ? 'Ustvari ali se pridruži skupinski vožnji. Postavi točko srečanja, RSVP, klepetaj s skupino in prejemaj obvestila.'
                : 'Create or join a group ride. Set a meeting point, RSVP, chat with the group, and get notified about rides in your region.'}
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
