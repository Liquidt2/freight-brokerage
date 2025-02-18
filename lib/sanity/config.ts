import { ClientConfig } from 'next-sanity';
import { apiVersion, dataset, projectId, token } from '../env';

if (!projectId || !dataset) {
  throw new Error('Required environment variables are not set');
}

// Main Sanity Client Configuration
export const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // ✅ Enable CDN only in production
};

// Private API Token Configuration (Only for server-side use)
export const sanityTokenConfig: ClientConfig = token
  ? {
      ...config,
      token, // Only include token if available
      useCdn: false, // Avoid stale data when using API token
    }
  : { ...config, useCdn: true }; // Ensure useCdn is correctly set in case of no token

// Sanity API Endpoints
export const apiEndpoints = {
  api: projectId ? `https://${projectId}.api.sanity.io` : '',
  cdn: projectId ? `https://${projectId}.apicdn.sanity.io` : '',
};

// Common options for queries
export const queryConfig = {
  next: { revalidate: 60 },
};
