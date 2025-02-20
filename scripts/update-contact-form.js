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
      _key: 'name',
      label: 'Name',
      name: 'name',
      type: 'text',
      required: true,
      placeholder: 'John Doe'
    },
    {
      _key: 'email',
      label: 'Email',
      name: 'email',
      type: 'email',
      required: true,
      placeholder: 'john@example.com'
    },
    {
      _key: 'phone',
      label: 'Phone',
      name: 'phone',
      type: 'tel',
      required: false,
      placeholder: '(555) 123-4567'
    },
    {
      _key: 'message',
      label: 'Message',
      name: 'message',
      type: 'textarea',
      required: true,
      placeholder: 'Tell us about your freight needs...'
    }
  ],
  complianceFields: [
    {
      _key: 'smsOptIn',
      text: 'I agree to receive SMS updates',
      type: 'opt-in',
      required: false
    },
    {
      _key: 'termsAccepted',
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
          _key: 'contact',
          title: "CONTACT INFORMATION",
          fields: [
            { _key: 'name', label: "Name", value: "{name}" },
            { _key: 'email', label: "Email", value: "{email}" },
            { _key: 'phone', label: "Phone", value: "{phone}" }
          ]
        },
        {
          _key: 'message',
          title: "MESSAGE",
          fields: [
            { _key: 'content', label: "Content", value: "{message}" }
          ]
        },
        {
          _key: 'preferences',
          title: "PREFERENCES",
          fields: [
            { _key: 'sms', label: "SMS Updates", value: "{smsOptIn}" },
            { _key: 'terms', label: "Terms Accepted", value: "{termsAccepted}" }
          ]
        }
      ],
      footer: "Best regards,\nYour Website System\n\nThis is an automated message. Please do not reply directly."
    }
  }
};

async function updateContactForm() {
  try {
    // First find the existing form
    const existingForm = await client.fetch(
      '*[_type == "form" && slug.current == "contact-us"][0]'
    );

    if (!existingForm) {
      console.log('Contact form not found, creating new one...');
      const result = await client.create(contactForm);
      console.log('Contact form created successfully:', result);
      return;
    }

    // Update the existing form
    const result = await client.patch(existingForm._id)
      .set(contactForm)
      .commit();

    console.log('Contact form updated successfully:', result);
  } catch (error) {
    console.error('Error updating contact form:', error);
  }
}

updateContactForm();
