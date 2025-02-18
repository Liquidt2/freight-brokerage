require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const token = process.env.SANITY_API_TOKEN
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

console.log('Testing Sanity token...')
console.log('Project ID:', projectId)
console.log('Dataset:', dataset)
console.log('Token prefix:', token?.substring(0, 5) + '...')

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

async function testToken() {
  try {
    console.log('Making request to Sanity...')
    console.log('Request URL:', `https://api.sanity.io/v2024-03-17/data/query/${dataset}`)
    const result = await client.fetch('*[_type == "post"][0...1]')
    console.log('Success! Found', result.length, 'posts')
    console.log('First post:', result[0]?.title)
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response?.body,
      statusCode: error.statusCode,
      url: error.response?.url,
      headers: error.response?.headers
    })
  }
}

testToken()
