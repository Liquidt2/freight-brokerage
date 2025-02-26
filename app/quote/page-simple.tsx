import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/client"
import { formQuery } from "@/lib/sanity/queries"
import { FormContent, FormField, FormFieldGroup } from "@/app/forms/types"
import QuoteFormClient from "./quote-form-client"

export const revalidate = 0 // Disable cache to ensure fresh data on every request

// Helper function to transform a field
function transformField(field: FormField) {
  return {
    ...field,
    // Ensure radio buttons and conditional fields have proper options
    options: field.type && field.type.startsWith("is")
      ? [{ value: "Yes" }, { value: "No" }]
      : field.options,
    // Set hidden state based on showWhen
    hidden: field.showWhen ? true : field.hidden,
    // Add validation for specific field types
    validation: {
      ...field.validation,
      pattern:
        field.type === "tel"
          ? "^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
          : field.validation?.pattern,
      message:
        field.type === "tel"
          ? "Please enter a valid phone number"
          : field.validation?.message,
    },
  };
}

async function getForm(preview: boolean): Promise<FormContent | null> {
  try {
    console.log("Fetching quote form from Sanity with fresh data...")
    const client = getClient(preview)
    
    // Force disable CDN for form data
    client.useCdn = false
    
    const form = await client.fetch(formQuery, { slug: "request-quote" })

    console.log("Quote form fetch result:", {
      formExists: !!form,
      formTitle: form?.title,
      fieldsCount: form?.fields?.length,
      complianceFieldsCount: form?.complianceFields?.length,
      timestamp: new Date().toISOString(),
      preview: preview
    })

    if (!form) {
      console.error("Quote form not found in Sanity")
      return null
    }
    
    // Log the raw form structure to debug
    console.log("Raw form structure:", JSON.stringify(form, null, 2).substring(0, 500) + "...")
    
    // Transform fields to ensure they're in the grouped format
    let transformedFields;
    
    // Check if the form data is already in the grouped format
    if (form.fields && form.fields.length > 0) {
      if (form.fields[0].group) {
        // Form is already in grouped format, just transform fields within groups
        console.log("Form is in grouped format, transforming fields within groups")
        transformedFields = form.fields.map((group: FormFieldGroup) => ({
          ...group,
          fields: group.fields.map((field: FormField) => transformField(field))
        }));
      } else {
        // Form is in the old flat format, convert to grouped format
        console.log("Form is in flat format, converting to grouped format")
        transformedFields = [{
          group: "Form Information",
          fields: form.fields.map((field: any) => transformField(field))
        }];
      }
    } else {
      console.error("Form fields array is empty or undefined")
      transformedFields = []
    }

    return {
      ...form,
      fields: transformedFields
    }
  } catch (error) {
    console.error("Error fetching quote form:", error)
    return null
  }
}

export default async function QuotePage() {
  const preview = draftMode().isEnabled
  const form = await getForm(preview)

  if (!form) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">
            Please add quote form content in the Sanity Studio.
          </p>
        </div>
      </div>
    )
  }

  // Simple server action that doesn't use webhooks
  async function handleSubmit(data: any) {
    "use server"
    console.log("Form submitted:", data)
    // Don't return anything to match the expected Promise<void> type
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuoteFormClient form={form} onSubmit={handleSubmit} />
    </div>
  )
}
