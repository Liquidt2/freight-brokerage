import { useWatch, UseFormReturn } from "react-hook-form"
import { FormSchema } from "@/app/forms/validation"
import { useCallback, useMemo } from 'react'

// Constants
const YES = 'Yes' as const
const NO = 'No' as const
type YesNo = typeof YES | typeof NO

// Type guard for YesNo
const isYesNo = (value: unknown): value is YesNo => 
  value === YES || value === NO

export function useConditionalFields(
  form: UseFormReturn<FormSchema>,
  currentFields: Array<keyof FormSchema>
) {
  // Watch all conditional fields
  const isPalletized = useWatch({
    control: form.control,
    name: "isPalletized",
    defaultValue: NO
  });
  
  const isHazmat = useWatch({
    control: form.control,
    name: "isHazmat",
    defaultValue: NO
  });
  
  const isTemperatureControlled = useWatch({
    control: form.control,
    name: "isTemperatureControlled",
    defaultValue: NO
  });
  
  const isHighValue = useWatch({
    control: form.control,
    name: "isHighValue",
    defaultValue: NO
  });
  
  const isHeavyLoad = useWatch({
    control: form.control,
    name: "isHeavyLoad",
    defaultValue: NO
  });
  
  const isOversizedLoad = useWatch({
    control: form.control,
    name: "isOversizedLoad",
    defaultValue: NO
  });

  // Memoize conditional fields configuration
  const conditionalFields = useMemo(() => ({
    palletCount: { parent: "isPalletized", showWhen: YES },
    unNumber: { parent: "isHazmat", showWhen: YES },
    hazmatClass: { parent: "isHazmat", showWhen: YES },
    temperature: { parent: "isTemperatureControlled", showWhen: YES },
    insuranceInfo: { parent: "isHighValue", showWhen: YES },
    heavyLoadWeight: { parent: "isHeavyLoad", showWhen: YES },
    oversizedDimensions: { parent: "isOversizedLoad", showWhen: YES }
  }), []);

  // Memoize shouldShowField function
  const shouldShowField = useCallback((fieldName: keyof FormSchema): boolean => {
    try {
      // First check if the field is in the current step
      if (!currentFields.includes(fieldName)) return false;

      // Check if this is a conditional field
      const conditionalField = conditionalFields[fieldName as keyof typeof conditionalFields];
      if (conditionalField) {
        const { parent, showWhen } = conditionalField;
        const parentValue = form.getValues(parent as keyof FormSchema);
        
        // Validate parent value is a valid YesNo type
        if (!isYesNo(parentValue)) {
          console.warn(`Invalid parent value for field ${fieldName}: ${parentValue}`);
          return false;
        }
        
        return parentValue === showWhen;
      }

      // Show all non-conditional fields that are part of the current step
      return true;
    } catch (error) {
      console.error(`Error in shouldShowField for ${fieldName}:`, error);
      return false; // Safe default
    }
  }, [currentFields, form, conditionalFields]);

  return { 
    shouldShowField,
    // Expose watched values if needed elsewhere
    formValues: {
      isPalletized,
      isHazmat,
      isTemperatureControlled,
      isHighValue,
      isHeavyLoad,
      isOversizedLoad
    }
  };
}
