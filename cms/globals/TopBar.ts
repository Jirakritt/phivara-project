import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// Site-wide top bar — the thin gold strip above the main header, shown on
// every page (see src/components/SiteHeader.tsx). Previously hardcoded
// (tagline text + a placeholder "02-XXX-XXXX" hotline that was never
// replaced with a real number). Each field is kept as one free-text string
// per locale rather than splitting the hotline into label+number parts —
// same "whole line is one field" approach Footer.ts uses for copyrightText.
export const TopBar: GlobalConfig = {
  slug: 'topbar',
  access: {
    read: () => true,
    update: hasAnyRole('admin', 'editor'),
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: { description: 'ข้อความฝั่งซ้ายของแถบบนสุด เช่น PHIVARA Aesthetic & Longevity Center' },
    },
    {
      name: 'hotlineText',
      type: 'text',
      localized: true,
      admin: { description: 'ข้อความสายด่วน ใส่เบอร์โทรจริงแทน 02-XXX-XXXX เช่น สายด่วนส่วนตัว: 02-123-4567' },
    },
    {
      name: 'lineText',
      type: 'text',
      localized: true,
      admin: { description: 'ข้อความ LINE เช่น LINE: @phivara' },
    },
  ],
}
