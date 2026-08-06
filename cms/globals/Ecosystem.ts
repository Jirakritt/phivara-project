import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// Source: ecosystem.html — a single landing page (like membership.html),
// not a repeatable collection, so this is a Payload Global too. The 4
// "disciplines" array is order-dependent and always exactly 4 items
// (Longevity, Dermatology, Wellness, Plastic Surgery) — the frontend zips
// each array index with a fixed set of structural constants (anchor id,
// doctor/program/article filter slug, CSS tone class) that live in code,
// not the CMS, since they're routing plumbing rather than editable copy.
export const Ecosystem: GlobalConfig = {
  slug: 'ecosystem',
  access: {
    read: () => true,
    update: hasAnyRole('admin', 'editor'),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'THE PHIVARA ECOSYSTEM' },
        { name: 'headlineLine1', type: 'text', localized: true, required: true },
        { name: 'headlineLine2', type: 'text', localized: true, required: true },
        { name: 'lead', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'disciplines',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      admin: { description: 'Exactly 4 rows, in order: Longevity, Dermatology, Aesthetic Wellness, Plastic Surgery.' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        {
          name: 'chips',
          type: 'array',
          fields: [{ name: 'label', type: 'text', localized: true, required: true }],
        },
        { name: 'doctorLinkLabel', type: 'text', localized: true, required: true },
        { name: 'programLinkLabel', type: 'text', localized: true, required: true },
        { name: 'articleLinkLabel', type: 'text', localized: true, required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'closingCta',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'BEGIN YOUR JOURNEY' },
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'buttonLabel', type: 'text', localized: true },
      ],
    },
  ],
}
