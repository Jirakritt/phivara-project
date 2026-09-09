import type { OutgoingEmail } from './types'
import { addressToString, allRecipientAddresses } from './types'

// Sends through the real Gmail account via Gmail's REST API (OAuth2), not
// SMTP — no nodemailer/SMTP transport dependency needed, just `fetch` +
// three env vars. Required setup (see DEPLOY.md):
//   GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET — OAuth2 credentials from a
//     Google Cloud project (APIs & Services > Credentials > OAuth client ID,
//     type "Desktop app" is easiest for generating the refresh token below)
//   GMAIL_REFRESH_TOKEN — obtained once via Google's OAuth2 Playground
//     (https://developers.google.com/oauthplayground) authorizing the
//     https://www.googleapis.com/auth/gmail.send scope against the mailbox
//     that should send these emails
//   GMAIL_SENDER_EMAIL — the mailbox address the refresh token belongs to
//     (also used as the default From: address)
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Gmail email provider selected but GMAIL_CLIENT_ID/GMAIL_CLIENT_SECRET/GMAIL_REFRESH_TOKEN are not set in .env')
  }
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Gmail OAuth token refresh failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

// Base64url per Gmail API's `raw` field spec (RFC 4648 §5 — '-'/'_'
// instead of '+'/'/', no padding).
function base64url(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Encodes a UTF-8 subject line as a MIME "encoded word" (RFC 2047) — plain
// UTF-8 bytes in a raw email header are not spec-legal and some clients
// mangle Thai subjects without this.
function encodeMimeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`
}

export async function sendViaGmail(message: OutgoingEmail, defaultFromAddress: string, defaultFromName: string): Promise<void> {
  const accessToken = await getAccessToken()
  const senderEmail = process.env.GMAIL_SENDER_EMAIL || defaultFromAddress
  // Gmail's raw MIME To:/Cc:/Bcc: headers each accept a comma-separated
  // address list, so joining allRecipientAddresses() per header is enough
  // for multi-recipient sends — no per-address API calls needed. Gmail's
  // API parses the raw message and delivers to whichever of these three
  // headers are present, then strips the Bcc header from the copy other
  // recipients see (standard MTA Bcc behavior) — so it's safe to put real
  // addresses in a Bcc: header here, unlike sending Bcc via most SMTP
  // relays where you'd need a separate envelope-recipient mechanism.
  const to = allRecipientAddresses(message.to).join(', ')
  const cc = allRecipientAddresses(message.cc).join(', ')
  const bcc = allRecipientAddresses(message.bcc).join(', ')
  if (!to && !cc && !bcc) throw new Error('sendEmail called with no "to"/"cc"/"bcc" recipient')
  const from = addressToString(message.from, `${defaultFromName} <${senderEmail}>`)

  const mime = [
    `From: ${from}`,
    to ? `To: ${to}` : null,
    cc ? `Cc: ${cc}` : null,
    bcc ? `Bcc: ${bcc}` : null,
    `Subject: ${encodeMimeSubject(message.subject || '')}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    message.html || message.text || '',
  ]
    .filter((line): line is string => line !== null)
    .join('\r\n')

  const res = await fetch(SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64url(mime) }),
  })
  if (!res.ok) throw new Error(`Gmail send failed (${res.status}): ${await res.text()}`)
}
