import Link from 'next/link'
import { LanguageToggle } from '@/components/LanguageToggle'
import styles from '../legal.module.css'

export const metadata = {
  title: 'Podpora / Support — NaBajk',
}

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NaBajk" width={120} height={34} />
        </Link>
        <LanguageToggle />
      </header>

      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>
            Podpora <span className={styles.titleSuffix}>/ Support</span>
          </h1>
          <p className={styles.lastUpdated}>NaBajk — nabajk.si</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Stik z nami / Contact us</h2>
            <p>
              Za vsa vprašanja, težave z aplikacijo ali povratne informacije nas kontaktirajte na:
            </p>
            <p>
              For any questions, app issues, or feedback, please contact us at:
            </p>
            <p>
              <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pogosta vprašanja / FAQ</h2>
            <p>
              <strong>Kdaj bo aplikacija na voljo?</strong><br />
              NaBajk je trenutno v razvoju. Prijavi se na čakalno listo na nabajk.si in te obvestimo ob izidu.
            </p>
            <p>
              <strong>When will the app be available?</strong><br />
              NaBajk is currently in development. Sign up for the waitlist at nabajk.si and we'll notify you at launch.
            </p>
            <p>
              <strong>Kako izbrišem račun?</strong><br />
              Račun in vse podatke lahko izbrišeš neposredno v aplikaciji: Nastavitve → Izbriši račun.
            </p>
            <p>
              <strong>How do I delete my account?</strong><br />
              You can delete your account and all data directly in the app: Settings → Delete Account.
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
