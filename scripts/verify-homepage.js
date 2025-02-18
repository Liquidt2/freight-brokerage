require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset || !token) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-17',
  token,
  useCdn: false,
  withCredentials: true,
  resultSourceMap: false,
  apiHost: 'https://api.sanity.io',
  ignoreBrowserTokenWarning: true
})

async function verifyHomepage() {
  try {
    // First, check if the homepage document exists
    const homepageDoc = await client.fetch('*[_type == "homepage"][0]')
    console.log('\nHomepage document exists:', !!homepageDoc)
    
    if (homepageDoc) {
      // Check section settings
      console.log('\nSection Settings:')
      console.log('sectionSettings exists:', !!homepageDoc.sectionSettings)
      if (homepageDoc.sectionSettings) {
        console.log('visibleSections:', homepageDoc.sectionSettings.visibleSections)
        console.log('sectionOrder:', homepageDoc.sectionSettings.sectionOrder)
      }

      // Check each section's content
      const sections = [
        'hero',
        'features',
        'industryFocus',
        'howItWorks',
        'testimonials',
        'mapSection',
        'faq',
        'newsSection',
        'cta'
      ]
      console.log('\nSection Content:')
      sections.forEach(section => {
        console.log(`${section}:`, {
          exists: !!homepageDoc[section],
          content: homepageDoc[section]
        })
      })

      // Verify section data matches schema
      console.log('\nSchema Validation:')
      // Verify section data matches schema
      console.log('\nSchema Validation:')
      
      const sectionValidators = {
        hero: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasPrimaryButton: !!data.primaryButton,
          hasSecondaryButton: !!data.secondaryButton
        }),
        features: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasFeaturesList: Array.isArray(data.featuresList),
          featuresCount: data.featuresList?.length
        }),
        industryFocus: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasIndustries: Array.isArray(data.industries),
          industriesCount: data.industries?.length
        }),
        howItWorks: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasSteps: Array.isArray(data.steps),
          stepsCount: data.steps?.length
        }),
        testimonials: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasTestimonialsList: Array.isArray(data.testimonialsList),
          testimonialsCount: data.testimonialsList?.length
        }),
        mapSection: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasCoverageAreas: Array.isArray(data.coverageAreas),
          coverageAreasCount: data.coverageAreas?.length
        }),
        faq: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasQuestions: Array.isArray(data.questions),
          questionsCount: data.questions?.length
        }),
        newsSection: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasNewsItems: Array.isArray(data.newsItems),
          newsItemsCount: data.newsItems?.length
        }),
        cta: (data) => ({
          hasTitle: !!data.title,
          hasSubtitle: !!data.subtitle,
          hasButtonText: !!data.buttonText,
          hasButtonLink: !!data.buttonLink
        })
      }

      sections.forEach(section => {
        if (homepageDoc[section]) {
          console.log(`${section} section has required fields:`, sectionValidators[section](homepageDoc[section]))
        }
      })
    }
  } catch (error) {
    console.error('Error verifying homepage:', error)
  }
}

verifyHomepage()
