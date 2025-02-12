import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO Metadata',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO Title',
      type: 'string',
      validation: Rule => Rule.max(60).warning('Should be under 60 characters'),
    }),
    defineField({
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      validation: Rule => Rule.max(160).warning('Should be under 160 characters'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image for social media sharing',
      options: {
        hotspot: true,
      },
    }),
  ],
})