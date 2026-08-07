import type { CollectionConfig } from 'payload'

import { branchScopedOwnRecord, isAdmin } from '../access/roles'

// Source: js/site-shell.js `branches` array (single source of truth already
// on the live site) + facilities/directions/gallery found in js/branch-detail.js
// and contact.html / branch-*.html.
export const Branches: CollectionConfig = {
  slug: 'branches',
  admin: {
    useAsTitle: 'nameEn',
    defaultColumns: ['nameEn', 'nameTh', 'phone'],
  },
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
            { name: 'nameTh', type: 'text', required: true },
            { name: 'nameEn', type: 'text', required: true },
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
