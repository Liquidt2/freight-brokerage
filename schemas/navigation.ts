import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Text' },
            { name: 'link', type: 'string', title: 'Link' },
            {
              name: 'dropdown',
              type: 'array',
              title: 'Dropdown Items',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'text', type: 'string', title: 'Text' },
                    { name: 'link', type: 'string', title: 'Link' },
                    { name: 'description', type: 'text', title: 'Description' },
                    { name: 'icon', type: 'string', title: 'Icon' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})