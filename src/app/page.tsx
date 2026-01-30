import { Hero } from '@/components/Hero'
import { FeatureNarrative } from '@/components/FeatureNarrative'
import { AppPreview } from '@/components/AppPreview'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { RouteLineIndicator } from '@/components/RouteLineIndicator'

export default function Home() {
  return (
    <>
      {/* Signature element: Scroll progress route line */}
      <RouteLineIndicator />

      <main>
        {/* Hero with video background and waitlist form */}
        <Hero />

        {/* Feature narrative section */}
        <FeatureNarrative />

        {/* App preview section */}
        <AppPreview />

        {/* Contact section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
