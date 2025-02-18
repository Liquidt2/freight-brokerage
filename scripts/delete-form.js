const { createClient } = require('@sanity/client')
require('dotenv').config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
})

async function deleteRequestQuoteForm() {
  try {
    // Find and delete the Request Quote form
    const query = '*[_type == "form" && slug.current == "request-quote"][0]'
    const form = await client.fetch(query)
    
    if (form) {
      await client.delete(form._id)
      console.log('Request Quote form deleted successfully')
    } else {
      console.log('Request Quote form not found')
    }
  } catch (error) {
    console.error('Error deleting form:', error)
  }
}

deleteRequestQuoteForm()
