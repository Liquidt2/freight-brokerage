// Server-side version of webhooks.ts that doesn't rely on Sanity's React context
import { createClient } from '@sanity/client'
import { token, projectId, dataset, apiVersion } from '../env'

// Legacy webhook URLs from environment variables
const WEBHOOK_CREATE = process.env.NEXT_PUBLIC_WEBHOOK_CREATE
const WEBHOOK_UPDATE = process.env.NEXT_PUBLIC_WEBHOOK_UPDATE
const WEBHOOK_PUBLISH = process.env.NEXT_PUBLIC_WEBHOOK_PUBLISH

// Create a server-side client
const createServerClient = () => {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: 'published',
  })
}

interface WebhookConfig {
  _id: string
  name: string
  url: string
  events: string[]
  headers?: { key: string; value: string }[]
  authType: 'none' | 'bearer' | 'basic' | 'apikey'
  authToken?: string
  username?: string
  password?: string
  apiKeyName?: string
  apiKeyValue?: string
  payloadTemplate?: {
    code: string
  }
  targetService: string
  enabled: boolean
}

// Helper function to get all enabled webhooks
async function getEnabledWebhooks(): Promise<WebhookConfig[]> {
  const client = createServerClient()
  return client.fetch(`
    *[_type == "webhook" && enabled == true] {
      _id,
      name,
      url,
      events,
      headers,
      authType,
      authToken,
      username,
      password,
      apiKeyName,
      apiKeyValue,
      "payloadTemplate": payloadTemplate,
      targetService,
      enabled
    }
  `)
}

// Helper function to log webhook execution
async function logWebhookExecution(
  webhookId: string,
  event: string,
  status: 'success' | 'failed' | 'pending',
  statusCode?: number,
  response?: string,
  error?: string,
  payload?: any
) {
  try {
    const client = createServerClient()
    await client.create({
      _type: 'webhookLog',
      webhook: {
        _type: 'reference',
        _ref: webhookId
      },
      event,
      status,
      statusCode,
      response,
      error,
      payload: payload ? {
        _type: 'code',
        language: 'json',
        code: JSON.stringify(payload, null, 2)
      } : undefined,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error logging webhook execution:', err)
  }
}

// Helper function to execute a webhook
async function executeWebhook(
  webhook: WebhookConfig,
  eventType: string,
  payload: any
): Promise<void> {
  if (!webhook.enabled || !webhook.events.includes(eventType)) {
    return
  }

  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add custom headers
    if (webhook.headers && webhook.headers.length > 0) {
      webhook.headers.forEach(header => {
        headers[header.key] = header.value
      })
    }

    // Add authentication
    if (webhook.authType === 'bearer' && webhook.authToken) {
      headers['Authorization'] = `Bearer ${webhook.authToken}`
    } else if (webhook.authType === 'basic' && webhook.username && webhook.password) {
      const base64Auth = Buffer.from(`${webhook.username}:${webhook.password}`).toString('base64')
      headers['Authorization'] = `Basic ${base64Auth}`
    } else if (webhook.authType === 'apikey' && webhook.apiKeyName && webhook.apiKeyValue) {
      headers[webhook.apiKeyName] = webhook.apiKeyValue
    }

    // Prepare payload
    let finalPayload = payload
    
    // Use custom payload template if provided
    if (webhook.payloadTemplate && webhook.payloadTemplate.code) {
      try {
        const template = JSON.parse(webhook.payloadTemplate.code)
        // Simple template variable replacement
        const templateStr = JSON.stringify(template)
        const replaced = templateStr.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
          const value = key.split('.').reduce((obj: any, k: string) => obj && obj[k], payload)
          return value !== undefined ? JSON.stringify(value).slice(1, -1) : match
        })
        finalPayload = JSON.parse(replaced)
      } catch (err) {
        console.error('Error parsing payload template:', err)
        // Fall back to default payload
      }
    }

    // Execute the webhook
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(finalPayload),
    })

    const responseText = await response.text()
    
    // Log the execution
    await logWebhookExecution(
      webhook._id,
      eventType,
      response.ok ? 'success' : 'failed',
      response.status,
      responseText,
      response.ok ? undefined : `HTTP ${response.status}: ${responseText}`,
      finalPayload
    )
    
    if (!response.ok) {
      console.error(`Webhook error (${response.status}):`, responseText)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(`Webhook execution error:`, errorMessage)
    
    // Log the error
    await logWebhookExecution(
      webhook._id,
      eventType,
      'failed',
      undefined,
      undefined,
      errorMessage,
      payload
    )
  }
}

// Export function to trigger webhooks from server actions
export async function triggerWebhook(eventType: string, data: any): Promise<void> {
  try {
    const webhooks = await getEnabledWebhooks()
    
    // Execute each matching webhook
    await Promise.all(
      webhooks
        .filter(webhook => webhook.events.includes(eventType))
        .map(webhook => executeWebhook(webhook, eventType, data))
    )

    // Legacy webhook support
    if (eventType === 'post-created' && WEBHOOK_CREATE) {
      try {
        await fetch(WEBHOOK_CREATE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            event: 'onCreate'
          })
        })
      } catch (err) {
        console.error('Legacy webhook onCreate error:', err)
      }
    } else if (eventType === 'post-updated' && WEBHOOK_UPDATE) {
      try {
        await fetch(WEBHOOK_UPDATE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            event: 'onUpdate'
          })
        })
      } catch (err) {
        console.error('Legacy webhook onUpdate error:', err)
      }
    } else if (eventType === 'post-published' && WEBHOOK_PUBLISH) {
      try {
        await fetch(WEBHOOK_PUBLISH, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            event: 'onPublish'
          })
        })
      } catch (err) {
        console.error('Legacy webhook onPublish error:', err)
      }
    }
  } catch (err) {
    console.error('Error triggering webhooks:', err)
  }
}
