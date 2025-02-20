import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-17',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

const contactForm = {
  _type: 'form',
  status: 'published',
  name: 'Contact Form',
  slug: {
    _type: 'slug',
    current: 'contact-us'
  },
  title: 'Contact Us',
  description: 'Get in touch with us. We\'d love to hear from you.',
  fields: [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      required: true
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      required: true
    },
    {
      label: 'Phone',
      name: 'phone',
      type: 'tel',
      required: false
    },
    {
      label: 'Message',
      name: 'message',
      type: 'textarea',
      required: true
    }
  ],
  complianceFields: [
    {
      text: 'I agree to receive SMS updates',
      type: 'opt-in',
      required: false
    },
    {
      text: 'I agree to the terms and conditions',
      type: 'consent',
      required: true
    }
  ],
  submitButton: {
    text: 'Send Message',
    loadingText: 'Sending...'
  },
  successMessage: {
    title: 'Message Sent!',
    message: 'Thank you for your message. We will get back to you shortly.'
  },
  errorMessage: {
    title: 'Error',
    message: 'There was an error sending your message. Please try again or contact us directly.'
  },
  notifications: {
    emailTemplate: {
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
    }
  }
};

async function createContactForm() {
  try {
    const result = await client.create(contactForm);
    console.log('Contact form created successfully:', result);
  } catch (error) {
    console.error('Error creating contact form:', error);
  }
}

createContactForm();
