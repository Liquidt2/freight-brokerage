import { client } from './client';
import n8nTemplate from '@/schemas/templates/n8n-template.json';
import makeTemplate from '@/schemas/templates/make-template.json';
import customCrmTemplate from '@/schemas/templates/custom-crm-template.json';

/**
 * Imports webhook templates into Sanity if they don't already exist
 */
export async function importWebhookTemplates() {
  try {
    console.log('Checking for existing webhook templates...');
    
    // Check for existing templates
    const existingTemplates = await client.fetch(`
      *[_type == "webhookTemplate"] {
        _id,
        name,
        service
      }
    `);
    
    const templates = [
      { template: n8nTemplate, id: 'n8n-template' },
      { template: makeTemplate, id: 'make-template' },
      { template: customCrmTemplate, id: 'custom-crm-template' }
    ];
    
    for (const { template, id } of templates) {
      // Check if this template already exists
      const exists = existingTemplates.some(
        (t: any) => t.service === template.service
      );
      
      if (!exists) {
        console.log(`Importing template: ${template.name}`);
        
        // Create the template document
        const { _type, ...templateData } = template;
        await client.createIfNotExists({
          _id: id,
          _type: 'webhookTemplate',
          ...templateData
        });
        
        console.log(`Template imported: ${template.name}`);
      } else {
        console.log(`Template already exists: ${template.name}`);
      }
    }
    
    console.log('Webhook templates import completed');
  } catch (error) {
    console.error('Error importing webhook templates:', error);
  }
}
