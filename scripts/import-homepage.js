require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

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

async function importHomepage() {
  try {
    // Read the homepage content
    const content = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'content', 'homepage.json'), 'utf8')
    )

    // Validate content before import
    const requiredSections = [
      'hero',
      'industryFocus',
      'features',
      'howItWorks',
      'testimonials',
      'mapSection',
      'faq',
      'newsSection',
      'cta',
      'sectionSettings'
    ]

    const missingKeys = requiredSections.filter(key => !content[key])
    if (missingKeys.length > 0) {
      console.warn('Warning: Missing sections:', missingKeys)
    }

    // Create the homepage document
    const result = await client.createOrReplace({
      _type: 'homepage',
      _id: 'homepage',
      hero: content.hero || null,
      industryFocus: content.industryFocus || null,
      features: content.features || null,
      howItWorks: content.howItWorks || null,
      testimonials: content.testimonials || null,
      mapSection: content.mapSection || null,
      faq: content.faq || null,
      newsSection: content.newsSection || null,
      cta: content.cta || null,
      sectionSettings: content.sectionSettings || {
        visibleSections: [],
        sectionOrder: []
      }
    })

    console.log('Homepage content imported successfully:', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error importing homepage content:', error)
    process.exit(1)
  }
}

importHomepage()
