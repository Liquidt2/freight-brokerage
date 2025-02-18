import { createClient, ClientConfig, ClientPerspective } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { token, projectId, dataset, apiVersion } from '../env'
import { headers } from 'next/headers'

if (!projectId || !dataset) {
  throw new Error('Required environment variables are not set');
}

const clientConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
  perspective: 'published' as ClientPerspective,
  resultSourceMap: false,
  ignoreBrowserTokenWarning: true
}

// Create a client for fetching data
export const client = createClient(clientConfig)

// Helper function to get the client
export const getClient = (preview: boolean = false) => {
  const client = createClient({
    ...clientConfig,
    useCdn: !preview,
  })

  return {
    fetch: async (query: string, params?: any) => {
      try {
        console.log('Sanity request:', {
          projectId,
          dataset,
          apiVersion,
          query,
          params,
          hasToken: !!token,
          preview
        });

        const result = await client.fetch(query, params);
        
        if (!result) {
          console.error('No data returned from Sanity for query:', query);
          throw new Error('No data found');
        }

        console.log('Sanity response:', {
          hasData: !!result,
          type: result ? typeof result : 'null'
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
