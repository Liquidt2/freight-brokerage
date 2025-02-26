import { StructureBuilder, StructureResolver } from 'sanity/desk'
import { CommentIcon, LinkIcon, DocumentIcon, CogIcon } from '@sanity/icons'
import BlogPreview from '@/components/studio/BlogPreview'

export const deskStructure: StructureResolver = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Blog Posts Section
      S.listItem()
        .title('Blog Posts')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Blog Posts')
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('post')
                .views([
                  S.view.form(),
                  S.view
                    .component(BlogPreview)
                    .title('Preview')
                ])
            )
        ),

      // Chatbot Section
      S.listItem()
        .title('Chatbot')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Chatbot')
            .items([
              S.listItem()
                .title('Settings')
                .child(
                  S.document()
                    .schemaType('chatSettings')
                    .documentId('chatbot-settings')
                ),
              S.listItem()
                .title('Leads')
                .schemaType('chatLead')
                .child(
                  S.documentTypeList('chatLead')
                    .title('Chat Leads')
                ),
            ])
        ),

      // Webhooks & Integrations Section
      S.listItem()
        .title('Webhooks & Integrations')
        .icon(LinkIcon)
        .child(
          S.list()
            .title('Webhooks & Integrations')
            .items([
              S.listItem()
                .title('Webhook Configurations')
                .icon(CogIcon)
                .schemaType('webhook')
                .child(
                  S.documentTypeList('webhook')
                    .title('Webhook Configurations')
                ),
              S.listItem()
                .title('Webhook Logs')
                .icon(DocumentIcon)
                .schemaType('webhookLog')
                .child(
                  S.documentTypeList('webhookLog')
                    .title('Webhook Logs')
                    .defaultOrdering([{ field: 'timestamp', direction: 'desc' }])
                ),
              S.listItem()
                .title('Integration Templates')
                .schemaType('webhookTemplate')
                .child(
                  S.documentTypeList('webhookTemplate')
                    .title('Integration Templates')
                ),
            ])
        ),

      // Other Content Types
      ...S.documentTypeListItems().filter(
        (item) => !['post', 'chatLead', 'chatSettings', 'webhook', 'webhookLog', 'webhookTemplate'].includes(item.getId() || '')
      )
    ])
}
