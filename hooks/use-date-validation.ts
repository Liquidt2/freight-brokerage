import { useEffect, useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { FormSchema } from "@/app/forms/validation"

export function useDateValidation(form: UseFormReturn<FormSchema>) {
  const validateDates = useCallback(() => {
    const { originPickupDate, deliveryDate } = form.getValues()

    if (originPickupDate && deliveryDate) {
      const pickup = new Date(originPickupDate)
      const delivery = new Date(deliveryDate)
      
      if (pickup > delivery) {
        form.setError("deliveryDate", {
          type: "manual",
          message: "Delivery date must be after pickup date",
        })
      } else {
        form.clearErrors("deliveryDate")
      }
    }
  }, [form])

  // Watch date fields for changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "originPickupDate" || name === "deliveryDate") {
        validateDates()
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form, validateDates])

  return { validateDates }
}
