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

async function exportHomepage() {
  try {
    // Fetch the homepage document from Sanity
    const homepageDoc = await client.fetch('*[_type == "homepage"][0]')
    
    if (!homepageDoc) {
      console.error('No homepage document found in Sanity')
      process.exit(1)
    }

    // Remove Sanity-specific fields
    const { _rev, _type, _id, _createdAt, _updatedAt, ...cleanedDoc } = homepageDoc

    // Write to the local JSON file
    fs.writeFileSync(
      path.join(process.cwd(), 'content', 'homepage.json'),
      JSON.stringify(cleanedDoc, null, 2)
    )

    console.log('Homepage content exported successfully to homepage.json')
  } catch (error) {
    console.error('Error exporting homepage content:', error)
    process.exit(1)
  }
}

exportHomepage()
