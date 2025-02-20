import { StructureBuilder, StructureResolver } from 'sanity/desk'
import { PlugIcon, CommentIcon } from '@sanity/icons'
import ApiWebhooksTab from '@/components/studio/ApiWebhooksTab'
import BlogPreview from '@/components/studio/BlogPreview'

export const deskStructure: StructureResolver = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // API & Webhooks Section
      S.listItem()
        .title('API & Webhooks')
        .icon(PlugIcon)
        .child(
          S.document()
            .schemaType('apiWebhooks')
            .documentId('apiWebhooks-config')
            .views([
              S.view.form(),
              S.view
                .component(ApiWebhooksTab)
                .title('Configuration')
            ])
        ),

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

      // Other Content Types
      ...S.documentTypeListItems().filter(
        (item) => !['post', 'apiWebhooks', 'chatLead', 'chatSettings'].includes(item.getId() || '')
      )
    ])
}
