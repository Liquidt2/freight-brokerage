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

  try {
    const { isEnabled: preview } = await draftMode()
    const client = getClient(preview)
    const footer = await client.fetch(footerQuery)

    if (!footer) {
      console.info('No footer content found in Sanity - this is expected when first setting up the CMS')
      return null
    }

    return footer
  } catch (error) {
    console.error('Error fetching footer:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return null
  }
}
