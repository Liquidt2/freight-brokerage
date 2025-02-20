import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
})

async function updateQuoteForm() {
  try {
    // Read the forms.json file
    const formsJson = JSON.parse(
      readFileSync(path.join(__dirname, '..', 'content', 'forms.json'), 'utf8')
    )

    // Get the quote form
    const quoteForm = formsJson.forms.find(form => form.slug === 'request-quote')

    if (!quoteForm) {
      throw new Error('Quote form not found in forms.json')
    }

    // Convert the form fields to Sanity format
    const formFields = quoteForm.fields.map(field => ({
      _type: 'formField',
      label: field.label,
      name: field.name,
      type: field.type,
      placeholder: field.placeholder,
      required: field.required,
      hidden: field.hidden,
      showWhen: field.showWhen,
      options: field.options ? field.options.map(opt => 
        typeof opt === 'string' ? { value: opt } : opt
      ) : undefined,
      validation: field.validation
    }))

    // Convert compliance fields to Sanity format
    const complianceFields = quoteForm.complianceFields.map(field => ({
      _type: 'complianceField',
      text: field.text,
      type: field.type,
      required: field.required
    }))

    // Convert email template to Sanity format
    const emailTemplate = {
      subject: quoteForm.notifications.emailTemplate.subject,
      sections: quoteForm.notifications.emailTemplate.sections.map(section => ({
        _type: 'emailSection',
        title: section.title,
        fields: section.fields.map(field => ({
          _type: 'emailField',
          label: field.label,
          value: field.value
        }))
      }))
    }

    // Update the form in Sanity
    const result = await client.createOrReplace({
      _type: 'form',
      _id: 'request-quote',
      status: 'published',
      name: quoteForm.name,
      slug: { current: quoteForm.slug },
      title: quoteForm.title,
      description: quoteForm.description,
      fields: formFields,
      complianceFields: complianceFields,
      submitButton: quoteForm.submitButton,
      successMessage: quoteForm.successMessage,
      errorMessage: quoteForm.errorMessage,
      notifications: {
        adminEmail: quoteForm.notifications.adminEmail,
        emailTemplate: emailTemplate
      }
    })

    console.log('Successfully updated quote form in Sanity:', result)
  } catch (error) {
    console.error('Error updating quote form:', error)
    process.exit(1)
  }
}

updateQuoteForm()
