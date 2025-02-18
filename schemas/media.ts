import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media',
  title: 'Media Library',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alternative Text',
      type: 'string',
      description: 'Important for SEO and accessibility',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'asset',
      title: 'Media Asset',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Hero Images', value: 'hero' },
          { title: 'Service Images', value: 'service' },
          { title: 'Blog Images', value: 'blog' },
          { title: 'Team Photos', value: 'team' },
          { title: 'Logos', value: 'logo' },
          { title: 'Icons', value: 'icon' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        {
          name: 'width',
          type: 'number',
          title: 'Width',
        },
        {
          name: 'height',
          type: 'number',
          title: 'Height',
        },
      ],
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size (KB)',
      type: 'number',
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'object',
      fields: [
        {
          name: 'author',
          type: 'string',
          title: 'Author/Creator',
        },
        {
          name: 'source',
          type: 'url',
          title: 'Source URL',
        },
        {
          name: 'license',
          type: 'string',
          title: 'License',
          options: {
            list: [
              { title: 'All Rights Reserved', value: 'all-rights-reserved' },
              { title: 'Creative Commons', value: 'cc' },
              { title: 'Public Domain', value: 'public-domain' },
              { title: 'Purchased License', value: 'purchased' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'optimized',
      title: 'Optimized Versions',
      type: 'object',
      fields: [
        {
          name: 'thumbnail',
          type: 'image',
          title: 'Thumbnail (200x200)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'medium',
          type: 'image',
          title: 'Medium (800x800)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'large',
          type: 'image',
          title: 'Large (1920x1080)',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'asset',
      category: 'category',
    },
    prepare({ title, media, category }) {
      return {
        title,
        subtitle: category ? `Category: ${category}` : 'No category',
        media,
      }
    },
  },
})
