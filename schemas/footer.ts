import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'companyInfo',
      title: 'Company Information',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Company Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'showName',
          title: 'Show Company Name',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'logo',
          title: 'Company Logo',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'showLogo',
          title: 'Show Logo',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'logoWidth',
          title: 'Logo Width (in pixels)',
          type: 'number',
          initialValue: 150,
          validation: (Rule) => Rule.min(50).max(300),
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'showAddress',
          title: 'Show Address',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'showPhone',
          title: 'Show Phone',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'showEmail',
          title: 'Show Email',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'show',
              title: 'Show Link',
              type: 'boolean',
              initialValue: true,
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'links',
      title: 'Footer Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'show',
              title: 'Show Link',
              type: 'boolean',
              initialValue: true,
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showCopyright',
      title: 'Show Copyright',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'companyInfo.name',
    },
  },
})
