# NaBajk Landing Page

Production-grade landing page for NaBajk — a curated route discovery app for road cycling in Slovenia.

## Art Direction Brief

### Direction & Tone
**Editorial Luxury**: A premium, restrained aesthetic that combines editorial magazine sensibilities with luxury brand refinement. The design prioritizes dramatic whitespace, typographic authority, and intentional asymmetry to create a distinctive presence that feels authored rather than templated.

### Typography
**Display**: Space Grotesk — geometric, modern, and characterful with excellent optical rhythm
**Body**: DM Sans — clean, readable, premium feel that pairs harmoniously with Space Grotesk
**Mono**: JetBrains Mono — for any technical/code elements

This pairing replaces Inter (which was in the original brand guidelines) to avoid the common AI aesthetic pattern while maintaining the clean, modern character required by the brand.

### Palette Logic
The color system uses the NaBajk brand green (#00BF76) as the primary accent, applied sparingly to CTAs, active states, and highlights. The dark neutral background (#0A0A0B) creates cinema-quality depth, while surface variants provide subtle layering without competing with content.

### Motion Grammar
- Orchestrated entrance animations with staggered delays
- Scroll-driven interactions for the signature route line
- Subtle hover states with spring-based easing
- All motion respects `prefers-reduced-motion`

### Signature Element
**Route Line Scroll Indicator**: An animated SVG path on the left edge that draws itself as users scroll, visually representing a cycling route and providing scroll progress feedback. This element is functional (scroll indicator) while reinforcing the cycling/routes theme.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables (design tokens)
- **Backend**: Supabase (waitlist storage)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note**: The app works without Supabase credentials — waitlist submissions will be logged to the console instead.

## Supabase Setup

### 1. Create the waitlist table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('sl', 'en')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist (created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts only
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Deny all selects for anonymous users
-- (You can still read from the Supabase dashboard or with service role key)
CREATE POLICY "Deny anonymous selects" ON waitlist
  FOR SELECT
  TO anon
  USING (false);
```

### 2. Get your API keys

1. Go to your Supabase project dashboard
2. Navigate to **Settings > API**
3. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Asset Placeholders

### Logo
Replace `/public/logo.svg` with your actual NaBajk logo.

### Hero Video
Place your hero video at `/public/hero.mp4`
- Recommended: 1080p or 720p MP4
- Aspect ratio: 16:9 preferred, but any ratio works (video will be cropped to cover)
- The video will play muted, looped, with `object-fit: cover`

Optionally add a poster image at `/public/hero-poster.jpg` for initial load.

### App Screenshots
Place your app screenshots in `/public/screenshots/`:
- `login.png` — Login/welcome screen
- `home.png` — Home screen with routes
- `route.png` — Route detail screen

Recommended size: 1170×2532px (iPhone 13 Pro resolution) or similar mobile aspect ratio.

### Open Graph Image
Replace `/public/og-image.png` with your social sharing image (1200×630px recommended).

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Design tokens + global styles
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Landing page composition
├── components/
│   ├── Hero.tsx         # Hero section with video + waitlist
│   ├── WaitlistForm.tsx # Email collection form
│   ├── LanguageToggle.tsx # SLO/ENG language switcher
│   ├── FeatureNarrative.tsx # Features section
│   ├── ScreenshotRail.tsx # App screenshots showcase
│   ├── Footer.tsx       # Footer with links
│   └── RouteLineIndicator.tsx # Signature scroll element
├── hooks/
│   └── useScrollProgress.ts
└── lib/
    ├── i18n.ts          # Translations (SL/EN)
    ├── LanguageContext.tsx # Language state management
    └── supabaseClient.ts # Supabase client + waitlist API
```

## Design System Tokens

All design decisions are driven by CSS custom properties defined in `globals.css`:

### Colors
- `--color-brand-green`: #00BF76 (primary CTA, active states)
- `--color-brand-green-dark`: #00995E (hover/pressed states)
- `--color-bg`: #0A0A0B (app background)
- `--color-surface`: #121214 (cards, containers)
- `--color-text`: #FAFAFA (primary text)
- `--color-muted`: #8A8A8F (secondary text)

### Typography
- `--font-display`: Space Grotesk
- `--font-body`: DM Sans
- Type scale from `--text-xs` to `--text-7xl`

### Spacing
- Scale from `--space-1` (0.25rem) to `--space-32` (8rem)

### Motion
- `--duration-fast`: 150ms
- `--duration-base`: 250ms
- `--ease-out`, `--ease-spring` for natural movement

## Accessibility

- WCAG AA color contrast compliance
- Keyboard navigation for all interactive elements
- Focus-visible styling integrated into the design
- `prefers-reduced-motion` respected throughout
- Semantic HTML structure
- ARIA attributes where necessary

## Bilingual Support

The page supports Slovenian (default) and English:
- Language preference persists in localStorage
- Toggle in the header switches all visible copy
- Locale is stored with waitlist submissions

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

The site is optimized for deployment on Vercel, Netlify, or any Node.js hosting platform.

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari iOS 14+
- Chrome for Android

---

Built with care for Slovenian road cyclists.
