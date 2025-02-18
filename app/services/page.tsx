import { getClient } from '@/lib/sanity/client'
import { servicesQuery } from '@/lib/sanity/queries'
import { ServiceContent } from './types'
import ServicesContent from './services-content'

async function getServices(): Promise<ServiceContent[]> {
  try {
    // For now, we'll always use the published content since we'll handle preview in the client
    const client = getClient(false)
    const services = await client.fetch(servicesQuery, {})

    if (!services) {
      console.error('No services returned from Sanity')
      throw new Error('No services returned')
    }

    return services
  } catch (error) {
    console.error('Error fetching services:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

export default async function ServicesPage() {
  const services = await getServices()
  return <ServicesContent services={services} />
}
