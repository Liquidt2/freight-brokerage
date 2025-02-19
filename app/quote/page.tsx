import { draftMode } from 'next/headers'
import { submitForm } from '@/app/actions/submit-form'
import QuoteFormClient from './quote-form-client'
import { FormSchema } from '@/app/forms/types'

export const revalidate = 60 // Revalidate every minute

export default async function QuotePage() {
  const { isEnabled: preview } = await draftMode()

  async function handleSubmit(data: FormSchema) {
    'use server'
    await submitForm({ formId: 'request-quote', data })
  }

  return (
    <div className="container mx-auto px-4">
      <QuoteFormClient onSubmit={handleSubmit} />
    </div>
  )
}
