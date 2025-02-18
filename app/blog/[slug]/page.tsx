import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { singleBlogPostQuery } from '@/lib/sanity/queries'
import BlogPostClient from './blog-post-client'
import Link from 'next/link'

export const revalidate = 0 // Disable caching for now to rule out cache issues

async function getAllSlugs() {
  try {
    const client = getClient()
    const slugs = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`)
    console.log('Successfully fetched slugs:', slugs.length)
    return slugs
  } catch (error) {
    console.error('Error fetching slugs:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

async function getPost(slug: string, preview: boolean) {
  if (!slug || slug === 'null') {
    throw new Error('Invalid slug provided');
  }

  try {
    console.log('Fetching post with config:', {
      preview,
      slug,
      query: singleBlogPostQuery
    })

    const client = getClient(preview)
    const post = await client.fetch(singleBlogPostQuery, { slug })

    if (!post) {
      throw new Error(`Post not found: ${slug}`);
    }

    console.log('Successfully fetched post:', post.title)
    return post
  } catch (error) {
    console.error('Error fetching post:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error // Let Next.js error boundary handle it
  }
}

export async function generateStaticParams() {
  const posts = await getAllSlugs()
  return posts.map((post: { slug: string }) => {
    return { slug: String(post.slug) }
  })
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  if (!params.slug || params.slug === 'null') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Invalid Blog Post URL</h2>
          <p className="text-muted-foreground">The blog post URL is invalid.</p>
          <div className="mt-6">
            <Link href="/blog" className="text-primary hover:underline">
              Return to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  try {
    const preview = draftMode().isEnabled
    const post = await getPost(params.slug, preview)
    return <BlogPostClient post={post} />
  } catch (error) {
    console.error('Failed to render blog post:', error)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow border border-destructive/20">
          <h2 className="text-2xl font-bold mb-2 text-destructive">Error Loading Blog Post</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load blog post content. Please try again later.'}
          </p>
          <div className="mt-6">
            <Link href="/blog" className="text-primary hover:underline">
              Return to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
