// Form Field Interface
export interface FormField {
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  placeholder?: string;
  required?: boolean; // ✅ Made optional (defaults to false if not provided)
  options?: { value: string }[];
  validation?: {
    pattern: string;
    message: string;
  };
}

// Compliance Field Interface
export interface ComplianceField {
  type: 'opt-in' | 'opt-out' | 'consent' | 'acknowledgment';
  text: string;
  required?: boolean; // ✅ Made optional (defaults to false if not provided)
}

// Submit Button Interface
export interface SubmitButton {
  text: string;
  loadingText?: string; // ✅ Made optional in case loading text is not used
}

// General Message Interface
export interface Message {
  title: string;
  message: string;
}

// Notifications Interface
export interface Notifications {
  adminEmail: string;
  emailTemplate: string;
}

// Main Form Content Interface
export interface FormContent {
  name: string;
  title: string;
  description?: string;
  fields: FormField[];
  complianceFields?: ComplianceField[]; // ✅ Made optional if compliance fields are not always required
  submitButton: SubmitButton;
  successMessage: Message;
  errorMessage: Message;
  notifications: Notifications;
}
