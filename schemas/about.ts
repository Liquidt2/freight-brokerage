import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'mission', title: 'Mission' },
    { name: 'team', title: 'Team' },
    { name: 'history', title: 'History' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Mission Section
    defineField({
      name: 'mission',
      title: 'Mission Section',
      type: 'object',
      group: 'mission',
      fields: [
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'statement', type: 'text', title: 'Mission Statement' },
        {
          name: 'values',
          type: 'array',
          title: 'Core Values',
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
        },
      ],
    }),

    // Team Section
    defineField({
      name: 'team',
      title: 'Team Section',
      type: 'object',
      group: 'team',
      fields: [
        { name: 'title', type: 'string', title: 'Section Title' },
        { name: 'subtitle', type: 'text', title: 'Section Subtitle' },
        {
          name: 'members',
          type: 'array',
          title: 'Team Members',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', type: 'string', title: 'Name' },
                { name: 'role', type: 'string', title: 'Role' },
                { name: 'bio', type: 'text', title: 'Bio' },
                { name: 'image', type: 'media', title: 'Photo' },
                {
                  name: 'social',
                  type: 'object',
                  title: 'Social Links',
                  fields: [
                    { name: 'linkedin', type: 'url', title: 'LinkedIn' },
                    { name: 'twitter', type: 'url', title: 'Twitter' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),

    // History Section
    defineField({
      name: 'history',
      title: 'Company History',
      type: 'object',
      group: 'history',
      fields: [
        { name: 'title', type: 'string', title: 'Section Title' },
        {
          name: 'timeline',
          type: 'array',
          title: 'Timeline',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'year', type: 'string', title: 'Year' },
                { name: 'title', type: 'string', title: 'Title' },
                { name: 'description', type: 'text', title: 'Description' },
                { name: 'image', type: 'media', title: 'Image' },
              ],
            },
          ],
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})