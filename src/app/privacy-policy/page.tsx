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
          <img src="/logo.png" alt="NaBajk" width={120} height={34} />
        </Link>
        <LanguageToggle />
      </header>

      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>
            Politika zasebnosti <span className={styles.titleSuffix}>/ Privacy Policy</span>
          </h1>
          <p className={styles.lastUpdated}>Zadnja posodobitev / Last updated: April / April 2026</p>

          {/* WHAT WE COLLECT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kaj zbiramo / What we collect</h2>
            <p>
              NaBajk zbira naslednje podatke:
            </p>
            <ul>
              <li>
                <strong>E-poštni naslov</strong> — za preverjanje identitete ob prijavi (magic link, Google Sign-In ali Apple Sign-In). Naslova ne delimo z nikomer in ga ne prodajamo.
              </li>
              <li>
                <strong>Prikazno ime ali vzdevek</strong> — po vaši izbiri. Pravo ime ni zahtevano niti shranjeno.
              </li>
              <li>
                <strong>Lokacija / GPS (ospredje in ozadje)</strong> — ko vi aktivno zaženete snemanje vožnje, aplikacija dostopa do GPS lokacije vaše naprave. Snemanje se nadaljuje tudi v ozadju (z izklopljenim zaslonom), da GPS sled ni prekinjena. Aplikacija beleži: zemljepisno širino, dolžino, nadmorsko višino (kadar je na voljo), časovni žig in natančnost — vsake 4 sekunde oziroma vsakih 15 metrov. Ti podatki se shranijo kot del vaše zgodovine voženj v vašem računu na Supabase. GPS se uporablja izključno za funkcijo snemanja vožnje in se ne deli s tretjimi osebami.
              </li>
              <li>
                <strong>Foto knjižnica</strong> — dostop do foto knjižnice se zahteva izključno, ko vi izrecno delite kartico vožnje (slika se shrani na vašo napravo). Aplikacija nima dostopa do kamere.
              </li>
              <li>
                <strong>Potisni žeton / Push token</strong> — za pošiljanje obvestil o skupinskih vožnjah. Žeton je shranjen v vašem profilu na Supabase.
              </li>
              <li>
                <strong>Podatki o vožnji</strong> — naslov, razdalja (km), višinski vzpon (m), trajanje (min), težavnost (samodejno izračunana), GPS polilinija, celotni GPX z žigi, regija. Povezano z vašim računom.
              </li>
              <li>
                <strong>GPX datoteke</strong> — datoteke, ki jih sami naložite prek izbirnika datotek. Shranjene v zasebnem prostoru Supabase, dostopne samo lastniku.
              </li>
              <li>
                <strong>Podatki o skupinskih vožnjah</strong> — naslov, regija, datum/čas, zbirno mesto (besedilo in koordinate), stanje RSVP, prikazno ime. Sporočila v klepetalnici vsebujejo samo prikazno ime (brez ID-ja) in se samodejno izbrišejo 2 uri po začetku vožnje.
              </li>
            </ul>
            <p>
              NaBajk collects the following data:
            </p>
            <ul>
              <li>
                <strong>Email address</strong> — to verify your identity when signing in (magic link, Google Sign-In, or Apple Sign-In). We never share or sell your email address.
              </li>
              <li>
                <strong>Display name or nickname</strong> — chosen by you. No real name is required or stored.
              </li>
              <li>
                <strong>Location / GPS (foreground and background)</strong> — when you actively start a ride recording, the app accesses your device&apos;s GPS. Recording continues in the background (screen off) so your GPS track is not interrupted. The app captures: latitude, longitude, altitude (when available), timestamp, and accuracy — every 4 seconds or 15 meters. This data is saved as part of your ride history in your account on Supabase. GPS is used exclusively for the ride recording feature and is not shared with any third party.
              </li>
              <li>
                <strong>Photo library</strong> — access to your photo library is requested only when you explicitly share a ride card (the generated image is saved to your device). The app does not have camera access.
              </li>
              <li>
                <strong>Push token</strong> — to send group ride notifications. The token is stored in your profile on Supabase.
              </li>
              <li>
                <strong>Ride data</strong> — title, distance (km), elevation gain (m), duration (min), difficulty (auto-calculated), GPS polyline, full GPX with timestamps, region. Linked to your account.
              </li>
              <li>
                <strong>GPX files</strong> — files you upload via the file picker. Stored in a private Supabase bucket, accessible only to the owner.
              </li>
              <li>
                <strong>Group ride data</strong> — title, region, date/time, meeting point (text and coordinates), RSVP status, display name. Chat messages store display name only (no user ID) and are auto-deleted 2 hours after ride start.
              </li>
            </ul>
          </section>

          {/* HOW WE USE YOUR DATA */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kako podatke uporabljamo / How we use your data</h2>
            <ul>
              <li><strong>E-pošta</strong> — izključno za prijavo in dostop do računa.</li>
              <li><strong>GPS / lokacija</strong> — izključno za snemanje vožnje. Shranjeni podatki o vožnji so vidni samo vam in se trajno izbrišejo ob izbrisu računa.</li>
              <li><strong>Push žeton</strong> — izključno za pošiljanje obvestil o skupinskih vožnjah.</li>
              <li><strong>Foto knjižnica</strong> — za shranjevanje kartic vožnje lokalno na vaši napravi.</li>
              <li><strong>GPX datoteke</strong> — za prikaz poti v brskalniku poti; dostopne samo lastniku.</li>
              <li><strong>Podatki o skupinskih vožnjah</strong> — prikazani udeležencem vožnje.</li>
            </ul>
            <p>NaBajk ne izvaja vedenjskega sledenja, ne prikazuje oglasov in ne gradi oglasnih profilov.</p>
            <ul>
              <li><strong>Email</strong> — exclusively for sign-in and account access.</li>
              <li><strong>GPS / location</strong> — exclusively for ride recording. Stored ride data is visible only to you and is permanently deleted when you delete your account.</li>
              <li><strong>Push token</strong> — exclusively to send group ride notifications.</li>
              <li><strong>Photo library</strong> — to save ride cards locally on your device.</li>
              <li><strong>GPX files</strong> — to display routes in the route browser; accessible only to the owner.</li>
              <li><strong>Group ride data</strong> — displayed to ride participants.</li>
            </ul>
            <p>NaBajk does not perform behavioural tracking, does not show advertisements, and does not build advertising profiles.</p>
          </section>

          {/* BACKGROUND LOCATION */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lokacija v ozadju / Background location</h2>
            <p>
              Aplikacija zahteva dovoljenje &bdquo;Vedno dovoli&ldquo; za lokacijo, da snemanje vožnje ni prekinjeno, ko izklopite zaslon. Lokacija v ozadju se uporablja izključno za to funkcijo — nikoli za sledenje, oglaševanje ali katerikoli drug namen. Do lokacije v ozadju dostopamo samo med aktivno sejo snemanja, ki jo vi ročno sprožite in ustavite. To dovoljenje lahko kadar koli prekličete v nastavitvah naprave; v tem primeru snemanje vožnje ne bo delovalo.
            </p>
            <p>
              The app requests the &ldquo;Always Allow&rdquo; location permission so that ride recording is not interrupted when you turn off your screen. Background location is used exclusively for this feature — never for tracking, advertising, or any other purpose. Background location is only accessed during an active recording session that you manually start and stop. You can revoke this permission at any time in your device settings; ride recording will not function without it.
            </p>
          </section>

          {/* THIRD-PARTY SERVICES */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tretje osebe / Third-party services</h2>
            <p>NaBajk uporablja naslednje zunanje storitve. Ni analitičnih, oglasnih ali crashreporting SDK-jev.</p>
            <p>NaBajk uses the following third-party services. There are no analytics, advertising, or crash-reporting SDKs.</p>
            <ul>
              <li><strong>Supabase</strong> (EU strežniki / EU servers) — podatkovna baza, avtentikacija, shranjevanje datotek. Hrani vse uporabniške podatke. / Database, authentication, file storage. Stores all user data.</li>
              <li><strong>Expo Push</strong> — pošiljanje potisnih obvestil. Prejme potisni žeton naprave. / Sends push notifications. Receives device push token.</li>
              <li><strong>Google Sign-In</strong> — avtentikacija. Prejme Google identity žeton. / Authentication. Receives Google identity token.</li>
              <li><strong>Apple Sign-In</strong> — avtentikacija. Prejme Apple identity žeton. / Authentication. Receives Apple identity token.</li>
              <li><strong>OpenFreemap.org</strong> — ploščice zemljevida. Prejme samo IP naslov (standardni CDN). / Map tiles. Receives IP address only (standard CDN).</li>
              <li><strong>CartoDB</strong> — ploščice zemljevida za kartice vožnje. Prejme samo IP naslov. / Map tiles for ride share cards. Receives IP address only.</li>
              <li><strong>Instagram / Facebook</strong> — deljenje zgodb (samo na pobudo uporabnika). Prejme lokalno ustvarjeno sliko PNG. / Story sharing (user-initiated only). Receives locally generated PNG image.</li>
            </ul>
          </section>

          {/* STORAGE AND SECURITY */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shranjevanje in varnost / Storage and security</h2>
            <p>
              Vaši podatki so shranjeni na infrastrukturi Supabase, ki deluje na strežnikih v Evropski uniji. Supabase zagotavlja šifriranje podatkov med prenosom in v mirovanju. GPX datoteke so shranjene v zasebnem prostoru, dostopnem samo lastniku. Push žetoni so shranjeni v tabeli uporabniških profilov.
            </p>
            <p>
              Your data is stored on Supabase infrastructure running on servers in the European Union. Supabase provides encryption of data in transit and at rest. GPX files are stored in a private bucket accessible only to the owner. Push tokens are stored in the user profiles table.
            </p>
          </section>

          {/* YOUR RIGHTS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vaše pravice / Your rights</h2>
            <p>
              Račun in vse z njim povezane podatke lahko kadar koli izbrišete neposredno v aplikaciji (Nastavitve → Izbriši račun). Brisanje je takojšnje in trajno ter zajema:
            </p>
            <ul>
              <li>Profil in nastavitve / Profile and settings</li>
              <li>Vse shranjene vožnje (GPS sledi, GPX podatki) / All saved rides (GPS tracks, GPX data)</li>
              <li>Vse skupinske vožnje, ki ste jih ustvarili / All group rides you created</li>
              <li>Vse RSVP-je in priljubljene / All RSVPs and favourites</li>
            </ul>
            <p>
              Opomba: sporočila v klepetalnicah skupinskih voženj vsebujejo samo prikazno ime (brez ID-ja). Sporočila od izbrisanih računov so lahko vidna do samodejnega brisanja 2 uri po začetku vožnje.
            </p>
            <p>
              You can delete your account and all associated data at any time directly in the app (Settings → Delete Account). Deletion is immediate and permanent and covers:
            </p>
            <ul>
              <li>Profile and settings</li>
              <li>All saved rides (GPS tracks, GPX data)</li>
              <li>All group rides you created</li>
              <li>All RSVPs and favourites</li>
            </ul>
            <p>
              Note: group ride chat messages store display name only (no user ID). Messages from deleted accounts may remain visible until the auto-delete 2 hours after ride start.
            </p>
            <p>
              Za ostala vprašanja nas kontaktirajte na: <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
            </p>
            <p>
              For other questions contact us at: <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
            </p>
          </section>

          {/* CHILDREN */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Otroci / Children</h2>
            <p>
              Aplikacija NaBajk ni namenjena otrokom, mlajšim od 13 let. Zavestno ne zbiramo podatkov od otrok, mlajših od 13 let. Če menite, da smo nenamerno zbrali podatke otroka, nas kontaktirajte na <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a> in jih bomo takoj izbrisali.
            </p>
            <p>
              NaBajk is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe we have inadvertently collected data from a child, please contact us at <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a> and we will delete it immediately.
            </p>
          </section>

          {/* CONTACT */}
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
