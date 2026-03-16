import Link from 'next/link'
import { LanguageToggle } from '@/components/LanguageToggle'
import styles from '../legal.module.css'

export const metadata = {
  title: 'Pogoji uporabe / Terms of Service — NaBajk',
}

export default function TermsOfService() {
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
            Pogoji uporabe <span className={styles.titleSuffix}>/ Terms of Service</span>
          </h1>
          <p className={styles.lastUpdated}>Zadnja posodobitev / Last updated: Marec / March 2026</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sprejetje pogojev / Acceptance of terms</h2>
            <p>
              Z uporabo aplikacije NaBajk sprejemate te Pogoje uporabe. Če se ne strinjate, aplikacije ne smete uporabljati.
            </p>
            <p>
              By using the NaBajk app you accept these Terms of Service. If you do not agree, you must not use the app.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Brezplačna storitev — brez garancij / Free service — no warranties</h2>
            <p>
              NaBajk je brezplačna platforma, ki se zagotavlja &bdquo;takšna kot je&ldquo;, brez kakršnih koli garancij za neprekinjeno delovanje, točnost podatkov ali primernost za določen namen.
            </p>
            <p>
              NaBajk is a free platform provided &ldquo;as is&rdquo;, without any warranties of continuous availability, data accuracy, or fitness for a particular purpose.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kolesarstvo je nevarno / Cycling is dangerous</h2>
            <p>
              Kolesarstvo je telesna aktivnost, ki v sebi nosi tveganje. Aplikacijo NaBajk in njene vsebine uporabljate izključno na lastno odgovornost. NaBajk ne prevzema nobene odgovornosti za nesreče, telesne poškodbe, smrt, poškodbe premoženja, globe ali kakršno koli drugo škodo, ki bi nastala z uporabo aplikacije ali njenih vsebin.
            </p>
            <p>
              Cycling is a physical activity that carries inherent risk. You use NaBajk and its content entirely at your own risk. NaBajk is not liable for accidents, personal injury, death, property damage, fines, or any other loss or damage arising from use of the app or its content.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Natančnost poti / Route accuracy</h2>
            <p>
              Vse poti in skupinske vožnje so ustvarjene s strani uporabnikov — NaBajk ne preverja njihove točnosti, zakonitosti ali varnosti. Poti lahko vsebujejo napake: nepravilne trase, ceste, ki niso namenjene kolesarjem, zasebno zemljišče ali nelegalne odseke. Pred vsakim izhodom vizualno preverite in načrtujte svojo pot.
            </p>
            <p>
              All routes and group rides are user-generated — NaBajk does not verify their accuracy, legality, or safety. Routes may contain errors: incorrect paths, roads not designated for cyclists, privately owned land, or illegal sections. Always visually inspect and plan your route before riding.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Prometna zakonodaja / Traffic law compliance</h2>
            <p>
              Izključno vi ste odgovorni za upoštevanje vseh veljavnih prometnih predpisov in zakonodaje v vaši jurisdikciji. NaBajk ne nosi nobene odgovornosti za kršitve prometnih predpisov.
            </p>
            <p>
              You are solely responsible for complying with all applicable traffic laws and regulations in your jurisdiction. NaBajk bears no liability for traffic violations.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skupinske vožnje / Group rides</h2>
            <p>
              Z udeležbo ali organizacijo skupinske vožnje v celoti sprejemate osebno odgovornost za svojo udeležbo. Spoštujte druge udeležence v prometu, pešce in zasebno lastnino.
            </p>
            <p>
              By joining or organising a group ride you accept full personal responsibility for your participation. Respect other road users, pedestrians, and private property.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Omejitev odgovornosti / Limitation of liability</h2>
            <p>
              NaBajk, njegovi lastniki in sodelavci v nobenem primeru niso odgovorni za kakršno koli neposredno, posredno, naključno ali posledično škodo, ki izhaja iz uporabe aplikacije ali njenih vsebin.
            </p>
            <p>
              NaBajk, its owners and contributors are not liable under any circumstances for any direct, indirect, incidental, or consequential damages arising from use of the app or its content.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vsebina uporabnikov / User content</h2>
            <p>
              Pridržujemo si pravico, da brez predhodnega obvestila odstranimo vsebino ali račune, ki kršijo te pogoje ali veljavno zakonodajo.
            </p>
            <p>
              We reserve the right to remove content or accounts that violate these terms or applicable law without notice.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Veljavno pravo / Governing law</h2>
            <p>
              Te pogoje ureja pravo Republike Slovenije. Vsi spori se rešujejo pred pristojnimi slovenskimi sodišči. Pogoji se lahko posodobijo. Nadaljnja uporaba aplikacije pomeni sprejetje sprememb.
            </p>
            <p>
              These terms are governed by the law of the Republic of Slovenia. All disputes are subject to the jurisdiction of Slovenian courts. Terms may be updated. Continued use of the app constitutes acceptance of any changes.
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
