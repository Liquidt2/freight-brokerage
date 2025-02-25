import { z } from "zod"
import { TRUCK_TRAILER_TYPES, LOAD_TYPES, LOADING_METHODS, US_STATES } from "@/lib/constants/form-constants"

// Helper regex patterns
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
const ZIP_REGEX = /^\d{5}(-\d{4})?$/
const DIMENSIONS_REGEX = /^\d+(\.\d+)?[xX]\d+(\.\d+)?[xX]\d+(\.\d+)?$/

// Create type-safe union of values
const truckTrailerTypeValues = TRUCK_TRAILER_TYPES.map(t => t.value)
const loadTypeValues = LOAD_TYPES.map(t => t.value)
const loadingMethodValues = LOADING_METHODS.map(t => t.value)
const stateValues = US_STATES.map(s => s.value)

// Base schema with improved validation
export const baseFormSchema = z.object({
  // Company & Contact Information
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(PHONE_REGEX, "Please enter a valid phone number (e.g., 555-123-4567)"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyCity: z.string().min(1, "City is required"),
  companyState: z.enum(stateValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a state" })
  }),
  companyZip: z.string().regex(ZIP_REGEX, "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"),

  // Origin Information
  originCity: z.string().min(1, "Origin city is required"),
  originState: z.enum(stateValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a state" })
  }),
  zipCode: z.string().regex(ZIP_REGEX, "Please enter a valid ZIP code"),
  originPickupDate: z.date({
    required_error: "Pickup date is required",
    invalid_type_error: "Please select a valid date",
  }).nullable(),

  // Destination Information
  destinationCity: z.string().min(1, "Destination city is required"),
  destinationState: z.enum(stateValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a state" })
  }),
  destinationZip: z.string().regex(ZIP_REGEX, "Please enter a valid ZIP code"),
  deliveryDate: z.date({
    required_error: "Delivery date is required",
    invalid_type_error: "Please select a valid date",
  }).nullable(),

  // Load Information
  truckTrailerType: z.enum(truckTrailerTypeValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a truck/trailer type" })
  }),
  commodityType: z.string().min(1, "Commodity type is required"),
  weight: z.string().min(1, "Weight is required"),
  dimensions: z.string().regex(DIMENSIONS_REGEX, "Please enter dimensions in format: L x W x H"),
  loadType: z.enum(loadTypeValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a load type" })
  }),
  
  // Yes/No radio fields
  isPalletized: z.enum(['Yes', 'No']).default('No'),
  isHazmat: z.enum(['Yes', 'No']).default('No'),
  isTemperatureControlled: z.enum(['Yes', 'No']).default('No'),
  isStackable: z.enum(['Yes', 'No']).default('No'),
  isHighValue: z.enum(['Yes', 'No']).default('No'),
  isHeavyLoad: z.enum(['Yes', 'No']).default('No'),
  isOversizedLoad: z.enum(['Yes', 'No']).default('No'),

  // Conditional fields
  palletCount: z.string().optional(),
  unNumber: z.string().optional(),
  hazmatClass: z.string().optional(),
  temperature: z.string().optional(),
  loadingMethod: z.enum(loadingMethodValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a loading method" })
  }).optional(),
  specialHandling: z.string().optional(),
  insuranceInfo: z.string().optional(),
  heavyLoadWeight: z.string().optional(),
  oversizedDimensions: z.string().optional(),

  // Compliance
  smsOptIn: z.boolean(),
  termsAccepted: z.boolean(),
})

// Step-specific validation schemas
export const stepSchemas = {
  0: baseFormSchema.pick({
    companyName: true,
    contactName: true,
    email: true,
    phone: true,
    companyAddress: true,
    companyCity: true,
    companyState: true,
    companyZip: true,
  }),
  1: baseFormSchema.pick({
    originCity: true,
    originState: true,
    zipCode: true,
    originPickupDate: true,
  }),
  2: baseFormSchema.pick({
    destinationCity: true,
    destinationState: true,
    destinationZip: true,
    deliveryDate: true,
  }),
  3: baseFormSchema.pick({
    truckTrailerType: true,
    commodityType: true,
    weight: true,
    dimensions: true,
    loadType: true,
    isPalletized: true,
    palletCount: true,
    isHazmat: true,
    unNumber: true,
    hazmatClass: true,
    isTemperatureControlled: true,
    temperature: true,
    loadingMethod: true,
    specialHandling: true,
    isStackable: true,
    isHighValue: true,
    insuranceInfo: true,
    isHeavyLoad: true,
    heavyLoadWeight: true,
    isOversizedLoad: true,
    oversizedDimensions: true,
  }).superRefine((data, ctx) => {
    if (data.isPalletized === 'Yes' && !data.palletCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Number of pallets is required when load is palletized",
        path: ["palletCount"],
      })
    }
    if (data.isHazmat === 'Yes') {
      if (!data.unNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "UN number is required for hazmat loads",
          path: ["unNumber"],
        })
      }
      if (!data.hazmatClass) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hazmat classification is required",
          path: ["hazmatClass"],
        })
      }
    }
    if (data.isTemperatureControlled === 'Yes' && !data.temperature) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Temperature is required for temperature controlled loads",
        path: ["temperature"],
      })
    }
    if (data.isHighValue === 'Yes' && !data.insuranceInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Insurance information is required for high-value loads",
        path: ["insuranceInfo"],
      })
    }
    if (data.isHeavyLoad === 'Yes' && !data.heavyLoadWeight) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Weight is required for heavy loads",
        path: ["heavyLoadWeight"],
      })
    }
    if (data.isOversizedLoad === 'Yes' && !data.oversizedDimensions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dimensions are required for oversized loads",
        path: ["oversizedDimensions"],
      })
    }
  }),
  4: baseFormSchema.pick({
    smsOptIn: true,
    termsAccepted: true,
  }).refine((data) => data.termsAccepted, {
    message: "You must accept the terms and conditions",
    path: ["termsAccepted"],
  }),
}

export const formSchema = baseFormSchema

export type FormSchema = z.infer<typeof formSchema>
export type FormFieldName = keyof FormSchema
