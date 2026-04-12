'use client'

import Link from 'next/link'
import { LanguageToggle } from '@/components/LanguageToggle'
import { useLanguage } from '@/lib/LanguageContext'
import styles from '../legal.module.css'

export function PrivacyPolicyContent() {
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
            {sl ? 'Politika zasebnosti' : 'Privacy Policy'}
          </h1>
          <p className={styles.lastUpdated}>
            {sl ? 'Zadnja posodobitev: April 2026' : 'Last updated: April 2026'}
          </p>

          {/* WHAT WE COLLECT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Kaj zbiramo' : 'What we collect'}
            </h2>
            <p>{sl ? 'NaBajk zbira naslednje podatke:' : 'NaBajk collects the following data:'}</p>
            <ul className={styles.list}>
              <li>
                <strong>{sl ? 'E-poštni naslov' : 'Email address'}</strong>
                {sl
                  ? ' — za preverjanje identitete ob prijavi (magic link, Google Sign-In ali Apple Sign-In). Naslova ne delimo z nikomer in ga ne prodajamo.'
                  : ' — to verify your identity when signing in (magic link, Google Sign-In, or Apple Sign-In). We never share or sell your email address.'}
              </li>
              <li>
                <strong>{sl ? 'Prikazno ime ali vzdevek' : 'Display name or nickname'}</strong>
                {sl
                  ? ' — po vaši izbiri. Pravo ime ni zahtevano niti shranjeno.'
                  : ' — chosen by you. No real name is required or stored.'}
              </li>
              <li>
                <strong>{sl ? 'Lokacija / GPS (ospredje in ozadje)' : 'Location / GPS (foreground and background)'}</strong>
                {sl
                  ? ' — ko vi aktivno zaženete snemanje vožnje, aplikacija dostopa do GPS lokacije vaše naprave. Snemanje se nadaljuje tudi v ozadju (z izklopljenim zaslonom), da GPS sled ni prekinjena. Aplikacija beleži: zemljepisno širino, dolžino, nadmorsko višino (kadar je na voljo), časovni žig in natančnost — vsake 4 sekunde oziroma vsakih 15 metrov. Ti podatki se shranijo kot del vaše zgodovine voženj v vašem računu. GPS se uporablja izključno za funkcijo snemanja vožnje in se ne deli s tretjimi osebami.'
                  : ' — when you actively start a ride recording, the app accesses your device\'s GPS. Recording continues in the background (screen off) so your GPS track is not interrupted. The app captures: latitude, longitude, altitude (when available), timestamp, and accuracy — every 4 seconds or 15 meters. This data is saved as part of your ride history in your account. GPS is used exclusively for the ride recording feature and is not shared with any third party.'}
              </li>
              <li>
                <strong>{sl ? 'Foto knjižnica' : 'Photo library'}</strong>
                {sl
                  ? ' — dostop do foto knjižnice se zahteva izključno, ko vi izrecno delite kartico vožnje (slika se shrani na vašo napravo). Aplikacija nima dostopa do kamere.'
                  : ' — access to your photo library is requested only when you explicitly share a ride card (the generated image is saved to your device). The app does not have camera access.'}
              </li>
              <li>
                <strong>{sl ? 'Potisni žeton' : 'Push token'}</strong>
                {sl
                  ? ' — za pošiljanje obvestil o skupinskih vožnjah. Žeton je shranjen v vašem profilu.'
                  : ' — to send group ride notifications. The token is stored in your profile.'}
              </li>
              <li>
                <strong>{sl ? 'Podatki o vožnji' : 'Ride data'}</strong>
                {sl
                  ? ' — naslov, razdalja (km), višinski vzpon (m), trajanje (min), težavnost (samodejno izračunana), GPS polilinija, celotni GPX z žigi, regija. Povezano z vašim računom.'
                  : ' — title, distance (km), elevation gain (m), duration (min), difficulty (auto-calculated), GPS polyline, full GPX with timestamps, region. Linked to your account.'}
              </li>
              <li>
                <strong>{sl ? 'GPX datoteke' : 'GPX files'}</strong>
                {sl
                  ? ' — datoteke, ki jih sami naložite prek izbirnika datotek. Shranjene v zasebnem prostoru, dostopne samo lastniku.'
                  : ' — files you upload via the file picker. Stored in a private bucket, accessible only to the owner.'}
              </li>
              <li>
                <strong>{sl ? 'Podatki o skupinskih vožnjah' : 'Group ride data'}</strong>
                {sl
                  ? ' — naslov, regija, datum/čas, zbirno mesto (besedilo in koordinate), stanje RSVP, prikazno ime. Sporočila v klepetalnici vsebujejo samo prikazno ime (brez ID-ja) in se samodejno izbrišejo 2 uri po začetku vožnje.'
                  : ' — title, region, date/time, meeting point (text and coordinates), RSVP status, display name. Chat messages store display name only (no user ID) and are auto-deleted 2 hours after ride start.'}
              </li>
            </ul>
          </section>

          {/* HOW WE USE YOUR DATA */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Kako podatke uporabljamo' : 'How we use your data'}
            </h2>
            <ul className={styles.list}>
              <li><strong>{sl ? 'E-pošta' : 'Email'}</strong>{sl ? ' — izključno za prijavo in dostop do računa.' : ' — exclusively for sign-in and account access.'}</li>
              <li><strong>{sl ? 'GPS / lokacija' : 'GPS / location'}</strong>{sl ? ' — izključno za snemanje vožnje. Shranjeni podatki o vožnji so vidni samo vam in se trajno izbrišejo ob izbrisu računa.' : ' — exclusively for ride recording. Stored ride data is visible only to you and is permanently deleted when you delete your account.'}</li>
              <li><strong>{sl ? 'Potisni žeton' : 'Push token'}</strong>{sl ? ' — izključno za pošiljanje obvestil o skupinskih vožnjah.' : ' — exclusively to send group ride notifications.'}</li>
              <li><strong>{sl ? 'Foto knjižnica' : 'Photo library'}</strong>{sl ? ' — za shranjevanje kartic vožnje lokalno na vaši napravi.' : ' — to save ride cards locally on your device.'}</li>
              <li><strong>{sl ? 'GPX datoteke' : 'GPX files'}</strong>{sl ? ' — za prikaz poti v brskalniku poti; dostopne samo lastniku.' : ' — to display routes in the route browser; accessible only to the owner.'}</li>
              <li><strong>{sl ? 'Podatki o skupinskih vožnjah' : 'Group ride data'}</strong>{sl ? ' — prikazani udeležencem vožnje.' : ' — displayed to ride participants.'}</li>
            </ul>
            <p style={{ marginTop: 'var(--space-3)' }}>
              {sl
                ? 'NaBajk ne izvaja vedenjskega sledenja, ne prikazuje oglasov in ne gradi oglasnih profilov.'
                : 'NaBajk does not perform behavioural tracking, does not show advertisements, and does not build advertising profiles.'}
            </p>
          </section>

          {/* BACKGROUND LOCATION */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Lokacija v ozadju' : 'Background location'}
            </h2>
            <p>
              {sl
                ? 'Aplikacija zahteva dovoljenje "Vedno dovoli" za lokacijo, da snemanje vožnje ni prekinjeno, ko izklopite zaslon. Lokacija v ozadju se uporablja izključno za to funkcijo — nikoli za sledenje, oglaševanje ali katerikoli drug namen. Do lokacije v ozadju dostopamo samo med aktivno sejo snemanja, ki jo vi ročno sprožite in ustavite. To dovoljenje lahko kadar koli prekličete v nastavitvah naprave; v tem primeru snemanje vožnje ne bo delovalo.'
                : 'The app requests the "Always Allow" location permission so that ride recording is not interrupted when you turn off your screen. Background location is used exclusively for this feature — never for tracking, advertising, or any other purpose. Background location is only accessed during an active recording session that you manually start and stop. You can revoke this permission at any time in your device settings; ride recording will not function without it.'}
            </p>
          </section>

          {/* THIRD-PARTY SERVICES */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Zunanje storitve' : 'Third-party services'}
            </h2>
            <p>
              {sl
                ? 'NaBajk uporablja naslednje zunanje storitve. Ni analitičnih, oglasnih ali crash-reporting SDK-jev.'
                : 'NaBajk uses the following third-party services. There are no analytics, advertising, or crash-reporting SDKs.'}
            </p>
            <ul className={styles.list}>
              <li><strong>Supabase</strong> ({sl ? 'strežniki v EU' : 'EU servers'}) — {sl ? 'podatkovna baza, avtentikacija, shranjevanje datotek. Hrani vse uporabniške podatke.' : 'database, authentication, file storage. Stores all user data.'}</li>
              <li><strong>Expo Push</strong> — {sl ? 'pošiljanje potisnih obvestil. Prejme potisni žeton naprave.' : 'sends push notifications. Receives device push token.'}</li>
              <li><strong>Google Sign-In</strong> — {sl ? 'avtentikacija. Prejme Google identity žeton.' : 'authentication. Receives Google identity token.'}</li>
              <li><strong>Apple Sign-In</strong> — {sl ? 'avtentikacija. Prejme Apple identity žeton.' : 'authentication. Receives Apple identity token.'}</li>
              <li><strong>OpenFreemap.org</strong> — {sl ? 'ploščice zemljevida. Prejme samo IP naslov.' : 'map tiles. Receives IP address only.'}</li>
              <li><strong>CartoDB</strong> — {sl ? 'ploščice zemljevida za kartice vožnje. Prejme samo IP naslov.' : 'map tiles for ride share cards. Receives IP address only.'}</li>
              <li><strong>Instagram / Facebook</strong> — {sl ? 'deljenje zgodb (samo na pobudo uporabnika). Prejme lokalno ustvarjeno sliko.' : 'story sharing (user-initiated only). Receives locally generated image.'}</li>
            </ul>
          </section>

          {/* STORAGE AND SECURITY */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Shranjevanje in varnost' : 'Storage and security'}
            </h2>
            <p>
              {sl
                ? 'Vaši podatki so shranjeni na infrastrukturi Supabase, ki deluje na strežnikih v Evropski uniji. Supabase zagotavlja šifriranje podatkov med prenosom in v mirovanju. GPX datoteke so shranjene v zasebnem prostoru, dostopnem samo lastniku. Potisni žetoni so shranjeni v tabeli uporabniških profilov.'
                : 'Your data is stored on Supabase infrastructure running on servers in the European Union. Supabase provides encryption of data in transit and at rest. GPX files are stored in a private bucket accessible only to the owner. Push tokens are stored in the user profiles table.'}
            </p>
          </section>

          {/* YOUR RIGHTS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Vaše pravice' : 'Your rights'}
            </h2>
            <p>
              {sl
                ? 'Račun in vse z njim povezane podatke lahko kadar koli izbrišete neposredno v aplikaciji (Nastavitve → Izbriši račun). Brisanje je takojšnje in trajno ter zajema:'
                : 'You can delete your account and all associated data at any time directly in the app (Settings → Delete Account). Deletion is immediate and permanent and covers:'}
            </p>
            <ul className={styles.list}>
              <li>{sl ? 'Profil in nastavitve' : 'Profile and settings'}</li>
              <li>{sl ? 'Vse shranjene vožnje (GPS sledi, GPX podatki)' : 'All saved rides (GPS tracks, GPX data)'}</li>
              <li>{sl ? 'Vse skupinske vožnje, ki ste jih ustvarili' : 'All group rides you created'}</li>
              <li>{sl ? 'Vse RSVP-je in priljubljene' : 'All RSVPs and favourites'}</li>
            </ul>
            <p style={{ marginTop: 'var(--space-3)' }}>
              {sl
                ? 'Opomba: sporočila v klepetalnicah skupinskih voženj vsebujejo samo prikazno ime (brez ID-ja). Sporočila od izbrisanih računov so lahko vidna do samodejnega brisanja 2 uri po začetku vožnje.'
                : 'Note: group ride chat messages store display name only (no user ID). Messages from deleted accounts may remain visible until the auto-delete 2 hours after ride start.'}
            </p>
            <p style={{ marginTop: 'var(--space-3)' }}>
              {sl ? 'Za ostala vprašanja:' : 'For other questions:'}{' '}
              <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
            </p>
          </section>

          {/* CHILDREN */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Otroci' : 'Children'}
            </h2>
            <p>
              {sl
                ? 'Aplikacija NaBajk ni namenjena otrokom, mlajšim od 13 let. Zavestno ne zbiramo podatkov od otrok, mlajših od 13 let. Če menite, da smo nenamerno zbrali podatke otroka, nas kontaktirajte na '
                : 'NaBajk is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe we have inadvertently collected data from a child, please contact us at '}
              <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>
              {sl ? ' in jih bomo takoj izbrisali.' : ' and we will delete it immediately.'}
            </p>
          </section>

          {/* CONTACT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sl ? 'Kontakt' : 'Contact'}
            </h2>
            <p>
              {sl ? 'Za vsa vprašanja v zvezi z zasebnostjo:' : 'For any privacy-related questions:'}{' '}
              <a href="mailto:nabajk.si@gmail.com">nabajk.si@gmail.com</a>.{' '}
              {sl
                ? 'Politika zasebnosti se lahko posodobi. Nadaljnja uporaba aplikacije pomeni sprejetje sprememb.'
                : 'This policy may be updated. Continued use of the app constitutes acceptance of any changes.'}
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
