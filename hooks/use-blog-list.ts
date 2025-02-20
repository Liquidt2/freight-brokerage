import { useState, useCallback } from 'react'
import { getClient } from '@/lib/sanity/client'
import { blogListQuery } from '@/lib/sanity/queries'

const POSTS_PER_PAGE = 9

export interface BlogPost {
  title: string
  slug: {
    current: string
  }
  excerpt: string
  featuredImage: any
  author: {
    name: string
    image: any
  }
  categories: Array<{
    title: string
    slug: {
      current: string
    }
  }>
  publishedAt: string
  readTime: number
  visibility: {
    showInLists: boolean
  }
}

interface BlogListResponse {
  posts: BlogPost[]
  total: number
}

export function useBlogList(initialData: BlogListResponse) {
  const [posts, setPosts] = useState<BlogPost[]>(initialData.posts)
  const [total, setTotal] = useState(initialData.total)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validatePost = (post: any): post is BlogPost => {
    const hasRequiredFields = 
      post.title &&
      post.slug?.current &&
      typeof post.excerpt === 'string' &&
      post.author?.name &&
      typeof post.publishedAt === 'string' &&
      typeof post.readTime === 'number';

    if (!hasRequiredFields) {
      console.warn('Post missing required fields:', post);
    }

    return hasRequiredFields;
  };

  const loadMore = useCallback(async () => {
    if (isLoading || posts.length >= total) return;

    try {
      setIsLoading(true)
      setError(null)

      const start = page * POSTS_PER_PAGE
      const end = start + POSTS_PER_PAGE

      let retries = 3
      while (retries > 0) {
        try {
          const client = getClient(false)
          const result = await client.fetch(blogListQuery, { start, end }) as BlogListResponse

          if (!result?.posts) {
            throw new Error('No posts returned from Sanity')
          }

          // Validate posts
          const validPosts = result.posts.filter(validatePost)

          if (validPosts.length === 0) {
            throw new Error('No valid posts found in response')
          }

          setPosts(prevPosts => [...prevPosts, ...validPosts])
          setTotal(result.total)
          setPage(prev => prev + 1)
          return // Success, exit retry loop

        } catch (error) {
          console.error('Failed to fetch more posts:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            retryCount: 3 - retries
          })
          
          retries--
          if (retries === 0) {
            throw error // Let outer catch handle it
          } else {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000))
          }
        }
      }
    } catch (error) {
      setError(
        error instanceof Error 
          ? `Failed to load more posts: ${error.message}`
          : 'Failed to load more posts'
      )
    } finally {
      setIsLoading(false)
    }
  }, [page, posts.length, total, isLoading])

  const hasMore = posts.length < total

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadMore
  }
}
