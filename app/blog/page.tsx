import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { blogPostsQuery } from '@/lib/sanity/queries'
import BlogList from '@/app/blog/blog-list'

export const revalidate = 0

async function getPosts(preview: boolean) {
  try {
    console.log('Fetching posts with config:', {
      preview,
      query: blogPostsQuery
    })

    const client = getClient(preview)
    const posts = await client.fetch(blogPostsQuery)

    if (!posts) {
      console.error('No posts returned from Sanity')
      throw new Error('No posts returned')
    }

    console.log('Successfully fetched posts:', posts.length)
    return posts
  } catch (error) {
    console.error('Error fetching posts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

export default async function BlogPage() {
  const preview = draftMode().isEnabled
  const posts = await getPosts(preview)

  if (!posts?.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">No Posts Found</h2>
          <p className="text-muted-foreground">Check back later for new content.</p>
        </div>
      </div>
    )
  }

  return <BlogList initialPosts={posts} />
}
