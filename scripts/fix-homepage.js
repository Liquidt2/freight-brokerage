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

async function fixHomepage() {
  try {
    // First, check if the homepage document exists
    const homepageDoc = await client.fetch('*[_type == "homepage"][0]')
    console.log('\nHomepage document exists:', !!homepageDoc)
    
    if (!homepageDoc) {
      // Create a new homepage document with required sections
      const newHomepage = {
        _type: 'homepage',
        _id: 'homepage',
        hero: {
          title: 'Specialized Freight Brokerage Solutions',
          subtitle: 'Expert logistics services in flatbed, plastics, and pharmaceutical transportation.',
          primaryButton: {
            text: 'Get a Quote',
            link: '/quote'
          },
          secondaryButton: {
            text: 'Learn More',
            link: '/services'
          }
        },
        features: {
          title: 'Why Choose Us',
          subtitle: 'We combine industry expertise with cutting-edge technology.',
          featuresList: [
            {
              title: 'Specialized Expertise',
              description: 'Deep knowledge in flatbed, plastics, and pharmaceutical transportation.',
              icon: 'truck'
            }
          ]
        },
        cta: {
          title: 'Ready to Streamline Your Freight Operations?',
          subtitle: 'Contact us today to discuss your specialized transportation needs.',
          buttonText: 'Contact Us',
          buttonLink: '/contact'
        },
        sectionSettings: {
          visibleSections: ['hero', 'features', 'industryFocus', 'howItWorks', 'testimonials', 'mapSection', 'faq', 'newsSection', 'cta'],
          sectionOrder: ['hero', 'features', 'industryFocus', 'howItWorks', 'testimonials', 'mapSection', 'faq', 'newsSection', 'cta']
        }
      }

      const result = await client.createOrReplace(newHomepage)
      console.log('Created new homepage document:', result)
    } else {
      // Ensure required sections exist
      const updates = {}
      
      // Only set sectionSettings if they don't exist
      // Always update sectionSettings to include all possible sections
      updates.sectionSettings = {
        visibleSections: ['hero', 'features', 'industryFocus', 'howItWorks', 'testimonials', 'mapSection', 'faq', 'newsSection', 'cta'],
        sectionOrder: ['hero', 'features', 'industryFocus', 'howItWorks', 'testimonials', 'mapSection', 'faq', 'newsSection', 'cta']
      }

      if (Object.keys(updates).length > 0) {
        // Update the document with a new revision
        const result = await client.createOrReplace({
          ...homepageDoc,
          ...updates
        })
        console.log('Updated homepage document:', result)
      } else {
        console.log('Homepage document is valid, no updates needed')
      }
    }
  } catch (error) {
    console.error('Error fixing homepage:', error)
  }
}

fixHomepage()
