'use client'

import { useLanguage } from '@/lib/LanguageContext'
import styles from './Partners.module.css'

export function Partners() {
  const { locale } = useLanguage()
  const sl = locale === 'sl'

  return (
    <section className={styles.section} id="partners">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>{sl ? 'NAŠI PARTNERJI' : 'OUR PARTNERS'}</span>
          <h2 className={styles.title}>
            {sl ? 'Podpirajo nas najboljši v slovenskem kolesarstvu.' : 'Backed by the best in Slovenian cycling.'}
          </h2>
        </div>
        <div className={styles.grid}>
          {/* Vitamini.si */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.logoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/partner-vitamini.png" alt="Vitamini.si" className={styles.logo} />
              </div>
              <span className={styles.badge}>{sl ? 'PREHRANA' : 'NUTRITION'}</span>
            </div>
            <h3 className={styles.cardTitle}>{sl ? 'Napolni se za vožnjo' : 'Fuel your ride'}</h3>
            <p className={styles.cardDesc}>
              {sl
                ? 'Vitamini.si je slovenska spletna trgovina s športno prehrano in prehranskimi dopolnili. Vitamini, minerali, proteini, kreatin in produkti za regeneracijo — kakovostno gorivo za tvoj trening.'
                : 'Vitamini.si is a Slovenian online store for sports nutrition and health supplements. Vitamins, minerals, proteins, creatine and recovery products. Quality fuel to support your training and keep you performing at your best.'}
            </p>
            <a
              href="https://www.vitamini.si"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              {sl ? 'Obišči vitamini.si' : 'Visit vitamini.si'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* A2U */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.logoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/partner-a2u.png" alt="A2U" className={styles.logo} />
              </div>
              <span className={styles.badge}>{sl ? 'OPREMA & SERVIS' : 'GEAR & SERVICE'}</span>
            </div>
            <h3 className={styles.cardTitle}>{sl ? 'Opremi se' : 'Gear up'}</h3>
            <p className={styles.cardDesc}>
              {sl
                ? 'A2U je ena največjih specializiranih kolesarskih verig v Sloveniji s 7 poslovalnicami po vsej državi. Kolesa, komponente, oblačila in servis — znamke Colnago, Wilier, Factor, Garmin in Wahoo.'
                : "A2U is one of Slovenia's largest specialized cycling chains with 7 stores nationwide. Bikes, components, clothing and expert service across the country, carrying brands like Colnago, Wilier, Factor, Garmin and Wahoo."}
            </p>
            <a
              href="https://www.a2u.si"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              {sl ? 'Obišči a2u.si' : 'Visit a2u.si'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
