import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          validation: Rule => Rule.required(),
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

    // Industry Focus Section
    defineField({
      name: 'industryFocus',
      title: 'Industry Focus Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'industries',
          title: 'Industries',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Title' },
                { name: 'description', type: 'text', title: 'Description' },
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Truck', value: 'truck' },
                      { title: 'Box', value: 'box' },
                      { title: 'Flask', value: 'flask' },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),

    // Features Section
    defineField({
      name: 'features',
      title: 'Features Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'featuresList',
          title: 'Features',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Title' },
                { name: 'description', type: 'text', title: 'Description' },
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Truck', value: 'truck' },
                      { title: 'Shield', value: 'shield' },
                      { title: 'Clock', value: 'clock' },
                      { title: 'Globe', value: 'globe' },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),

    // How It Works Section
    defineField({
      name: 'howItWorks',
      title: 'How It Works Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Title' },
                { name: 'description', type: 'text', title: 'Description' },
                { name: 'stepNumber', type: 'number', title: 'Step Number' },
              ],
            },
          ],
        },
      ],
    }),

    // Latest Blog Posts Section
    defineField({
      name: 'blogSection',
      title: 'Blog Posts Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'showLatestPosts',
          title: 'Show Latest Posts',
          type: 'boolean',
          description: 'Enable to automatically display the latest blog posts',
        },
      ],
    }),

    // Testimonials Section
    defineField({
      name: 'testimonials',
      title: 'Testimonials Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'testimonialsList',
          title: 'Testimonials',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'quote', type: 'text', title: 'Quote' },
                { name: 'author', type: 'string', title: 'Author Name' },
                { name: 'company', type: 'string', title: 'Company' },
              ],
            },
          ],
        },
      ],
    }),

    // Map Section
    defineField({
      name: 'mapSection',
      title: 'Map/Coverage Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'coverageAreas',
          title: 'Coverage Areas',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),

    // FAQ Section
    defineField({
      name: 'faq',
      title: 'FAQ Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'questions',
          title: 'Questions',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', type: 'string', title: 'Question' },
                { name: 'answer', type: 'text', title: 'Answer' },
              ],
            },
          ],
        },
      ],
    }),

    // News Section
    defineField({
      name: 'newsSection',
      title: 'News Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
        },
        {
          name: 'newsItems',
          title: 'News Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Title' },
                { name: 'content', type: 'text', title: 'Content' },
                { name: 'date', type: 'date', title: 'Date' },
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
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
        },
      ],
    }),

    // Hidden Sections (created but not displayed)
    defineField({
      name: 'statistics',
      title: 'Statistics Section (Hidden)',
      type: 'object',
      fields: [
        {
          name: 'stats',
          title: 'Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Label' },
                { name: 'value', type: 'string', title: 'Value' },
                { name: 'suffix', type: 'string', title: 'Suffix' },
              ],
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'partners',
      title: 'Partners Section (Hidden)',
      type: 'object',
      fields: [
        {
          name: 'partnersList',
          title: 'Partners',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', type: 'string', title: 'Partner Name' },
                { name: 'description', type: 'text', title: 'Description' },
              ],
            },
          ],
        },
      ],
    }),

    // Section Display Settings
    defineField({
      name: 'sectionSettings',
      title: 'Section Display Settings',
      type: 'object',
      fields: [
        {
          name: 'visibleSections',
          title: 'Visible Sections',
          type: 'array',
          of: [
            {
              type: 'string',
              options: {
                list: [
                  { title: 'Hero', value: 'hero' },
                  { title: 'Industry Focus', value: 'industryFocus' },
                  { title: 'Features', value: 'features' },
                  { title: 'How It Works', value: 'howItWorks' },
                  { title: 'Blog Posts', value: 'blogSection' },
                  { title: 'Testimonials', value: 'testimonials' },
                  { title: 'Map/Coverage', value: 'mapSection' },
                  { title: 'FAQ', value: 'faq' },
                  { title: 'News', value: 'newsSection' },
                  { title: 'CTA', value: 'cta' },
                ],
              },
            },
          ],
        },
        {
          name: 'sectionOrder',
          title: 'Section Order',
          type: 'array',
          of: [
            {
              type: 'string',
              options: {
                list: [
                  { title: 'Hero', value: 'hero' },
                  { title: 'Industry Focus', value: 'industryFocus' },
                  { title: 'Features', value: 'features' },
                  { title: 'How It Works', value: 'howItWorks' },
                  { title: 'Blog Posts', value: 'blogSection' },
                  { title: 'Testimonials', value: 'testimonials' },
                  { title: 'Map/Coverage', value: 'mapSection' },
                  { title: 'FAQ', value: 'faq' },
                  { title: 'News', value: 'newsSection' },
                  { title: 'CTA', value: 'cta' },
                ],
              },
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
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
    },
    prepare({ title }) {
      return {
        title: 'Homepage',
        subtitle: title,
      }
    },
  },
})
