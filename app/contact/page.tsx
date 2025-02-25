import { draftMode } from 'next/headers'

export const revalidate = 60 // Revalidate every minute
import { getClient } from '@/lib/sanity/client'
import { formQuery } from '@/lib/sanity/queries'
import { FormContent, FormField, FormFieldGroup } from '@/app/forms/types'
import { submitForm } from '@/app/actions/submit-form'
import ContactFormClient from './contact-form-client'

// Helper function to transform a field
function transformField(field: FormField) {
  return {
    ...field,
    // Ensure radio buttons and conditional fields have proper options
    options: field.type && field.type.startsWith("is")
      ? [{ value: "Yes" }, { value: "No" }]
      : field.options,
    // Set hidden state based on showWhen
    hidden: field.showWhen ? true : field.hidden,
    // Add validation for specific field types
    validation: {
      ...field.validation,
      pattern:
        field.type === "tel"
          ? "^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
          : field.validation?.pattern,
      message:
        field.type === "tel"
          ? "Please enter a valid phone number"
          : field.validation?.message,
    },
  };
}

async function getForm(preview: boolean): Promise<FormContent | null> {
  try {
    const client = getClient(preview)
    const form = await client.fetch(formQuery, { slug: 'contact-us' })

    if (!form) {
      console.error('Contact form not found')
      return null
    }

    // Transform fields to ensure they're in the grouped format
    let transformedFields;
    
    // Check if the form data is already in the grouped format
    if (form.fields.length > 0 && form.fields[0].group) {
      // Form is already in grouped format, just transform fields within groups
      transformedFields = form.fields.map((group: FormFieldGroup) => ({
        ...group,
        fields: group.fields.map((field: FormField) => transformField(field))
      }));
    } else {
      // Form is in the old flat format, convert to grouped format
      // Group fields by their type or create a single group
      transformedFields = [{
        group: "Contact Information",
        fields: form.fields.map((field: any) => transformField(field))
      }];
    }

    return {
      ...form,
      fields: transformedFields
    }
  } catch (error) {
    console.error('Error fetching contact form:', error)
    return null
  }
}

export default async function ContactPage() {
  const preview = draftMode().isEnabled
  const form = await getForm(preview)

  if (!form) {
    return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">Please add contact form content in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  async function handleSubmit(data: any) {
    'use server'
    await submitForm({ formId: 'contact-us', data })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ContactFormClient form={form} onSubmit={handleSubmit} />
    </div>
  )
}
