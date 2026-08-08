import type { CollectionConfig } from 'payload'

import {
  branchScopedContent,
  hasAnyRole,
  publishedOrBranchScopedStaff,
  validateBranchInScope,
} from '../access/roles'
import { seoFields } from '../fields/seo'

// Source: js/main.js `journalArticles` (card fields) + article_detail.html
// (full prose body, TOC-driven H2 sections, blockquote, note-box,
// insight-grid, author box, related programs/doctors, popular sidebar).
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', '_status'],
  },
  // Matches the marketing plan's governance step: "ตรวจทานด้านการแพทย์และ
  // กฎหมายก่อนเผยแพร่" — editors draft, a medical reviewer (or admin)
  // publishes.
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrBranchScopedStaff('branch'),
    create: hasAnyRole('admin', 'editor', 'medical-reviewer'),
    // Same convention as Programs: branch is optional (most articles are
    // editorial content not tied to one location), so unassigned articles
    // stay editable by every branch-scoped editor/reviewer; only admins
    // can delete one of those shared articles.
    update: branchScopedContent(['editor', 'medical-reviewer'], 'branch', true),
    delete: branchScopedContent(['editor'], 'branch', false),
  },
  // Grouped into tabs (UI-only — none are named, so this doesn't change how
  // the data is stored/queried) to match the reviewed CMS mockup
  // (phivara-design-html/cms/edit-articles.html).
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'ข้อมูลพื้นฐาน',
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
            {
              name: 'branch',
              type: 'relationship',
              relationTo: 'branches',
              admin: { description: 'Optional — only set this if the article is specific to one branch. Leave blank for general editorial content.' },
              validate: validateBranchInScope(true),
            },
            { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
            { name: 'publishedDate', type: 'date', required: true },
            { name: 'readTimeMinutes', type: 'number', required: true },
            {
              name: 'popular',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Surface in the "MOST READ" sidebar' },
            },
          ],
        },
        {
          label: 'เนื้อหาบทความ',
          fields: [
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
          ],
        },
        {
          label: 'ผู้เขียน & แท็ก & ที่เกี่ยวข้อง',
          fields: [
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
            {
              name: 'tags',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'relatedPrograms', type: 'relationship', relationTo: 'programs', hasMany: true },
            { name: 'relatedDoctors', type: 'relationship', relationTo: 'doctors', hasMany: true },
          ],
        },
        {
          label: 'SEO',
          fields: [seoFields()],
        },
      ],
    },
  ],
}
