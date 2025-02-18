import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '@/schemas';
import { apiVersion, dataset, projectId } from '../env';

// Check for missing environment variables (without breaking execution)
if (!projectId || !dataset) {
  console.warn('⚠️ Warning: Missing `projectId` or `dataset`. Check your .env file.');
}

// Define Sanity Studio Configuration
export const studioConfig = defineConfig({
  name: 'freight-brokerage',
  title: 'FreightFlow Pro CMS',
  projectId: projectId || 'wfl1kdmd', // Prevent errors
  dataset: dataset || 'production', // Fallback to 'production' if missing
  apiVersion,
  basePath: '/studio',
  plugins: [
    deskTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    productionUrl: async (prev, context) => prev, // Return as Promise
  },
});
