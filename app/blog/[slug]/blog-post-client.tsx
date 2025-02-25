"use client"

import { motion } from "framer-motion"
import { Calendar, User, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PortableText, PortableTextComponents } from "@portabletext/react"
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
  readTime: string
  category: string
  featuredImage: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  excerpt: string
}

import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Suspense } from "react"

function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="mb-8">
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error Loading Content</AlertTitle>
      <AlertDescription>
        {error.message || "Failed to load blog post content. Please try again later."}
      </AlertDescription>
    </Alert>
  )
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

  try {
    return (
      <Suspense fallback={<BlogPostSkeleton />}>
        <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2">
        <Button
          variant="ghost"
          asChild
          className="hover:bg-transparent hover:text-primary"
        >
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>

      <div className="relative h-[400px] rounded-lg overflow-hidden mb-8 mt-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        {post.featuredImage?.asset ? (
          <Image
            src={urlFor(post.featuredImage).url()}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-white font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author.name}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">{post.title}</h1>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <PortableText
          value={post.body}
          components={{
            block: {
              h1: ({children}) => <h1 className="text-3xl font-bold mt-10 mb-5">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
              h4: ({children}) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
              normal: ({children}) => <p className="mb-4">{children}</p>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-6">
                  {children}
                </blockquote>
              ),
            },
            list: {
              bullet: ({children}) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
              number: ({children}) => <ol className="list-decimal pl-6 mb-4">{children}</ol>
            },
            listItem: {
              bullet: ({children}) => <li className="mb-2">{children}</li>,
              number: ({children}) => <li className="mb-2">{children}</li>
            },
            marks: {
              strong: ({children}) => <strong>{children}</strong>,
              em: ({children}) => <em>{children}</em>,
              code: ({children}) => (
                <code className="bg-muted px-1.5 py-0.5 rounded">{children}</code>
              ),
              underline: ({children}) => <u>{children}</u>,
              'strike-through': ({children}) => <s>{children}</s>,
              link: ({value, children}) => {
                const target = value?.blank ? '_blank' : undefined
                return (
                  <a
                    href={value?.href}
                    target={target}
                    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                )
              }
            },
            types: {
              image: ({value}) => {
                if (!value?.asset) {
                  return (
                    <div className="my-8 h-[500px] bg-muted flex items-center justify-center rounded-lg">
                      <span className="text-muted-foreground">No image available</span>
                    </div>
                  )
                }
                return (
                  <div className="my-8">
                    <Image
                      src={urlFor(value).url()}
                      alt={value.alt || ''}
                      width={800}
                      height={500}
                      sizes="(max-width: 800px) 100vw, 800px"
                      className="rounded-lg"
                    />
                    {value.caption && (
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {value.caption}
                      </p>
                    )}
                  </div>
                )
              },
              code: ({value}) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
                  <code>{value.code}</code>
                </pre>
              ),
              callout: ({value}: {value: {type: 'info' | 'warning' | 'success' | 'error', content: string}}) => {
                const typeStyles: Record<string, string> = {
                  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900',
                  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900',
                  success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900',
                  error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900'
                }
                return (
                  <div className={`p-4 my-6 border-l-4 rounded ${typeStyles[value.type]}`}>
                    {value.content}
                  </div>
                )
              },
              table: ({value}: {value: {rows: Array<{cells: string[]}>}}) => (
                <div className="my-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <tbody className="divide-y divide-border">
                      {value.rows.map((row: {cells: string[]}, i: number) => (
                        <tr key={i}>
                          {row.cells.map((cell: string, j: number) => (
                            <td key={j} className="px-4 py-2 whitespace-nowrap">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          }}
        />
      </div>
        </motion.article>
      </Suspense>
    )
  } catch (error) {
    return <ErrorDisplay error={error instanceof Error ? error : new Error('An unexpected error occurred')} />
  }
}
