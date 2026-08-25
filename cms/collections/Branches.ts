import type { CollectionConfig } from 'payload'

import { branchScopedOwnRecord, isAdmin } from '../access/roles'

// Source: js/site-shell.js `branches` array (single source of truth already
// on the live site) + facilities/directions/gallery found in js/branch-detail.js
// and contact.html / branch-*.html.
export const Branches: CollectionConfig = {
  slug: 'branches',
  admin: {
    // nameEn (flat field) removed — slug is the only field guaranteed to be
    // present, required, and unique, so it's the safest useAsTitle now that
    // `name` (localized) is optional per-locale.
    useAsTitle: 'slug',
    defaultColumns: ['displayOrder', 'slug', 'name', 'phone'],
  },
  // List view defaults to the same order the public site uses (see
  // src/lib/homeData.ts / src/lib/branchesData.ts, both `sort:
  // 'displayOrder,id'`) so what an editor sees here matches what visitors
  // see on the homepage/contact page without needing to click the column
  // header first.
  defaultSort: 'displayOrder',
  access: {
    read: () => true,
    // Address/hours/phone are operational facts, not marketing copy — new
    // branches and deletions stay admin-only, but a Content Editor
    // assigned to a branch (Users.assignedBranches) can now update that
    // one branch's own record. Medical Reviewers never touch this.
    create: isAdmin,
    update: branchScopedOwnRecord(),
    delete: isAdmin,
  },
  // Grouped into tabs (UI-only — none are named, so this doesn't change how
  // the data is stored/queried) to match the reviewed CMS mockup
  // (phivara-design-html/cms/edit-branches.html).
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'ข้อมูลพื้นฐาน',
          fields: [
            {
              // matches the `id` / `formValue` used in booking forms and URLs today
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: { description: 'e.g. sanampao, phaholyothin, sriayudhaya, sriracha, petchakasem' },
            },
            {
              // Controls display order everywhere this collection is listed
              // (homepage "PHIVARA DESTINATIONS" cards, /contact grid, footer,
              // register/basic-info "preferred branch" dropdown — see
              // homeData.ts and branchesData.ts, both sort by this field now
              // instead of creation order). Lower numbers show first; ties
              // fall back to creation order. Not required — new branches
              // default to 0 and can be sorted into place after saving.
              name: 'displayOrder',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'ลำดับการแสดงผล (ตัวเลขน้อยแสดงก่อน) — ใช้ที่หน้าแรก, หน้าติดต่อ, footer และฟอร์มสมัครสมาชิก',
                position: 'sidebar',
              },
            },
            // Per-locale name — the old flat nameTh/nameEn fields (from the
            // original additive migration, see Doctors.ts's `name` field
            // comment for the full rationale) have been removed now that
            // every read path uses this field instead. Deliberately NOT
            // required: an empty value in a given locale is how an editor
            // marks that locale as "not translated yet" for this branch,
            // and `required: true` would block saving that locale at all.
            { name: 'name', type: 'text', localized: true },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "Hospital-Grade Plastic Surgery Center"' },
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
          ],
        },
        {
          label: 'ที่อยู่ & เวลาทำการ',
          fields: [
            {
              name: 'address',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'hours',
              type: 'text',
              localized: true,
            },
            { name: 'phone', type: 'text' },
            { name: 'lineId', type: 'text', defaultValue: '@phivara' },
            {
              name: 'mapUrl',
              type: 'text',
              admin: { description: 'Google Maps link or embed URL (not present on current site — recommended addition)' },
            },
          ],
        },
        {
          label: 'รูปภาพ & แกลเลอรี',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'สิ่งอำนวยความสะดวก & เส้นทาง',
          fields: [
            {
              name: 'facilities',
              type: 'array',
              admin: { description: 'Facility highlight cards, e.g. "Positive Pressure Operating Theaters"' },
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
            },
            {
              name: 'directions',
              type: 'textarea',
              localized: true,
              admin: { description: 'BTS/parking directions shown on the branch detail page' },
            },
          ],
        },
        {
          label: 'แพทย์ & โปรแกรมที่เกี่ยวข้อง',
          fields: [
            {
              name: 'doctors',
              type: 'relationship',
              relationTo: 'doctors',
              hasMany: true,
              admin: { description: 'Doctors featured on this branch page (also filterable via Doctor.branch)' },
            },
            {
              name: 'featuredPrograms',
              type: 'relationship',
              relationTo: 'programs',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
}
