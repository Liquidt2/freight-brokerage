// Test script to fetch form data directly from Sanity
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wfl1kdmd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_STUDIO_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false, // Disable CDN to ensure fresh data
});

// Form query
const formQuery = `*[_type == "form" && status == "published" && slug.current == $slug][0] {
  _id,
  _type,
  name,
  "slug": slug.current,
  title,
  description,
  fields[] {
    group,
    fields[] {
      _key,
      label,
      type,
      name,
      required,
      hidden,
      showWhen {
        field,
        equals
      },
      options[] {
        _key,
        value
      },
      placeholder,
      validation {
        min,
        max,
        pattern,
        message
      },
      unit
    }
  },
  complianceFields[] {
    _key,
    text,
    type,
    required
  },
  submitButton {
    text,
    loadingText
  },
  successMessage {
    title,
    message
  },
  errorMessage {
    title,
    message
  },
  notifications {
    adminEmail,
    emailTemplate {
      subject,
      sections[] {
        _key,
        title,
        fields[] {
          _key,
          label,
          value
        }
      },
      footer
    }
  },
  "_updatedAt": _updatedAt
}`;

async function fetchForm() {
  try {
    console.log('Fetching form data from Sanity...');
    
    const form = await client.fetch(formQuery, { slug: 'request-quote' });
    
    console.log('Form data fetched successfully:');
    console.log('Form exists:', !!form);
    console.log('Form ID:', form?._id);
    console.log('Form title:', form?.title);
    console.log('Form updated at:', form?._updatedAt);
    console.log('Fields count:', form?.fields?.length);
    console.log('Compliance fields count:', form?.complianceFields?.length);
    
    // Log the first field group and field for debugging
    if (form?.fields && form.fields.length > 0) {
      console.log('First field group:', form.fields[0].group);
      if (form.fields[0].fields && form.fields[0].fields.length > 0) {
        console.log('First field:', form.fields[0].fields[0].label);
      }
    }
    
    // Log the raw form structure (truncated)
    console.log('Raw form structure (truncated):', JSON.stringify(form, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.error('Error fetching form:', error);
  }
}

fetchForm();
