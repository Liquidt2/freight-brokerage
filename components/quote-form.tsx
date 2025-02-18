"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

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

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  freightType: z.string({
    required_error: "Please select a freight type.",
  }),
  origin: z.string().min(2, {
    message: "Origin location is required.",
  }),
  destination: z.string().min(2, {
    message: "Destination location is required.",
  }),
  weight: z.string().min(1, {
    message: "Weight is required.",
  }),
  dimensions: z.string().optional(),
  specialNeeds: z.string().optional(),
})

type FormStep = {
  title: string
  description: string
  fields: string[]
}

const formSteps: FormStep[] = [
  {
    title: "Company Information",
    description: "Tell us about your business",
    fields: ["companyName", "contactName", "email", "phone"],
  },
  {
    title: "Shipment Details",
    description: "Provide information about your freight",
    fields: ["freightType", "weight", "dimensions"],
  },
  {
    title: "Route Information",
    description: "Specify pickup and delivery locations",
    fields: ["origin", "destination", "specialNeeds"],
  },
]

export default function QuoteForm() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      freightType: "",
      origin: "",
      destination: "",
      weight: "",
      dimensions: "",
      specialNeeds: "",
    },
  })

  const currentFields = formSteps[step].fields
  const isLastStep = step === formSteps.length - 1

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!isLastStep) {
        setStep(step + 1)
        return
      }

      setIsSubmitting(true)
      // Here we would normally submit to an API endpoint
      console.log(values)
      toast.success("Quote request submitted successfully!")
      form.reset()
      setStep(0)
    } catch (error) {
      toast.error("Failed to submit quote request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
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
              <div className="space-y-6">
                {/* Company Information */}
                {currentFields.includes("companyName") && (
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

                {currentFields.includes("contactName") && (
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

                {currentFields.includes("email") && (
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

                {currentFields.includes("phone") && (
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

                {/* Shipment Details */}
                {currentFields.includes("freightType") && (
                  <FormField
                    control={form.control}
                    name="freightType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Freight Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select freight type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ltl">LTL (Less than Truckload)</SelectItem>
                            <SelectItem value="ftl">FTL (Full Truckload)</SelectItem>
                            <SelectItem value="specialized">Specialized</SelectItem>
                            <SelectItem value="international">International</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {currentFields.includes("weight") && (
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

                {currentFields.includes("dimensions") && (
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="L x W x H in inches"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Example: 48 x 40 x 48
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Route Information */}
                {currentFields.includes("origin") && (
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City, State or Zip Code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {currentFields.includes("destination") && (
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City, State or Zip Code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {currentFields.includes("specialNeeds") && (
                  <FormField
                    control={form.control}
                    name="specialNeeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any special requirements or instructions"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
