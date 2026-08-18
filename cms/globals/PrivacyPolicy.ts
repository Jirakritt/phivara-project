import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// Source: privacy-policy.html — a single legal page, not a repeatable
// collection. Modeled as one localized Lexical rich-text field (not split
// into the 10 individual PDPA sections) so legal/compliance staff can
// freely edit headings, paragraphs, and lists — add or remove a section —
// without needing a schema change. Same editor as an article body (see
// cms/collections/Articles.ts's `body` field).
//
// Each locale's content is a fully separate Lexical document (localized:
// true), fetched with the same target->en->th fallback chain used for
// Membership/Ecosystem/Footer/TopBar (see src/lib/privacyPolicyData.ts) so
// an untranslated locale never renders a blank legal page — a visitor
// always sees at least the English (or Thai) version.
export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'นโยบายความเป็นส่วนตัว (Privacy Policy)',
  access: {
    read: () => true,
    // Legal/compliance-sensitive page — keep edits to admin + editor only,
    // matching Membership/Ecosystem.
    update: hasAnyRole('admin', 'editor'),
  },
  fields: [
    {
      name: 'body',
      type: 'richText',
      localized: true,
      admin: {
        description:
          'เนื้อหานโยบายความเป็นส่วนตัวทั้งหมด (หัวข้อ ย่อหน้า และ list) แก้ไขได้อิสระต่อภาษา — ยังคงมีข้อความ [...] เป็น placeholder ที่ต้องรอทีมกฎหมายกรอกก่อนเผยแพร่จริง หากภาษาใดยังไม่มีเนื้อหา หน้าเว็บจะแสดงฉบับอังกฤษแทน (หรือไทย หากอังกฤษก็ยังไม่มี)',
      },
    },
  ],
}

export default PrivacyPolicy
