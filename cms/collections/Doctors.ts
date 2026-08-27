import type { CollectionConfig } from 'payload'

import {
  branchScopedContent,
  hasAnyRole,
  publishedOrBranchScopedStaff,
  validateBranchInScope,
} from '../access/roles'
import { seoFields } from '../fields/seo'
import { autoSlugFromNameEn } from './hooks/autoSlugFromNameEn'

// Source: js/doctor.js (listing card fields) + js/doctor-detail.js
// (hardcoded per-doctor detail content — this collection normalizes that
// into real, editable fields instead of if/else JS blocks).
export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    // nameEn (flat field) removed — slug is the only field guaranteed to be
    // present and unique, so it's the safest useAsTitle now that `name`
    // (localized) is optional per-locale.
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'name', 'specialty', 'branch', '_status'],
  },
  // Credentials/bio are medical claims — require a draft to be reviewed
  // before it goes live, instead of publishing on save.
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [autoSlugFromNameEn],
  },
  access: {
    read: publishedOrBranchScopedStaff('branch'),
    create: hasAnyRole('admin', 'editor', 'medical-reviewer'),
    // branch is required on every doctor (no "shared/unassigned" case here
    // — see the field below), so update/delete both use the same scoping.
    update: branchScopedContent(['editor', 'medical-reviewer'], 'branch', false),
    delete: branchScopedContent(['editor'], 'branch', false),
  },
  // Grouped into tabs (UI-only — none are named, so this doesn't change how
  // the data is stored/queried) to match the reviewed CMS mockup
  // (phivara-design-html/cms/edit-doctors.html) instead of one long
  // scrolling list of 18 fields.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'ข้อมูลพื้นฐาน',
          fields: [
            {
              // Not `required` at the field level — the client-side required
              // check would block saving with the field left blank, which is
              // exactly the case autoSlugFromNameEn (beforeValidate hook,
              // server-side) is meant to fill in. nameEn is required, so the
              // hook always has something to generate from.
              name: 'slug',
              type: 'text',
              unique: true,
              admin: {
                description:
                  'URL for the doctor page, e.g. /doctor/dr-punnawit-sirimetha. Leave blank to auto-generate from Name En, or type your own custom URL.',
              },
            },
            // Per-locale name. The old flat nameTh/nameEn fields (kept
            // during the original additive migration so existing data and
            // any code still reading them wouldn't break) have now been
            // removed — every read path (including autoSlugFromNameEn) uses
            // this field for every locale including th/en.
            //
            // Deliberately NOT required: the whole point of this field is
            // per-locale filtering (src/lib/payload.ts's hasLocaleContent,
            // used throughout src/lib/doctorsData.ts) — a doctor with no
            // `name` in, say, ja is how an editor says "don't show this
            // doctor on the Japanese site yet". Marking it required would
            // make Payload's admin block saving/publishing that locale
            // entirely with an empty name, making it impossible to leave a
            // locale intentionally untranslated.
            { name: 'name', type: 'text', localized: true },
            {
              name: 'branch',
              type: 'relationship',
              relationTo: 'branches',
              required: true,
              validate: validateBranchInScope(false),
            },
            {
              name: 'specialty',
              type: 'select',
              required: true,
              options: [
                { label: 'Plastic Surgery', value: 'plastic' },
                { label: 'Dermatology', value: 'dermatology' },
                { label: 'Longevity Medicine', value: 'longevity' },
                { label: 'Aesthetic Wellness', value: 'wellness' },
              ],
              admin: { description: 'Filter key used on doctor.html (matches the 4 Beaugevity pillars)' },
            },
            {
              name: 'specialtyLabel',
              type: 'text',
              localized: true,
              admin: { description: 'Display text on the card, e.g. "ศัลยกรรมตกแต่งรอบดวงตาและใบหน้า"' },
            },
            {
              // Distinct from boardCertification (ประวัติและวุฒิบัตร tab,
              // used on /doctor for credential text like "วุฒิบัตรสาขา...")
              // — this is a plain profile field like specialtyLabel/subNote,
              // currently only surfaced on the branch "แพทย์หลักประจำสาขา"
              // featured card's "ความชำนาญพิเศษเฉพาะทาง" fact (see
              // branch/[slug]/page.tsx).
              name: 'subSpecialty',
              type: 'text',
              localized: true,
              admin: { description: 'ความชำนาญพิเศษเฉพาะทาง — ใช้แสดงในการ์ดแพทย์หลักประจำสาขา เช่น "ตจวิทยา"' },
            },
            {
              name: 'subNote',
              type: 'text',
              localized: true,
              admin: { description: 'Small credential line under the specialty, e.g. "Board Certified Plastic Surgeon"' },
            },
          ],
        },
        {
          label: 'รูปภาพโปรไฟล์',
          fields: [
            { name: 'portrait', type: 'upload', relationTo: 'media', admin: { description: 'Large portrait for doctor_detail hero' } },
            { name: 'cardPhoto', type: 'upload', relationTo: 'media', admin: { description: 'Thumbnail for listing/carousel cards' } },
          ],
        },
        {
          label: 'ประวัติและวุฒิบัตร',
          fields: [
            {
              name: 'hospitalTitle',
              type: 'text',
              localized: true,
              admin: { description: 'Hero badge on doctor_detail, e.g. "แพทย์ประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา"' },
            },
            {
              name: 'boardCertification',
              type: 'text',
              localized: true,
              admin: { description: 'Sub-title under the doctor name, e.g. "วุฒิบัตรสาขาศัลยศาสตร์ตกแต่ง..."' },
            },
            {
              name: 'tags',
              type: 'array',
              admin: { description: 'Pill tags on the profile header, e.g. "✦ Plastic Surgery"' },
              fields: [{ name: 'label', type: 'text', localized: true, required: true }],
            },
            {
              name: 'bio',
              type: 'richText',
              localized: true,
            },
            {
              name: 'credentialGroups',
              type: 'array',
              admin: { description: 'e.g. "Education & Certifications", "Professional Experience", "Clinical Specialization"' },
              fields: [
                { name: 'heading', type: 'text', localized: true, required: true },
                {
                  name: 'items',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', localized: true, required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'ตารางออกตรวจ & ติดต่อ',
          fields: [
            {
              name: 'schedule',
              type: 'array',
              admin: { description: 'Weekly outpatient schedule table' },
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  required: true,
                  options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                },
                { name: 'hours', type: 'text', required: true, admin: { description: 'e.g. "09:00 - 20:00 น."' } },
                { name: 'locationName', type: 'text', localized: true },
                { name: 'locationNote', type: 'text', localized: true },
              ],
            },
            {
              name: 'contactIntro',
              type: 'textarea',
              localized: true,
              admin: { description: 'Paragraph inviting appointment requests on the doctor page' },
            },
            {
              name: 'contactFact',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "ศูนย์ศัลยกรรมตกแต่ง · โรงพยาบาลพญาไทศรีราชา"' },
            },
          ],
        },
        {
          // Powers the optional "featured lead doctor" hero card on the
          // branch profile page (src/app/[locale]/(public)/branch/[slug]/
          // page.tsx) — see that file's top comment for why this never had
          // a schema home before now. Leave `isBranchFeatured` unchecked on
          // every doctor at a branch and the section simply doesn't render
          // (same as today). Check it on more than one doctor at the same
          // branch and the page renders them as a slide instead of a single
          // static card — see public/js/branch-doctor-featured-slider.js.
          // The card's "ความชำนาญ"/"ความชำนาญพิเศษเฉพาะทาง" facts reuse the
          // existing specialtyLabel/boardCertification fields above rather
          // than duplicating them here.
          label: 'แพทย์หลักประจำสาขา',
          fields: [
            {
              name: 'isBranchFeatured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'แสดงแพทย์คนนี้เป็นการ์ดใหญ่ (featured) ในหน้าโปรไฟล์ของสาขาตัวเอง ถ้ามีมากกว่า 1 คนต่อสาขาที่ติ๊กไว้ จะแสดงเป็น slide ให้เลื่อนดูทีละคนแทนการ์ดเดี่ยว',
              },
            },
            {
              // Deliberately NOT reusing portrait/cardPhoto — this renders
              // as a wide `background-image` behind the whole featured
              // card, not inside a fixed square/portrait photo-frame, so it
              // needs its own wide-format image (see the original design
              // reference: public/assets/images/doctors/
              // dr-highlight-sanampao.png, 2752x1536 / 16:9). Falls back to
              // cardPhoto/portrait if left blank (see doctorsData.ts) so a
              // doctor checked as featured without this filled in doesn't
              // render with a broken image, but the fallback photo will
              // look stretched/cropped since it wasn't shot for this frame.
              name: 'featuredPhoto',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'รูปพื้นหลังการ์ดแพทย์หลัก แนะนำอัตราส่วนแนวนอนกว้าง ~16:9 (เช่น 2752x1536px) — คนละรูปกับ Portrait/Card Photo เพราะสัดส่วนไม่เท่ากัน',
                condition: (_, siblingData) => Boolean(siblingData?.isBranchFeatured),
              },
            },
            {
              name: 'quote',
              type: 'text',
              localized: true,
              admin: {
                description: 'คำคมที่แสดงในการ์ดแพทย์หลัก',
                condition: (_, siblingData) => Boolean(siblingData?.isBranchFeatured),
              },
            },
            {
              name: 'featuredHighlights',
              type: 'array',
              admin: {
                description: 'รายการ checklist ในการ์ดแพทย์หลัก เช่น "ประเมินสุขภาพเชิงลึก & ฟื้นฟูสมดุล" — ใส่กี่ข้อก็ได้',
                condition: (_, siblingData) => Boolean(siblingData?.isBranchFeatured),
              },
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
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
