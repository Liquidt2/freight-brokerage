import { createClient } from '@sanity/client'
import { cache } from 'react'
import { client } from './client'

// Wrap the cached function in a way that makes it callable
export const sanityFetch = cache(client.fetch.bind(client))
