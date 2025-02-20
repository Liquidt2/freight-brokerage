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
      _key: 'companyName',
      label: 'Company Name',
      name: 'companyName',
      type: 'text',
      required: true,
      placeholder: 'Enter your company name'
    },
    {
      _key: 'contactName',
      label: 'Contact Name',
      name: 'contactName',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      _key: 'email',
      label: 'Email',
      name: 'email',
      type: 'email',
      required: true,
      placeholder: 'your@email.com'
    },
    {
      _key: 'phone',
      label: 'Phone',
      name: 'phone',
      type: 'tel',
      required: true,
      placeholder: '(555) 123-4567'
    },
    {
      _key: 'companyAddress',
      label: 'Company Address',
      name: 'companyAddress',
      type: 'text',
      required: true,
      placeholder: 'Enter your street address'
    },
    {
      _key: 'companyCity',
      label: 'Company City',
      name: 'companyCity',
      type: 'text',
      required: true,
      placeholder: 'Enter your city'
    },
    {
      _key: 'companyState',
      label: 'Company State',
      name: 'companyState',
      type: 'state',
      required: true,
      placeholder: 'Select your state'
    },
    {
      _key: 'companyZip',
      label: 'Company ZIP',
      name: 'companyZip',
      type: 'zipCode',
      required: true,
      placeholder: 'Enter ZIP code'
    },
    // Origin Information
    {
      _key: 'originCity',
      label: 'Origin City',
      name: 'originCity',
      type: 'text',
      required: true,
      placeholder: 'Enter pickup city'
    },
    {
      _key: 'originState',
      label: 'Origin State',
      name: 'originState',
      type: 'state',
      required: true,
      placeholder: 'Select pickup state'
    },
    {
      _key: 'zipCode',
      label: 'Origin ZIP Code',
      name: 'zipCode',
      type: 'zipCode',
      required: true,
      placeholder: 'Enter pickup ZIP code'
    },
    {
      _key: 'originPickupDate',
      label: 'Pickup Date',
      name: 'originPickupDate',
      type: 'date',
      required: true,
      placeholder: 'Select pickup date'
    },
    // Destination Information
    {
      _key: 'destinationCity',
      label: 'Destination City',
      name: 'destinationCity',
      type: 'text',
      required: true,
      placeholder: 'Enter delivery city'
    },
    {
      _key: 'destinationState',
      label: 'Destination State',
      name: 'destinationState',
      type: 'state',
      required: true,
      placeholder: 'Select delivery state'
    },
    {
      _key: 'destinationZip',
      label: 'Destination ZIP Code',
      name: 'destinationZip',
      type: 'zipCode',
      required: true,
      placeholder: 'Enter delivery ZIP code'
    },
    {
      _key: 'deliveryDate',
      label: 'Delivery Date',
      name: 'deliveryDate',
      type: 'date',
      required: true,
      placeholder: 'Select delivery date'
    },
    // Load Information
    {
      _key: 'truckTrailerType',
      label: 'Truck & Trailer Type',
      name: 'truckTrailerType',
      type: 'truckTrailerType',
      required: true,
      placeholder: 'Select truck & trailer type',
      options: [
        { value: 'Full Truckload', _key: 'ftl' },
        { value: 'Less Than Truckload (LTL)', _key: 'ltl' },
        { value: 'Flatbed', _key: 'flatbed' },
        { value: 'Refrigerated', _key: 'reefer' },
        { value: 'Expedited', _key: 'expedited' },
        { value: 'Other', _key: 'other' }
      ]
    },
    {
      _key: 'commodityType',
      label: 'Commodity Type',
      name: 'commodityType',
      type: 'text',
      required: true,
      placeholder: 'What are you shipping?'
    },
    {
      _key: 'weight',
      label: 'Weight (lbs)',
      name: 'weight',
      type: 'number',
      required: true,
      placeholder: 'Enter weight in pounds'
    },
    {
      _key: 'dimensions',
      label: 'Dimensions',
      name: 'dimensions',
      type: 'text',
      required: true,
      placeholder: 'L x W x H (in inches)'
    },
    {
      _key: 'loadType',
      label: 'Load Type',
      name: 'loadType',
      type: 'select',
      required: true,
      placeholder: 'Select load type',
      options: [
        { value: 'Full Truckload', _key: 'ftl' },
        { value: 'Less Than Truckload', _key: 'ltl' },
        { value: 'Partial Truckload', _key: 'partial' }
      ]
    },
    {
      _key: 'isPalletized',
      label: 'Is the load palletized?',
      name: 'isPalletized',
      type: 'checkbox',
      required: false
    },
    {
      _key: 'palletCount',
      label: 'Number of Pallets',
      name: 'palletCount',
      type: 'number',
      required: false,
      placeholder: 'Enter number of pallets'
    },
    {
      _key: 'isHazmat',
      label: 'Is this a hazmat load?',
      name: 'isHazmat',
      type: 'checkbox',
      required: false
    },
    {
      _key: 'unNumber',
      label: 'UN Number',
      name: 'unNumber',
      type: 'text',
      required: false,
      placeholder: 'Enter UN number'
    },
    {
      _key: 'hazmatClass',
      label: 'Hazmat Class',
      name: 'hazmatClass',
      type: 'text',
      required: false,
      placeholder: 'Enter hazmat class'
    },
    {
      _key: 'isTemperatureControlled',
      label: 'Temperature Controlled?',
      name: 'isTemperatureControlled',
      type: 'checkbox',
      required: false
    },
    {
      _key: 'temperature',
      label: 'Temperature (°F)',
      name: 'temperature',
      type: 'number',
      required: false,
      placeholder: 'Enter required temperature'
    },
    {
      _key: 'loadingMethod',
      label: 'Loading Method',
      name: 'loadingMethod',
      type: 'select',
      required: true,
      placeholder: 'Select loading method',
      options: [
        { value: 'Dock', _key: 'dock' },
        { value: 'Ground', _key: 'ground' },
        { value: 'Forklift', _key: 'forklift' },
        { value: 'Crane', _key: 'crane' },
        { value: 'Other', _key: 'other' }
      ]
    },
    {
      _key: 'specialHandling',
      label: 'Special Handling Requirements',
      name: 'specialHandling',
      type: 'textarea',
      required: false,
      placeholder: 'Enter any special handling instructions'
    },
    {
      _key: 'isStackable',
      label: 'Is the load stackable?',
      name: 'isStackable',
      type: 'checkbox',
      required: false
    },
    {
      _key: 'isHighValue',
      label: 'High Value Shipment?',
      name: 'isHighValue',
      type: 'checkbox',
      required: false
    },
    {
      _key: 'insuranceInfo',
      label: 'Insurance Information',
      name: 'insuranceInfo',
      type: 'textarea',
      required: false,
      placeholder: 'Enter insurance requirements'
    }
  ],
  complianceFields: [
    {
      _key: 'smsOptIn',
      text: 'I agree to receive SMS updates about my shipment',
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
          _key: 'contact',
          title: "CONTACT DETAILS",
          fields: [
            { _key: 'company', label: "Company", value: "{companyName}" },
            { _key: 'contact', label: "Contact", value: "{contactName}" },
            { _key: 'email', label: "Email", value: "{email}" },
            { _key: 'phone', label: "Phone", value: "{phone}" }
          ]
        },
        {
          _key: 'shipment',
          title: "SHIPMENT DETAILS",
          fields: [
            { _key: 'from', label: "From", value: "{originCity}, {originState} {zipCode}" },
            { _key: 'to', label: "To", value: "{destinationCity}, {destinationState} {destinationZip}" },
            { _key: 'pickup', label: "Pickup", value: "{originPickupDate}" },
            { _key: 'delivery', label: "Delivery", value: "{deliveryDate}" }
          ]
        },
        {
          _key: 'load',
          title: "LOAD DETAILS",
          fields: [
            { _key: 'type', label: "Type", value: "{truckTrailerType}" },
            { _key: 'commodity', label: "Commodity", value: "{commodityType}" },
            { _key: 'weight', label: "Weight", value: "{weight} lbs" },
            { _key: 'dimensions', label: "Dimensions", value: "{dimensions}" }
          ]
        },
        {
          _key: 'special',
          title: "SPECIAL REQUIREMENTS",
          fields: [
            { _key: 'hazmat', label: "Hazmat", value: "{isHazmat?UN: {unNumber}, Class: {hazmatClass}}" },
            { _key: 'temp', label: "Temperature Control", value: "{isTemperatureControlled?{temperature}°F}" },
            { _key: 'pallets', label: "Palletized", value: "{isPalletized?{palletCount} pallets}" },
            { _key: 'highValue', label: "High Value", value: "{isHighValue?Yes}" },
            { _key: 'handling', label: "Special Handling", value: "{specialHandling}" }
          ]
        }
      ],
      footer: "Best regards,\nYour Freight System\n\nThis is an automated message. Please do not reply directly."
    }
  }
};

async function updateQuoteForm() {
  try {
    // First find the existing form
    const existingForm = await client.fetch(
      '*[_type == "form" && slug.current == "request-quote"][0]'
    );

    if (!existingForm) {
      console.log('Quote form not found, creating new one...');
      const result = await client.create(quoteForm);
      console.log('Quote form created successfully:', result);
      return;
    }

    // Update the existing form
    const result = await client.patch(existingForm._id)
      .set(quoteForm)
      .commit();

    console.log('Quote form updated successfully:', result);
  } catch (error) {
    console.error('Error updating quote form:', error);
  }
}

updateQuoteForm();
