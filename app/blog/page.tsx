import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { blogListQuery } from '@/lib/sanity/queries'
import BlogList from '@/app/blog/blog-list'
import { Suspense } from 'react'

export const revalidate = 0

const POSTS_PER_PAGE = 9

async function getPosts(preview: boolean) {
  let retries = 3
  while (retries > 0) {
    try {
      console.log('Fetching posts with config:', {
        preview,
        query: blogListQuery,
        start: 0,
        end: POSTS_PER_PAGE
      })

      const client = getClient(preview)
      const result = await client.fetch(blogListQuery, { start: 0, end: POSTS_PER_PAGE })

      if (!result?.posts) {
        throw new Error('No posts returned from Sanity')
      }

      // Validate required fields
      const validPosts = result.posts.filter((post: any) => {
        const hasRequiredFields = 
          post.title &&
          post.slug?.current &&
          typeof post.excerpt === 'string' &&
          post.author?.name &&
          typeof post.publishedAt === 'string' &&
          typeof post.readTime === 'number';

        if (!hasRequiredFields) {
          console.warn('Post missing required fields:', post)
        }

        return hasRequiredFields
      })

      if (validPosts.length === 0) {
        throw new Error('No valid posts found')
      }

      console.log('Successfully fetched posts:', {
        total: result.posts.length,
        valid: validPosts.length,
        sample: JSON.stringify(validPosts[0]).slice(0, 100) + '...'
      })

      return {
        posts: validPosts,
        total: result.total
      }
    } catch (error) {
      console.error('Error fetching posts:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        retriesLeft: retries - 1
      })
      
      retries--
      if (retries === 0) {
        console.error('All retries failed, returning empty result')
        return { posts: [], total: 0 }
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000))
    }
  }
  return { posts: [], total: 0 }
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(POSTS_PER_PAGE)].map((_, i) => (
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

export default async function BlogPage() {
  const preview = draftMode().isEnabled
  const initialData = await getPosts(preview)

  return (
    <Suspense fallback={<LoadingState />}>
      <BlogList initialData={initialData} />
    </Suspense>
  )
}
