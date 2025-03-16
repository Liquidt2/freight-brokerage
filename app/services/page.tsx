import { Suspense } from 'react'
import { getClient } from '@/lib/sanity/client'
import { servicesListQuery } from '@/lib/sanity/queries'
import ServicesContent from './services-content'
import { Service } from '@/hooks/use-services'

async function getServices(): Promise<Service[]> {
  let retries = 3
  while (retries > 0) {
    try {
      console.log('Fetching services...')
      const client = getClient(false)
      const services = await client.fetch(servicesListQuery)

      if (!services) {
        throw new Error('No services returned from Sanity')
      }

      // Validate required fields
      const validServices = services.filter((service: any) => {
        const hasRequiredFields =
          service.title &&
          service.slug &&
          service.description &&
          service.icon

        if (!hasRequiredFields) {
          console.warn('Service missing required fields:', service)
        }

        return hasRequiredFields
      })

      if (validServices.length === 0) {
        throw new Error('No valid services found')
      }

      console.log('Successfully fetched services:', {
        total: services.length,
        valid: validServices.length,
        sample: JSON.stringify(validServices[0]).slice(0, 100) + '...'
      })

      return validServices
    } catch (error) {
      console.error('Error fetching services:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        retriesLeft: retries - 1
      })

      retries--
      if (retries === 0) {
        console.error('All retries failed, returning empty array')
        return []
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000))
    }
  }
  return []
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Changed grid layout to a single column */}
      <div className="grid grid-cols-1 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-48 mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <Suspense fallback={<LoadingState />}>
      <ServicesContent initialServices={services} />
    </Suspense>
  )
}
