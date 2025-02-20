import { z } from "zod"

export interface FormFieldConfig {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string } | string>;
  validation?: {
    pattern?: string;
    message?: string;
  };
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
  fields: FormFieldConfig[];
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

// Define the base schema with all fields optional
const baseSchema = z.object({
  // Company & Contact Information
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  phone: z.string().optional(),
  companyAddress: z.string().optional(),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
  companyZip: z.string().optional(),

  // Origin Information
  originCity: z.string().optional(),
  originState: z.string().optional(),
  zipCode: z.string().optional(),
  originPickupDate: z.date().optional(),

  // Destination Information
  destinationCity: z.string().optional(),
  destinationState: z.string().optional(),
  destinationZip: z.string().optional(),
  deliveryDate: z.date().optional(),

  // Load Information
  truckTrailerType: z.string().optional(),
  commodityType: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  loadType: z.string().optional(),
  isPalletized: z.boolean().default(false),
  palletCount: z.string().optional(),
  isHazmat: z.boolean().default(false),
  unNumber: z.string().optional(),
  hazmatClass: z.string().optional(),
  isTemperatureControlled: z.boolean().default(false),
  temperature: z.string().optional(),
  loadingMethod: z.string().optional(),
  specialHandling: z.string().optional(),
  isStackable: z.boolean().default(false),
  isHighValue: z.boolean().default(false),
  insuranceInfo: z.string().optional(),

  // Compliance
  smsOptIn: z.boolean().default(false),
  termsAccepted: z.boolean().default(false),
})

// Step-specific validation schemas
export const stepSchemas = {
  0: z.object({
    companyName: z.string().min(1, { message: "Company name is required." }),
    contactName: z.string().min(1, { message: "Contact name is required." }),
    email: z.string().min(1, { message: "Email is required." }).email({ message: "Please enter a valid email address." }),
    phone: z.string().min(1, { message: "Phone number is required." }),
    companyAddress: z.string().min(1, { message: "Company address is required." }),
    companyCity: z.string().min(1, { message: "City is required." }),
    companyState: z.string().min(1, { message: "Please select a state." }),
    companyZip: z.string().min(5, { message: "Please enter a valid ZIP code." }),
  }),
  1: z.object({
    originCity: z.string().min(1, { message: "Origin city is required." }),
    originState: z.string().min(1, { message: "Please select a state." }),
    zipCode: z.string().min(5, { message: "Please enter a valid ZIP code." }),
    originPickupDate: z.date({ required_error: "Please select a pickup date." }),
  }),
  2: z.object({
    destinationCity: z.string().min(1, { message: "Destination city is required." }),
    destinationState: z.string().min(1, { message: "Please select a state." }),
    destinationZip: z.string().min(5, { message: "Please enter a valid ZIP code." }),
    deliveryDate: z.date({ required_error: "Please select a delivery date." }),
  }),
  3: z.object({
    truckTrailerType: z.string().min(1, { message: "Please select a truck & trailer type." }),
    commodityType: z.string().min(1, { message: "Please enter the type of goods being shipped." }),
    weight: z.string().min(1, { message: "Please enter the weight." }),
    dimensions: z.string().min(1, { message: "Please enter the dimensions." }),
    loadType: z.string().min(1, { message: "Please select a load type." }),
    loadingMethod: z.string().min(1, { message: "Please select a loading method." }),
    // Add conditional fields to the schema
    isPalletized: z.boolean().default(false),
    palletCount: z.string().optional(),
    isHazmat: z.boolean().default(false),
    unNumber: z.string().optional(),
    hazmatClass: z.string().optional(),
    isTemperatureControlled: z.boolean().default(false),
    temperature: z.string().optional(),
    isHighValue: z.boolean().default(false),
    insuranceInfo: z.string().optional(),
    isStackable: z.boolean().default(false),
    specialHandling: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.isPalletized && !data.palletCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pallet count is required when load is palletized",
        path: ["palletCount"],
      });
    }
    if (data.isHazmat && (!data.unNumber || !data.hazmatClass)) {
      if (!data.unNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "UN number is required for hazmat loads",
          path: ["unNumber"],
        });
      }
      if (!data.hazmatClass) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hazmat classification is required",
          path: ["hazmatClass"],
        });
      }
    }
    if (data.isTemperatureControlled && !data.temperature) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Temperature is required for temperature controlled loads",
        path: ["temperature"],
      });
    }
    if (data.isHighValue && !data.insuranceInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Insurance information is required for high-value shipments",
        path: ["insuranceInfo"],
      });
    }
  }),
  4: z.object({
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  }),
}

export const formSchema = baseSchema

export type FormSchema = z.infer<typeof formSchema>
export type FormFieldName = keyof FormSchema
export type FormFieldValues = FormSchema
