import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.type !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video URL',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
  ],
})