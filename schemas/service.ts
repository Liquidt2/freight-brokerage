import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Services',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'pricing', title: 'Pricing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name',
      group: 'content',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      validation: Rule => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }, { type: 'media' }],
      group: 'content',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'icon', type: 'string', title: 'Icon' },
          ],
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Plan Name' },
            { name: 'price', type: 'number', title: 'Price' },
            { name: 'interval', type: 'string', title: 'Interval' },
            {
              name: 'features',
              type: 'array',
              title: 'Features',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
      group: 'pricing',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})