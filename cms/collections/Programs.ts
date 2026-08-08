import type { CollectionConfig } from 'payload'

import {
  branchScopedContent,
  hasAnyRole,
  publishedOrBranchScopedStaff,
  validateBranchInScope,
} from '../access/roles'
import { seoFields } from '../fields/seo'

// Source: js/main.js `homepagePrograms`, program.html card markup (card-code,
// card-tag, card-list, card-foot) and program_detail.html `programs` object
// (about text, purpose/audience lists, checkup table, terms of service).
//
// Note: the current site uses two different category taxonomies in parallel
// (program.html filters: longevity/hormone/heart/skin/women vs.
// program_detail.html categoryByProgram: plastic/longevity/dermatology/
// wellness). Pick one taxonomy before building — `category` below defaults
// to the broader Beaugevity pillars used elsewhere on the site; add a
// second `filterTag` field if the finer program.html filter set is still
// wanted for the catalog page.
export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', '_status'],
  },
  // Checkup lists and terms of service are medical/legal content — require
  // a draft to be reviewed before it goes live, instead of publishing on save.
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrBranchScopedStaff('branch'),
    create: hasAnyRole('admin', 'editor', 'medical-reviewer'),
    // branch is optional here — a program with no branch set (e.g. pv02)
    // is available at every location, so it stays editable by every
    // branch-scoped editor/reviewer. Deleting one of those shared programs
    // is reserved for admins only (allowUnassigned: false on delete).
    update: branchScopedContent(['editor', 'medical-reviewer'], 'branch', true),
    delete: branchScopedContent(['editor'], 'branch', false),
  },
  // Grouped into tabs (UI-only — none are named, so this doesn't change how
  // the data is stored/queried; existing seeded documents and seed.ts both
  // keep working unmodified) to match the reviewed CMS mockup
  // (phivara-design-html/cms/edit-view.html) instead of one long scrolling
  // list of 21 fields.
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
              admin: { description: 'e.g. pv01 — used in program_detail.html?id=' },
            },
            { name: 'code', type: 'text', admin: { description: 'e.g. "PV · 01"' } },
            {
              name: 'category',
              type: 'select',
              required: true,
              options: [
                { label: 'Plastic Surgery', value: 'plastic' },
                { label: 'Dermatology', value: 'dermatology' },
                { label: 'Longevity Medicine', value: 'longevity' },
                { label: 'Aesthetic Wellness', value: 'wellness' },
              ],
            },
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'price', type: 'number', required: true, admin: { description: 'THB' } },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Show in the /program highlight carousel (program.html originally hardcoded pv01, pv02, pv03, pv06 here)' },
            },
            {
              name: 'branch',
              type: 'relationship',
              relationTo: 'branches',
              admin: { description: 'Leave blank if this program is available at every branch.' },
              validate: validateBranchInScope(true),
            },
            {
              name: 'validityNote',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "รับบริการได้ถึง 30/12/69"' },
            },
          ],
        },
        {
          label: 'การ์ดแคตตาล็อก',
          description: 'สิ่งที่แสดงบนการ์ดในหน้ารายการ /program',
          fields: [
            {
              name: 'tag',
              type: 'text',
              localized: true,
              admin: { description: 'Card badge, e.g. "LONGEVITY", "CARDIOVASCULAR", "CELLULAR HEALTH"' },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              admin: { description: 'Catalog card description' },
            },
            {
              name: 'highlights',
              type: 'array',
              admin: { description: '2 bullet points shown on the catalog card' },
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
            },
            {
              name: 'cardNote',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "ปรึกษาแพทย์พร้อมสรุปผล", "เหมาะสำหรับทุกเพศ"' },
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'searchKeywords', type: 'text', admin: { description: 'Hidden keywords for the catalog search box' } },
          ],
        },
        {
          label: 'เนื้อหาหน้ารายละเอียด',
          fields: [
            {
              name: 'aboutProgram',
              type: 'richText',
              localized: true,
              admin: { description: 'Full "เกี่ยวกับโปรแกรมตรวจ" description on the detail page' },
            },
            {
              name: 'purposeList',
              type: 'array',
              admin: { description: '"ตรวจเพื่ออะไร" bullet list' },
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
            },
            {
              name: 'audienceList',
              type: 'array',
              admin: { description: '"เหมาะกับใคร" bullet list' },
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
            },
            {
              name: 'checkupItems',
              type: 'array',
              admin: { description: 'Checkup table rows; use "group" to split male/female lists like PV·02' },
              fields: [
                {
                  name: 'group',
                  type: 'select',
                  defaultValue: 'all',
                  options: ['all', 'male', 'female'],
                },
                { name: 'name', type: 'text', localized: true, required: true },
                { name: 'description', type: 'text', localized: true },
              ],
            },
            {
              name: 'termsOfService',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'description', type: 'textarea', localized: true, required: true },
              ],
            },
            {
              name: 'contactOverride',
              type: 'group',
              admin: { description: 'Optional override of the branch’s default contact info (used by pv02 today)' },
              fields: [
                { name: 'location', type: 'text', localized: true },
                { name: 'hours', type: 'text', localized: true },
                { name: 'phone', type: 'text' },
              ],
            },
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
