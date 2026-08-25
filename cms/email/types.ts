// Deliberately NOT importing Payload's own `SendEmailOptions` type here —
// that type is a thin wrapper over nodemailer's `SendMailOptions`, and this
// project never installs nodemailer at runtime (both provider integrations
// below talk straight to Gmail's REST API and Microsoft Graph's REST API
// over plain `fetch`, so there's no SMTP transport to configure). Payload's
// own `Config['email']` field is still typed against that nodemailer-backed
// interface though — see cms/payload.config.ts's `email:` line for the one
// `as any` this requires and why.
export interface EmailAddress {
  address: string
  name?: string
}

export type EmailRecipient = string | EmailAddress | Array<string | EmailAddress>

export interface OutgoingEmail {
  to?: EmailRecipient
  from?: string | EmailAddress
  subject?: string
  text?: string
  html?: string
}

export function firstRecipientAddress(to: EmailRecipient | undefined): string {
  const first = Array.isArray(to) ? to[0] : to
  if (!first) throw new Error('sendEmail called with no "to" recipient')
  return typeof first === 'string' ? first : first.address
}

export function addressToString(value: string | EmailAddress | undefined, fallback: string): string {
  if (!value) return fallback
  return typeof value === 'string' ? value : value.address
}
