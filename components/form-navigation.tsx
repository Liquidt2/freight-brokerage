import { Button } from "@/components/ui/button"

interface FormNavigationProps {
  currentStep: number
  isLastStep: boolean
  isSubmitting: boolean
  onPrevious: () => void
}

export function FormNavigation({
  currentStep,
  isLastStep,
  isSubmitting,
  onPrevious,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between pt-6">
      {currentStep > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
        >
          Previous
        </Button>
      )}
      <Button
        type="submit"
        className={currentStep === 0 ? "w-full" : ""}
        disabled={isSubmitting}
      >
        {isLastStep
          ? isSubmitting
            ? "Submitting..."
            : "Submit Quote Request"
          : "Next Step"}
      </Button>
    </div>
  )
}
