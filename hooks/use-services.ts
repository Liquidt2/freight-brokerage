import { useState, useCallback } from 'react'
import { getClient } from '@/lib/sanity/client'
import { servicesListQuery, serviceBySlugQuery } from '@/lib/sanity/queries'

export interface Service {
  title: string
  slug: {
    current: string
  }
  description: string
  icon: string
  features?: {
    title: string
    description: string
    details?: string[]
  }[]
  benefits?: {
    title: string
    description: string
    icon: string
  }[]
  requirements?: {
    title: string
    description: string
    items: string[]
  }[]
  coverage?: {
    areas: string[]
    restrictions?: string
  }
  pricing?: {
    model: string
    details: string
  }
  faqs?: {
    question: string
    answer: string
  }[]
  callToAction?: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
  visibility: {
    showInLists: boolean
    featured: boolean
  }
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    let retries = 3
    while (retries > 0) {
      try {
        setIsLoading(true)
        setError(null)
        
        const client = getClient(false)
        const result = await client.fetch(servicesListQuery)

        if (!result) {
          throw new Error('No services returned from Sanity')
        }

        // Validate required fields
        const validServices = result.filter((service: any) => {
          const hasRequiredFields = 
            service.title && 
            service.slug && 
            service.description && 
            service.icon;
          
          if (!hasRequiredFields) {
            console.warn('Service missing required fields:', service)
          }
          
          return hasRequiredFields
        })

        if (validServices.length === 0) {
          throw new Error('No valid services found')
        }

        setServices(validServices)
        return // Success, exit retry loop
      } catch (error) {
        console.error('Failed to fetch services:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          retryCount: 3 - retries
        })
        
        retries--
        if (retries === 0) {
          setError(
            error instanceof Error 
              ? `Failed to load services: ${error.message}`
              : 'Failed to load services'
          )
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000))
        }
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  const fetchServiceBySlug = useCallback(async (slug: string) => {
    let retries = 3
    while (retries > 0) {
      try {
        setIsLoading(true)
        setError(null)
        
        const client = getClient(false)
        const result = await client.fetch(serviceBySlugQuery, { slug })

        if (result) {
          return result
        } else {
          throw new Error(`Service not found: ${slug}`)
        }
      } catch (error) {
        console.error('Failed to fetch service:', error)
        retries--
        if (retries === 0) {
          throw error // Let the component handle it
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, (3 - retries) * 1000))
        }
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  return {
    services,
    isLoading,
    error,
    fetchServices,
    fetchServiceBySlug
  }
}
