import { definePlugin } from 'sanity'

// Webhook URLs will be set via environment variables
const WEBHOOK_CREATE = process.env.NEXT_PUBLIC_WEBHOOK_CREATE
const WEBHOOK_UPDATE = process.env.NEXT_PUBLIC_WEBHOOK_UPDATE
const WEBHOOK_PUBLISH = process.env.NEXT_PUBLIC_WEBHOOK_PUBLISH

interface SanityDocument {
  _type: string
  _id: string
  title?: string
  status?: string
  autoPublish?: boolean
  publishedAt?: string
}

interface PluginContext {
  documentStore: {
    on: (event: string, callback: (doc: any) => Promise<void>) => void
  }
}

export const webhooksPlugin = definePlugin((config) => {
  return {
    name: 'sanity-plugin-webhooks',
    setup: (context: PluginContext) => {
      // Handle document creation
      context.documentStore.on('create', async (document: SanityDocument) => {
        if (document._type === 'post' && WEBHOOK_CREATE) {
          try {
            await fetch(WEBHOOK_CREATE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                _type: document._type,
                _id: document._id,
                title: document.title,
                status: document.status,
                autoPublish: document.autoPublish,
                event: 'onCreate'
              })
            })
          } catch (err) {
            console.error('Webhook onCreate error:', err)
          }
        }
      })

      // Handle document updates
      context.documentStore.on('update', async (update: { 
        document: SanityDocument
        previous: SanityDocument 
      }) => {
        const { document, previous } = update
        const prevStatus = previous?.status || 'unknown'
        
        if (document._type === 'post' && WEBHOOK_UPDATE) {
          try {
            await fetch(WEBHOOK_UPDATE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                _type: document._type,
                _id: document._id,
                title: document.title,
                status: document.status,
                autoPublish: document.autoPublish,
                previousStatus: prevStatus,
                event: 'onUpdate'
              })
            })
          } catch (err) {
            console.error('Webhook onUpdate error:', err)
          }
        }
      })

      // Handle document publishing
      context.documentStore.on('publish', async (document: SanityDocument) => {
        if (document._type === 'post' && WEBHOOK_PUBLISH) {
          try {
            await fetch(WEBHOOK_PUBLISH, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                _type: document._type,
                _id: document._id,
                title: document.title,
                status: document.status,
                publishedAt: document.publishedAt,
                event: 'onPublish'
              })
            })
          } catch (err) {
            console.error('Webhook onPublish error:', err)
          }
        }
      })
    }
  }
})
