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

async function importForms() {
  try {
    // Read the forms content
    const content = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'content', 'forms.json'), 'utf8')
    )

    // Import each form
    for (const form of content.forms) {
      // Transform options array into proper format
      const formattedFields = form.fields.map(field => ({
        ...field,
        options: field.options ? field.options.map(option => ({
          _type: 'option',
          value: typeof option === 'string' ? option : option.value
        })) : undefined
      }))

      const result = await client.createOrReplace({
        _type: 'form',
        _id: `form-${form.slug}`,
        ...form,
        fields: formattedFields,
        slug: {
          _type: 'slug',
          current: form.slug
        }
      })
      console.log(`Form "${form.name}" imported successfully:`, result)
    }

    console.log('All forms imported successfully')
  } catch (error) {
    console.error('Error importing forms:', error)
    process.exit(1)
  }
}

importForms()
