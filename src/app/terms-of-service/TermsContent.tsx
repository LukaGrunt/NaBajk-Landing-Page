'use client'

import Link from 'next/link'
import { LanguageToggle } from '@/components/LanguageToggle'
import { useLanguage } from '@/lib/LanguageContext'
import styles from '../legal.module.css'

export function TermsContent() {
  const { locale } = useLanguage()
  const sl = locale === 'sl'

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
            {sl ? 'Pogoji uporabe' : 'Terms of Service'}
          </h1>
          <p className={styles.lastUpdated}>
            {sl ? 'Zadnja posodobitev: April 2026' : 'Last updated: April 2026'}
          </p>

          {/* ACCEPTANCE */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Sprejetje pogojev' : 'Acceptance of terms'}
            </h2>
            <p>
              {sl
                ? 'Z uporabo aplikacije NaBajk sprejemate te Pogoje uporabe in našo Politiko zasebnosti. Če se ne strinjate, aplikacije ne smete uporabljati.'
                : 'By using the NaBajk app you accept these Terms of Service and our Privacy Policy. If you do not agree, you must not use the app.'}
            </p>
          </section>

          {/* ACCOUNT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Račun' : 'Account'}
            </h2>
            <p>
              {sl
                ? 'Za uporabo aplikacije NaBajk morate biti stari vsaj 13 let. Z registracijo potrjujete, da izpolnjujete to starostno zahtevo. Vsaka oseba sme imeti samo en račun. Odgovorni ste za varnost svojega računa in za vse dejavnosti, ki se izvajajo z vašim računom. NaBajk si pridržuje pravico, da brez predhodnega obvestila začasno ali trajno onemogoči račune, ki kršijo te pogoje.'
                : 'You must be at least 13 years old to use NaBajk. By registering, you confirm that you meet this age requirement. Each person may hold only one account. You are responsible for the security of your account and for all activity carried out through it. NaBajk reserves the right to suspend or terminate accounts that violate these terms without prior notice.'}
            </p>
          </section>

          {/* FREE SERVICE */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Brezplačna storitev — brez garancij' : 'Free service — no warranties'}
            </h2>
            <p>
              {sl
                ? 'NaBajk je brezplačna platforma, ki se zagotavlja "takšna kot je", brez kakršnih koli garancij za neprekinjeno delovanje, točnost podatkov, zanesljivost GPS snemanja ali primernost za določen namen. Storitev lahko kadar koli spremenimo ali ukinemo brez predhodnega obvestila.'
                : 'NaBajk is a free platform provided "as is", without any warranties of continuous availability, data accuracy, GPS recording reliability, or fitness for a particular purpose. The service may be changed or discontinued at any time without prior notice.'}
            </p>
          </section>

          {/* CYCLING IS DANGEROUS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Kolesarstvo je nevarno' : 'Cycling is dangerous'}
            </h2>
            <p>
              {sl
                ? 'Kolesarstvo je telesna aktivnost, ki v sebi nosi tveganje za telesne poškodbe, smrt in materialno škodo. Aplikacijo NaBajk in njene vsebine (poti, skupinske vožnje, GPS sledi, nasvete) uporabljate izključno na lastno odgovornost. Pred vsakim izhodom preverite svojo pripravljenost, opremo in vremensko napoved. NaBajk ne prevzema nobene odgovornosti za nesreče, telesne poškodbe, smrt, poškodbe premoženja, globe ali kakršno koli drugo škodo, ki bi nastala z uporabo aplikacije ali njenih vsebin.'
                : 'Cycling is a physical activity that carries inherent risk of personal injury, death, and property damage. You use NaBajk and its content (routes, group rides, GPS tracks, advice) entirely at your own risk. Before every ride, verify your fitness, equipment, and weather conditions. NaBajk is not liable for accidents, personal injury, death, property damage, fines, or any other loss or damage arising from use of the app or its content.'}
            </p>
          </section>

          {/* ROUTE ACCURACY */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Natančnost poti' : 'Route accuracy'}
            </h2>
            <p>
              {sl
                ? 'Vse poti in skupinske vožnje so ustvarjene s strani uporabnikov — NaBajk ne preverja njihove točnosti, zakonitosti ali varnosti. Poti lahko vsebujejo napake: nepravilne trase, ceste, ki niso primerne za kolesarje, zasebno zemljišče ali nelegalne odseke. Vedno vizualno preverite in načrtujte svojo pot, preden se odpravite na vožnjo. GPS snemanje je odvisno od zmogljivosti naprave in signala — NaBajk ne jamči za točnost zabeleženih podatkov.'
                : 'All routes and group rides are user-generated — NaBajk does not verify their accuracy, legality, or safety. Routes may contain errors: incorrect paths, roads not suitable for cyclists, privately owned land, or illegal sections. Always visually inspect and plan your route before riding. GPS recording depends on device capability and signal — NaBajk does not guarantee the accuracy of recorded data.'}
            </p>
          </section>

          {/* TRAFFIC LAW */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Prometna zakonodaja' : 'Traffic law compliance'}
            </h2>
            <p>
              {sl
                ? 'Izključno vi ste odgovorni za upoštevanje vseh veljavnih prometnih predpisov, zakonodaje in lokalnih predpisov v vaši jurisdikciji. NaBajk ne nosi nobene odgovornosti za kršitve prometnih predpisov ali posledice le-teh.'
                : 'You are solely responsible for complying with all applicable traffic laws, regulations, and local ordinances in your jurisdiction. NaBajk bears no liability for traffic violations or their consequences.'}
            </p>
          </section>

          {/* LOCATION DATA */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Lokacijski podatki' : 'Location data'}
            </h2>
            <p>
              {sl
                ? 'Z uporabo funkcije snemanja vožnje aplikaciji dodelite dostop do GPS lokacije vaše naprave (vključno z ozadjem). Ta dostop se uporablja izključno za snemanje vaše GPS sledi med aktivno sejo. Lokacijski dostop lahko kadar koli prekličete v nastavitvah naprave; v tem primeru snemanje vožnje ne bo delovalo. Lokacijski podatki se shranjujejo v vašem računu in se trajno izbrišejo ob izbrisu računa.'
                : 'By using the ride recording feature you grant the app access to your device\'s GPS location (including background). This access is used exclusively to record your GPS track during an active session. You can revoke location access at any time in your device settings; ride recording will not function without it. Location data is stored in your account and permanently deleted when you delete your account.'}
            </p>
          </section>

          {/* GROUP RIDES */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Skupinske vožnje' : 'Group rides'}
            </h2>
            <p>
              {sl
                ? 'Z udeležbo ali organizacijo skupinske vožnje v celoti sprejemate osebno odgovornost za svojo udeležbo. Organizator skupinske vožnje je izključno odgovoren za varnost vožnje, zakonitost trase in komunikacijo z udeleženci. NaBajk ni soorganizator nobene skupinske vožnje in ne prevzema odgovornosti za dejavnosti ali posledice skupinskih voženj. Spoštujte druge udeležence v prometu, pešce in zasebno lastnino.'
                : 'By joining or organising a group ride you accept full personal responsibility for your participation. The group ride organiser is solely responsible for the ride\'s safety, route legality, and communication with participants. NaBajk is not a co-organiser of any group ride and accepts no responsibility for group ride activities or consequences. Respect other road users, pedestrians, and private property.'}
            </p>
          </section>

          {/* USER CONTENT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Vsebina uporabnikov' : 'User content'}
            </h2>
            <p>
              {sl
                ? 'Z nalaganjem poti ali GPX datotek v NaBajk dodelite NaBajku neekskluzivno, brezplačno licenco za prikaz teh vsebin drugim uporabnikom aplikacije. Lastništvo vaše vsebine ostane pri vas. S tem, ko vsebino naložite, potrjujete, da imate pravico do njenega deljenja in da ne krši pravic tretjih oseb. NaBajk si pridržuje pravico, da brez predhodnega obvestila odstrani vsebino ali račune, ki kršijo te pogoje, veljavno zakonodajo ali žalijo skupnost.'
                : 'By uploading routes or GPX files to NaBajk you grant NaBajk a non-exclusive, royalty-free licence to display that content to other app users. You retain ownership of your content. By uploading content you confirm that you have the right to share it and that it does not infringe any third-party rights. NaBajk reserves the right to remove content or accounts that violate these terms, applicable law, or community standards without prior notice.'}
            </p>
          </section>

          {/* PROHIBITED CONDUCT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Prepovedana ravnanja' : 'Prohibited conduct'}
            </h2>
            <p>{sl ? 'Prepovedano je:' : 'It is prohibited to:'}</p>
            <ul className={styles.list}>
              <li>{sl ? 'Nalagati lažne, zavajajoče ali nevarne poti.' : 'Upload false, misleading, or dangerous routes.'}</li>
              <li>{sl ? 'Nadlegovati ali žaliti druge uporabnike v klepetalnicah skupinskih voženj.' : 'Harass or abuse other users in group ride chats.'}</li>
              <li>{sl ? 'Samodejno zbirati (scraping) podatke iz aplikacije.' : 'Automatically scrape data from the app.'}</li>
              <li>{sl ? 'Ustvariti nov račun z namenom izogibanja prepovedi.' : 'Create a new account to circumvent a ban or suspension.'}</li>
              <li>{sl ? 'Kakorkoli posegati v delovanje aplikacije ali njene infrastrukture.' : 'Interfere with the operation of the app or its infrastructure.'}</li>
            </ul>
          </section>

          {/* LIMITATION OF LIABILITY */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Omejitev odgovornosti' : 'Limitation of liability'}
            </h2>
            <p>
              {sl
                ? 'NaBajk, njegovi lastniki, razvijalci in sodelavci v nobenem primeru niso odgovorni za kakršno koli neposredno, posredno, naključno, posebno ali posledično škodo, ki izhaja iz uporabe aplikacije ali njenih vsebin, vključno z — a ne omejeno na — telesne poškodbe, smrt, materialno škodo, izgubo podatkov ali prekinjeno delovanje storitve. Ta omejitev velja v največjem obsegu, ki ga dopušča veljavna zakonodaja.'
                : 'NaBajk, its owners, developers, and contributors are not liable under any circumstances for any direct, indirect, incidental, special, or consequential damages arising from use of the app or its content, including but not limited to personal injury, death, property damage, data loss, or service interruption. This limitation applies to the fullest extent permitted by applicable law.'}
            </p>
          </section>

          {/* SERVICE TERMINATION */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Preklic storitve' : 'Service termination'}
            </h2>
            <p>
              {sl
                ? 'NaBajk lahko kadar koli in brez predhodnega obvestila ukine ali bistveno spremeni storitev. Ker je aplikacija brezplačna, ob prekinitvi storitve ni povračil. Priporočamo, da pomembne GPS sledi redno izvažate za lastno varnostno kopijo.'
                : 'NaBajk may shut down or materially change the service at any time without prior notice. As the app is free, no refunds apply upon termination. We recommend regularly exporting important GPS tracks for your own backup.'}
            </p>
          </section>

          {/* GOVERNING LAW */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Veljavno pravo' : 'Governing law'}
            </h2>
            <p>
              {sl
                ? 'Te pogoje ureja pravo Republike Slovenije. Vsi spori se rešujejo pred pristojnimi slovenskimi sodišči. Pogoji se lahko posodobijo; o bistvenih spremembah vas bomo obvestili prek aplikacije. Nadaljnja uporaba aplikacije pomeni sprejetje veljavnih pogojev.'
                : 'These terms are governed by the law of the Republic of Slovenia. All disputes are subject to the exclusive jurisdiction of Slovenian courts. Terms may be updated; we will notify you of material changes via the app. Continued use of the app constitutes acceptance of the current terms.'}
            </p>
          </section>

          {/* CONTACT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Kontakt' : 'Contact'}
            </h2>
            <p>
              {sl ? 'Za vprašanja v zvezi s pogoji uporabe:' : 'For questions about these terms:'}{' '}
              <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
            </p>
          </section>

          <Link href="/" className={styles.backLink}>
            {sl ? '← Nazaj' : '← Back'}
          </Link>
        </article>
      </main>
    </div>
  )
}
