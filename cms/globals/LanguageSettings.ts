import type { Field, GlobalConfig } from 'payload'

import { isAdmin } from '../access/roles'
import { DEFAULT_ON_LOCALES, LOCALE_META } from '../admin/localeMeta'

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
//
// These per-locale groups are the real, saved schema (still fetched by
// getPubliclyLiveLocales() etc. exactly as before) but are hidden from
// their own default checkbox-list rendering (`admin.hidden: true`) — a
// single custom `languageSettingsGrid` UI field below renders a card-grid
// view over them instead (see cms/admin/components/LanguageSettingsGrid.tsx,
// ported from the reviewed mockup phivara-design-html/cms/
// edit-language-settings-v2.html). Label/description text lives once in
// that component now rather than being repeated per locale here.
const localeFields: Field[] = LOCALE_META.map(({ code, label }) => ({
  name: code,
  type: 'group',
  label,
  admin: { hidden: true },
  fields: [
    {
      name: 'cmsEditable',
      type: 'checkbox',
      defaultValue: Boolean(DEFAULT_ON_LOCALES[code]),
      label: 'แก้ไขได้ใน CMS',
    },
    {
      name: 'publiclyLive',
      type: 'checkbox',
      defaultValue: Boolean(DEFAULT_ON_LOCALES[code]),
      label: 'เผยแพร่บนหน้าเว็บ',
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
  fields: [
    {
      name: 'languageSettingsGrid',
      type: 'ui',
      admin: {
        components: {
          Field: '/cms/admin/components/LanguageSettingsGrid#LanguageSettingsGrid',
        },
      },
    },
    ...localeFields,
  ],
}
