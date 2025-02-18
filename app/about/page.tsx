import { getClient } from '@/lib/sanity/client'
import { aboutQuery } from '@/lib/sanity/queries'
import { AboutContent } from './types'
import AboutContentUI from './about-content'

async function getAboutContent(): Promise<AboutContent | null> {
  try {
    // For now, we'll always use the published content since we'll handle preview in the client
    const client = getClient(false)
    const about = await client.fetch(aboutQuery, {})

    if (!about) {
      console.error('No about content returned from Sanity')
      throw new Error('No about content returned')
    }

    return about
  } catch (error) {
    console.error('Error fetching about content:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return null
  }
}

export default async function AboutPage() {
  const about = await getAboutContent()

  if (!about) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
          <p className="text-muted-foreground">Please add content in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  return <AboutContentUI about={about} />
}
