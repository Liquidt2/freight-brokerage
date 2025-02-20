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

const quoteEmailTemplate = {
  subject: "New Quote Request from {companyName}",
  sections: [
    {
      title: "CONTACT DETAILS",
      fields: [
        { label: "Company", value: "{companyName}" },
        { label: "Contact", value: "{contactName}" },
        { label: "Email", value: "{email}" },
        { label: "Phone", value: "{phone}" },
        { label: "Address", value: "{companyAddress}, {companyCity}, {companyState} {companyZip}" }
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
        { label: "Hazmat", value: "{isHazmat?Yes - UN: {unNumber}, Class: {hazmatClass}:No}" },
        { label: "Temperature Control", value: "{isTemperatureControlled?Yes - {temperature}°F:No}" },
        { label: "Palletized", value: "{isPalletized?Yes - {palletCount} pallets:No}" },
        { label: "High Value", value: "{isHighValue?Yes - {insuranceInfo}:No}" },
        { label: "Stackable", value: "{isStackable?Yes:No}" },
        { label: "Heavy Haul", value: "{isHeavyHaul?Yes:No}" },
        { label: "Over Dimensional", value: "{isOverDimensional?Yes - {overDimensionalDetails}:No}" },
        { label: "Special Handling", value: "{specialHandling}" }
      ]
    }
  ],
  footer: "Best regards,\nYour Freight System\n\nThis is an automated message. Please do not reply directly."
};

const contactEmailTemplate = {
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
        { label: "SMS Updates", value: "{smsOptIn?Yes:No}" },
        { label: "Terms Accepted", value: "{termsAccepted}" }
      ]
    }
  ],
  footer: "Best regards,\nYour Website System\n\nThis is an automated message. Please do not reply directly."
};

async function updateFormTemplates() {
  try {
    // Get all forms
    const forms = await client.fetch('*[_type == "form"]');
    
    for (const form of forms) {
      const template = form.slug.current === 'request-quote' ? quoteEmailTemplate : contactEmailTemplate;
      
      // Update the form with the new template structure
      await client
        .patch(form._id)
        .set({
          'notifications.emailTemplate': template
        })
        .commit();
      
      console.log(`Updated template for form: ${form.name}`);
    }
    
    console.log('All form templates updated successfully');
  } catch (error) {
    console.error('Error updating form templates:', error);
  }
}

updateFormTemplates();
