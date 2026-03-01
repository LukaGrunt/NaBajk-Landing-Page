import Link from 'next/link'
import { LanguageToggle } from '@/components/LanguageToggle'
import styles from '../legal.module.css'

export const metadata = {
  title: 'Politika zasebnosti / Privacy Policy — NaBajk',
}

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="NaBajk" width={120} height={34} />
        </Link>
        <LanguageToggle />
      </header>

      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>
            Politika zasebnosti <span className={styles.titleSuffix}>/ Privacy Policy</span>
          </h1>
          <p className={styles.lastUpdated}>Zadnja posodobitev / Last updated: Marec / March 2026</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kaj zbiramo / What we collect</h2>
            <p>
              NaBajk zbira izključno vaš e-poštni naslov, ki ga uporabljamo zgolj za preverjanje identitete ob prijavi (magic link ali Google Sign-In). E-poštnega naslova ne delimo z nikomer in ga ne prodajamo. Izberete si lahko prikazno ime ali vzdevek — pravo ime ni zahtevano niti shranjeno. Trajnih lokacijskih podatkov ne shranjujemo in ne ustvarjamo oglasnih profilov.
            </p>
            <p>
              NaBajk collects only your email address, used solely to verify your identity when signing in (magic link or Google Sign-In). We never share or sell your email address. You choose your own display name or nickname — no real name is required or stored. We do not store permanent location data and we do not build advertising profiles.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kako podatke uporabljamo / How we use your data</h2>
            <p>
              Vaš e-poštni naslov je edini osebni podatek, ki ga obdelujemo. Uporablja se izključno za pošiljanje prijave in zagotavljanje dostopa do računa. NaBajk ne izvaja vedenjskega sledenja in ne prikazuje oglasov.
            </p>
            <p>
              Your email address is the only personal data we process. It is used exclusively to send you a sign-in link and to provide access to your account. NaBajk does not perform behavioural tracking and does not show advertisements.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shranjevanje in varnost / Storage and security</h2>
            <p>
              Vaši podatki so shranjeni na infrastrukturi Supabase, ki deluje na strežnikih v Evropski uniji. Supabase zagotavlja šifriranje podatkov med prenosom in v mirovanju.
            </p>
            <p>
              Your data is stored on Supabase infrastructure running on servers in the European Union. Supabase provides encryption of data in transit and at rest.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vaše pravice / Your rights</h2>
            <p>
              Račun in vse s tem povezane podatke lahko kadar koli izbrišete neposredno v aplikaciji (Nastavitve → Izbriši račun). Za ostala vprašanja nas kontaktirajte na: <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
            </p>
            <p>
              You can delete your account and all associated data at any time directly in the app (Settings → Delete Account). For other questions contact us at: <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kontakt / Contact</h2>
            <p>
              Za vsa vprašanja v zvezi z zasebnostjo nas kontaktirajte na: <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>. Politika zasebnosti se lahko posodobi. Nadaljnja uporaba aplikacije pomeni sprejetje sprememb.
            </p>
            <p>
              For any privacy-related questions contact us at: <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>. This policy may be updated. Continued use of the app constitutes acceptance of any changes.
            </p>
          </section>

          <Link href="/" className={styles.backLink}>
            ← Nazaj / Back
          </Link>
        </article>
      </main>
    </div>
  )
}
