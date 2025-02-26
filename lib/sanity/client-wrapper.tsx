'use client'

import { createClient, ClientConfig } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityProvider } from './context-wrapper'
import { token, projectId, dataset, apiVersion } from '../env'

// Create a client configuration
const clientConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token,
  perspective: 'published',
  resultSourceMap: false,
  ignoreBrowserTokenWarning: true
}

// Create a client instance
const client = createClient(clientConfig)

// Set up image builder
const builder = imageUrlBuilder({
  projectId,
  dataset
})

export function urlFor(source: any) {
  return builder.image(source)
}

// Client wrapper component
export function SanityClientProvider({ children }: { children: React.ReactNode }) {
  // Create a client value to provide
  const clientValue = {
    client,
    config: clientConfig,
    urlFor
  }

  return (
    <SanityProvider value={clientValue}>
      {children}
    </SanityProvider>
  )
}

// Export a hook to use the client
export function useSanityClient() {
  return client
}
