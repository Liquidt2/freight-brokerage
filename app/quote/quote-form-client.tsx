"use client"

import QuoteForm from '@/components/quote-form'
import { FormSchema } from '@/app/forms/types'

interface QuoteFormClientProps {
  onSubmit: (data: FormSchema) => Promise<void>
}

export default function QuoteFormClient({ onSubmit }: QuoteFormClientProps) {
  return (
    <div className="container py-2">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold mb-2">Request a Quote</h1>
        <p className="text-muted-foreground">
          Fill out the form below to get a quote for your freight shipping needs.
        </p>
      </div>

      <QuoteForm onSubmit={onSubmit} />
    </div>
  )
}
