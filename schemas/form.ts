import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'form',
  title: 'Forms',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Form Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'name', type: 'string', title: 'Field Name' },
            {
              name: 'type',
              type: 'string',
              title: 'Field Type',
              options: {
                list: [
                  'text',
                  'email',
                  'tel',
                  'textarea',
                  'select',
                  'checkbox',
                  'radio',
                ],
              },
            },
            { name: 'required', type: 'boolean', title: 'Required' },
            {
              name: 'options',
              type: 'array',
              title: 'Options',
              of: [{ type: 'string' }],
              hidden: ({ parent }) => !['select', 'radio'].includes(parent?.type),
            },
            {
              name: 'validation',
              type: 'object',
              title: 'Validation',
              fields: [
                { name: 'pattern', type: 'string', title: 'Pattern' },
                { name: 'message', type: 'string', title: 'Error Message' },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'submitButton',
      title: 'Submit Button',
      type: 'object',
      fields: [
        { name: 'text', type: 'string', title: 'Button Text' },
        { name: 'variant', type: 'string', title: 'Button Variant' },
      ],
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
    }),
  ],
})