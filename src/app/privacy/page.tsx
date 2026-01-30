'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { LanguageToggle } from '@/components/LanguageToggle'
import Link from 'next/link'
import styles from './privacy.module.css'

export default function Privacy() {
  const { locale } = useLanguage()

  const content = {
    sl: {
      title: 'Politika zasebnosti',
      lastUpdated: 'Zadnja posodobitev: Januar 2025',
      intro: 'NaBajk spoštuje tvojo zasebnost. Ta stran pojasnjuje, kako ravnamo s tvojimi podatki.',
      section1Title: 'Katere podatke zbiramo',
      section1Content: 'Če se pridružiš čakalni listi, zbiramo samo tvoj e-mail naslov in izbrani jezik (slovenščina ali angleščina). Ne zbiramo nobenih drugih osebnih podatkov.',
      section2Title: 'Kako uporabljamo podatke',
      section2Content: 'Tvoj e-mail naslov uporabljamo izključno za obvestilo ob izidu aplikacije NaBajk. Ne pošiljamo promocijskih sporočil in tvojih podatkov ne delimo s tretjimi strankami.',
      section3Title: 'Hramba podatkov',
      section3Content: 'Tvoji podatki so shranjeni varno na strežnikih Supabase (EU regija). Podatke hranimo do izida aplikacije, nato pa jih izbrišemo ali prenesemo v aplikacijo, če to izrecno dovoljuješ.',
      section4Title: 'Tvoje pravice',
      section4Content: 'Kadarkoli lahko zahtevate izbris svojih podatkov s čakalne liste. Pišite nam na info@nabajk.si.',
      section5Title: 'Piškotki',
      section5Content: 'Ta stran uporablja localStorage za shranjevanje jezikovne nastavitve. Ne uporabljamo piškotkov za sledenje ali analitiko.',
      backLink: 'Nazaj na domačo stran',
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 2025',
      intro: 'NaBajk respects your privacy. This page explains how we handle your data.',
      section1Title: 'What data we collect',
      section1Content: 'If you join the waitlist, we only collect your email address and selected language (Slovenian or English). We do not collect any other personal data.',
      section2Title: 'How we use your data',
      section2Content: 'We use your email address solely to notify you when NaBajk launches. We do not send promotional messages and do not share your data with third parties.',
      section3Title: 'Data storage',
      section3Content: 'Your data is stored securely on Supabase servers (EU region). We retain the data until the app launches, then delete it or transfer it to the app only with your explicit consent.',
      section4Title: 'Your rights',
      section4Content: 'You can request deletion of your data from the waitlist at any time. Contact us at info@nabajk.si.',
      section5Title: 'Cookies',
      section5Content: 'This site uses localStorage to store your language preference. We do not use cookies for tracking or analytics.',
      backLink: 'Back to home',
    },
  }

  const t = content[locale]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="NaBajk"
            width={120}
            height={34}
          />
        </Link>
        <LanguageToggle />
      </header>

      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.lastUpdated}>{t.lastUpdated}</p>

          <p className={styles.intro}>{t.intro}</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.section1Title}</h2>
            <p>{t.section1Content}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.section2Title}</h2>
            <p>{t.section2Content}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.section3Title}</h2>
            <p>{t.section3Content}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.section4Title}</h2>
            <p>{t.section4Content}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.section5Title}</h2>
            <p>{t.section5Content}</p>
          </section>

          <Link href="/" className={styles.backLink}>
            ← {t.backLink}
          </Link>
        </article>
      </main>
    </div>
  )
}
