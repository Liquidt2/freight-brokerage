import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'webhookTemplate',
  title: 'Webhook Template',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Template Name',
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
      name: 'service',
      title: 'Service',
      type: 'string',
      options: {
        list: [
          { title: 'Custom CRM', value: 'custom-crm' },
          { title: 'n8n.io', value: 'n8n' },
          { title: 'Make.com', value: 'make' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'urlTemplate',
      title: 'URL Template',
      type: 'string',
      description: 'URL template with placeholders, e.g., https://n8n.example.com/webhook/{id}'
    }),
    defineField({
      name: 'defaultHeaders',
      title: 'Default Headers',
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
      name: 'defaultAuthType',
      title: 'Default Authentication Type',
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
      name: 'payloadTemplate',
      title: 'Default Payload Template',
      type: 'code',
      options: {
        language: 'json'
      }
    }),
    defineField({
      name: 'instructions',
      title: 'Setup Instructions',
      type: 'array',
      of: [{ type: 'block' }]
    })
  ],
  preview: {
    select: {
      title: 'name',
      service: 'service'
    },
    prepare(selection: Record<string, any>) {
      const { title, service } = selection;
      const serviceIcons: Record<string, string> = {
        'custom-crm': '🏢',
        'n8n': '🔄',
        'make': '⚙️'
      }
      return {
        title,
        subtitle: `${serviceIcons[service as string] || '🔗'} ${service}`
      }
    }
  }
})
