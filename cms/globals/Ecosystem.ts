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
  // Grouped into tabs (UI-only — none are named, so this doesn't change how
  // the data is stored/queried) to match the reviewed CMS mockup
  // (phivara-design-html/cms/edit-ecosystem.html). The 4 discipline rows use
  // a custom RowLabel (cms/admin/components/EcosystemRowLabel.tsx) showing
  // each row's own Title instead of the generic "Discipline 01/02/03/04".
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'THE PHIVARA ECOSYSTEM' },
                { name: 'headlineLine1', type: 'text', localized: true, required: true },
                { name: 'headlineLine2', type: 'text', localized: true, required: true },
                {
                  // Was a plain `textarea` — staff typed line breaks intending
                  // a lead paragraph followed by a bulleted list of the 4
                  // disciplines, but a plain textarea has no way to carry
                  // that structure through to the frontend: HTML collapses
                  // newlines in a `<p>` by default, so it all rendered as one
                  // run-on paragraph (reported 2026-08-27). richText gives
                  // staff a real bullet-list button, and the frontend now
                  // walks it with parseRichTextBlocks() (src/lib/richText.ts
                  // — the same helper src/lib/privacyPolicyData.ts already
                  // uses) instead of dumping the raw string into one <p>.
                  name: 'lead',
                  type: 'richText',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: '4 สาขาความเชี่ยวชาญ',
          fields: [
            {
              name: 'disciplines',
              type: 'array',
              minRows: 4,
              maxRows: 4,
              admin: {
                description: 'Exactly 4 rows, in order: Longevity, Dermatology, Aesthetic Wellness, Plastic Surgery.',
                components: {
                  // Shows each row's own Title instead of "Discipline 01/02/03/04" —
                  // see cms/admin/components/EcosystemRowLabel.tsx.
                  RowLabel: '/cms/admin/components/EcosystemRowLabel#DisciplineRowLabel',
                },
              },
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
          ],
        },
        {
          label: 'Closing CTA',
          fields: [
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
        },
      ],
    },
  ],
}
