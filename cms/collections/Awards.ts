import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/roles'

async function revalidateHome() {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next (e.g. a seed/migrate script): nothing cached to purge.
  }
}

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
    defaultColumns: ['caption', 'enabled', 'image'],
  },
  // Saving/deleting an award refreshes the homepage right away (it's ISR-cached
  // for 60s) so switching an award off, or all of them, shows immediately.
  hooks: {
    afterChange: [revalidateHome],
    afterDelete: [revalidateHome],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'แสดงบนหน้าเว็บ',
      admin: {
        position: 'sidebar',
        description:
          'ปิดเพื่อซ่อนรางวัลนี้จากหน้าแรก (ข้อมูลและรูปยังอยู่ใน CMS) ถ้าปิดครบทุกรายการ ส่วน AWARDS & RECOGNITION ในหน้าแรกจะถูกซ่อนทั้งก้อน',
      },
    },
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
