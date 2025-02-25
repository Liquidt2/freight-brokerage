import { FieldErrors } from "react-hook-form"
import { FormSchema } from "@/app/forms/validation"

interface FormErrorsProps {
  errors: FieldErrors<FormSchema>
  submitError?: string | null
}

export function FormErrors({ errors, submitError }: FormErrorsProps) {
  const hasErrors = Object.keys(errors).length > 0 || submitError

  if (!hasErrors) return null

  return (
    <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md mb-6">
      {Object.keys(errors).length > 0 && (
        <>
          <p className="font-medium">Please fix the following errors:</p>
          <ul className="list-disc list-inside">
            {Object.entries(errors).map(([field, error]) => (
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
  )
}
