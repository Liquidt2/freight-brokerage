"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FormSchema, formSchema, stepSchemas } from "@/app/forms/types"

interface QuoteFormProps {
  onSubmit: (data: FormSchema) => Promise<void>
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
] as const

const LOADING_METHODS = [
  { value: "dock", label: "Dock" },
  { value: "forklift", label: "Forklift" },
  { value: "liftgate", label: "Liftgate" },
  { value: "manual", label: "Manual" },
] as const

export default function QuoteForm({ onSubmit: handleSubmit }: QuoteFormProps) {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    criteriaMode: "all",
    defaultValues: {
      companyName: "",
      contactName: "",
      truckTrailerType: "",
      email: "",
      phone: "",
      companyAddress: "",
      companyCity: "",
      companyState: "",
      companyZip: "",
      originCity: "",
      originState: "",
      zipCode: "",
      originPickupDate: undefined,
      destinationCity: "",
      destinationState: "",
      destinationZip: "",
      deliveryDate: undefined,
      commodityType: "",
      weight: "",
      dimensions: "",
      loadType: "",
      isPalletized: false,
      palletCount: "",
      isHazmat: false,
      unNumber: "",
      hazmatClass: "",
      isTemperatureControlled: false,
      temperature: "",
      loadingMethod: "",
      specialHandling: "",
      isStackable: false,
      isHighValue: false,
      insuranceInfo: "",
      smsOptIn: false,
      termsAccepted: false,
    },
  })

  type FormField = keyof FormSchema;

  const formSteps: Array<{
    title: string;
    description: string;
    fields: FormField[];
  }> = [
    {
      title: "Company & Contact Information",
      description: "Tell us about your business",
      fields: [
        "companyName", "contactName", "email", "phone",
        "companyAddress", "companyCity", "companyState", "companyZip"
      ],
    },
    {
      title: "Origin Location",
      description: "Provide pickup location details",
      fields: ["originCity", "originState", "zipCode", "originPickupDate"],
    },
    {
      title: "Destination Location",
      description: "Provide delivery location details",
      fields: ["destinationCity", "destinationState", "destinationZip", "deliveryDate"],
    },
    {
      title: "Load Information",
      description: "Tell us about your freight",
      fields: [
        "truckTrailerType", "commodityType", "weight", "dimensions", "loadType",
        "isPalletized", "palletCount",
        "isHazmat", "unNumber", "hazmatClass",
        "isTemperatureControlled", "temperature",
        "loadingMethod", "specialHandling",
        "isStackable", "isHighValue", "insuranceInfo"
      ],
    },
    {
      title: "Compliance",
      description: "Please review and accept the terms",
      fields: ["smsOptIn", "termsAccepted"],
    },
  ]

  const currentFields = formSteps[step].fields
  const isLastStep = step === formSteps.length - 1

  // Watch conditional field values
  const {
    isPalletized,
    isHazmat,
    isTemperatureControlled,
    isHighValue,
    originPickupDate,
    deliveryDate
  } = form.watch();

  // Validate dates
  const validateDates = useCallback(() => {
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
  }, [originPickupDate, deliveryDate, form])

  useEffect(() => {
    validateDates()
  }, [validateDates])

  async function onSubmit(values: FormSchema) {
    try {
      setSubmitError(null); // Clear any previous errors
      if (!isLastStep) {
        // Clear any existing errors
        form.clearErrors()

        // Get the validation schema for the current step
        const currentStepSchema = stepSchemas[step as keyof typeof stepSchemas]
        
        try {
          // Parse the current step's values with the step-specific schema
          const stepValues = Object.fromEntries(
            formSteps[step].fields.map(field => [field, values[field]])
          )
          await currentStepSchema.parseAsync(stepValues)
          
          // If validation passes, move to next step
          setStep(step + 1)
        } catch (error) {
          // If validation fails, set the errors
          if (error instanceof Error) {
            const zodError = JSON.parse(error.message)
            zodError.errors.forEach((err: any) => {
              form.setError(err.path[0] as any, {
                type: "manual",
                message: err.message,
              })
            })
          }
        }
        return
      }

      if (!values.termsAccepted) {
        form.setError("termsAccepted", {
          type: "manual",
          message: "You must accept the terms and conditions",
        })
        return
      }

      setIsSubmitting(true)
      await handleSubmit(values)
      toast.success("Quote request submitted successfully!")
      form.reset()
      setStep(0)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit quote request. Please try again.";
      toast.error(errorMessage);
      setSubmitError(errorMessage); // Set the error message for display
    } finally {
      setIsSubmitting(false)
    }
  }

  const shouldShowField = (fieldName: FormField) => {
    if (!currentFields.includes(fieldName)) return false
    
    // Handle conditional fields
    switch (fieldName) {
      case "palletCount":
        return isPalletized
      case "unNumber":
      case "hazmatClass":
        return isHazmat
      case "temperature":
        return isTemperatureControlled
      case "insuranceInfo":
        return isHighValue
      default:
        return true
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8 bg-card p-6 rounded-lg card-border">
        {formSteps.map((formStep, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {formStep.title}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-card p-6 rounded-lg card-border"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">{formSteps[step].title}</h2>
            <p className="text-muted-foreground">{formSteps[step].description}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Show form errors */}
              {(Object.keys(form.formState.errors).length > 0 || submitError) && (
                <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md mb-6">
                  {Object.keys(form.formState.errors).length > 0 && (
                    <>
                      <p className="font-medium">Please fix the following errors:</p>
                      <ul className="list-disc list-inside">
                    {Object.entries(form.formState.errors).map(([field, error]) => (
                      <li key={field}>
                        {error?.message}
                      </li>
                    ))}
                      </ul>
                    </>
                  )}
                  {submitError && (
                    <p className="font-medium text-destructive">{submitError}</p>
                  )}
                </div>
              )}

              <div className="space-y-6">
                {/* Company & Contact Information */}
                {shouldShowField("companyName") && (
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("contactName") && (
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("email") && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("phone") && (
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(555) 123-4567"
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("companyAddress") && (
                  <FormField
                    control={form.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("companyCity") && (
                  <FormField
                    control={form.control}
                    name="companyCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("companyState") && (
                  <FormField
                    control={form.control}
                    name="companyState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("companyZip") && (
                  <FormField
                    control={form.control}
                    name="companyZip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Origin Information */}
                {shouldShowField("originCity") && (
                  <FormField
                    control={form.control}
                    name="originCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("originState") && (
                  <FormField
                    control={form.control}
                    name="originState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("zipCode") && (
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("originPickupDate") && (
                  <FormField
                    control={form.control}
                    name="originPickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={!field.value ? "text-muted-foreground" : ""}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  "Select pickup date"
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Destination Information */}
                {shouldShowField("destinationCity") && (
                  <FormField
                    control={form.control}
                    name="destinationCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("destinationState") && (
                  <FormField
                    control={form.control}
                    name="destinationState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("destinationZip") && (
                  <FormField
                    control={form.control}
                    name="destinationZip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("deliveryDate") && (
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={!field.value ? "text-muted-foreground" : ""}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  "Select delivery date"
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Load Information */}
                {shouldShowField("truckTrailerType") && (
                  <FormField
                    control={form.control}
                    name="truckTrailerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Truck & Trailer Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select truck & trailer type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full Truckload">Full Truckload</SelectItem>
                            <SelectItem value="Less Than Truckload (LTL)">Less Than Truckload (LTL)</SelectItem>
                            <SelectItem value="Flatbed">Flatbed</SelectItem>
                            <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                            <SelectItem value="Expedited">Expedited</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("commodityType") && (
                  <FormField
                    control={form.control}
                    name="commodityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commodity Type</FormLabel>
                        <FormControl>
                          <Input placeholder="What is being shipped?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("weight") && (
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter weight in pounds"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("dimensions") && (
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (L x W x H)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Example: 48 x 40 x 48 inches"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("loadType") && (
                  <FormField
                    control={form.control}
                    name="loadType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Load Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select load type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ftl">Full Truckload (FTL)</SelectItem>
                            <SelectItem value="ltl">Less than Truckload (LTL)</SelectItem>
                            <SelectItem value="partial">Partial Truckload</SelectItem>
                            <SelectItem value="specialized">Specialized</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("isPalletized") && (
                  <FormField
                    control={form.control}
                    name="isPalletized"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Palletized Load</FormLabel>
                          <FormDescription>
                            Is the load palletized?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("palletCount") && (
                  <FormField
                    control={form.control}
                    name="palletCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Pallets</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter number of pallets"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("isHazmat") && (
                  <FormField
                    control={form.control}
                    name="isHazmat"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Hazmat Load</FormLabel>
                          <FormDescription>
                            Is this a hazardous materials load?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("unNumber") && (
                  <FormField
                    control={form.control}
                    name="unNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UN Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter UN number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("hazmatClass") && (
                  <FormField
                    control={form.control}
                    name="hazmatClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hazmat Classification</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hazmat class" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("isTemperatureControlled") && (
                  <FormField
                    control={form.control}
                    name="isTemperatureControlled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Temperature Controlled</FormLabel>
                          <FormDescription>
                            Does this load require temperature control?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("temperature") && (
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Temperature (°F)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter temperature in Fahrenheit"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("loadingMethod") && (
                  <FormField
                    control={form.control}
                    name="loadingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loading/Unloading Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loading method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LOADING_METHODS.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("specialHandling") && (
                  <FormField
                    control={form.control}
                    name="specialHandling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Handling Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any special handling needs (tarping, straps, permits, escorts, etc.)"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("isStackable") && (
                  <FormField
                    control={form.control}
                    name="isStackable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Stackable Load</FormLabel>
                          <FormDescription>
                            Can this load be stacked?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("isHighValue") && (
                  <FormField
                    control={form.control}
                    name="isHighValue"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>High-Value Shipment</FormLabel>
                          <FormDescription>
                            Is this a high-value shipment requiring additional insurance?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("insuranceInfo") && (
                  <FormField
                    control={form.control}
                    name="insuranceInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter insurance requirements and coverage details"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Compliance Fields */}
                {shouldShowField("smsOptIn") && (
                  <FormField
                    control={form.control}
                    name="smsOptIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>SMS Updates</FormLabel>
                          <FormDescription>
                            I agree to receive SMS/text message updates about my shipment
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("termsAccepted") && (
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Terms and Conditions</FormLabel>
                          <FormDescription>
                            I have read and agree to the terms and conditions
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex justify-between pt-6">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  type="submit"
                  className={step === 0 ? "w-full" : ""}
                  disabled={isSubmitting}
                >
                  {isLastStep
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit Quote Request"
                    : "Next Step"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
