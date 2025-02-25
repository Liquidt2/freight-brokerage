export function validateServerEnv() {
  const requiredEnvVars = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    )
  }
}

export function getServerEnv() {
  validateServerEnv()

  return {
    smtp: {
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!) || 587,
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    webhook: {
      url: process.env.WEBHOOK_URL,
      secret: process.env.WEBHOOK_SECRET,
    },
  } as const
}
