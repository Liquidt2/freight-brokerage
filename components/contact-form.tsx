"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { getClient } from "@/lib/sanity/client"
import { formQuery } from "@/lib/sanity/queries"
import { submitForm, FormSubmission } from "@/app/actions/submit-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface ComplianceField {
  text: string
  type: 'consent' | 'opt-in' | 'opt-out'
  required: boolean
}

interface FormConfig {
  title: string
  description?: string
  fields: Array<{
    label: string
    type: string
    name: string
    required: boolean
    options?: Array<{ value: string }>
  }>
  complianceFields?: ComplianceField[]
  submitButton?: {
    text: string
    loadingText: string
  }
  successMessage?: {
    title: string
    message: string
  }
  errorMessage?: {
    title: string
    message: string
  }
}

const phoneRegex = /^(\+1|1)?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

interface FormValues {
  name: string
  email: string
  phone: string
  message: string
  smsOptIn?: boolean
  termsAccepted?: boolean
  'opt-out'?: boolean
  [key: string]: string | boolean | undefined
}

type SchemaShape = {
  [K in keyof FormValues]: z.ZodType<FormValues[K]>
}

const baseSchema: SchemaShape = {
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string()
    .regex(phoneRegex, {
      message: "Please enter a valid US phone number (e.g. (555) 123-4567)",
    })
    .transform(val => {
      // Normalize phone number format
      const digits = val.replace(/\D/g, '');
      const match = digits.match(/^1?(\d{3})(\d{3})(\d{4})$/);
      if (!match) return val;
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  smsOptIn: z.boolean().optional(),
  termsAccepted: z.boolean().optional(),
  'opt-out': z.boolean().optional(),
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [schema, setSchema] = useState(() => z.object(baseSchema).passthrough())

  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        const client = getClient()
        const config = await client.fetch(formQuery, { slug: 'contact-us' })
        setFormConfig(config)

        // Create a new schema with compliance fields
        const schemaConfig = { ...baseSchema }
        
        config.complianceFields?.forEach((field: ComplianceField) => {
          const fieldName = field.type === 'consent' ? 'termsAccepted' : field.type === 'opt-in' ? 'smsOptIn' : field.type
          schemaConfig[fieldName as keyof FormValues] = field.required 
            ? z.boolean().refine(val => val, {
                message: `Please accept ${field.text}`,
              })
            : z.boolean().default(false)
        })
        
        setSchema(z.object(schemaConfig).passthrough())
      } catch (error) {
        console.error('Error fetching form config:', error)
        toast.error('Error loading form configuration')
      }
    }

    fetchFormConfig()
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      smsOptIn: false,
      termsAccepted: false,
      'opt-out': false,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      await submitForm({ formId: 'contact-us', data: values })
      toast.success(formConfig?.successMessage?.message || "Message sent successfully!")
      form.reset()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      {formConfig ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your freight needs..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Compliance Fields */}
        {formConfig.complianceFields?.map((field: ComplianceField, index: number) => {
          const fieldName = field.type === 'consent' ? 'termsAccepted' : field.type === 'opt-in' ? 'smsOptIn' : field.type
          return (
            <FormField
              key={index}
              control={form.control}
              name={fieldName}
              render={({ field: formField }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={formField.value as boolean}
                      onCheckedChange={formField.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{field.text}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          )
        })}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : formConfig.submitButton?.text || "Send Message"}
        </Button>
      </form>
      ) : (
        <div>Loading form...</div>
      )}
    </Form>
  )
}
