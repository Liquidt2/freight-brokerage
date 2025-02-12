import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: "skMbBccnukBQsohz4kO3omP9Dxeqxp3AtyzXk8WL5Jr83UeKHCz34WhAKZgkaSF8yNkr9eqabuSLbpqEaVdL1ubaCYvYVQo9x08h9lDGHYmYH3iPxgqFhokgSI9kybw4xpz5K20GOiAgFEvkatLBnY9NPuGiKYOtrPbl3DPiKyu268XWe3bH",
})