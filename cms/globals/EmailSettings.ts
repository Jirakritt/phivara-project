import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// Controls which transactional-email provider cms/email/adapter.ts sends
// through (member verification links, password-reset links — see
// Members.ts). Only the *choice* of provider lives here; the actual
// credentials (OAuth client secret/refresh token/app password) are never
// entered through the CMS — they stay in server-only env vars (see
// DEPLOY.md) so they never pass through the database or the admin UI. This
// global just flips which set of env vars gets used.
export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  admin: {
    description: 'เลือกผู้ให้บริการส่งอีเมลระบบ (ยืนยันบัญชี / รีเซ็ตรหัสผ่าน) — ค่า credentials ตั้งค่าแยกที่ .env บน server เท่านั้น ไม่ใส่ในหน้านี้',
  },
  access: {
    read: hasAnyRole('admin', 'editor'),
    update: hasAnyRole('admin'),
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'gmail',
      options: [
        { label: 'Gmail', value: 'gmail' },
        { label: 'Microsoft Graph (Outlook / Microsoft 365)', value: 'microsoft-graph' },
      ],
      admin: { description: 'ระบบจะส่งอีเมล (ยืนยันบัญชี, ลืมรหัสผ่าน) ผ่านผู้ให้บริการที่เลือกไว้นี้' },
    },
  ],
}
