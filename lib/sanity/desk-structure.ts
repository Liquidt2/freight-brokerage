import { StructureBuilder, StructureResolver } from 'sanity/desk'
import { CommentIcon } from '@sanity/icons'
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

      // Other Content Types
      ...S.documentTypeListItems().filter(
        (item) => !['post', 'chatLead', 'chatSettings'].includes(item.getId() || '')
      )
    ])
}
