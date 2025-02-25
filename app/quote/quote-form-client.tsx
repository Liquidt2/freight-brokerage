"use client"

import { motion } from "framer-motion"
import { DynamicForm } from '@/components/dynamic-form'
import { FormContent } from '@/app/forms/types'

interface QuoteFormClientProps {
  form: FormContent
  onSubmit: (data: any) => Promise<void>
}

export default function QuoteFormClient({ form, onSubmit }: QuoteFormClientProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
        {form.description && (
          <p className="text-muted-foreground">{form.description}</p>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card p-6 rounded-lg card-border"
      >
        <DynamicForm form={form} onSubmit={onSubmit} />
      </motion.div>
    </div>
  )
}
