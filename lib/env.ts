export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
// Use SANITY_STUDIO_TOKEN for studio authentication
export const token = process.env.SANITY_STUDIO_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN || '';

if (!projectId || !dataset) {
  throw new Error('Missing required Sanity environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_DATASET`');
}
