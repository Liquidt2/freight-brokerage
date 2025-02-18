import { getClient } from '@/lib/sanity/client'
import { navigationQuery } from '@/lib/sanity/queries'
import { unstable_cache } from 'next/cache'

// Cache navigation data for 1 hour by default
const CACHE_DURATION = 60 * 60

export async function getNavigationData(preview: boolean = false) {
  const getCachedNavigation = unstable_cache(
    async () => {
      try {
        const client = getClient(preview)
        const navigation = await client.fetch(navigationQuery)

        if (!navigation) {
          throw new Error('Navigation content not found')
        }

        return navigation
      } catch (error) {
        console.error('Error fetching navigation:', error)
        // Return a minimal fallback navigation to prevent complete UI failure
        return {
          menuItems: [
            { text: 'Home', href: '/', show: true },
            { text: 'About', href: '/about', show: true },
            { text: 'Contact', href: '/contact', show: true },
          ],
          logo: {
            showIcon: true,
            showText: true,
            text: 'FreightFlow Pro'
          }
        }
      }
    },
    ['navigation-data'],
    {
      revalidate: CACHE_DURATION,
      tags: ['navigation']
    }
  )

  return getCachedNavigation()
}

// Function to force revalidate navigation cache
export async function revalidateNavigation() {
  try {
    await fetch('/api/revalidate?tag=navigation')
    return true
  } catch (error) {
    console.error('Failed to revalidate navigation:', error)
    return false
  }
}
