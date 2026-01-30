export type Locale = 'sl' | 'en'

export const translations = {
  sl: {
    // Hero
    heroHeadline: 'Ne veš kam na kolo?',
    heroSubheadlinePrefix: 'Izbrane cestne poti v ',
    heroSubheadlineAccent: 'Sloveniji.',
    heroDescription: 'Najboljše ceste, razdeljene po regijah, in skupinske vožnje - vse za tvoj naslednji izlet.',

    // Waitlist
    waitlistTitle: 'Bodi med prvimi',
    waitlistDescription: 'Pridruži se čakalni listi in izve di, ko aplikacija izide.',
    waitlistPlaceholder: 'Vnesi svoj e-mail',
    waitlistButton: 'Pridruži se',
    waitlistButtonLoading: 'Pošiljam...',
    waitlistSuccess: 'Odlično! Obvestili te bomo ob izidu.',
    waitlistErrorGeneric: 'Nekaj je šlo narobe. Poskusi znova.',
    waitlistErrorInvalid: 'Vnesi veljaven e-mail naslov.',
    waitlistErrorDuplicate: 'Ta e-mail je že na čakalni listi.',
    waitlistConsent: 'S prijavo se strinjaš, da ti občasno pošljemo novice o aplikaciji. Brez neželene pošte.',

    // Features
    featuresTagline: 'ZAKAJ NABAJK',
    featuresTitle: 'Vse za cestno kolesarjenje v Sloveniji. Na enem mestu.',
    featuresProblem: 'Kolikokrat si iskal poti ali tekme po internetu in je bil info raztresen po skupinah, PDF-jih in objavah? NaBajk zbere bistveno na enem mestu, da se hitreje odločiš in greš na kolo.',
    feature1Title: 'Kurirane poti po regijah',
    feature1Description: 'Ročno izbrane cestne ture. Krog za kavo, klanci ali daljše vožnje. Brez šuma.',
    feature2Title: 'Regionalno vreme (ARSO)',
    feature2Description: 'Hitra napoved po regiji z vetrom, preden se odločiš za smer.',
    feature3Title: 'Koledar rekreativnih tekem',
    feature3Description: 'Amaterski cestni dogodki v Sloveniji, z zbranimi datumi in direktnimi povezavami do organizatorjev.',
    feature4Title: 'Skupinske vožnje',
    feature4Description: 'Ustvari svojo vožnjo ali se pridruži obstoječi. Povabi prijatelje in skupaj odkrijte nove poti.',
    featuresOffline: 'Zemljevidi poti bodo na voljo tudi za prenos (offline).',
    featuresLaunchingSoon: 'NaBajk prihaja kmalu. Sledi za launch.',

    // App showcase
    showcaseTagline: 'Aplikacija',
    showcaseTitle: 'Temna, čista, osredotočena',
    showcaseDescription: 'Zasnovana za kolesarje, ki želijo hitro najti odličen izlet — brez odvečnega šuma.',

    // App Preview
    previewTagline: 'PRIHAJA KMALU',
    previewTitle: 'Pokukaj v aplikacijo',
    previewDescription: 'Temna, čista in osredotočena. Zasnovana za kolesarje, ki želijo hitro najti odličen izlet.',

    // Contact
    contactTitle: 'Stopi v stik',
    contactDescription: 'Imaš vprašanja? Želiš izvedeti več o aplikaciji? Piši nam - z veseljem ti odgovorimo.',
    contactButton: 'Pošlji sporočilo',

    // Footer
    footerTagline: 'Narejeno za Slovenijo',
    footerPrivacy: 'Zasebnost',
    footerContact: 'Kontakt',
    footerCopyright: '© 2026 NaBajk. Vse pravice pridržane.',

    // Language toggle
    langSlo: 'SLO',
    langEng: 'ENG',

    // Regions
    regionGorenjska: 'Gorenjska',
    regionOther: 'Kmalu še več regij',
  },
  en: {
    // Hero
    heroHeadline: 'Don\'t know where to ride?',
    heroSubheadlinePrefix: 'Curated road routes in ',
    heroSubheadlineAccent: 'Slovenia.',
    heroDescription: 'The best roads organized by region, plus group rides - everything for your next adventure.',

    // Waitlist
    waitlistTitle: 'Be among the first',
    waitlistDescription: 'Join the waitlist and find out when the app launches.',
    waitlistPlaceholder: 'Enter your email',
    waitlistButton: 'Join waitlist',
    waitlistButtonLoading: 'Sending...',
    waitlistSuccess: 'You\'re in! We\'ll notify you when we launch.',
    waitlistErrorGeneric: 'Something went wrong. Please try again.',
    waitlistErrorInvalid: 'Please enter a valid email address.',
    waitlistErrorDuplicate: 'This email is already on the waitlist.',
    waitlistConsent: 'By signing up, you agree to receive occasional app updates. No spam.',

    // Features
    featuresTagline: 'WHY NABAJK',
    featuresTitle: 'Everything for road cycling in Slovenia. In one place.',
    featuresProblem: 'How many times have you searched for routes or amateur races and ended up lost in scattered posts, PDFs, and groups? NaBajk brings the essentials together so you can choose faster and go ride.',
    feature1Title: 'Curated routes by region',
    feature1Description: 'Hand-picked road rides. Coffee loops, climbs, or longer days. No noise.',
    feature2Title: 'Regional weather (ARSO)',
    feature2Description: 'Quick forecast by region with wind, before you commit to a route.',
    feature3Title: 'Amateur race calendar',
    feature3Description: 'Slovenia\'s amateur road events in one calendar, with dates and direct organizer links.',
    feature4Title: 'Group rides',
    feature4Description: 'Create your own ride or join an existing one. Invite friends and discover new routes together.',
    featuresOffline: 'Route maps will be downloadable for offline use.',
    featuresLaunchingSoon: 'NaBajk is launching soon. Follow for updates.',

    // App showcase
    showcaseTagline: 'The app',
    showcaseTitle: 'Dark, clean, focused',
    showcaseDescription: 'Designed for cyclists who want to find a great ride fast — without the noise.',

    // App Preview
    previewTagline: 'COMING SOON',
    previewTitle: 'Sneak peek at the app',
    previewDescription: 'Dark, clean, and focused. Designed for cyclists who want to find a great ride fast.',

    // Contact
    contactTitle: 'Get in touch',
    contactDescription: 'Have questions? Want to learn more about the app? Write to us - we\'d love to hear from you.',
    contactButton: 'Send a message',

    // Footer
    footerTagline: 'Made for Slovenia',
    footerPrivacy: 'Privacy',
    footerContact: 'Contact',
    footerCopyright: '© 2026 NaBajk. All rights reserved.',

    // Language toggle
    langSlo: 'SLO',
    langEng: 'ENG',

    // Regions
    regionGorenjska: 'Gorenjska',
    regionOther: 'More regions coming soon',
  },
} as const

export type TranslationKey = keyof typeof translations.sl

export function getTranslation(locale: Locale, key: TranslationKey): string {
  return translations[locale][key]
}
