# Freight Brokerage

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Liquidt2/freight-brokerage)

## Form Submission Updates

The form submission process for both the "Request a Quote" and "Contact Us" forms has been updated:

1. Forms no longer save data to Supabase
2. Email notifications are still sent when forms are submitted
3. Added webhook support for future CRM integration

### Webhook Integration

The application now supports sending form data to a webhook URL when forms are submitted. This allows integration with external systems like CRMs without storing the data in Supabase.

For detailed information on how to configure and use the webhook functionality, please see the [Webhook Setup Documentation](./WEBHOOK_SETUP.md).

## Environment Variables

In addition to the existing environment variables, the following optional variables have been added for webhook support:

```
# Webhook Configuration (Optional)
WEBHOOK_URL=https://your-crm-webhook-url.com/api/webhook
WEBHOOK_SECRET=your_webhook_secret_key
```
