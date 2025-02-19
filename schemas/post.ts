import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string | undefined) => {
          if (!input) return ''
          return input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .slice(0, 96)
        }
      },
      validation: Rule => Rule.required()
        .custom(slug => {
          if (typeof slug === 'undefined') return true
          if (!slug?.current) return true
          const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)
          return isValid ? true : 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
        }),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      validation: Rule => Rule.min(1).unique(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry Focus',
      type: 'string',
      options: {
        list: [
          { title: 'Flatbed Transportation', value: 'flatbed' },
          { title: 'Plastic Industry', value: 'plastic' },
          { title: 'Pharmaceutical Logistics', value: 'pharmaceutical' },
          { title: 'General Freight', value: 'general' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Pending Review', value: 'pending_review' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' }
        ],
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'autoPublish',
      title: 'Auto-Publish',
      type: 'boolean',
      description: 'Enable automatic publishing via n8n workflow',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      hidden: ({ document }) => document?.status !== 'published',
    }),
    defineField({
      name: 'scheduledPublishAt',
      title: 'Schedule Publish',
      type: 'datetime',
      hidden: ({ document }) => document?.status !== 'draft',
      description: 'Set a future date to automatically publish this post',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      validation: Rule => Rule.required().min(10).max(160)
        .warning('Optimal length for SEO is between 50 and 160 characters'),
    }),
    defineField({
      name: 'source',
      title: 'Source URL',
      type: 'url',
      description: 'Original source URL if content is repurposed',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'visibility',
      title: 'Visibility',
      type: 'object',
      fields: [
        {
          name: 'featured',
          title: 'Featured Post',
          type: 'boolean',
          description: 'Show this post in featured sections',
          initialValue: false,
        },
        {
          name: 'showInLists',
          title: 'Show in Post Lists',
          type: 'boolean',
          description: 'Show this post in blog lists and archives',
          initialValue: true,
        },
        {
          name: 'showInSearch',
          title: 'Show in Search',
          type: 'boolean',
          description: 'Allow this post to appear in search results',
          initialValue: true,
        },
        {
          name: 'password',
          title: 'Password Protection',
          type: 'string',
          description: 'Optional: Require a password to view this post',
        }
      ]
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'post' } }],
      validation: Rule => Rule.unique(),
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Text',
          type: 'string',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
      status: 'status',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
      const { author, status, publishedAt } = selection
      const subtitle = [
        author && `by ${author}`,
        status && `[${status}]`,
        publishedAt && `Published: ${new Date(publishedAt).toLocaleDateString()}`
      ].filter(Boolean).join(' - ')
      
      return { ...selection, subtitle }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Status',
      name: 'status',
      by: [
        { field: 'status', direction: 'asc' }
      ]
    }
  ]
})
