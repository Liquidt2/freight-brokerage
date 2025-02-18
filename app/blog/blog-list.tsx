"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, User, Clock, ArrowRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { urlFor } from "@/lib/sanity/image"

type BlogPost = {
  slug: string
  title: string
  body: any
  author: {
    name: string
    image?: string
  }
  publishedAt: string
  readTime: number
  categories: { title: string }[]
  mainImage: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  excerpt: string
  industry: string
}

export default function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [subscribing, setSubscribing] = useState(false)

  if (!initialPosts?.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">No Posts Found</h2>
          <p className="text-muted-foreground">Check back later for new content.</p>
        </div>
      </div>
    )
  }

  // Extract unique categories from blog posts
  const categories = ["All", ...Array.from(new Set(initialPosts.map(post => post.industry)))]

  const filteredPosts = selectedCategory === "All"
    ? initialPosts
    : initialPosts.filter(post => post.industry === selectedCategory);

  const featuredPost = initialPosts[0];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubscribing(false)
    // Show success message
    alert("Successfully subscribed to the newsletter!")
  }

  return (
    <div className="space-y-12">
      {/* Featured Post */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-lg overflow-hidden group card-border"
      >
        <Link href={`/blog/${featuredPost.slug}`} className="block">
          <div className="relative h-[400px]">
            {featuredPost.mainImage ? (
                <Image
                  src={urlFor(featuredPost.mainImage).url()}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Truck className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4"
              >
                {featuredPost.industry}
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {featuredPost.author.name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime} min read
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full transition-all duration-300 border-primary/20"
          >
            {category}
          </Button>
        ))}
      </motion.div>

      {/* Blog Posts Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`category-${selectedCategory}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.slice(1).map((post, index) => (
            <motion.article
              key={`post-${index}-${post.slug}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group bg-background rounded-lg overflow-hidden card-border"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="relative h-48 overflow-hidden">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Truck className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {post.industry}
                  </span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center card-border"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Stay Updated with Industry Insights
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Subscribe to our newsletter for the latest logistics news and expert advice
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 flex-grow"
          />
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="whitespace-nowrap rounded-full shadow-md"
            disabled={subscribing}
          >
            {subscribing ? "Subscribing..." : (
              <>
                Subscribe <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </motion.section>
    </div>
  )
}
