import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { formQuery } from '@/lib/sanity/queries'
import { FormContent } from '@/app/forms/types'
import { submitForm } from '@/app/actions/submit-form'
import ContactFormClient from './contact-form-client'

async function getForm(preview: boolean): Promise<FormContent | null> {
  try {
    const client = getClient(preview)
    const form = await client.fetch(formQuery, { slug: 'contact-us' })

    if (!form) {
      console.error('Contact form not found')
      return null
    }

    return form
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
      <div className="container mx-auto px-4 py-12">
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
    <div className="container mx-auto px-4 py-12">
      <ContactFormClient form={form} onSubmit={handleSubmit} />
    </div>
  )
}
