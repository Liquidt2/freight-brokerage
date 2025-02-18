'use server';

import { getClient } from '@/lib/sanity/client';
import { formQuery } from '@/lib/sanity/queries';
import { FormContent } from '@/app/forms/types';
import nodemailer from 'nodemailer';

interface FormSubmission {
  formId: string;
  data: Record<string, any>;
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
    const form = await client.fetch(formQuery, { slug: formId }) as FormContent | null;

    if (!form) {
      throw new FormSubmissionError('Form configuration not found', 404);
    }

    // 2. Validate required fields
    const missingFields = form.fields
      .filter(field => field.required && !data[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      throw new FormSubmissionError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // 3. Validate compliance fields
    const missingCompliance = (form.complianceFields || [])
      .filter(field => field.required && !data[`compliance_${field.type}`])
      .map(field => field.text);

    if (missingCompliance.length > 0) {
      throw new FormSubmissionError(`Please accept the following: ${missingCompliance.join(', ')}`);
    }

    // 4. Prepare email content using the template
    let emailContent = form.notifications.emailTemplate;
    emailContent = Object.entries(data).reduce((content, [key, value]) => {
      return content.replaceAll(`{${key}}`, String(value));
    }, emailContent);

    // 5. Send email securely
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

const adminEmail = formId === 'contact-us' ? 'contactus@bkelogistics.com' : formId === 'request-quote' ? 'quotes@bkelogistics.com' : undefined; // No default email


    await transporter.sendMail({
      from: `BKE Logistics <${process.env.EMAIL_USER}>`, // Must match auth user
      replyTo: adminEmail, // Replies go to alias
      to: adminEmail,
      subject: `New ${form.name} Submission`,
      text: emailContent,
    });

    // 6. Simulate database storage
    await new Promise(resolve => setTimeout(resolve, 1000));

  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}
