# Webhooks Manager for Sanity CMS

This document explains how to use the Webhooks Manager feature in the Sanity CMS to handle integrations with external services.

## Overview

The Webhooks Manager allows you to configure and manage webhooks that send data to external services when specific events occur in your website or CMS. This enables integration with:

- Custom CRM systems
- n8n.io workflows
- Make.com scenarios
- Other external services

## Accessing the Webhooks Manager

1. Log in to your Sanity Studio at `/studio`
2. In the left sidebar, click on "Webhooks & Integrations"
3. You'll see three sections:
   - Webhook Configurations
   - Webhook Logs
   - Integration Templates

## Creating a New Webhook

1. Go to "Webhook Configurations" and click "Create new document"
2. Fill in the following information:
   - **Name**: A descriptive name for the webhook
   - **Description**: (Optional) Details about the webhook's purpose
   - **Webhook URL**: The endpoint URL where data will be sent
   - **Trigger Events**: Select one or more events that will trigger this webhook:
     - Contact Form Submission
     - Quote Request Submission
     - Blog Post Created
     - Blog Post Updated
     - Blog Post Published
   - **HTTP Headers**: (Optional) Add any custom headers needed
   - **Authentication Type**: Choose from None, Bearer Token, Basic Auth, or API Key
   - **Custom Payload Template**: (Optional) Customize the JSON payload format
   - **Target Service**: Select the service type (Custom, n8n.io, Make.com)
   - **Enabled**: Toggle to enable/disable the webhook

3. Click "Publish" to save and activate the webhook

## Using Integration Templates

Integration templates provide pre-configured settings for common services:

1. Go to "Integration Templates"
2. Browse the available templates (Custom CRM, n8n.io, Make.com)
3. Open a template to view setup instructions
4. When creating a new webhook, you can reference these templates for the correct configuration

## Monitoring Webhook Activity

The Webhook Logs section shows a history of all webhook executions:

1. Go to "Webhook Logs" to view recent webhook activity
2. Each log entry includes:
   - The webhook name
   - Event type
   - Timestamp
   - Status (Success, Failed, Pending)
   - HTTP status code
   - Response from the server
   - Error message (if any)
   - Payload that was sent

This helps you troubleshoot any issues with your webhook integrations.

## Supported Events

The following events can trigger webhooks:

### Form Submissions
- **contact-form**: Triggered when a visitor submits the Contact Us form
- **quote-form**: Triggered when a visitor submits the Request a Quote form

### Blog Posts
- **post-created**: Triggered when a new blog post is created
- **post-updated**: Triggered when an existing blog post is updated
- **post-published**: Triggered when a blog post is published

## Payload Format

By default, webhooks send a JSON payload with the following structure:

```json
{
  "formId": "contact-us",  // or "request-quote" for form submissions
  "data": {
    // All form fields submitted by the user
    "name": "John Doe",
    "email": "john@example.com",
    // ... other form fields
  },
  "timestamp": "2025-02-25T21:09:27.000Z"
}
```

For blog post events, the payload includes the post data:

```json
{
  "_type": "post",
  "_id": "post-id",
  "title": "Post Title",
  "status": "published",
  "publishedAt": "2025-02-25T21:09:27.000Z",
  "event": "post-published"
}
```

You can customize this format using the Custom Payload Template field when configuring a webhook.

## Troubleshooting

If your webhooks aren't working as expected:

1. Check the Webhook Logs to see if there are any errors
2. Verify the webhook URL is correct and accessible
3. Ensure the authentication credentials are valid
4. Check that the webhook is enabled
5. Verify that you've selected the correct trigger events
6. Test the webhook with a sample event (e.g., submit a test form)

For additional help, contact the development team.
