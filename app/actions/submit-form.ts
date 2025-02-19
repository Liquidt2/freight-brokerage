'use server';

import { getClient } from '@/lib/sanity/client';
import { formQuery } from '@/lib/sanity/queries';
import nodemailer from 'nodemailer';

interface FormSubmission {
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

interface FormConfig {
  fields: FormField[];
  complianceFields?: ComplianceField[];
}

class FormSubmissionError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function submitForm({ formId, data }: FormSubmission): Promise<void> {
  try {
    // 1. Get the form configuration
    const client = getClient();
    const form = await client.fetch(formQuery, { slug: formId }) as FormConfig;

    if (!form) {
      throw new FormSubmissionError('Form configuration not found', 404);
    }

    // 2. Validate required fields
    const missingFields = form.fields
      .filter((field: FormField) => {
        // Skip validation for conditional fields that aren't applicable
        if (field.name === "palletCount" && !data.isPalletized) return false;
        if ((field.name === "unNumber" || field.name === "hazmatClass") && !data.isHazmat) return false;
        if (field.name === "temperature" && !data.isTemperatureControlled) return false;
        if (field.name === "insuranceInfo" && !data.isHighValue) return false;
        
        // Map form field names to data field names
        const fieldMapping: { [key: string]: string } = {
          'email': 'email',
          'phone': 'phone',
          'zipCode': 'zipCode',
          'originPickupDate': 'originPickupDate'
        };
        
        // Use mapped field name if it exists, otherwise use original field name
        const dataFieldName = fieldMapping[field.name] || field.name;
        return field.required && !data[dataFieldName];
      })
      .map((field: FormField) => field.label);

    if (missingFields.length > 0) {
      throw new FormSubmissionError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // 3. Validate conditional fields
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

    // 4. Validate compliance fields
    const missingCompliance = (form.complianceFields || [])
      .filter((field: ComplianceField) => {
        const fieldName = field.type === 'consent' ? 'termsAccepted' : field.type;
        return field.required && !data[fieldName];
      })
      .map((field: ComplianceField) => field.text);

    if (missingCompliance.length > 0) {
      throw new FormSubmissionError(`Please accept the following: ${missingCompliance.join(', ')}`);
    }

    // 5. Format email content
    const emailContent = `
New Quote Request

Company & Contact Information:
----------------------------
Company Name: ${data.companyName}
Contact Name: ${data.contactName}
Email: ${data.email}
Phone: ${data.phone}

Origin Information:
-----------------
City: ${data.originCity}
State: ${data.originState}
ZIP Code: ${data.zipCode}
Pickup Date: ${data.originPickupDate}

Destination Information:
----------------------
City: ${data.destinationCity}
State: ${data.destinationState}
Delivery Date: ${data.deliveryDate}

Load Information:
---------------
Truck & Trailer Type: ${data.truckTrailerType}
Hazardous Material: ${data.hazardousMaterial || 'No'}
Additional Services: ${data.additionalServices || 'None'}

Additional Details:
-----------------
${data.details || 'None provided'}

Compliance:
----------
Terms Accepted: ${data.termsAccepted ? 'Yes' : 'No'}
    `;

    // 6. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587, // Use TLS port
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP Connection Error:', error);
      throw new FormSubmissionError('Failed to connect to email server. Please try again.');
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'quotes@bkelogistics.com',
      replyTo: 'quotes@bkelogistics.com',
      subject: `New Quote Request from ${data.companyName}`,
      text: emailContent,
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    if (error instanceof FormSubmissionError) {
      throw error;
    }
    throw new FormSubmissionError(
      error instanceof Error ? error.message : 'An error occurred while submitting the form'
    );
  }
}
