import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// Site-wide footer — shown on every page (see src/components/SiteFooter.tsx).
// The "สาขา" (Locations) column intentionally stays OUT of this global: it's
// wired directly to the Branches collection (src/lib/homeData.ts's
// getHomeData()) so it always reflects the real branch list, not a manually
// maintained link list like the columns below.
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: hasAnyRole('admin', 'editor'),
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: { description: 'ข้อความใต้โลโก้ PHIVARA มุมซ้ายของ footer' },
    },
    {
      name: 'linkGroups',
      type: 'array',
      label: 'คอลัมน์ลิงก์',
      admin: {
        description:
          'แต่ละคอลัมน์มีหัวข้อ + รายการเมนูย่อย (ไม่รวมคอลัมน์ "สาขา" ซึ่งดึงจากรายชื่อสาขาอัตโนมัติ)',
      },
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { description: 'เช่น /doctor หรือ https://example.com' },
            },
          ],
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      localized: true,
      admin: { description: 'ข้อความลิขสิทธิ์แถวล่างสุด เช่น © 2569 PHIVARA สงวนลิขสิทธิ์' },
    },
    {
      name: 'socialLinks',
      type: 'group',
      admin: { description: 'เว้นว่างช่องไหนไว้ ไอคอนนั้นจะไม่แสดง' },
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'line', type: 'text' },
      ],
    },
  ],
}
