import { headers } from 'next/headers'
import { 
  homepageQuery 
} from '@/lib/sanity/queries'
import { getClient } from '@/lib/sanity/client'
import { 
  HeroSection, 
  IndustryFocusSection,
  FeaturesSection, 
  HowItWorksSection,
  TestimonialsSection,
  MapSection,
  FAQSection,
  NewsSection,
  CTASection 
} from "@/components/home-sections"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
  console.log('Fetching homepage data...');
  
  try {
    const homepageData = await getClient().fetch(homepageQuery, {});
    
    console.log('Homepage data fetched:', {
      hasData: !!homepageData,
      sections: Object.keys(homepageData || {}),
      sectionSettings: homepageData?.sectionSettings
    });

    if (!homepageData) {
      console.error('No homepage data returned from Sanity');
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12 bg-background rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">Error Loading Content</h2>
            <p className="text-muted-foreground">Unable to load homepage content from Sanity.</p>
          </div>
        </div>
      );
    }

    const {
    hero, 
    industryFocus,
    features, 
    howItWorks,
    testimonials,
    mapSection,
    faq,
    newsSection,
    cta, 
    sectionSettings 
  } = homepageData

  console.log('Destructured data:', {
    hero: !!hero,
    features: !!features,
    cta: !!cta,
    sectionSettings: !!sectionSettings
  })

const visibleSections = sectionSettings?.visibleSections ?? []
const sectionOrder = sectionSettings?.sectionOrder ?? []

  console.log('Section settings:', {
    visibleSections,
    sectionOrder
  })

  // Create a map of section names to their components
  const sectionComponents: { [key: string]: React.ReactNode } = {
    hero: hero ? <HeroSection data={hero} /> : null,
    industryFocus: industryFocus ? <IndustryFocusSection data={industryFocus} /> : null,
    features: features ? <FeaturesSection data={features} /> : null,
    howItWorks: howItWorks ? <HowItWorksSection data={howItWorks} /> : null,
    testimonials: testimonials ? <TestimonialsSection data={testimonials} /> : null,
    mapSection: mapSection ? <MapSection data={mapSection} /> : null,
    faq: faq ? <FAQSection data={faq} /> : null,
    newsSection: newsSection ? <NewsSection data={newsSection} /> : null,
    cta: cta ? <CTASection data={cta} /> : null
  }

  // Filter and order sections based on visibility and order settings
  console.log('Before filtering:', {
    sectionOrder,
    visibleSections,
    availableComponents: Object.keys(sectionComponents)
  })

const orderedSections = sectionOrder
    .filter((section: string) => {
      const isVisible = visibleSections.includes(section)
      console.log(`Section ${section} visible:`, isVisible)
      return isVisible
    })
    .map((section: string) => {
      const component = sectionComponents[section]
      console.log(`Section ${section} component:`, !!component)
      return component
    })
    .filter(Boolean)

  console.log('Final ordered sections count:', orderedSections.length)

    return (
      <div className="w-full min-h-screen bg-background">
      {orderedSections.length > 0 ? (
        <div className="flex flex-col w-full">
          {orderedSections.map((section: React.ReactNode, index: number) => (
            <div key={index} className="page-section">
              {section}
            </div>
          ))}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12 bg-background rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">No Sections Visible</h2>
            <p className="text-muted-foreground">Please check section visibility settings in Sanity Studio.</p>
          </div>
        </div>
      )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Error Loading Content</h2>
          <p className="text-muted-foreground">An error occurred while loading the homepage content.</p>
        </div>
      </div>
    );
  }
}
