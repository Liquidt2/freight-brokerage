import { draftMode, headers } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { footerQuery } from '@/lib/sanity/queries'
import { FooterContent } from '@/components/types'

async function isStudioRoute(): Promise<boolean> {
  try {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    return pathname.startsWith('/studio')
  } catch {
    return false
  }
}

export async function getFooterData(): Promise<FooterContent | null> {
  // Skip footer data fetching for studio route
  if (await isStudioRoute()) {
    return null
  }

  let retries = 3
  while (retries > 0) {
    try {
      const { isEnabled: preview } = await draftMode()
      const client = getClient(preview)
      const footer = await client.fetch(footerQuery)

      if (!footer) {
        throw new Error('No footer content found in Sanity')
      }

      // Validate required fields
      const hasRequiredFields = 
        footer.companyInfo &&
        typeof footer.companyInfo.name === 'string' &&
        typeof footer.companyInfo.showName === 'boolean';

      if (!hasRequiredFields) {
        console.warn('Footer missing required fields:', footer)
        throw new Error('Footer data is missing required fields')
      }

      // Validate social links if present
      if (footer.socialLinks) {
        footer.socialLinks = footer.socialLinks.filter((link: FooterContent['socialLinks'][0]) => {
          const isValid = 
            ['linkedin', 'twitter', 'facebook', 'instagram'].includes(link.platform) &&
            typeof link.url === 'string' &&
            typeof link.show === 'boolean';
          
          if (!isValid) {
            console.warn('Invalid social link:', link)
          }
          
          return isValid
        })
      }

      console.log('Successfully fetched footer:', {
        hasCompanyInfo: !!footer.companyInfo,
        socialLinksCount: footer.socialLinks?.length || 0,
        hasCopyright: !!footer.copyright
      })

      return footer
    } catch (error) {
      console.error('Error fetching footer:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        retriesLeft: retries - 1
      })
      
      retries--
      if (retries === 0) {
        console.error('All retries failed, returning null')
        return null
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000))
    }
  }
  return null
}
