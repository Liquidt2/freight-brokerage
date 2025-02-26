import { createClient, ClientConfig, ClientPerspective } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { token, projectId, dataset, apiVersion } from '../env'

if (!projectId || !dataset) {
  throw new Error('Required environment variables are not set');
}

const isDevelopment = process.env.NODE_ENV === 'development'

const clientConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: !isDevelopment, // Disable CDN in development
  token,
  perspective: 'published' as ClientPerspective,
  resultSourceMap: false,
  ignoreBrowserTokenWarning: true
}

// Create a client for fetching data - using a function to avoid React context issues
const createSanityClient = () => createClient(clientConfig)

// Export a client instance for direct use
export const client = createSanityClient()

// Helper function to get the client
export const getClient = (preview: boolean = false) => {
  const client = createClient({
    ...clientConfig,
    useCdn: false, // Always disable CDN to ensure fresh data
  })

  return {
    useCdn: false, // Expose useCdn property
    fetch: async (query: string, params?: any) => {
      try {
        console.log('Sanity request:', {
          projectId,
          dataset,
          apiVersion,
          query,
          params,
          hasToken: !!token,
          preview,
          isDevelopment
        });

        const result = await client.fetch(query, params);
        
        if (!result) {
          console.error('No data returned from Sanity for query:', {
            query,
            params,
            projectId,
            dataset
          });
          throw new Error('No data found');
        }

        console.log('Sanity response:', {
          hasData: !!result,
          type: result ? typeof result : 'null',
          resultLength: Array.isArray(result) ? result.length : 'not an array',
          sample: result ? JSON.stringify(result).slice(0, 100) + '...' : 'null'
        });

        return result;
      } catch (error) {
        console.error('Sanity error:', {
          error,
          query,
          params,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    }
  }
}

// Set up image builder
const builder = imageUrlBuilder({
  projectId,
  dataset
})

export function urlFor(source: any) {
  return builder.image(source)
}
