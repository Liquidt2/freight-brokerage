"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { FormContent, FormField as FormFieldType, createFormSchema } from "@/app/forms/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField as FormFieldUI,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DynamicFormProps {
  form: FormContent;
  onSubmit: (data: any) => Promise<void>;
}

const complianceFieldMap: Record<string, string> = {
  consent: "termsAccepted",
  sms: "smsOptIn"
};

const getComplianceFieldName = (type: string) =>
  complianceFieldMap[type] || type;

  const buildDefaultValues = (form: FormContent) => {
    const defaultValues: Record<string, any> = {};

    // Add default values for each field in each group
    form.fields.forEach((group) => {
      group.fields.forEach((field) => {
        // Ensure field has a valid name before adding default value
        if (field && field.name) {
          // Set default values based on field type
          if (field.type === "radio" || field.type.startsWith("is")) {
            defaultValues[field.name] = "No"; // Default radio buttons to "No"
          } else {
            defaultValues[field.name] = "";
          }
        }
      });
    });

    // Add default values for compliance fields
    form.complianceFields?.forEach((field) => {
      // Ensure field has a valid type before adding default value
      if (!field || !field.type) return;
      
      const fieldName = getComplianceFieldName(field.type);
      // Ensure fieldName is valid
      if (fieldName) {
        defaultValues[fieldName] = false;
        defaultValues[`${fieldName}Touched`] = false;
      }
    });

    return defaultValues;
  };

  export function DynamicForm({ form, onSubmit }: DynamicFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(0); // Add state to force re-render
    const totalSteps = form.fields.length + 1; // +1 for compliance step

    const formSchema = createFormSchema(form);
    const defaultValues = buildDefaultValues(form);

    const formInstance = useForm({
      resolver: zodResolver(formSchema),
      defaultValues,
    });

    const stepFields = useMemo(() => {
      const steps: string[][] = [];
      
      // Add fields from each group
      form.fields.forEach((group) => {
        steps.push(group.fields.map((field) => field.name));
      });

      // Add compliance fields as the last step
      steps.push(
        form.complianceFields?.map((field) => getComplianceFieldName(field.type)) ||
          []
      );

      return steps;
    }, [form.fields, form.complianceFields]);

    const currentStepFields = useMemo(() => {
      if (currentStep === form.fields.length) {
        return [];
      }
      
      // Get all fields in the current step, including conditional fields
      const fields = form.fields[currentStep].fields;
      
      // Log the fields for debugging
      console.log(`Current step ${currentStep} fields:`, 
        fields.map(f => `${f.name} (${f.type})${f.showWhen ? ` - shows when ${f.showWhen.field}=${f.showWhen.equals}` : ''}`));
      
      return fields;
    }, [currentStep, form.fields, forceUpdate]); // Add forceUpdate to re-evaluate when form is forced to re-render

  // Watch all form values to trigger re-renders when they change
  const formValues = useWatch({
    control: formInstance.control
  });
  
  // Force re-render when forceUpdate changes
  useEffect(() => {
    // This will cause the component to re-render when forceUpdate changes
    // and re-evaluate all conditional fields
    console.log("Form re-rendering due to forceUpdate:", forceUpdate);
  }, [forceUpdate]);
  
  // Set default values for radio buttons
  useEffect(() => {
    // Find all radio/is* fields and set default values if not already set
    form.fields.forEach(group => {
      group.fields.forEach(field => {
        if ((field.type === "radio" || field.type.startsWith("is")) && 
            !formInstance.getValues(field.name)) {
          formInstance.setValue(field.name, "No");
        }
      });
    });
    
    // Force re-render to ensure conditional fields are properly evaluated
    setForceUpdate(prev => prev + 1);
  }, [form.fields, formInstance]);

  const shouldShowField = useCallback(
    (field: FormFieldType) => {
      if (!field.showWhen) return true;
      
      // Check if the field name and showWhen field are valid
      if (!field.name || !field.showWhen.field) return false;

      try {
        const parentFieldValue = formInstance.getValues(field.showWhen.field);
        console.log(`Checking condition for field ${field.name}: ${field.showWhen.field} = ${parentFieldValue}, should equal ${field.showWhen.equals}`);
        return parentFieldValue === field.showWhen.equals;
      } catch (error) {
        console.error(`Error checking condition for field ${field.name}:`, error);
        return false;
      }
    },
    [formInstance, formValues, forceUpdate] // Add forceUpdate to re-evaluate when form is forced to re-render
  );

  const validateStep = async (step: number) => {
    if (step === form.fields.length) {
      // Validate compliance fields
      const complianceFields = form.complianceFields?.map(field => 
        getComplianceFieldName(field.type)
      ) || [];
      
      const stepValues = Object.fromEntries(
        complianceFields.map((field) => [field, formInstance.getValues(field)])
      );

      try {
        await formSchema.pick(
          complianceFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
        ).parseAsync(stepValues);
        return true;
      } catch (error) {
        await formInstance.trigger(complianceFields);
        return false;
      }
    }

    // Validate fields in the current group
    const currentGroup = form.fields[step];
    const currentFields = currentGroup.fields.map(field => field.name);
    const stepValues = Object.fromEntries(
      currentFields.map((field) => [field, formInstance.getValues(field)])
    );

    try {
      await formSchema.pick(
        currentFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      ).parseAsync(stepValues);
      return true;
    } catch (error) {
      await formInstance.trigger(currentFields);
      return false;
    }
  };

  // Function to reset the form to initial state
  const resetForm = () => {
    formInstance.reset(defaultValues);
    setCurrentStep(0);
    setSubmitError(null);
    setForceUpdate(prev => prev + 1);
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep === totalSteps - 1) {
        try {
          setIsSubmitting(true);
          setSubmitError(null);
          
          // Validate conditional fields before submission
          const formValues = formInstance.getValues();
          
          // Check if hazmat is selected but required fields are missing
          if (formValues.isHazmat === 'Yes') {
            if (!formValues.unNumber) {
              formInstance.setError('unNumber', { 
                type: 'manual', 
                message: 'UN number is required for hazmat loads' 
              });
              setIsSubmitting(false);
              return;
            }
            if (!formValues.hazmatClass) {
              formInstance.setError('hazmatClass', { 
                type: 'manual', 
                message: 'Hazmat classification is required' 
              });
              setIsSubmitting(false);
              return;
            }
          }
          
          // Check if oversized load is selected but dimensions are missing
          if (formValues.isOversizedLoad === 'Yes' && !formValues.oversizedDimensions) {
            formInstance.setError('oversizedDimensions', { 
              type: 'manual', 
              message: 'Dimensions are required for oversized loads' 
            });
            setIsSubmitting(false);
            return;
          }
          
          // Submit the form if all validations pass
          await onSubmit(formInstance.getValues());
          
          // Show success message temporarily
          setSubmitSuccess(true);
          
          // Reset form after a delay
          setTimeout(() => {
            setSubmitSuccess(false);
            resetForm();
          }, 3000);
        } catch (error) {
          console.error("Form submission error:", error);
          setSubmitError(error instanceof Error ? error.message : "An error occurred");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  if (submitSuccess) {
    return (
      <div className="text-center p-6 bg-background rounded-lg shadow">
        <h3 className="text-2xl font-bold mb-2">{form.successMessage.title}</h3>
        <p className="text-muted-foreground">{form.successMessage.message}</p>
      </div>
    );
  }

  return (
    <Form {...formInstance}>
      <form onSubmit={formInstance.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                    i === currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : i < currentStep
                      ? "bg-primary/20 border-primary/20"
                      : "bg-background border-border"
                  )}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={cn(
                      "h-1 w-12 mx-2",
                      i < currentStep ? "bg-primary/20" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStepFields.map(
          (field) => {
            // Ensure field has a valid name before rendering
            if (!field || !field.name) return null;
            
            return shouldShowField(field) && (
              <FormFieldUI
                key={field.name}
                control={formInstance.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === "radio" || field.type.startsWith("is") ? (
                        <RadioGroup
                          onValueChange={(value) => {
                            formField.onChange(value);
                            // Force re-render to update conditional fields
                            formInstance.trigger();
                            // Force component re-render to update conditional fields
                            setForceUpdate(prev => prev + 1);
                          }}
                          value={formField.value || "No"}
                          className="flex flex-row space-x-4"
                        >
                          {["Yes", "No"].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={value}
                                id={`${field.name}-${value.toLowerCase()}`}
                              />
                              <FormLabel
                                htmlFor={`${field.name}-${value.toLowerCase()}`}
                              >
                                {value}
                              </FormLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          {...formField}
                        />
                      ) : field.type === "select" ? (
                        <Select
                          onValueChange={formField.onChange}
                          defaultValue={formField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem
                                key={
                                  typeof option === "string"
                                    ? option
                                    : option.value
                                }
                                value={
                                  typeof option === "string"
                                    ? option
                                    : option.value
                                }
                              >
                                {typeof option === "string"
                                  ? option
                                  : option.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "date" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formField.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formField.value ? (
                                format(new Date(formField.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                formField.value
                                  ? new Date(formField.value)
                                  : undefined
                              }
                              onSelect={(date) =>
                                formField.onChange(date?.toISOString())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...formField}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
        )}

        {currentStep === totalSteps - 1 &&
          form.complianceFields?.map((field) => {
            // Ensure field has a valid type before rendering
            if (!field || !field.type) return null;
            
            const fieldName = getComplianceFieldName(field.type);
            // Ensure the mapped field name is valid
            if (!fieldName) return null;
            
            return (
              <FormFieldUI
                key={field.type}
                control={formInstance.control}
                name={fieldName}
                render={({ field: formField }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={formField.value}
                      onCheckedChange={(checked) => {
                        formField.onChange(checked);
                        const touchedField = `${getComplianceFieldName(
                          field.type
                        )}Touched`;
                        formInstance.setValue(touchedField, true);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{field.text}</FormLabel>
                  </div>
                </FormItem>
              )}
              />
            );
          })}

        {submitError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            <h4 className="font-semibold mb-1">{form.errorMessage.title}</h4>
            <p>{submitError}</p>
          </div>
        )}

        <div className="flex justify-between space-x-4 mt-6">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="w-full"
            >
              Previous
            </Button>
          )}
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="w-full"
          >
            {currentStep === totalSteps - 1
              ? isSubmitting
                ? form.submitButton.loadingText
                : form.submitButton.text
              : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
