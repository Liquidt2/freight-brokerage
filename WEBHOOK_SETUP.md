# Webhook Setup for Form Submissions

This document explains how to configure the webhook functionality for form submissions in the freight brokerage application.

## Overview

The application now supports sending form data to a webhook URL when forms are submitted. This allows integration with external systems like CRMs without storing the data in Supabase. The webhook functionality is optional and will only be used if configured.

## Configuration

To enable webhook functionality, you need to add the following environment variables to your `.env` file:

```
# Webhook Configuration (Optional)
WEBHOOK_URL=https://your-crm-webhook-url.com/api/webhook
WEBHOOK_SECRET=your_webhook_secret_key
```

### Environment Variables

- `WEBHOOK_URL`: The URL where form data will be sent. This is required to enable webhook functionality.
- `WEBHOOK_SECRET`: (Optional) A secret key used for authentication. If provided, it will be sent in the Authorization header as a Bearer token.

## Webhook Request Format

When a form is submitted, the application will send a POST request to the configured webhook URL with the following JSON payload:

```json
{
  "formId": "request-quote",  // or "contact-us"
  "data": {
    // All form fields submitted by the user
    "name": "John Doe",
    "email": "john@example.com",
    // ... other form fields
  },
  "timestamp": "2025-02-25T21:09:27.000Z"
}
```

### Headers

The request will include the following headers:

- `Content-Type: application/json`
- `Authorization: Bearer your_webhook_secret_key` (only if `WEBHOOK_SECRET` is configured)

## Error Handling

The webhook functionality is designed to be non-blocking. If the webhook request fails for any reason, the form submission will still be considered successful, and the email notification will still be sent. Errors will be logged to the console but will not be returned to the user.

## Testing Your Webhook

You can use services like [webhook.site](https://webhook.site) or [Pipedream](https://pipedream.com) to create a temporary webhook endpoint for testing. These services will show you the incoming requests and allow you to verify that the data is being sent correctly.

## Implementing Your Own Webhook Endpoint

When implementing your own webhook endpoint, make sure to:

1. Accept POST requests with JSON payloads
2. Validate the Authorization header if you're using a secret key
3. Process the form data according to your needs
4. Return a 200 OK response to indicate successful processing

## Troubleshooting

If you're having issues with the webhook functionality:

1. Check that the `WEBHOOK_URL` environment variable is set correctly
2. Verify that your webhook endpoint is accessible and accepting requests
3. Check the server logs for any error messages related to webhook calls
4. Ensure your webhook endpoint can handle the data format being sent

For additional help, please contact the development team.
