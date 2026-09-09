import type { Payload } from 'payload'

import { sendViaGmail } from './gmail'
import { sendViaMicrosoftGraph } from './microsoftGraph'

// Sends the "new inquiry" notification to a branch's configured staff
// recipients (Branches.ts's `notificationRecipients` array field) whenever
// a Lead is created — see Leads.ts's afterChange hook at the bottom of that
// file, which is the only caller of sendLeadNotificationEmail() below.
//
// Deliberately does NOT go through cms/email/adapter.ts's
// switchableEmailAdapter() (the thing `payload.sendEmail()` actually
// calls) even though that adapter already has the exact same
// provider-selection logic — that adapter's whole design intentionally
// swallows send failures (see its file comment: a broken mail provider
// must never be able to fail account registration/password-reset). This
// hook needs the opposite: a real success/failure result to write into the
// Lead's own notificationStatus/notificationError fields so staff can SEE
// a failed send in the admin instead of it only ever reaching a server
// log. Hence the small, deliberate duplication of the provider-select
// block below rather than reusing the adapter.

const DEFAULT_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'no-reply@phivara.site'
const DEFAULT_FROM_NAME = process.env.EMAIL_FROM_NAME || 'PHIVARA'
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Kept in sync by hand with the `service` field `options` in Leads.ts (same
// arrangement as cms/lib/leadsExport.ts's own SERVICE_LABELS) — prints the
// human label instead of the raw stored value in the notification email.
const SERVICE_LABELS: Record<string, string> = {
  wellness: 'Aesthetic',
  longevity: 'Longevity',
  'plastic-surgery': 'Plastic Surgery',
  dermatology: 'Dermatology',
  membership: 'PHIVARA AUM Membership',
}

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

function formatThaiDateTime(value?: string | null): string {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}, ${pad(d.getHours())}:${pad(d.getMinutes())} น.`
}

function formatThaiDate(value?: string | null): string {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
}

// Minimal shape sendLeadNotificationEmail() actually reads off a Lead doc —
// kept narrow (rather than importing the full generated `Lead` type) so
// this file doesn't need to know about fields it never touches.
export interface LeadNotificationInput {
  id: number | string
  name: string
  phone: string
  service?: string | null
  notes?: string | null
  preferredDate?: string | null
  sourcePath?: string | null
  createdAt?: string | null
}

function escapeHTML(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Row layout, label/value colors, header gradient, button shape all match
// cms/email/templates.ts's renderEmailHTML() (the verify-account/
// forgot-password template) so every email PHIVARA sends shares one visual
// language — reviewed with the team as an inline HTML mockup before this
// was built.
function row(label: string, value: string, isLast = false): string {
  const border = isLast ? 'border-top:1px solid #EFE9DD;border-bottom:1px solid #EFE9DD;' : 'border-top:1px solid #EFE9DD;'
  return `<tr><td style="padding:9px 0;color:#9C9488;width:38%;${border}vertical-align:top;">${escapeHTML(label)}</td><td style="padding:9px 0;color:#302E2A;font-weight:500;${border}line-height:1.6;">${value}</td></tr>`
}

export function generateLeadNotificationEmailSubject(lead: LeadNotificationInput, branchName: string): string {
  return `มีลูกค้าใหม่ติดต่อเข้ามา ${branchName}`
}

export function generateLeadNotificationEmailHTML(lead: LeadNotificationInput, branchName: string): string {
  const serviceLabel = (lead.service && SERVICE_LABELS[lead.service]) || lead.service || '-'
  const cmsUrl = `${SITE_URL}/admin/collections/leads/${lead.id}`
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F6F1E8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1E8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#FFFEFC;border-radius:12px;overflow:hidden;border:1px solid rgba(199,167,107,.3);">
        <tr><td style="background:linear-gradient(150deg,#775D3B,#A88756);padding:24px 28px;color:#fff;">
          <div style="font-size:19px;letter-spacing:.04em;font-weight:500;">PHIVARA</div>
          <div style="font-size:12.5px;opacity:.85;margin-top:4px;">แจ้งเตือนคำขอปรึกษาใหม่</div>
        </td></tr>
        <tr><td style="padding:28px 28px 8px;">
          <h1 style="margin:0 0 6px;color:#302E2A;font-size:18px;font-weight:500;">มีลูกค้าใหม่ติดต่อเข้ามา</h1>
          <p style="margin:0 0 20px;color:#6F695F;font-size:13px;line-height:1.6;">สาขา ${escapeHTML(branchName)} กรุณาติดต่อกลับลูกค้าโดยเร็วที่สุด</p>
        </td></tr>
        <tr><td style="padding:0 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
            ${row('ชื่อ-นามสกุล', escapeHTML(lead.name))}
            ${row('เบอร์โทร', escapeHTML(lead.phone))}
            ${row('บริการที่สนใจ', escapeHTML(serviceLabel))}
            ${lead.notes ? row('ข้อความเพิ่มเติม', escapeHTML(lead.notes)) : ''}
            ${lead.preferredDate ? row('วันที่สะดวก', formatThaiDate(lead.preferredDate)) : ''}
            ${row('กรอกจากหน้า', escapeHTML(lead.sourcePath || '-'))}
            ${row('เวลาที่ส่งเข้ามา', formatThaiDateTime(lead.createdAt), true)}
          </table>
        </td></tr>
        <tr><td style="padding:24px 28px 8px;">
          <a href="${cmsUrl}" style="display:inline-block;background:#C7A76B;color:#fff;text-decoration:none;padding:12px 26px;border-radius:999px;font-size:13.5px;font-weight:500;">เปิดดูรายการนี้ในระบบ CMS</a>
        </td></tr>
        <tr><td style="padding:20px 28px 26px;">
          <p style="margin:0;color:#9C9488;font-size:11.5px;line-height:1.6;">อีเมลนี้ส่งอัตโนมัติจากระบบเว็บไซต์ PHIVARA ถึงเจ้าหน้าที่ที่ตั้งค่าไว้สำหรับสาขานี้ ไม่ต้องตอบกลับอีเมลฉบับนี้</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export async function sendLeadNotificationEmail(args: {
  payload: Payload
  lead: LeadNotificationInput
  branchName: string
  to: string[]
  cc: string[]
  bcc: string[]
}): Promise<{ success: boolean; error?: string }> {
  if (args.to.length === 0 && args.cc.length === 0 && args.bcc.length === 0) {
    return { success: false, error: 'No active notification recipients configured for this branch' }
  }

  // Same "read email-settings on every send" pattern as adapter.ts, so an
  // admin flipping Gmail <-> Microsoft Graph in CMS > Email Settings takes
  // effect on the next lead too, not just auth emails.
  let provider = process.env.EMAIL_PROVIDER_FALLBACK || 'gmail'
  try {
    const settings = (await args.payload.findGlobal({ slug: 'email-settings' })) as unknown as { provider?: string }
    if (settings?.provider) provider = settings.provider
  } catch (err) {
    args.payload.logger.warn(`[lead-notification] email-settings global unreadable, falling back to ${provider}: ${(err as Error).message}`)
  }

  const message = {
    to: args.to,
    cc: args.cc,
    bcc: args.bcc,
    subject: generateLeadNotificationEmailSubject(args.lead, args.branchName),
    html: generateLeadNotificationEmailHTML(args.lead, args.branchName),
  }

  try {
    if (provider === 'microsoft-graph') {
      await sendViaMicrosoftGraph(message, DEFAULT_FROM_ADDRESS)
    } else {
      await sendViaGmail(message, DEFAULT_FROM_ADDRESS, DEFAULT_FROM_NAME)
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}
