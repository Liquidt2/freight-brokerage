import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { formQuery } from '@/lib/sanity/queries'
import { FormContent } from '@/app/forms/types'
import { submitForm } from '@/app/actions/submit-form'
import QuoteFormClient from './quote-form-client'

export const revalidate = 60 // Revalidate every minute

async function getForm(preview: boolean): Promise<FormContent | null> {
  try {
    console.log('Fetching quote request form...')
    const client = getClient(preview)
    console.log('Form query:', formQuery)
    const form = await client.fetch(formQuery, { slug: 'request-quote' })
    console.log('Form data received:', form ? 'Data received' : 'No data')

    if (!form) {
      console.error('Quote request form not found')
      return null
    }

    return form
  } catch (error) {
    console.error('Error fetching quote request form:', error)
    return null
  }
}

export default async function QuotePage() {
  console.log('Rendering quote page...')
  const { isEnabled: preview } = await draftMode()
  const form = await getForm(preview)

  if (!form) {
    return (
      <div className="py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">Please add quote request form content in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  async function handleSubmit(data: any) {
    'use server'
    await submitForm({ formId: 'request-quote', data })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <QuoteFormClient form={form} onSubmit={handleSubmit} />
    </div>
  )
}
