import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from '@/schemas'
import { apiVersion, dataset, projectId } from '@/lib/env'

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
    deskTool(),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput()
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
