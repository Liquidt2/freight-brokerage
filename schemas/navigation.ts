import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
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
      name: 'title',
      title: 'Navigation Title',
      type: 'string',
      description: 'Used for internal reference only',
      validation: Rule => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'isActive',
      title: 'Active Navigation',
      type: 'boolean',
      description: 'Only one navigation can be active at a time',
      initialValue: false,
    }),
    defineField({
      name: 'logo',
      title: 'Logo Settings',
      type: 'object',
      initialValue: {
        text: 'FreightFlow Pro',
        showText: true,
        showImage: false,
        imageWidth: 150,
        logoHeight: 75,
        logoWidth: 150,
        showIcon: true
      },
      fields: [
        {
          name: 'text',
          title: 'Logo Text',
          type: 'string',
          description: 'Company name to display in the navigation',
        },
        {
          name: 'showText',
          title: 'Show Logo Text',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'image',
          title: 'Logo Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'showImage',
          title: 'Show Logo Image',
          type: 'boolean',
          initialValue: true,
        },
{
  name: 'imageWidth',
  title: 'Logo Image Width (in pixels)',
  type: 'number',
  initialValue: 150,
  validation: (Rule) => Rule.min(50).max(300),
},
{
  name: 'logoHeight',
  title: 'Logo Height (in pixels)',
  type: 'number',
  initialValue: 75,
  validation: (Rule) => Rule.min(25).max(150),
},
{
  name: 'logoWidth',
  title: 'Logo Width (in pixels)',
  type: 'number',
  initialValue: 150,
  validation: (Rule) => Rule.min(50).max(300),
},
        {
          name: 'showIcon',
          title: 'Show Default Icon',
          type: 'boolean',
          description: 'Whether to show the truck icon when no logo image is present',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Link Text',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'visibility',
              title: 'Visibility Settings',
              type: 'object',
              fields: [
                {
                  name: 'show',
                  title: 'Show Link',
                  type: 'boolean',
                  initialValue: true,
                },
                {
                  name: 'roles',
                  title: 'Visible to Roles',
                  type: 'array',
                  of: [{ type: 'string' }],
                  options: {
                    list: [
                      { title: 'All Users', value: 'all' },
                      { title: 'Authenticated Only', value: 'authenticated' },
                      { title: 'Admin Only', value: 'admin' }
                    ]
                  },
                  initialValue: ['all']
                },
                {
                  name: 'devices',
                  title: 'Show on Devices',
                  type: 'array',
                  of: [{ type: 'string' }],
                  options: {
                    list: [
                      { title: 'Desktop', value: 'desktop' },
                      { title: 'Tablet', value: 'tablet' },
                      { title: 'Mobile', value: 'mobile' }
                    ]
                  },
                  initialValue: ['desktop', 'tablet', 'mobile']
                }
              ]
            },
            {
              name: 'isButton',
              title: 'Show as Button',
              type: 'boolean',
              description: 'Display this item as a button instead of a regular link',
              initialValue: false,
            },
            {
              name: 'buttonVariant',
              title: 'Button Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Default', value: 'default' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Outline', value: 'outline' },
                ],
              },
              hidden: ({ parent }) => !parent?.isButton,
            },
            {
              name: 'submenu',
              title: 'Submenu Items',
              type: 'array',
              of: [
                {
      type: 'object',
      fields: [
                    {
                      name: 'text',
                      title: 'Link Text',
                      type: 'string',
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: 'href',
                      title: 'Link URL',
                      type: 'string',
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: 'visibility',
                      title: 'Visibility Settings',
                      type: 'object',
                      fields: [
                        {
                          name: 'show',
                          title: 'Show Link',
                          type: 'boolean',
                          initialValue: true,
                        },
                        {
                          name: 'roles',
                          title: 'Visible to Roles',
                          type: 'array',
                          of: [{ type: 'string' }],
                          options: {
                            list: [
                              { title: 'All Users', value: 'all' },
                              { title: 'Authenticated Only', value: 'authenticated' },
                              { title: 'Admin Only', value: 'admin' }
                            ]
                          },
                          initialValue: ['all']
                        },
                        {
                          name: 'devices',
                          title: 'Show on Devices',
                          type: 'array',
                          of: [{ type: 'string' }],
                          options: {
                            list: [
                              { title: 'Desktop', value: 'desktop' },
                              { title: 'Tablet', value: 'tablet' },
                              { title: 'Mobile', value: 'mobile' }
                            ]
                          },
                          initialValue: ['desktop', 'tablet', 'mobile']
                        }
                      ]
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'mobileSettings',
      title: 'Mobile Menu Settings',
      type: 'object',
      initialValue: {
        breakpoint: 'lg',
        showSocialLinks: true
      },
      fields: [
        {
          name: 'breakpoint',
          title: 'Mobile Breakpoint',
          type: 'string',
          options: {
            list: [
              { title: 'Small (640px)', value: 'sm' },
              { title: 'Medium (768px)', value: 'md' },
              { title: 'Large (1024px)', value: 'lg' },
            ],
          },
        },
        {
          name: 'showSocialLinks',
          title: 'Show Social Links',
          type: 'boolean',
          description: 'Display social media links in mobile menu',
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      hidden: ({ parent }) => !parent?.mobileSettings?.showSocialLinks,
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
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required(),
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
  ],
  preview: {
    select: {
      title: 'title',
      items: 'menuItems',
      status: 'status',
      isActive: 'isActive'
    },
    prepare({ title, items, status, isActive }) {
      const subtitle = [
        `${items?.length || 0} menu items`,
        status && `[${status}]`,
        isActive ? '✓ Active' : '✗ Inactive'
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
      title: 'Active First',
      name: 'activeFirst',
      by: [
        { field: 'isActive', direction: 'desc' }
      ]
    }
  ]
})
