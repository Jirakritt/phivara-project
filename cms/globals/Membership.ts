import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// Source: membership.html — a single landing page (PHIVARA AUM), not a
// repeatable collection. Modeled as a Payload Global so staff edit one
// record instead of managing a list with one item.
export const Membership: GlobalConfig = {
  slug: 'membership',
  access: {
    read: () => true,
    // Single high-visibility page — keep edits to admin + editor only.
    update: hasAnyRole('admin', 'editor'),
  },
  // Grouped into tabs (UI-only — none are named, so this doesn't change how
  // the data is stored/queried) to match the reviewed CMS mockup
  // (phivara-design-html/cms/edit-membership.html) instead of 7 sections
  // stacked in one long scroll.
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
                { name: 'kicker', type: 'text', localized: true, defaultValue: 'PHIVARA PRIVATE MEMBERSHIP' },
                { name: 'headline', type: 'text', localized: true, required: true },
                { name: 'lead', type: 'textarea', localized: true },
                { name: 'heroImage', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'บทนำ & สิทธิพิเศษ',
          fields: [
            {
              name: 'intro',
              type: 'group',
              fields: [
                { name: 'overline', type: 'text', localized: true },
                { name: 'heading', type: 'text', localized: true },
                { name: 'body', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'privileges',
              type: 'array',
              admin: { description: 'The 4 "AUM Privileges" cards' },
              fields: [
                { name: 'title', type: 'text', localized: true, required: true },
                { name: 'description', type: 'textarea', localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: 'คำมั่นสัญญา & เส้นทางสมาชิก',
          fields: [
            {
              name: 'promise',
              type: 'group',
              admin: { description: '"The AUM Promise" quote section' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'quote', type: 'textarea', localized: true },
                { name: 'body', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'journeySteps',
              type: 'array',
              admin: { description: 'The 4-step "Your Membership Journey" list' },
              fields: [
                { name: 'title', type: 'text', localized: true, required: true },
                { name: 'description', type: 'textarea', localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: 'คำถามที่พบบ่อย',
          fields: [
            {
              name: 'faq',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', localized: true, required: true },
                { name: 'answer', type: 'textarea', localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: 'Final CTA',
          fields: [
            {
              name: 'finalCta',
              type: 'group',
              fields: [
                { name: 'overline', type: 'text', localized: true },
                { name: 'heading', type: 'text', localized: true },
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
