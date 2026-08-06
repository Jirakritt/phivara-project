import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// The homepage hero ("banner") — eyebrow/headline/lead/CTA text plus the
// rotating background image slideshow. Previously this was all hardcoded
// directly in src/app/(frontend)/page.tsx (and the image list in
// public/js/main.js), which meant staff couldn't change it without a code
// deploy. Modeled as a Global, same reasoning as Membership/Ecosystem: this
// is a single section, not a repeatable list.
export const HomeHero: GlobalConfig = {
  slug: 'home-hero',
  access: {
    read: () => true,
    update: hasAnyRole('admin', 'editor'),
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'THE ART OF BEAUGEVITY' },
    { name: 'headline', type: 'text', localized: true, required: true },
    { name: 'lead', type: 'textarea', localized: true },
    { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'จองปรึกษาส่วนตัว' },
    {
      name: 'backgroundImages',
      type: 'array',
      minRows: 1,
      // Not localized — the same photos rotate regardless of site language,
      // so this is one shared list rather than a per-locale one.
      admin: { description: 'Rotating hero background slideshow (public/js/main.js cross-fades between these every 7s).' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}
