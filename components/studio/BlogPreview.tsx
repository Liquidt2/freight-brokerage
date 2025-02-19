import { Card, Flex, Text } from '@sanity/ui'
import { PreviewProps, SanityDocument } from 'sanity'
import { PortableText } from '@portabletext/react'

interface BlogDocument extends SanityDocument {
  title?: string
  excerpt?: string
  body?: any
  author?: { name: string }
  publishedAt?: string
}

export default function BlogPreview(props: { document: BlogDocument }) {
  const { title, excerpt, body, author, publishedAt } = props.document

  return (
    <Card padding={4}>
      <Flex direction="column" gap={4}>
        <Card padding={4} radius={2} shadow={1}>
          <Text size={4} weight="bold">
            {title || 'Untitled'}
          </Text>
          
          {author && (
            <Text size={2} muted>
              By {author.name}
            </Text>
          )}
          
          {publishedAt && (
            <Text size={2} muted>
              Published: {new Date(publishedAt).toLocaleDateString()}
            </Text>
          )}
        </Card>

        {excerpt && (
          <Card padding={4} radius={2} shadow={1}>
            <Text size={2}>{excerpt}</Text>
          </Card>
        )}

        {body && (
          <Card padding={4} radius={2} shadow={1}>
            <PortableText value={body} />
          </Card>
        )}
      </Flex>
    </Card>
  )
}
