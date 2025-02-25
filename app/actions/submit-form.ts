'use server';

import { getClient } from '@/lib/sanity/client';
import { formQuery } from '@/lib/sanity/queries';
import { getServerEnv } from '@/lib/env/server';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';

export interface FormSubmission {
  formId: string;
  data: Record<string, any>;
}

interface FormField {
  _key: string;
  name: string;
  label: string;
  required?: boolean;
  type: string;
  showWhen?: {
    field: string;
    equals: string;
  };
}

interface FormFieldGroup {
  group: string;
  fields: FormField[];
}

interface ComplianceField {
  type: string;
  text: string;
  required?: boolean;
}

interface EmailTemplate {
  subject: string;
  sections: {
    title: string;
    fields: {
      label: string;
      value: string;
    }[];
  }[];
  footer?: string;
}

interface FormConfig {
  fields: FormFieldGroup[];
  complianceFields?: ComplianceField[];
  notifications?: {
    adminEmail?: string;
    emailTemplate?: EmailTemplate;
  };
}

class FormSubmissionError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function formatEmailContent(template: EmailTemplate, data: Record<string, any>): { subject: string; text: string } {
  // Log the data for debugging
  console.log('Email template data:', JSON.stringify(data, null, 2));
  
  const formatValue = (value: string): string => {
    return value.replace(/\{(\w+)(?:=([^}]+))?(?:\?([^}]+))?\}/g, (match, field, equalCheck, condition) => {
      console.log(`Formatting field: ${field}, value: ${data[field]}, equalCheck: ${equalCheck}, condition: ${condition}`);
      
      // Handle conditional formatting based on equality check (e.g., {isHazmat=Yes?...})
      if (equalCheck && condition) {
        const [truePart, falsePart = ''] = condition.split(':');
        return data[field] === equalCheck ? truePart : falsePart;
      }
      
      // Handle conditional formatting (e.g., {field?truePart:falsePart})
      if (condition) {
        const [truePart, falsePart = ''] = condition.split(':');
        return data[field] ? truePart : falsePart;
      }
      
      // Handle date fields
      if (field.endsWith('Date')) {
        return data[field] ? new Date(data[field]).toLocaleDateString() : 'N/A';
      }
      
      // Handle boolean fields
      if (typeof data[field] === 'boolean') {
        return data[field] ? 'Yes' : 'No';
      }
      
      // Return the field value or N/A if not found
      return data[field] || 'N/A';
    });
  };

  const subject = formatValue(template.subject);
  
  let content = 'Dear Admin,\n\n';
  
  // Add sections
  template.sections.forEach(section => {
    content += `${section.title}\n${'-'.repeat(section.title.length)}\n`;
    section.fields.forEach(field => {
      const formattedValue = formatValue(field.value);
      if (formattedValue) {
        content += `${field.label}: ${formattedValue}\n`;
      }
    });
    content += '\n';
  });

  // Add footer if present
  if (template.footer) {
    content += `\n${formatValue(template.footer)}`;
  }

  return { subject, text: content.trim() };
}

/**
 * Sends form data to a webhook if configured
 * @param formId The ID of the form being submitted
 * @param data The form data
 */
async function sendToWebhook(formId: string, data: Record<string, any>): Promise<void> {
  const env = getServerEnv();
  const webhookUrl = env.webhook.url;
  const webhookSecret = env.webhook.secret;
  
  // Skip if webhook URL is not configured
  if (!webhookUrl) {
    console.log('Webhook URL not configured, skipping webhook call');
    return;
  }
  
  try {
    console.log(`Sending ${formId} form data to webhook: ${webhookUrl}`);
    
    // Prepare headers with authentication if secret is provided
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (webhookSecret) {
      headers['Authorization'] = `Bearer ${webhookSecret}`;
    }
    
    // Send data to webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        formId,
        data,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook error (${response.status}): ${errorText}`);
    } else {
      console.log(`Webhook call successful: ${response.status}`);
    }
  } catch (error) {
    // Log error but don't throw - we don't want webhook failures to break form submission
    console.error('Error calling webhook:', error);
  }
}

function getDefaultEmailTemplate(formId: string): EmailTemplate {
  if (formId === 'request-quote') {
    return {
      subject: "New Freight Quote Request from {companyName}",
      sections: [
        {
          title: "CONTACT INFORMATION",
          fields: [
            { label: "Company Name", value: "{companyName}" },
            { label: "Contact Name", value: "{contactName}" },
            { label: "Email Address", value: "{email}" },
            { label: "Phone Number", value: "{phone}" },
            { label: "Company Address", value: "{companyAddress}" },
            { label: "City", value: "{companyCity}" },
            { label: "State", value: "{companyState}" },
            { label: "ZIP Code", value: "{companyZip}" }
          ]
        },
        {
          title: "SHIPMENT INFORMATION",
          fields: [
            { label: "Origin", value: "{originCity}, {originState} {zipCode}" },
            { label: "Destination", value: "{destinationCity}, {destinationState} {destinationZip}" },
            { label: "Pickup Date", value: "{originPickupDate}" },
            { label: "Delivery Date", value: "{deliveryDate}" }
          ]
        },
        {
          title: "CARGO DETAILS",
          fields: [
            { label: "Trailer Type", value: "{trailerType}" },
            { label: "Commodity", value: "{commodity}" },
            { label: "Weight (lbs)", value: "{weight}" },
            { label: "Dimensions", value: "{isOversizedLoad=Yes?{oversizedDimensions}:N/A}" }
          ]
        },
        {
          title: "SPECIAL REQUIREMENTS",
          fields: [
            { label: "Hazardous Materials", value: "{isHazmat}" },
            { label: "UN Number", value: "{isHazmat=Yes?{unNumber}:N/A}" },
            { label: "Hazmat Class", value: "{isHazmat=Yes?{hazmatClass}:N/A}" },
            { label: "Temperature Controlled", value: "{isTemperatureControlled}" },
            { label: "Temperature (°F)", value: "{isTemperatureControlled=Yes?{temperature}:N/A}" },
            { label: "Palletized", value: "{isPalletized}" },
            { label: "Pallet Count", value: "{isPalletized=Yes?{palletCount}:N/A}" },
            { label: "Stackable", value: "{isStackable}" },
            { label: "High Value Cargo", value: "{isHighValue}" },
            { label: "Insurance Information", value: "{isHighValue=Yes?{insuranceInfo}:N/A}" },
            { label: "Heavy Load", value: "{isHeavyLoad}" },
            { label: "Heavy Load Weight", value: "{isHeavyLoad=Yes?{heavyLoadWeight}:N/A}" },
            { label: "Oversized Load", value: "{isOversizedLoad}" },
            { label: "Oversized Dimensions", value: "{isOversizedLoad=Yes?{oversizedDimensions}:N/A}" }
          ]
        },
        {
          title: "ADDITIONAL INFORMATION",
          fields: [
            { label: "SMS Updates Requested", value: "{smsOptIn}" },
            { label: "Terms & Conditions Accepted", value: "{termsAccepted}" },
            { label: "Freight Rates Updates Requested", value: "{optIn}" }
          ]
        }
      ],
      footer: "Thank you for your quote request. Our team will review your information and contact you shortly.\n\nBest regards,\nFreight Brokerage Team\n\nThis is an automated message. Please do not reply directly to this email."
    };
  }

  // Contact form template
  if (formId === 'contact-us') {
    return {
      subject: "New Contact Form Submission from {fullName}",
      sections: [
        {
          title: "CONTACT INFORMATION",
          fields: [
            { label: "Full Name", value: "{fullName}" },
            { label: "Email Address", value: "{email}" },
            { label: "Phone Number", value: "{phone}" }
          ]
        },
        {
          title: "MESSAGE DETAILS",
          fields: [
            { label: "Subject", value: "{subject}" },
            { label: "Message", value: "{message}" }
          ]
        },
        {
          title: "COMMUNICATION PREFERENCES",
          fields: [
            { label: "SMS Updates Requested", value: "{smsOptIn}" },
            { label: "Terms & Conditions Accepted", value: "{termsAccepted}" }
          ]
        }
      ],
      footer: "Thank you for contacting us. We will respond to your inquiry as soon as possible.\n\nBest regards,\nFreight Brokerage Team\n\nThis is an automated message. Please do not reply directly to this email."
    };
  }

  // Default template for any other form
  return {
    subject: "New Form Submission",
    sections: [
      {
        title: "FORM DATA",
        fields: [
          { label: "Form ID", value: formId }
        ]
      }
    ],
    footer: "This is an automated message from your website's form submission system.\n\nBest regards,\nFreight Brokerage Team"
  };
}

export async function submitForm(params: FormSubmission): Promise<{ success: boolean; message: string }> {
  const { formId, data } = params;
  
  try {
    // Security headers check
    const headersList = headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';

    // 1. Get environment variables
    const env = getServerEnv();

    // 2. Get the form configuration
    const client = getClient();
    const form = await client.fetch(formQuery, { slug: formId }) as FormConfig;

    if (!form) {
      throw new FormSubmissionError('Form configuration not found', 404);
    }

    // 3. Validate required fields
    const missingFields: string[] = [];
    
    // Iterate through each field group
    form.fields.forEach((group: FormFieldGroup) => {
      group.fields.forEach((field: FormField) => {
        // Skip validation for conditional fields that aren't applicable
        if (field.showWhen) {
          const parentField = field.showWhen.field;
          const requiredValue = field.showWhen.equals;
          if (data[parentField] !== requiredValue) return;
        }
        
        if (field.required && !data[field.name]) {
          missingFields.push(field.label);
        }
      });
    });

    if (missingFields.length > 0) {
      throw new FormSubmissionError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // 4. Validate conditional fields
    const conditionalErrors = [];
    
    if (data.isPalletized === 'Yes' && !data.palletCount) {
      conditionalErrors.push('Pallet count is required for palletized loads');
    }
    if (data.isHazmat === 'Yes' && (!data.unNumber || !data.hazmatClass)) {
      if (!data.unNumber) conditionalErrors.push('UN number is required for hazmat loads');
      if (!data.hazmatClass) conditionalErrors.push('Hazmat classification is required for hazmat loads');
    }
    if (data.isTemperatureControlled === 'Yes' && !data.temperature) {
      conditionalErrors.push('Temperature is required for temperature controlled loads');
    }
    if (data.isHighValue === 'Yes' && !data.insuranceInfo) {
      conditionalErrors.push('Insurance information is required for high-value shipments');
    }
    if (data.isHeavyLoad === 'Yes' && !data.heavyLoadWeight) {
      conditionalErrors.push('Weight is required for heavy loads');
    }
    if (data.isOversizedLoad === 'Yes' && !data.oversizedDimensions) {
      conditionalErrors.push('Dimensions are required for oversized loads');
    }

    if (conditionalErrors.length > 0) {
      throw new FormSubmissionError(conditionalErrors.join('\n'));
    }

    // 5. Validate compliance fields
    const missingCompliance = (form.complianceFields || [])
      .filter((field: ComplianceField) => {
    const fieldName = field.type === 'consent' ? 'termsAccepted' : field.type === 'sms' || field.type === 'opt-in' ? 'smsOptIn' : field.type;
        return field.required && !data[fieldName];
      })
      .map((field: ComplianceField) => field.text);

    if (missingCompliance.length > 0) {
      throw new FormSubmissionError(`Please accept the following: ${missingCompliance.join(', ')}`);
    }

    // 6. Get email template and format content
    const defaultTemplate = getDefaultEmailTemplate(formId);
    const template = form.notifications?.emailTemplate || defaultTemplate;
    const { subject, text } = formatEmailContent(template, data);

    // 7. Create email transporter
    const transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: false,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 8. Verify SMTP connection
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP Connection Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown SMTP error';
      throw new FormSubmissionError(`Failed to connect to email server: ${errorMessage}. Please try again.`, 500);
    }

    // Send data to webhook if configured
    await sendToWebhook(formId, data);

    // Send email notification
    await transporter.sendMail({
      from: env.smtp.user,
      to: form.notifications?.adminEmail || env.smtp.user,
      replyTo: data.email,
      subject,
      text,
    });

    return {
      success: true,
      message: 'Form submitted successfully',
    };

  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Log detailed error information
    const errorDetails = {
      timestamp: new Date().toISOString(),
      formId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));

    if (error instanceof FormSubmissionError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'An error occurred while submitting the form. Please try again.',
    };
  }
}
