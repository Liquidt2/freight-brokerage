import { Box, Card, Container, Flex, Stack, Text, Button, Code, Label } from '@sanity/ui'
import { useState } from 'react'

interface WebhookStatus {
  endpoint: string
  status: 'active' | 'inactive'
  lastTested: string | null
}

const ApiWebhooksTab = () => {
  const [webhooks, setWebhooks] = useState<WebhookStatus[]>([
    {
      endpoint: process.env.NEXT_PUBLIC_WEBHOOK_CREATE || '',
      status: 'inactive',
      lastTested: null
    },
    {
      endpoint: process.env.NEXT_PUBLIC_WEBHOOK_UPDATE || '',
      status: 'inactive',
      lastTested: null
    },
    {
      endpoint: process.env.NEXT_PUBLIC_WEBHOOK_PUBLISH || '',
      status: 'inactive',
      lastTested: null
    }
  ])

  const testWebhook = async (endpoint: string, eventType: string) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _type: 'post',
          _id: 'test',
          title: 'Test Post',
          status: 'draft',
          event: eventType
        })
      })

      if (response.ok) {
        setWebhooks(prev =>
          prev.map(hook =>
            hook.endpoint === endpoint
              ? { ...hook, status: 'active', lastTested: new Date().toISOString() }
              : hook
          )
        )
      }
    } catch (error) {
      console.error('Webhook test failed:', error)
    }
  }

  return (
    <Container width={2}>
      <Stack space={5}>
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={4}>
            <Text size={4} weight="bold">
              API & Webhooks Configuration
            </Text>
            
            <Box>
              <Text size={2} weight="semibold">
                API Token Management
              </Text>
              <Card marginTop={3} padding={3} radius={2} tone="primary">
                <Stack space={3}>
                  <Text size={1}>
                    Your API token can be managed at{' '}
                    <a
                      href="https://manage.sanity.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--card-link-color)' }}
                    >
                      manage.sanity.io
                    </a>
                  </Text>
                  <Button
                    text="Open Token Management"
                    tone="primary"
                    onClick={() => window.open('https://manage.sanity.io', '_blank')}
                  />
                </Stack>
              </Card>
            </Box>

            <Box>
              <Text size={2} weight="semibold">
                Webhook Endpoints
              </Text>
              <Stack space={3} marginTop={3}>
                {webhooks.map((webhook, index) => (
                  <Card
                    key={index}
                    padding={3}
                    radius={2}
                    shadow={1}
                    tone={webhook.status === 'active' ? 'positive' : 'caution'}
                  >
                    <Flex justify="space-between" align="center">
                      <Stack space={2}>
                        <Label size={1}>
                          {index === 0
                            ? 'Create Webhook'
                            : index === 1
                            ? 'Update Webhook'
                            : 'Publish Webhook'}
                        </Label>
                        <Code size={0}>{webhook.endpoint || 'Not configured'}</Code>
                        {webhook.lastTested && (
                          <Text size={0} muted>
                            Last tested: {new Date(webhook.lastTested).toLocaleString()}
                          </Text>
                        )}
                      </Stack>
                      <Button
                        text="Test"
                        tone="primary"
                        mode="ghost"
                        disabled={!webhook.endpoint}
                        onClick={() =>
                          testWebhook(
                            webhook.endpoint,
                            index === 0
                              ? 'onCreate'
                              : index === 1
                              ? 'onUpdate'
                              : 'onPublish'
                          )
                        }
                      />
                    </Flex>
                  </Card>
                ))}
              </Stack>
            </Box>

            <Box>
              <Text size={2} weight="semibold">
                Environment Variables
              </Text>
              <Card marginTop={3} padding={3} radius={2} tone="primary">
                <Stack space={3}>
                  <Text size={1}>
                    Configure these variables in your .env file:
                  </Text>
                  <Code size={1} language="bash">
                    {`NEXT_PUBLIC_WEBHOOK_CREATE=https://your-n8n-instance/webhook/blog-create
NEXT_PUBLIC_WEBHOOK_UPDATE=https://your-n8n-instance/webhook/blog-update
NEXT_PUBLIC_WEBHOOK_PUBLISH=https://your-n8n-instance/webhook/blog-publish
SANITY_API_TOKEN=your-generated-token`}
                  </Code>
                </Stack>
              </Card>
            </Box>

            <Box>
              <Text size={2} weight="semibold">
                Documentation
              </Text>
              <Card marginTop={3} padding={3} radius={2}>
                <Stack space={3}>
                  <Text size={1}>
                    For detailed setup instructions and examples, refer to the{' '}
                    <Code size={1}>docs/API_WEBHOOKS.md</Code> file in your project.
                  </Text>
                </Stack>
              </Card>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

export default ApiWebhooksTab
