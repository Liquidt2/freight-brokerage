import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { apiVersion, dataset, projectId } from './lib/env'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'BKE Logistics CMS',
  apiVersion,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    deskTool(),
    visionTool({
      defaultApiVersion: apiVersion,
    }),
  ],
})