'use server';

import { getClient } from '@/lib/sanity/client';
import { formQuery } from '@/lib/sanity/queries';
import { getServerEnv } from '@/lib/env/server';
import nodemailer from 'nodemailer';

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
  fields: FormField[];
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
  const formatValue = (value: string): string => {
    return value.replace(/\{(\w+)(?:\?([^}]+))?\}/g, (match, field, condition) => {
      if (condition) {
        const [truePart, falsePart = ''] = condition.split(':');
        return data[field] ? truePart : falsePart;
      }
      if (field.endsWith('Date')) {
        return data[field] ? new Date(data[field]).toLocaleDateString() : 'N/A';
      }
      if (typeof data[field] === 'boolean') {
        return data[field] ? 'Yes' : 'No';
      }
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

function getDefaultEmailTemplate(formId: string): EmailTemplate {
  if (formId === 'request-quote') {
    return {
      subject: "New Quote Request from {companyName}",
      sections: [
        {
          title: "CONTACT DETAILS",
          fields: [
            { label: "Company", value: "{companyName}" },
            { label: "Contact", value: "{contactName}" },
            { label: "Email", value: "{email}" },
            { label: "Phone", value: "{phone}" }
          ]
        },
        {
          title: "SHIPMENT DETAILS",
          fields: [
            { label: "From", value: "{originCity}, {originState} {zipCode}" },
            { label: "To", value: "{destinationCity}, {destinationState} {destinationZip}" },
            { label: "Pickup", value: "{originPickupDate}" },
            { label: "Delivery", value: "{deliveryDate}" }
          ]
        },
        {
          title: "LOAD DETAILS",
          fields: [
            { label: "Type", value: "{truckTrailerType}" },
            { label: "Commodity", value: "{commodityType}" },
            { label: "Weight", value: "{weight} lbs" },
            { label: "Dimensions", value: "{dimensions}" }
          ]
        },
        {
          title: "SPECIAL REQUIREMENTS",
          fields: [
            { label: "Hazmat", value: "{isHazmat?UN: {unNumber}, Class: {hazmatClass}}" },
            { label: "Temperature Control", value: "{isTemperatureControlled?{temperature}°F}" },
            { label: "Palletized", value: "{isPalletized?{palletCount} pallets}" },
            { label: "High Value", value: "{isHighValue?Yes}" },
            { label: "Special Handling", value: "{specialHandling}" }
          ]
        }
      ],
      footer: "Best regards,\nYour Freight System\n\nThis is an automated message. Please do not reply directly."
    };
  }

  // Default contact form template
  return {
    subject: "New Contact Form Message from {name}",
    sections: [
      {
        title: "CONTACT INFORMATION",
        fields: [
          { label: "Name", value: "{name}" },
          { label: "Email", value: "{email}" },
          { label: "Phone", value: "{phone}" }
        ]
      },
      {
        title: "MESSAGE",
        fields: [
          { label: "Content", value: "{message}" }
        ]
      },
      {
        title: "PREFERENCES",
        fields: [
          { label: "SMS Updates", value: "{smsOptIn}" },
          { label: "Terms Accepted", value: "{termsAccepted}" }
        ]
      }
    ],
    footer: "Best regards,\nYour Website System\n\nThis is an automated message. Please do not reply directly."
  };
}

export async function submitForm(params: FormSubmission): Promise<void> {
  const { formId, data } = params;
  try {
    // 1. Get environment variables
    const env = getServerEnv();

    // 2. Get the form configuration
    const client = getClient();
    const form = await client.fetch(formQuery, { slug: formId }) as FormConfig;

    if (!form) {
      throw new FormSubmissionError('Form configuration not found', 404);
    }

    // 3. Validate required fields
    const missingFields = form.fields
      .filter((field: FormField) => {
        // Skip validation for conditional fields that aren't applicable
        if (field.name === "palletCount" && !data.isPalletized) return false;
        if ((field.name === "unNumber" || field.name === "hazmatClass") && !data.isHazmat) return false;
        if (field.name === "temperature" && !data.isTemperatureControlled) return false;
        if (field.name === "insuranceInfo" && !data.isHighValue) return false;
        
        return field.required && !data[field.name];
      })
      .map((field: FormField) => field.label);

    if (missingFields.length > 0) {
      throw new FormSubmissionError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // 4. Validate conditional fields
    const conditionalErrors = [];
    
    if (data.isPalletized && !data.palletCount) {
      conditionalErrors.push('Pallet count is required for palletized loads');
    }
    if (data.isHazmat && (!data.unNumber || !data.hazmatClass)) {
      if (!data.unNumber) conditionalErrors.push('UN number is required for hazmat loads');
      if (!data.hazmatClass) conditionalErrors.push('Hazmat classification is required for hazmat loads');
    }
    if (data.isTemperatureControlled && !data.temperature) {
      conditionalErrors.push('Temperature is required for temperature controlled loads');
    }
    if (data.isHighValue && !data.insuranceInfo) {
      conditionalErrors.push('Insurance information is required for high-value shipments');
    }

    if (conditionalErrors.length > 0) {
      throw new FormSubmissionError(conditionalErrors.join('\n'));
    }

    // 5. Validate compliance fields
    const missingCompliance = (form.complianceFields || [])
      .filter((field: ComplianceField) => {
        const fieldName = field.type === 'consent' ? 'termsAccepted' : field.type === 'opt-in' ? 'smsOptIn' : field.type;
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

    // 9. Send email
    await transporter.sendMail({
      from: env.smtp.user,
      to: form.notifications?.adminEmail || env.smtp.user,
      replyTo: data.email,
      subject,
      text,
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    if (error instanceof FormSubmissionError) {
      throw error;
    }
    throw new FormSubmissionError(
      error instanceof Error ? error.message : 'An error occurred while submitting the form',
      error instanceof FormSubmissionError ? error.statusCode : 500
    );
  }
}
