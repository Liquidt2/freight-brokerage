import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' }
        ],
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      hidden: ({ document }) => document?.status !== 'published',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Truck', value: 'truck' },
          { title: 'Box', value: 'box' },
          { title: 'Flask', value: 'flask' },
          { title: 'Shield', value: 'shield' },
          { title: 'Globe', value: 'globe' },
          { title: 'Chart', value: 'chart' },
        ],
      },
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: Rule => Rule.required(),
            },
            {
              name: 'details',
              title: 'Details',
              type: 'array',
              of: [{ type: 'string' }],
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Shield', value: 'shield' },
                  { title: 'Clock', value: 'clock' },
                  { title: 'Chart', value: 'chart' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Star', value: 'star' },
                  { title: 'Check', value: 'check' },
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements & Compliance',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'coverage',
      title: 'Service Coverage',
      type: 'object',
      fields: [
        {
          name: 'areas',
          title: 'Coverage Areas',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'restrictions',
          title: 'Restrictions or Limitations',
          type: 'text',
        },
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing Information',
      type: 'object',
      fields: [
        {
          name: 'model',
          title: 'Pricing Model',
          type: 'string',
          options: {
            list: [
              { title: 'Per Mile', value: 'per-mile' },
              { title: 'Per Load', value: 'per-load' },
              { title: 'Custom Quote', value: 'custom' },
            ],
          },
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'factors',
          title: 'Pricing Factors',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'Service FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Text' },
            { name: 'link', type: 'string', title: 'Link' },
          ],
        },
        {
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Text' },
            { name: 'link', type: 'string', title: 'Link' },
          ],
        },
      ],
    }),
    defineField({
      name: 'visibility',
      title: 'Visibility Settings',
      type: 'object',
      fields: [
        {
          name: 'featured',
          title: 'Featured Service',
          type: 'boolean',
          description: 'Show this service in featured sections',
          initialValue: false,
        },
        {
          name: 'showInLists',
          title: 'Show in Service Lists',
          type: 'boolean',
          description: 'Show this service in service listings',
          initialValue: true,
        },
        {
          name: 'showInSearch',
          title: 'Show in Search',
          type: 'boolean',
          description: 'Allow this service to appear in search results',
          initialValue: true,
        },
        {
          name: 'showInNavigation',
          title: 'Show in Navigation',
          type: 'boolean',
          description: 'Include this service in navigation menus',
          initialValue: true,
        },
        {
          name: 'accessLevel',
          title: 'Access Level',
          type: 'string',
          options: {
            list: [
              { title: 'Public', value: 'public' },
              { title: 'Registered Users', value: 'registered' },
              { title: 'Premium Users', value: 'premium' }
            ]
          },
          initialValue: 'public'
        }
      ]
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
      description: 'description',
      status: 'status',
      featured: 'visibility.featured',
      publishedAt: 'publishedAt'
    },
    prepare({ title, description, status, featured, publishedAt }) {
      const subtitle = [
        description?.slice(0, 50) + (description?.length > 50 ? '...' : ''),
        status && `[${status}]`,
        featured && '⭐ Featured',
        publishedAt && `Published: ${new Date(publishedAt).toLocaleDateString()}`
      ].filter(Boolean).join(' - ')
      
      return {
        title,
        subtitle
      }
    },
  },
  orderings: [
    {
      title: 'Status',
      name: 'status',
      by: [
        { field: 'status', direction: 'asc' }
      ]
    },
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'visibility.featured', direction: 'desc' }
      ]
    }
  ]
})
