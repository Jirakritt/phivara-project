import type { Payload } from 'payload'

import { sendViaGmail } from './gmail'
import { sendViaMicrosoftGraph } from './microsoftGraph'
import type { OutgoingEmail } from './types'

const DEFAULT_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'no-reply@phivara.site'
const DEFAULT_FROM_NAME = process.env.EMAIL_FROM_NAME || 'PHIVARA'

// Payload's own `EmailAdapter` type is a factory: `({ payload }) => {
// name, defaultFromAddress, defaultFromName, sendEmail }`. Payload calls the
// factory once during startup (by which point the Local API is already up),
// so `sendEmail` below can safely call `payload.findGlobal()` on every send
// to pick up whichever provider is currently selected — an admin flipping
// the dropdown in cms/globals/EmailSettings.ts takes effect on the very
// next email sent, no restart required.
//
// Not typed against Payload's own `EmailAdapter` export on purpose — see
// cms/email/types.ts's file comment for why (it's transitively typed
// through nodemailer, which this project doesn't install since neither
// provider here uses SMTP). cms/payload.config.ts casts this with `as any`
// at the one place it's assigned to `email:` in the config object; the
// runtime shape below matches what Payload actually expects field-for-field.
export function switchableEmailAdapter() {
  return ({ payload }: { payload: Payload }) => ({
    name: 'switchable-gmail-msgraph',
    defaultFromAddress: DEFAULT_FROM_ADDRESS,
    defaultFromName: DEFAULT_FROM_NAME,
    sendEmail: async (message: OutgoingEmail): Promise<void> => {
      let provider: string = process.env.EMAIL_PROVIDER_FALLBACK || 'gmail'
      try {
        const settings = (await payload.findGlobal({ slug: 'email-settings' })) as unknown as { provider?: string }
        if (settings?.provider) provider = settings.provider
      } catch (err) {
        payload.logger.warn(`email-settings global unreadable, falling back to ${provider}: ${(err as Error).message}`)
      }

      // Payload's own create/forgotPassword/resetPassword operations await
      // this call with no try/catch of their own — an unhandled rejection
      // here would fail the ENTIRE register/reset request (the account
      // would still get created in the DB, but the visitor would see a 500
      // and have no way to complete verification). A misconfigured or
      // temporarily-down email provider shouldn't be able to break account
      // creation, so failures are caught and logged here instead of
      // propagating. In dev, with no Gmail/Microsoft Graph credentials set
      // yet, this is also what makes the flow testable at all: the
      // verification/reset link is printed to the terminal running `npm run
      // dev` so it can be copied by hand.
      try {
        if (provider === 'microsoft-graph') {
          await sendViaMicrosoftGraph(message, DEFAULT_FROM_ADDRESS)
        } else {
          await sendViaGmail(message, DEFAULT_FROM_ADDRESS, DEFAULT_FROM_NAME)
        }
      } catch (err) {
        payload.logger.error(
          `[email-adapter] Failed to send "${message.subject}" to ${JSON.stringify(message.to)} via ${provider}: ${(err as Error).message}`,
        )
        payload.logger.info(`[email-adapter] Email body that failed to send:\n${message.html || message.text || ''}`)
      }
    },
  })
}
