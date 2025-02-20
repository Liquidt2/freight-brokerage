"use client"

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { FormContent } from '@/app/forms/types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'

interface DynamicFormProps {
  form: FormContent
  onSubmit: (data: any) => Promise<void>
}

export function DynamicForm({ form, onSubmit }: DynamicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Helper function to get the correct field name for compliance fields
  const getComplianceFieldName = (type: string) => {
    switch (type) {
      case 'consent':
        return 'termsAccepted'
      case 'sms':
        return 'smsOptIn'
      default:
        return type
    }
  }

  // Dynamically build form schema
  const schemaFields = form.fields.reduce<Record<string, z.ZodTypeAny>>((acc, field) => {
    if (field.type === 'radio' && field.options?.some(opt => 
      typeof opt === 'object' ? opt.value === 'Yes' || opt.value === 'No' : opt === 'Yes' || opt === 'No'
    )) {
      // Handle Yes/No radio fields as booleans
      acc[field.name] = field.required
        ? z.boolean({ required_error: `${field.label} is required` })
        : z.boolean().optional()
    } else {
      let validator: z.ZodString = z.string()

      if (field.type === 'email') {
        validator = validator.email({ message: 'Invalid email address' })
      }

      if (field.validation?.pattern) {
        validator = validator.regex(new RegExp(field.validation.pattern), {
          message: field.validation.message,
        })
      }

      if (field.required) {
        validator = validator.min(1, { message: `${field.label} is required` })
        acc[field.name] = validator
      } else {
        acc[field.name] = validator.optional()
      }
    }

    return acc
  }, {})

  // Add compliance fields to schema if they exist
  form.complianceFields?.forEach((field) => {
    const fieldName = getComplianceFieldName(field.type)
    const touchedField = `${fieldName}Touched`
    
    // Add touched field to schema
    schemaFields[touchedField] = z.boolean()
    
    if (field.required) {
      // Use boolean().refine instead of literal(true) for more flexible validation
      schemaFields[fieldName] = z.boolean()
        .refine((val) => val === true, {
          message: field.text
        })
    } else {
      schemaFields[fieldName] = z.boolean().optional()
    }
  })

  const formSchema = z.object(schemaFields)

  // Create default values
  const defaultValues = {
    ...form.fields.reduce<Record<string, string>>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {}
    ),
    ...(form.complianceFields?.reduce<Record<string, boolean>>(
      (acc, field) => {
        const fieldName = getComplianceFieldName(field.type)
        // Initialize checkboxes as unchecked but track if they've been interacted with
        return { ...acc, [fieldName]: false, [`${fieldName}Touched`]: false }
      },
      {}
    ) ?? {}),
  }

  const formInstance = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await onSubmit(values)
      setSubmitSuccess(true)
      formInstance.reset()
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="text-center p-6 bg-background rounded-lg shadow">
        <h3 className="text-2xl font-bold mb-2">{form.successMessage.title}</h3>
        <p className="text-muted-foreground">{form.successMessage.message}</p>
      </div>
    )
  }

  return (
    <Form {...formInstance}>
      <form
        onSubmit={formInstance.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        {form.fields.map((field) => (
          <FormField
            key={field.name}
            control={formInstance.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === 'radio' && field.options?.some(opt => 
                    typeof opt === 'object' ? opt.value === 'Yes' || opt.value === 'No' : opt === 'Yes' || opt === 'No'
                  ) ? (
                    <RadioGroup
                      onValueChange={(value) => formField.onChange(value === 'Yes')}
                      defaultValue={formField.value ? 'Yes' : 'No'}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id={`${field.name}-yes`} />
                        <FormLabel htmlFor={`${field.name}-yes`}>Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id={`${field.name}-no`} />
                        <FormLabel htmlFor={`${field.name}-no`}>No</FormLabel>
                      </div>
                    </RadioGroup>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      placeholder={field.placeholder}
                      {...formField}
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(field.options) ? (
                          field.options.map((option) => (
                            <SelectItem 
                              key={typeof option === 'string' ? option : option.value}
                              value={typeof option === 'string' ? option : option.value}
                            >
                              {typeof option === 'string' ? option : option.value}
                            </SelectItem>
                          ))
                        ) : null}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'date' ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !formField.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formField.value ? (
                            format(new Date(formField.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            formField.value
                              ? new Date(formField.value)
                              : undefined
                          }
                          onSelect={(date) =>
                            formField.onChange(date?.toISOString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...formField}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Compliance Fields */}
        {form.complianceFields?.map((field) => (
          <FormField
            key={field.type}
            control={formInstance.control}
            name={getComplianceFieldName(field.type)}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={(checked) => {
                      formField.onChange(checked)
                      // Mark the field as touched when changed
                      const touchedField = `${getComplianceFieldName(field.type)}Touched`
                      formInstance.setValue(touchedField, true)
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.text}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        ))}

        {submitError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            <h4 className="font-semibold mb-1">{form.errorMessage.title}</h4>
            <p>{submitError}</p>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? form.submitButton.loadingText : form.submitButton.text}
        </Button>
      </form>
    </Form>
  )
}
