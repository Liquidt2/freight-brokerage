// Update form status in Sanity
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wfl1kdmd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

async function updateFormStatus() {
  try {
    // Get all forms
    const forms = await client.fetch(`*[_type == "form"]`);
    
    console.log(`Found ${forms.length} forms`);
    
    for (const form of forms) {
      console.log(`Form: ${form.name}, Current status: ${form.status}`);
      
      // Update form status to published
      await client
        .patch(form._id)
        .set({ status: 'published' })
        .commit();
      
      console.log(`Updated form status to published for: ${form.name}`);
    }
    
    console.log('Form status update completed');
  } catch (error) {
    console.error('Error updating form status:', error.message);
  }
}

updateFormStatus().catch(console.error);
