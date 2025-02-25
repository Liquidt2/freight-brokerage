import { z } from "zod"

export interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  hidden?: boolean;
  showWhen?: {
    field: string;
    equals: string;
  };
  options?: Array<{ value: string } | string>;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface FormFieldGroup {
  group: string;
  fields: FormField[];
}

export interface ComplianceField {
  type: string;
  text: string;
  required?: boolean;
}

export interface FormContent {
  name: string;
  title: string;
  description?: string;
  fields: FormFieldGroup[];
  complianceFields?: ComplianceField[];
  submitButton: {
    text: string;
    loadingText: string;
  };
  successMessage: {
    title: string;
    message: string;
  };
  errorMessage: {
    title: string;
    message: string;
  };
  notifications?: {
    adminEmail?: string;
    emailTemplate?: {
      subject: string;
      sections: Array<{
        title: string;
        fields: Array<{
          label: string;
          value: string;
        }>;
      }>;
      footer?: string;
    };
  };
}

// Helper function to create field validator
const createFieldValidator = (field: FormField): z.ZodTypeAny => {
  let validator: z.ZodTypeAny = z.string();

  switch (field.type) {
    case 'email':
      validator = z.string().email({ message: field.validation?.message || "Invalid email address" });
      break;
    case 'date':
      validator = z.string();
      break;
    case 'number':
      validator = z.string();
      break;
    case 'radio':
    case 'isHazmat':
    case 'isTemperatureControlled':
    case 'isPalletized':
    case 'isHeavyLoad':
    case 'isOversizedLoad':
    case 'isHighValue':
      validator = z.enum(['Yes', 'No']);
      break;
    default:
      validator = z.string();
  }

  if (field.validation?.pattern) {
    validator = (validator as z.ZodString).regex(new RegExp(field.validation.pattern), {
      message: field.validation.message,
    });
  }

  if (field.required) {
    if (validator instanceof z.ZodString) {
      validator = validator.min(1, { message: `${field.label} is required` });
    } else if (validator instanceof z.ZodEnum) {
      validator = validator;
    }
  } else {
    validator = validator.optional();
  }

  return validator;
};

// Create a dynamic schema based on form fields
export const createFormSchema = (form: FormContent) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Handle both grouped and ungrouped fields for backward compatibility
  form.fields.forEach((item: any) => {
    // If the item is a group
    if (item.group && Array.isArray(item.fields)) {
      item.fields.forEach((field: FormField) => {
        // Ensure field has a valid name before creating a validator
        if (field && field.name) {
          schemaFields[field.name] = createFieldValidator(field);
        }
      });
    }
    // If the item is a direct field (old format)
    else {
      const field = item as FormField;
      // Ensure field has a valid name before creating a validator
      if (field && field.name) {
        schemaFields[field.name] = createFieldValidator(field);
      }
    }
  });

  // Add compliance fields
  form.complianceFields?.forEach((field) => {
    if (!field || !field.type) return;
    
    const fieldName = field.type === 'consent' ? 'termsAccepted' : 
                     field.type === 'sms' ? 'smsOptIn' : field.type;
    
    // Ensure fieldName is valid
    if (fieldName) {
      schemaFields[fieldName] = field.required ? 
        z.literal(true, { errorMap: () => ({ message: field.text }) }) :
        z.boolean().optional();
      // Add touched state tracking
      schemaFields[`${fieldName}Touched`] = z.boolean();
    }
  });

  return z.object(schemaFields);
};

// Create step schemas based on form fields
export const createStepSchemas = (form: FormContent) => {
  const stepSchemas: Record<number, z.ZodTypeAny> = {};

  // Create a schema for each group
  form.fields.forEach((item: any, index) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    
    // If the item is a group
    if (item.group && Array.isArray(item.fields)) {
      item.fields.forEach((field: FormField) => {
        // Ensure field has a valid name before creating a validator
        if (field && field.name) {
          schemaFields[field.name] = createFieldValidator(field);
        }
      });
    }
    // If the item is a direct field (old format)
    else {
      const field = item as FormField;
      // Ensure field has a valid name before creating a validator
      if (field && field.name) {
        schemaFields[field.name] = createFieldValidator(field);
      }
    }

    stepSchemas[index] = z.object(schemaFields);
  });

  // Add compliance fields as the last step
  if (form.complianceFields?.length) {
    const complianceFields: Record<string, z.ZodTypeAny> = {};
    form.complianceFields.forEach((field) => {
      if (!field || !field.type) return;
      
      const fieldName = field.type === 'consent' ? 'termsAccepted' : 
                       field.type === 'sms' ? 'smsOptIn' : field.type;
      
      // Ensure fieldName is valid
      if (fieldName) {
        complianceFields[fieldName] = field.required ?
          z.literal(true, { errorMap: () => ({ message: field.text }) }) :
          z.boolean().optional();
      }
    });
    stepSchemas[form.fields.length] = z.object(complianceFields);
  }

  return stepSchemas;
};

// Export the step schemas type
export type StepSchemas = ReturnType<typeof createStepSchemas>;

// Export types for form values
export type FormSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;
export type FormFieldName = string;
export type FormFieldValues = Record<string, any>;
