import type { OutgoingEmail } from './types'
import { addressToString, firstRecipientAddress } from './types'

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
  const to = firstRecipientAddress(message.to)
  const from = addressToString(message.from, `${defaultFromName} <${senderEmail}>`)

  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeMimeSubject(message.subject || '')}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    message.html || message.text || '',
  ].join('\r\n')

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
