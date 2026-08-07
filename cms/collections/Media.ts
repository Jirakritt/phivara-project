import type { CollectionConfig } from 'payload'

import { isAdmin, isStaff } from '../access/roles'

// Backs every image field across Doctors, Programs, Articles, Branches
// (portraits, card photos, hero images, gallery shots, cover images).
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // public site needs to render images without auth
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      // 1.91:1 — the standard Open Graph / Twitter Card social-share ratio,
      // used by seo.ogImage (cms/fields/seo.ts) so LINE/Facebook/Twitter
      // previews crop correctly instead of using the 4:3 `card` or 16:9
      // `hero` sizes, both the wrong shape for a social preview.
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
}
