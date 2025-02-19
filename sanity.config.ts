import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from '@/schemas'
import { apiVersion, dataset, projectId } from '@/lib/env'
import { webhooksPlugin } from '@/lib/sanity/webhooks'
import { deskStructure } from '@/lib/sanity/desk-structure'

// Ensure projectId & dataset exist
if (!projectId || !dataset) {
  console.warn('⚠️ Warning: Missing `projectId` or `dataset`. Check your .env file.')
}

export const studioConfig = defineConfig({
  name: 'freight-brokerage',
  title: 'FreightFlow Pro CMS',
  projectId,
  dataset,
  apiVersion,
  basePath: '/studio',  // ✅ This ensures it mounts at `/studio`
  useCdn: false, // ✅ Ensure fresh API calls
  plugins: [
    deskTool({
      structure: deskStructure
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
    webhooksPlugin
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    productionUrl: async (prev, context) => prev,
  },
  auth: {
    redirectOnSingle: false, // ✅ Ensures login isn't skipped
    mode: 'replace', // ✅ Ensures proper login handling
  }
})
