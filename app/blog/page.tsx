"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "./data"

// Extract unique categories from blog posts
const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [subscribing, setSubscribing] = useState(false)

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

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
        <Link href={`/blog/${blogPosts[0].slug}`} className="block">
          <div className="relative h-[400px]">
            <Image
              src={blogPosts[0].image}
              alt={blogPosts[0].title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4"
              >
                {blogPosts[0].category}
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                {blogPosts[0].title}
              </h2>
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blogPosts[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {blogPosts[0].date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {blogPosts[0].readTime}
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
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group bg-background rounded-lg overflow-hidden card-border"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {post.date}
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