import { definePlugin, Tool } from 'sanity'
import { PlugIcon } from '@sanity/icons'
import ApiWebhooksTab from '../../components/studio/ApiWebhooksTab'

export const apiWebhooksTool = definePlugin(() => ({
  name: 'api-webhooks',
  tools: (prev: Tool[]) => {
    return [
      ...prev,
      {
        name: 'api-webhooks',
        title: 'API & Webhooks',
        icon: PlugIcon,
        component: ApiWebhooksTab
      }
    ]
  }
}))
