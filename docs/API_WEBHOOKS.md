# API & Webhooks Configuration

This document outlines the setup process for API access and webhooks integration with the Sanity Studio blog system.

## API Configuration

### Generating an API Token

1. Visit [manage.sanity.io](https://manage.sanity.io)
2. Select your project
3. Navigate to API > Tokens
4. Click "Create New Token"
5. Name it appropriately (e.g., "n8n-integration")
6. Select the following permissions:
   - `Editor` for content management
   - `Viewer` for content reading
7. Copy the generated token

### Environment Variables

Add the following to your `.env` file:

```env
NEXT_PUBLIC_WEBHOOK_CREATE=https://your-n8n-instance/webhook/blog-create
NEXT_PUBLIC_WEBHOOK_UPDATE=https://your-n8n-instance/webhook/blog-update
NEXT_PUBLIC_WEBHOOK_PUBLISH=https://your-n8n-instance/webhook/blog-publish
SANITY_API_TOKEN=your-generated-token
```

## Webhook Events

The system triggers webhooks for the following events:

### 1. onCreate (New Blog Post)
Triggered when a new blog post is created.

Payload:
```json
{
  "_type": "post",
  "_id": "post-id",
  "title": "Post Title",
  "status": "draft",
  "autoPublish": boolean,
  "event": "onCreate"
}
```

### 2. onUpdate (Blog Post Updated)
Triggered when a blog post is updated.

Payload:
```json
{
  "_type": "post",
  "_id": "post-id",
  "title": "Post Title",
  "status": "current-status",
  "autoPublish": boolean,
  "previousStatus": "previous-status",
  "event": "onUpdate"
}
```

### 3. onPublish (Blog Post Published)
Triggered when a blog post is published.

Payload:
```json
{
  "_type": "post",
  "_id": "post-id",
  "title": "Post Title",
  "status": "published",
  "publishedAt": "timestamp",
  "event": "onPublish"
}
```

## n8n Integration

### Setting up n8n Workflows

1. Create three webhook nodes in n8n for each event type
2. Configure the webhook URLs in your environment variables
3. Use the `autoPublish` field to determine automatic publishing rules
4. Handle the different event types according to your needs:
   - `onCreate`: Initial processing of new content
   - `onUpdate`: Content revision and status changes
   - `onPublish`: Distribution and notification workflows

### Webhook Security

1. Add authentication to your n8n webhooks
2. Use environment variables for sensitive data
3. Implement rate limiting if needed
4. Validate payload signatures if supported by your n8n setup

## Testing Webhooks

Use the following curl commands to test your webhook endpoints:

```bash
# Test onCreate webhook
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"_type":"post","_id":"test","title":"Test Post","status":"draft","autoPublish":false,"event":"onCreate"}' \
  $NEXT_PUBLIC_WEBHOOK_CREATE

# Test onUpdate webhook
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"_type":"post","_id":"test","title":"Test Post","status":"pending_review","previousStatus":"draft","event":"onUpdate"}' \
  $NEXT_PUBLIC_WEBHOOK_UPDATE

# Test onPublish webhook
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"_type":"post","_id":"test","title":"Test Post","status":"published","publishedAt":"2024-02-19T12:00:00Z","event":"onPublish"}' \
  $NEXT_PUBLIC_WEBHOOK_PUBLISH
```

## Troubleshooting

1. Check webhook logs in the browser console
2. Verify environment variables are properly set
3. Ensure n8n instance is running and accessible
4. Validate webhook payload format matches expected schema
5. Check network requests in browser developer tools

For additional support or custom integration needs, please refer to the [Sanity documentation](https://www.sanity.io/docs) or contact the development team.
