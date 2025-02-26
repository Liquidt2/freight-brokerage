# Freight Brokerage

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Liquidt2/freight-brokerage)

## Form Submission Updates

The form submission process for both the "Request a Quote" and "Contact Us" forms has been updated:

1. Forms no longer save data to Supabase
2. Email notifications are still sent when forms are submitted
3. Added webhook support for CRM integration

### Webhook Integration

The application now supports sending form data to webhook endpoints when forms are submitted. This allows integration with external systems like CRMs without storing the data in Supabase.

#### Webhooks Manager

A new Webhooks Manager has been added to the Sanity CMS, allowing you to:

- Configure multiple webhook endpoints
- Set up integrations with custom CRMs, n8n.io, and make.com
- Monitor webhook execution logs
- Customize payload formats
- Add authentication to webhook requests

For detailed information on how to use the Webhooks Manager, please see the [Webhooks Manager Documentation](./WEBHOOKS_MANAGER.md).

For legacy webhook configuration, see the [Legacy Webhook Setup Documentation](./WEBHOOK_SETUP.md).

## Environment Variables

In addition to the existing environment variables, the following optional variables have been added for webhook support:

```
# Legacy Webhook Configuration (Optional)
WEBHOOK_URL=https://your-crm-webhook-url.com/api/webhook
WEBHOOK_SECRET=your_webhook_secret_key

# Sanity Webhook Configuration (Optional)
NEXT_PUBLIC_WEBHOOK_CREATE=https://your-webhook-url.com/onCreate
NEXT_PUBLIC_WEBHOOK_UPDATE=https://your-webhook-url.com/onUpdate
NEXT_PUBLIC_WEBHOOK_PUBLISH=https://your-webhook-url.com/onPublish
```
