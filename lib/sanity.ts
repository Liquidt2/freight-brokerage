import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
}

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2024-03-17',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
  studioUrl: '/studio',
  // Add timeout configuration
  requestTimeout: 30000, // 30 seconds
  // Add retry configuration
  retry: {
    retries: 3,
    minTimeout: 1000,
    maxTimeout: 8000
  }
}

// Create a configured client for fetching data
export const client = createClient(config)

// Create a preview client with auth token
export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Helper function to choose the correct client
export const getClient = (usePreview = false) => 
  usePreview ? previewClient : client

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Useful type for image sources
export type SanityImageSource = Parameters<typeof urlFor>[0]