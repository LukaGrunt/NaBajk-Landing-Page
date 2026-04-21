import { Hero } from '@/components/Hero'
import { StatsStrip } from '@/components/StatsStrip'
import { AppShowcase } from '@/components/AppShowcase'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { Partners } from '@/components/Partners'
import { ElevationAnimation } from '@/components/ElevationAnimation'
import { SubmitRoute } from '@/components/SubmitRoute'
import { DownloadCTA } from '@/components/DownloadCTA'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <StatsStrip />
        <AppShowcase />
        <FeaturesGrid />
        <Partners />
        <ElevationAnimation />
        <SubmitRoute />
        <DownloadCTA />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
