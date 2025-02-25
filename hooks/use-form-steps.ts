import { useState, useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { FormSchema } from "@/app/forms/validation"

export interface FormStep {
  title: string
  description: string
  fields: Array<keyof FormSchema>
}

interface UseFormStepsProps {
  steps: FormStep[]
  form: UseFormReturn<FormSchema>
}

export function useFormSteps({ steps, form }: UseFormStepsProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isLastStep = currentStep === steps.length - 1
  const currentFields = steps[currentStep].fields

  const nextStep = useCallback(async () => {
    const fields = steps[currentStep].fields
    const currentValues = form.getValues()
    
    // Create an object with just the current step's values
    const stepValues = Object.fromEntries(
      fields.map(field => [field, currentValues[field]])
    )

    // Validate only the fields for the current step
    const stepValid = await form.trigger(fields as any[])
    
    if (stepValid) {
      setCurrentStep(step => step + 1)
      return true
    }
    return false
  }, [currentStep, steps, form])

  const previousStep = useCallback(() => {
    setCurrentStep(step => Math.max(0, step - 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.min(Math.max(0, step), steps.length - 1))
  }, [steps.length])

  const resetForm = useCallback(() => {
    form.reset()
    setCurrentStep(0)
    setSubmitError(null)
    setIsSubmitting(false)
  }, [form])

  return {
    currentStep,
    currentFields,
    isLastStep,
    isSubmitting,
    submitError,
    setIsSubmitting,
    setSubmitError,
    nextStep,
    previousStep,
    goToStep,
    resetForm
  }
}

// Define form steps
export const formSteps: FormStep[] = [
  {
    title: "Company & Contact Information",
    description: "Tell us about your business",
    fields: [
      "companyName",
      "contactName",
      "email",
      "phone",
      "companyAddress",
      "companyCity",
      "companyState",
      "companyZip"
    ],
  },
  {
    title: "Origin Location",
    description: "Provide pickup location details",
    fields: [
      "originCity",
      "originState",
      "zipCode",
      "originPickupDate"
    ],
  },
  {
    title: "Destination Location",
    description: "Provide delivery location details",
    fields: [
      "destinationCity",
      "destinationState",
      "destinationZip",
      "deliveryDate"
    ],
  },
  {
    title: "Load Information",
    description: "Tell us about your freight",
    fields: [
      "truckTrailerType",
      "commodityType",
      "weight",
      "dimensions",
      "loadType",
      "isPalletized",
      "palletCount",
      "isHazmat",
      "unNumber",
      "hazmatClass",
      "isTemperatureControlled",
      "temperature",
      "loadingMethod",
      "specialHandling",
      "isStackable",
      "isHighValue",
      "insuranceInfo",
      "isHeavyLoad",
      "heavyLoadWeight",
      "isOversizedLoad"
    ],
  },
  {
    title: "Compliance",
    description: "Please review and accept the terms",
    fields: [
      "smsOptIn",
      "termsAccepted"
    ],
  },
]
