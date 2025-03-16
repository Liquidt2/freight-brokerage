import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Page',
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mission',
      title: 'Mission Statement',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'history',
      title: 'Company History',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Write a narrative of your company\'s history. You can use formatting options like headers, bold text, and bullet points.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'values',
      title: 'Company Values',
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
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Shield', value: 'shield' },
                  { title: 'Users', value: 'users' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Award', value: 'award' },
                  { title: 'Star', value: 'star' },
                  { title: 'Heart', value: 'heart' },
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'team',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'bio',
              title: 'Bio',
              type: 'text',
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                },
              ],
            },
            {
              name: 'socialLinks',
              title: 'Social Links',
              type: 'object',
              fields: [
                {
                  name: 'linkedin',
                  title: 'LinkedIn URL',
                  type: 'url',
                },
                {
                  name: 'twitter',
                  title: 'Twitter URL',
                  type: 'url',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Company Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'issuer',
              title: 'Issuer',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      mission: 'mission',
      status: 'status',
      publishedAt: 'publishedAt'
    },
    prepare({ title, mission, status, publishedAt }) {
      const subtitle = [
        mission?.slice(0, 50) + (mission?.length > 50 ? '...' : ''),
        status && `[${status}]`,
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
    }
  ]
})