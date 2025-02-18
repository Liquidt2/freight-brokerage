import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { singleBlogPostQuery } from '@/lib/sanity/queries'
import BlogPostClient from './blog-post-client'
import Link from 'next/link'

export const revalidate = 60

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
  // Handle invalid slug
  if (!slug || slug === 'null') {
    return null;
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
      console.error('Post not found:', slug)
      return null;
    }

    console.log('Successfully fetched post:', post.title)
    return post
  } catch (error) {
    console.error('Error fetching post:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return null
  }
}

export async function generateStaticParams() {
  const posts = await getAllSlugs()
  return posts.map((post: { slug: string }) => {
    return { slug: String(post.slug) }
  })
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const preview = draftMode().isEnabled
  const post = await getPost(params.slug, preview)

  if (!post || !params.slug || params.slug === 'null') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Invalid Blog Post</h2>
          <p className="text-muted-foreground">The requested blog post is invalid or could not be found.</p>
          <div className="mt-6">
            <Link href="/blog" className="text-primary hover:underline">
              Return to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <BlogPostClient post={post} />
}
