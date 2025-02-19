import { defineField, defineType } from 'sanity'
import { PlugIcon } from '@sanity/icons'

export default defineType({
  name: 'apiWebhooks',
  title: 'API & Webhooks',
  type: 'document',
  icon: PlugIcon,
  fields: [
    defineField({
      name: 'webhookCreate',
      title: 'Create Webhook URL',
      type: 'string',
      description: 'URL for the onCreate webhook',
    }),
    defineField({
      name: 'webhookUpdate',
      title: 'Update Webhook URL',
      type: 'string',
      description: 'URL for the onUpdate webhook',
    }),
    defineField({
      name: 'webhookPublish',
      title: 'Publish Webhook URL',
      type: 'string',
      description: 'URL for the onPublish webhook',
    }),
    defineField({
      name: 'apiToken',
      title: 'API Token',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'API & Webhooks Configuration'
      }
    }
  }
})
