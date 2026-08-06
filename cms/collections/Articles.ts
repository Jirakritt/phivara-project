import type { CollectionConfig } from 'payload'

import { hasAnyRole, isAdmin, publishedOrStaff } from '../access/roles'

// Source: js/main.js `journalArticles` (card fields) + article_detail.html
// (full prose body, TOC-driven H2 sections, blockquote, note-box,
// insight-grid, author box, related programs/doctors, popular sidebar).
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate'],
  },
  // Matches the marketing plan's governance step: "ตรวจทานด้านการแพทย์และ
  // กฎหมายก่อนเผยแพร่" — editors draft, a medical reviewer (or admin)
  // publishes.
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrStaff,
    create: hasAnyRole('admin', 'editor', 'medical-reviewer'),
    update: hasAnyRole('admin', 'editor', 'medical-reviewer'),
    delete: isAdmin,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. blue-ocean-pathway — used in article_detail.html?id=' },
    },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'summary', type: 'textarea', localized: true, admin: { description: 'Card excerpt + meta description base' } },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Longevity Medicine', value: 'longevity' },
        { label: 'Dermatology', value: 'dermatology' },
        { label: 'Plastic Surgery', value: 'plastic' },
        { label: 'Aesthetic Wellness', value: 'wellness' },
      ],
    },
    { name: 'categoryLabel', type: 'text', localized: true, admin: { description: 'Display badge, e.g. "เวชศาสตร์อายุยืนยาว"' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'author',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', localized: true, defaultValue: 'ทีมแพทย์ PHIVARA' },
        { name: 'role', type: 'text', localized: true },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
        {
          name: 'doctor',
          type: 'relationship',
          relationTo: 'doctors',
          admin: { description: 'Optional link to a specific doctor byline' },
        },
      ],
    },
    { name: 'publishedDate', type: 'date', required: true },
    { name: 'readTimeMinutes', type: 'number', required: true },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      admin: {
        description:
          'Main prose. H2 sections build the table of contents automatically; use blocks below for note-box / insight-grid components seen on the current site.',
      },
    },
    {
      name: 'insightSteps',
      type: 'array',
      admin: { description: 'Optional numbered "process" cards (e.g. the 4-step Blue Ocean Pathway grid)' },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
      ],
    },
    {
      name: 'noteBox',
      type: 'group',
      admin: { description: 'Optional callout box, e.g. "สิ่งสำคัญที่ควรรู้"' },
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'relatedPrograms', type: 'relationship', relationTo: 'programs', hasMany: true },
    { name: 'relatedDoctors', type: 'relationship', relationTo: 'doctors', hasMany: true },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Surface in the "MOST READ" sidebar' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}
