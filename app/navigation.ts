import { getClient } from '@/lib/sanity/client'
import { navigationQuery } from '@/lib/sanity/queries'

export async function getNavigationData(preview: boolean = false) {
  try {
    const client = getClient(preview)
    const navigation = await client.fetch(navigationQuery)

    if (!navigation) {
      console.error('Navigation content not found')
      return null
    }

    return navigation
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return null
  }
}
