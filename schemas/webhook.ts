import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'webhook',
  title: 'Webhook',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'url',
      title: 'Webhook URL',
      type: 'url',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'events',
      title: 'Trigger Events',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Contact Form Submission', value: 'contact-form' },
              { title: 'Quote Request Submission', value: 'quote-form' },
              { title: 'Blog Post Created', value: 'post-created' },
              { title: 'Blog Post Updated', value: 'post-updated' },
              { title: 'Blog Post Published', value: 'post-published' }
            ]
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'headers',
      title: 'HTTP Headers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'key', type: 'string', title: 'Header Name' },
            { name: 'value', type: 'string', title: 'Header Value' }
          ]
        }
      ]
    }),
    defineField({
      name: 'authType',
      title: 'Authentication Type',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Bearer Token', value: 'bearer' },
          { title: 'Basic Auth', value: 'basic' },
          { title: 'API Key', value: 'apikey' }
        ]
      },
      initialValue: 'none'
    }),
    defineField({
      name: 'authToken',
      title: 'Authentication Token',
      type: 'string',
      hidden: ({ document }) => document?.authType !== 'bearer'
    }),
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      hidden: ({ document }) => document?.authType !== 'basic'
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: ({ document }) => document?.authType !== 'basic'
    }),
    defineField({
      name: 'apiKeyName',
      title: 'API Key Name',
      type: 'string',
      hidden: ({ document }) => document?.authType !== 'apikey'
    }),
    defineField({
      name: 'apiKeyValue',
      title: 'API Key Value',
      type: 'string',
      hidden: ({ document }) => document?.authType !== 'apikey'
    }),
    defineField({
      name: 'payloadTemplate',
      title: 'Custom Payload Template (JSON)',
      description: 'Leave empty to use default payload format',
      type: 'code',
      options: {
        language: 'json'
      }
    }),
    defineField({
      name: 'targetService',
      title: 'Target Service',
      type: 'string',
      options: {
        list: [
          { title: 'Custom', value: 'custom' },
          { title: 'n8n.io', value: 'n8n' },
          { title: 'Make.com', value: 'make' }
        ]
      },
      initialValue: 'custom'
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'url',
      enabled: 'enabled'
    },
    prepare(selection: Record<string, any>) {
      const { title, subtitle, enabled } = selection;
      return {
        title,
        subtitle: `${enabled ? '✅' : '❌'} ${subtitle}`,
      }
    }
  }
})
