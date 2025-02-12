import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'media',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'columns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Column Title' },
            {
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'text', type: 'string', title: 'Text' },
                    { name: 'url', type: 'string', title: 'URL' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'twitter', type: 'url', title: 'Twitter' },
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'address', type: 'text', title: 'Address' },
      ],
    }),
    defineField({
      name: 'legal',
      title: 'Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Text' },
            { name: 'url', type: 'string', title: 'URL' },
          ],
        },
      ],
    }),
  ],
})