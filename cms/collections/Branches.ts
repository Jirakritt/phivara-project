import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/roles'

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
    // Address/hours/phone are operational facts, not marketing copy —
    // restrict to admin (ops) so a content editor can't accidentally
    // publish a wrong address or phone number.
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
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
}
