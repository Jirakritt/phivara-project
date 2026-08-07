import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/roles'

// Source: js/main.js's hardcoded `awards` array (Awards & Recognition
// carousel on the homepage) — moved into a real collection so staff can
// add/remove/reorder awards without touching code. No explicit "order"
// field, same convention as Branches (see src/lib/homeData.ts): sort by
// `id` (creation order) so re-seeding preserves the original award-01..10
// sequence, and staff can reorder later by deleting + recreating if needed.
export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'image'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'e.g. "COVID Management Initiative of the Year - Thailand · Healthcare Asia Awards 2022"' },
    },
  ],
}
