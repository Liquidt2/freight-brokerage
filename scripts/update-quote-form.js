import { createClient } from '@sanity/client'

const projectId = 'wfl1kdmd'
const dataset = 'production'
const apiVersion = '2023-05-03'
const token = process.env.SANITY_STUDIO_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'published',
  resultSourceMap: false,
  withCredentials: true,
  ignoreBrowserTokenWarning: true
})

const updateQuoteForm = async () => {
  try {
    // Get the current form
    const form = await client.fetch('*[_type == "form" && slug.current == "request-quote"][0]')
    
    if (!form) {
      console.error('Quote request form not found')
      return
    }

    // Find the hazardous material field
    const updatedFields = form.fields.map(field => {
      if (field.name === 'hazardousMaterial') {
        return {
          ...field,
          type: 'radio',
          options: [
            { _type: 'option', value: 'Yes' },
            { _type: 'option', value: 'No' }
          ]
        }
      }
      return field
    })

    // Update the form
    const result = await client.patch(form._id)
      .set({ fields: updatedFields })
      .commit()

    console.log('Successfully updated quote form:', result)
  } catch (error) {
    console.error('Error updating quote form:', error)
  }
}

updateQuoteForm()
