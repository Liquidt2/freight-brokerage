import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'webhookLog',
  title: 'Webhook Log',
  type: 'document',
  fields: [
    defineField({
      name: 'webhook',
      title: 'Webhook',
      type: 'reference',
      to: [{ type: 'webhook' }]
    }),
    defineField({
      name: 'event',
      title: 'Event Type',
      type: 'string'
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Success', value: 'success' },
          { title: 'Failed', value: 'failed' },
          { title: 'Pending', value: 'pending' }
        ]
      }
    }),
    defineField({
      name: 'statusCode',
      title: 'HTTP Status Code',
      type: 'number'
    }),
    defineField({
      name: 'response',
      title: 'Response',
      type: 'text'
    }),
    defineField({
      name: 'error',
      title: 'Error',
      type: 'text'
    }),
    defineField({
      name: 'payload',
      title: 'Payload Sent',
      type: 'code',
      options: {
        language: 'json'
      }
    })
  ],
  preview: {
    select: {
      title: 'webhook.name',
      status: 'status',
      timestamp: 'timestamp'
    },
    prepare(selection: Record<string, any>) {
      const { title, status, timestamp } = selection;
      const statusEmoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⏳';
      const date = timestamp ? new Date(timestamp).toLocaleString() : '';
      return {
        title: title || 'Unnamed Webhook',
        subtitle: `${statusEmoji} ${status} - ${date}`
      }
    }
  },
  orderings: [
    {
      title: 'Timestamp, New',
      name: 'timestampDesc',
      by: [
        { field: 'timestamp', direction: 'desc' }
      ]
    }
  ]
})
