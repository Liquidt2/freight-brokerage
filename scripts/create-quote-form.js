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

const quoteForm = {
  _type: 'form',
  status: 'published',
  name: 'Request Quote Form',
  slug: {
    _type: 'slug',
    current: 'request-quote'
  },
  title: 'Request a Quote',
  description: 'Fill out the form below to get a quote for your freight shipping needs.',
  fields: [
    // Company & Contact Information
    {
      label: 'Company Name',
      name: 'companyName',
      type: 'text',
      required: true
    },
    {
      label: 'Contact Name',
      name: 'contactName',
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
      required: true
    },
    {
      label: 'Company Address',
      name: 'companyAddress',
      type: 'text',
      required: true
    },
    {
      label: 'Company City',
      name: 'companyCity',
      type: 'text',
      required: true
    },
    {
      label: 'Company State',
      name: 'companyState',
      type: 'state',
      required: true
    },
    {
      label: 'Company ZIP',
      name: 'companyZip',
      type: 'zipCode',
      required: true
    },
    // Origin Information
    {
      label: 'Origin City',
      name: 'originCity',
      type: 'text',
      required: true
    },
    {
      label: 'Origin State',
      name: 'originState',
      type: 'state',
      required: true
    },
    {
      label: 'Origin ZIP Code',
      name: 'zipCode',
      type: 'zipCode',
      required: true
    },
    {
      label: 'Pickup Date',
      name: 'originPickupDate',
      type: 'date',
      required: true
    },
    // Destination Information
    {
      label: 'Destination City',
      name: 'destinationCity',
      type: 'text',
      required: true
    },
    {
      label: 'Destination State',
      name: 'destinationState',
      type: 'state',
      required: true
    },
    {
      label: 'Destination ZIP Code',
      name: 'destinationZip',
      type: 'zipCode',
      required: true
    },
    {
      label: 'Delivery Date',
      name: 'deliveryDate',
      type: 'date',
      required: true
    },
    // Load Information
    {
      label: 'Truck & Trailer Type',
      name: 'truckTrailerType',
      type: 'truckTrailerType',
      required: true
    },
    {
      label: 'Commodity Type',
      name: 'commodityType',
      type: 'text',
      required: true
    },
    {
      label: 'Weight (lbs)',
      name: 'weight',
      type: 'number',
      required: true
    },
    {
      label: 'Dimensions',
      name: 'dimensions',
      type: 'text',
      required: true
    },
    {
      label: 'Load Type',
      name: 'loadType',
      type: 'select',
      required: true,
      options: [
        { value: 'Full Truckload' },
        { value: 'Less Than Truckload' },
        { value: 'Partial Truckload' }
      ]
    },
    {
      label: 'Is the load palletized?',
      name: 'isPalletized',
      type: 'checkbox',
      required: false
    },
    {
      label: 'Number of Pallets',
      name: 'palletCount',
      type: 'number',
      required: false
    },
    {
      label: 'Is this a hazmat load?',
      name: 'isHazmat',
      type: 'checkbox',
      required: false
    },
    {
      label: 'UN Number',
      name: 'unNumber',
      type: 'text',
      required: false
    },
    {
      label: 'Hazmat Class',
      name: 'hazmatClass',
      type: 'text',
      required: false
    },
    {
      label: 'Temperature Controlled?',
      name: 'isTemperatureControlled',
      type: 'checkbox',
      required: false
    },
    {
      label: 'Temperature (°F)',
      name: 'temperature',
      type: 'number',
      required: false
    },
    {
      label: 'Loading Method',
      name: 'loadingMethod',
      type: 'select',
      required: true,
      options: [
        { value: 'Dock' },
        { value: 'Ground' },
        { value: 'Forklift' },
        { value: 'Crane' },
        { value: 'Other' }
      ]
    },
    {
      label: 'Special Handling Requirements',
      name: 'specialHandling',
      type: 'textarea',
      required: false
    },
    {
      label: 'Is the load stackable?',
      name: 'isStackable',
      type: 'checkbox',
      required: false
    },
    {
      label: 'High Value Shipment?',
      name: 'isHighValue',
      type: 'checkbox',
      required: false
    },
    {
      label: 'Insurance Information',
      name: 'insuranceInfo',
      type: 'textarea',
      required: false
    }
  ],
  complianceFields: [
    {
      text: 'I agree to receive SMS updates about my shipment',
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
    text: 'Submit Quote Request',
    loadingText: 'Submitting...'
  },
  successMessage: {
    title: 'Quote Request Submitted!',
    message: 'Thank you for your quote request. Our team will review your information and get back to you shortly.'
  },
  errorMessage: {
    title: 'Error',
    message: 'There was an error submitting your quote request. Please try again or contact us directly.'
  },
  notifications: {
    emailTemplate: {
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
    }
  }
};

async function createQuoteForm() {
  try {
    const result = await client.create(quoteForm);
    console.log('Quote form created successfully:', result);
  } catch (error) {
    console.error('Error creating quote form:', error);
  }
}

createQuoteForm();
