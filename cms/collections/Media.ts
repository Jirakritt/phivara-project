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
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
}
