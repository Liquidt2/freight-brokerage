import { HeroSection, FeaturesSection, CTASection } from "@/components/home-sections"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}