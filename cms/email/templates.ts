// Bilingual copy for the two transactional emails Members.ts's auth config
// sends (verify-account, forgot-password). Kept here rather than in
// src/lib/dictionary.ts's UI_DICTIONARY — that dictionary is Edge-safe and
// keyed for pickText()'s th-string lookup, while this file is plain
// Node-only template strings picked by the member's own `preferredLocale`
// field (set once at registration, not the request's current locale) since
// email delivery happens outside of any page request. Only th/en exist for
// now, matching the site's only two currently-live locales — extend this
// map + register-basic-info's locale capture together if a 3rd locale ever
// goes live.
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

type Copy = { subject: string; heading: string; body: string; button: string; expiry: string }

const VERIFY_COPY: Record<'th' | 'en', Copy> = {
  th: {
    subject: 'ยืนยันอีเมลของคุณ — PHIVARA',
    heading: 'ยืนยันบัญชี PHIVARA ของคุณ',
    body: 'กดปุ่มด้านล่างเพื่อยืนยันอีเมลและเปิดใช้งานบัญชีสมาชิก PHIVARA Private Membership ของคุณ',
    button: 'ยืนยันอีเมล',
    expiry: 'ลิงก์นี้จะหมดอายุใน 24 ชั่วโมง หากคุณไม่ได้เป็นผู้ทำรายการนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้',
  },
  en: {
    subject: 'Verify your email — PHIVARA',
    heading: 'Verify your PHIVARA account',
    body: 'Click the button below to verify your email and activate your PHIVARA Private Membership account.',
    button: 'Verify email',
    expiry: "This link expires in 24 hours. If you didn't request this, you can safely ignore this email.",
  },
}

const RESET_COPY: Record<'th' | 'en', Copy> = {
  th: {
    subject: 'ตั้งรหัสผ่านใหม่ — PHIVARA',
    heading: 'ตั้งรหัสผ่านใหม่',
    body: 'กดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่สำหรับบัญชี PHIVARA ของคุณ',
    button: 'ตั้งรหัสผ่านใหม่',
    expiry: 'ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง หากคุณไม่ได้เป็นผู้ทำรายการนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้',
  },
  en: {
    subject: 'Reset your password — PHIVARA',
    heading: 'Reset your password',
    body: 'Click the button below to set a new password for your PHIVARA account.',
    button: 'Reset password',
    expiry: "This link expires in 1 hour. If you didn't request this, you can safely ignore this email.",
  },
}

function normalizeLocale(value: unknown): 'th' | 'en' {
  return value === 'en' ? 'en' : 'th'
}

function renderEmailHTML(copy: Copy, url: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F6F1E8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1E8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#FFFEFC;border-radius:12px;overflow:hidden;border:1px solid rgba(199,167,107,.3);">
        <tr><td style="background:linear-gradient(150deg,#775D3B,#A88756);padding:28px 32px;color:#fff;font-size:20px;letter-spacing:.04em;">PHIVARA</td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 14px;color:#302E2A;font-size:20px;">${copy.heading}</h1>
          <p style="margin:0 0 24px;color:#6F695F;font-size:14px;line-height:1.7;">${copy.body}</p>
          <a href="${url}" style="display:inline-block;background:#C7A76B;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:14px;font-weight:500;">${copy.button}</a>
          <p style="margin:28px 0 0;color:#9C9488;font-size:12px;line-height:1.6;">${copy.expiry}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export function generateVerifyEmailHTML(args: { token?: string; user?: { preferredLocale?: string } }): string {
  const locale = normalizeLocale(args.user?.preferredLocale)
  const url = `${SITE_URL}/${locale}/verify-email?token=${args.token}`
  return renderEmailHTML(VERIFY_COPY[locale], url)
}

export function generateVerifyEmailSubject(args: { user?: { preferredLocale?: string } }): string {
  return VERIFY_COPY[normalizeLocale(args.user?.preferredLocale)].subject
}

export function generateForgotPasswordEmailHTML(args?: { token?: string; user?: { preferredLocale?: string } }): string {
  const locale = normalizeLocale(args?.user?.preferredLocale)
  const url = `${SITE_URL}/${locale}/reset-password?token=${args?.token}`
  return renderEmailHTML(RESET_COPY[locale], url)
}

export function generateForgotPasswordEmailSubject(args?: { user?: { preferredLocale?: string } }): string {
  return RESET_COPY[normalizeLocale(args?.user?.preferredLocale)].subject
}
