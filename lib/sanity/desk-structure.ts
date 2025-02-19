import { StructureBuilder, StructureResolver } from 'sanity/desk'
import { PlugIcon } from '@sanity/icons'
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

      // Other Content Types
      ...S.documentTypeListItems().filter(
        (item) => !['post', 'apiWebhooks'].includes(item.getId() || '')
      )
    ])
}
