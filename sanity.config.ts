import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from '@/schemas'
import { apiVersion, dataset, projectId } from '@/lib/env'
import { webhooksPlugin } from '@/lib/sanity/webhooks'
import { deskStructure } from '@/lib/sanity/desk-structure'
import { importWebhookTemplates } from '@/lib/sanity/import-templates'

// Ensure projectId & dataset exist
if (!projectId || !dataset) {
  console.warn('⚠️ Warning: Missing `projectId` or `dataset`. Check your .env file.')
}

// Initialize webhook templates when in browser environment
if (typeof window !== 'undefined') {
  setTimeout(() => {
    importWebhookTemplates().catch(console.error)
  }, 2000)
}

export default defineConfig({
  name: 'freight-brokerage',
  title: 'BKE Logistics, LLC CMS',
  projectId,
  dataset,
  apiVersion,
  basePath: '/studio',
  useCdn: false,

  // Remove custom auth block to let Sanity handle login defaults
  // This prevents the login URL from being undefined
  // auth: {
  //   redirectOnSingle: false,
  //   mode: 'replace',
  //   loginUrl: '/studio/login',
  //   requireLogin: true,
  //   providers: [
  //     { name: 'sanity-login', title: 'Email / Password' }
  //   ]
  // },

  cors: {
    credentials: 'include',
    allowedOrigins: ['https://bkelogistics.com']
  },

  acl: {
    read: ['authenticated'],
    write: ['authenticated'],
    default: false
  },

  plugins: [
    deskTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion, requireLogin: true }),
    codeInput(),
    webhooksPlugin
  ],

  schema: {
    types: schemaTypes
  },

  document: {
    productionUrl: async (prev) => prev,
    actions: (prev, context) =>
      prev.filter(action => context.currentUser ? true : action.type !== 'delete')
  },

  studio: {},

  session: {
    tokenExpiration: 86400,
    requireLogin: true
  }
})
