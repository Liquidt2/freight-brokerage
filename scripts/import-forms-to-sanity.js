// Import forms from forms.json to Sanity
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wfl1kdmd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_STUDIO_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

// Read forms from forms.json
const formsPath = path.join(__dirname, '../content/forms.json');
const formsData = JSON.parse(fs.readFileSync(formsPath, 'utf8'));

async function importForms() {
  if (!formsData.forms || !Array.isArray(formsData.forms)) {
    console.error('No forms found in forms.json');
    return;
  }

  console.log(`Found ${formsData.forms.length} forms to import`);

  for (const form of formsData.forms) {
    try {
      // Check if form already exists
      const existingForm = await client.fetch(
        `*[_type == "form" && slug.current == $slug][0]`,
        { slug: form.slug }
      );

      if (existingForm) {
        console.log(`Form with slug "${form.slug}" already exists. Updating...`);
        
        // Update existing form
        await client
          .patch(existingForm._id)
          .set({
            status: 'published',
            name: form.name,
            title: form.title,
            description: form.description,
            fields: form.fields.map(group => ({
              _type: 'fieldGroup',
              group: group.group,
              fields: group.fields.map(field => ({
                _type: 'formField',
                _key: field.name,
                label: field.label,
                name: field.name,
                type: field.type,
                placeholder: field.placeholder,
                required: field.required,
                hidden: field.hidden,
                showWhen: field.showWhen,
                options: field.options ? field.options.map(option => ({
                  _type: 'option',
                  _key: option.value || option,
                  value: option.value || option
                })) : undefined,
                validation: field.validation,
                unit: field.unit
              }))
            })),
            complianceFields: form.complianceFields ? form.complianceFields.map((field, index) => ({
              _type: 'complianceField',
              _key: `compliance${index}`,
              text: field.text,
              type: field.type,
              required: field.required
            })) : [],
            submitButton: form.submitButton,
            successMessage: form.successMessage,
            errorMessage: form.errorMessage,
            notifications: form.notifications
          })
          .commit();
        
        console.log(`Updated form: ${form.name}`);
      } else {
        console.log(`Creating new form: ${form.name}`);
        
        // Create new form
        await client.create({
          _type: 'form',
          status: 'published',
          name: form.name,
          slug: {
            _type: 'slug',
            current: form.slug
          },
          title: form.title,
          description: form.description,
          fields: form.fields.map(group => ({
            _type: 'fieldGroup',
            group: group.group,
            fields: group.fields.map(field => ({
              _type: 'formField',
              _key: field.name,
              label: field.label,
              name: field.name,
              type: field.type,
              placeholder: field.placeholder,
              required: field.required,
              hidden: field.hidden,
              showWhen: field.showWhen,
              options: field.options ? field.options.map(option => ({
                _type: 'option',
                _key: option.value || option,
                value: option.value || option
              })) : undefined,
              validation: field.validation,
              unit: field.unit
            }))
          })),
          complianceFields: form.complianceFields ? form.complianceFields.map((field, index) => ({
            _type: 'complianceField',
            _key: `compliance${index}`,
            text: field.text,
            type: field.type,
            required: field.required
          })) : [],
          submitButton: form.submitButton,
          successMessage: form.successMessage,
          errorMessage: form.errorMessage,
          notifications: form.notifications
        });
        
        console.log(`Created form: ${form.name}`);
      }
    } catch (error) {
      console.error(`Error importing form ${form.name}:`, error.message);
    }
  }

  console.log('Form import completed');
}

importForms().catch(console.error);
