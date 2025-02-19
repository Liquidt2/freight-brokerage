import { StructureBuilder } from 'sanity/desk'
import { PlugIcon } from '@sanity/icons'

export const getApiWebhooksStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title('API & Webhooks')
    .icon(PlugIcon)
    .child(
      S.editor()
        .id('api-webhooks-config')
        .schemaType('apiWebhooks')
        .documentId('api-webhooks-config')
    )
}
