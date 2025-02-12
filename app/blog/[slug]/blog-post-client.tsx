"use client"

import { motion } from "framer-motion"
import { Calendar, User, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

type BlogPost = {
  slug: string
  title: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
}

export default function BlogPostClient({ post }: { post: BlogPost | undefined }) {
  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Button
        variant="ghost"
        asChild
        className="mb-8 hover:bg-transparent hover:text-primary"
      >
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </Button>

      <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-white font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">{post.title}</h1>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </motion.article>
  )
}