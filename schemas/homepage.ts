import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'features', title: 'Features Section' },
    { name: 'cta', title: 'CTA Section' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'subtitle', type: 'text', title: 'Subtitle' },
        { name: 'backgroundImage', type: 'media', title: 'Background Image' },
        {
          name: 'cta',
          type: 'object',
          title: 'Call to Action',
          fields: [
            { name: 'primaryText', type: 'string', title: 'Primary Button Text' },
            { name: 'primaryLink', type: 'string', title: 'Primary Button Link' },
            { name: 'secondaryText', type: 'string', title: 'Secondary Button Text' },
            { name: 'secondaryLink', type: 'string', title: 'Secondary Button Link' },
          ],
        },
      ],
    }),

    // Features Section
    defineField({
      name: 'features',
      title: 'Features Section',
      type: 'object',
      group: 'features',
      fields: [
        { name: 'title', type: 'string', title: 'Section Title' },
        { name: 'subtitle', type: 'text', title: 'Section Subtitle' },
        {
          name: 'featuresList',
          type: 'array',
          title: 'Features',
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

    // CTA Section
    defineField({
      name: 'cta',
      title: 'CTA Section',
      type: 'object',
      group: 'cta',
      fields: [
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'description', type: 'text', title: 'Description' },
        { name: 'buttonText', type: 'string', title: 'Button Text' },
        { name: 'buttonLink', type: 'string', title: 'Button Link' },
        { name: 'backgroundImage', type: 'media', title: 'Background Image' },
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