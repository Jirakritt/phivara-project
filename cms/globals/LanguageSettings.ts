import type { Field, GlobalConfig } from 'payload'

import { isAdmin } from '../access/roles'

// Controls which of the site's configured locales (see payload.config.ts
// `localization.locales`) are actually usable, at two independent levels
// per non-Thai locale:
//
//   cmsEditable  — whether staff can select this locale in the Payload
//                  admin's locale switcher at all, to draft/edit content in
//                  it. Read by `filterAvailableLocales` in payload.config.ts.
//   publiclyLive — whether the locale is actually reachable on the public
//                  website (routing, language switcher, sitemap). Read by
//                  the frontend middleware/layout (wired in Phase 2).
//
// Kept as two separate flags (not one) specifically so a language can be
// drafted and reviewed inside the CMS for a while before it's ever exposed
// to real visitors — e.g. content-team review before an admin flips it
// live. Thai is the site's default/fallback locale and is always fully on;
// it deliberately has no toggle here so no one can lock the whole site out
// by mistake.
//
// Both flags are Admin-only to change (access.update below) — language
// rollout is treated as an operational/business decision, not a routine
// content-editing task.
const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ja: '日本語 (Japanese)',
  zh: '中文 (Chinese)',
  vi: 'Tiếng Việt (Vietnamese)',
  km: 'ភាសាខ្មែរ (Khmer)',
  ar: 'العربية (Arabic) — RTL, ต้องปรับ layout เพิ่มก่อนเปิดใช้งานจริง',
  ms: 'Bahasa Melayu (Malay)',
  id: 'Bahasa Indonesia (Indonesian)',
  de: 'Deutsch (German)',
  ru: 'Русский (Russian)',
  lo: 'ພາສາລາວ (Lao)',
  ko: '한국어 (Korean)',
  fr: 'Français (French)',
}

// en is the one non-Thai locale already live going into this project (see
// Phase 2) — defaults to fully on. Everything else starts fully off until
// an admin turns it on from this screen.
const DEFAULT_ON: Record<string, boolean> = { en: true }

const localeFields: Field[] = Object.entries(LOCALE_LABELS).map(([code, label]) => ({
  name: code,
  type: 'group',
  label,
  fields: [
    {
      name: 'cmsEditable',
      type: 'checkbox',
      defaultValue: Boolean(DEFAULT_ON[code]),
      label: 'แก้ไขได้ใน CMS',
      admin: {
        description: 'เปิดให้ทีม content เห็นภาษานี้ในตัวเลือกภาษาของ CMS เพื่อเริ่มกรอก/แก้คำแปล — ยังไม่แสดงบนหน้าเว็บจริง',
      },
    },
    {
      name: 'publiclyLive',
      type: 'checkbox',
      defaultValue: Boolean(DEFAULT_ON[code]),
      label: 'เผยแพร่บนหน้าเว็บ',
      admin: {
        description: 'เปิดให้ผู้เข้าชมเว็บไซต์จริงเลือกภาษานี้ได้ — ควรเปิดหลังทีม content ตรวจทานคำแปลใน CMS เสร็จแล้วเท่านั้น',
      },
    },
  ],
}))

export const LanguageSettings: GlobalConfig = {
  slug: 'language-settings',
  label: 'การจัดการภาษา',
  access: {
    // Frontend (middleware, sitemap, language switcher) needs to read this
    // with no session — same public-read pattern as Footer/TopBar.
    read: () => true,
    update: isAdmin,
  },
  admin: {
    description:
      'ควบคุมว่าภาษาไหนแก้ไขได้ใน CMS และภาษาไหนเผยแพร่บนหน้าเว็บจริง — ไทยเป็นภาษาหลัก เปิดใช้งานเสมอ ไม่มีสวิตช์ปิด',
  },
  fields: localeFields,
}
