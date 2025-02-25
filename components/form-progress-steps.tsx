import { FormStep } from "@/hooks/use-form-steps"

interface FormProgressStepsProps {
  steps: FormStep[]
  currentStep: number
}

export function FormProgressSteps({ steps, currentStep }: FormProgressStepsProps) {
  return (
    <div className="flex justify-between mb-8 bg-card p-6 rounded-lg card-border">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep >= index
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {step.title}
          </p>
        </div>
      ))}
    </div>
  )
}

export function FormStepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
