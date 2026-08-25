import type { OutgoingEmail } from './types'
import { addressToString, firstRecipientAddress } from './types'

// Sends through Microsoft Graph's REST API using an app-only (client
// credentials) token — no user sign-in involved, no nodemailer dependency,
// just `fetch` + four env vars. Required setup (see DEPLOY.md):
//   MSGRAPH_TENANT_ID / MSGRAPH_CLIENT_ID / MSGRAPH_CLIENT_SECRET — from an
//     Azure AD App Registration with the *application* (not delegated)
//     Microsoft Graph permission `Mail.Send`, admin-consented
//   MSGRAPH_SENDER_UPN — the mailbox to send as (its User Principal Name /
//     email, e.g. no-reply@phivara.site) — the app registration must have
//     Mail.Send scoped to (or unrestricted for) this mailbox
function tokenUrl(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
}

async function getAccessToken(): Promise<string> {
  const tenantId = process.env.MSGRAPH_TENANT_ID
  const clientId = process.env.MSGRAPH_CLIENT_ID
  const clientSecret = process.env.MSGRAPH_CLIENT_SECRET
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Microsoft Graph email provider selected but MSGRAPH_TENANT_ID/MSGRAPH_CLIENT_ID/MSGRAPH_CLIENT_SECRET are not set in .env')
  }
  const res = await fetch(tokenUrl(tenantId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`Microsoft Graph OAuth token request failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export async function sendViaMicrosoftGraph(message: OutgoingEmail, defaultFromAddress: string): Promise<void> {
  const accessToken = await getAccessToken()
  const senderUpn = process.env.MSGRAPH_SENDER_UPN || defaultFromAddress
  const to = firstRecipientAddress(message.to)
  const fromAddress = addressToString(message.from, senderUpn)

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderUpn)}/sendMail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject: message.subject || '',
        body: { contentType: 'HTML', content: message.html || message.text || '' },
        toRecipients: [{ emailAddress: { address: to } }],
        from: { emailAddress: { address: fromAddress } },
      },
      saveToSentItems: false,
    }),
  })
  // sendMail returns 202 Accepted with an empty body on success.
  if (!res.ok) throw new Error(`Microsoft Graph send failed (${res.status}): ${await res.text()}`)
}
