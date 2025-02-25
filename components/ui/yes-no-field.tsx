import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface YesNoFieldProps {
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
}

export function YesNoField({
  label,
  description,
  value,
  onChange,
}: YesNoFieldProps) {
  return (
    <FormItem className="space-y-3">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={onChange}
          value={value}
          className="flex flex-row space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id={`${label}-yes`} />
            <FormLabel htmlFor={`${label}-yes`} className="font-normal">
              Yes
            </FormLabel>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id={`${label}-no`} />
            <FormLabel htmlFor={`${label}-no`} className="font-normal">
              No
            </FormLabel>
          </div>
        </RadioGroup>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  )
}
