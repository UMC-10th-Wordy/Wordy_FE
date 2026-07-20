import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingFeatureSection } from '@/components/landing/LandingFeatureSection'

export function LandingPreview() {
  return (
    <div className="min-h-screen bg-(--color-bg-default)">
      <LandingHeader />
      <main className="flex flex-col items-center gap-20 px-10 py-20">
        <LandingFeatureSection />
      </main>
    </div>
  )
}
