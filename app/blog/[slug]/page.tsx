import { blogPosts } from "../data"
import BlogPostClient from "./blog-post-client"

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug)
  return <BlogPostClient post={post} />
}