import type { CollectionConfig } from 'payload'

import {
  branchScopedContent,
  hasAnyRole,
  publishedOrBranchScopedStaff,
  validateBranchesInScope,
  validateBranchInScope,
  validateMainBranchInBranches,
} from '../access/roles'
import { seoFields } from '../fields/seo'
import { autoSlugFromNameEn } from './hooks/autoSlugFromNameEn'

// Source: js/doctor.js (listing card fields) + js/doctor-detail.js
// (hardcoded per-doctor detail content — this collection normalizes that
// into real, editable fields instead of if/else JS blocks).
export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    // `name` (localized) is optional per-locale — an empty value here just
    // falls back to Payload's default "Untitled" label/link in the admin
    // list for that one row, which is an acceptable admin-only rough edge
    // in exchange for the list being searchable/clickable by doctor name
    // instead of the internal slug.
    useAsTitle: 'name',
    listSearchableFields: ['name'],
    defaultColumns: ['name', 'displayOrder', 'specialty', 'branch', '_status'],
  },
  // List view defaults to the same order the public site uses (see
  // src/lib/doctorsData.ts / src/lib/homeData.ts, both `sort:
  // ['displayOrder', 'id']`) so what an editor sees here matches what
  // visitors see on /doctor and the branch doctor grid without needing to
  // click the column header first. Mirrors Branches.ts's identical pattern.
  defaultSort: 'displayOrder',
  // Credentials/bio are medical claims — require a draft to be reviewed
  // before it goes live, instead of publishing on save.
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [autoSlugFromNameEn],
  },
  access: {
    // Scoped against the new `branches` (hasMany) field rather than the
    // legacy single `branch` — a branch-scoped editor/reviewer should see
    // and manage a doctor if they practice at ANY of that editor's
    // branches, not just whichever branch happens to be in the old field.
    // `branches` isn't `required` yet (see its field def below — kept
    // optional until the team finishes merging every doctor's duplicate
    // records), but every doctor should have it populated by the
    // backfillDoctorBranches.ts script; a doctor with no `branches` set
    // falls through `allowUnassigned:false` and is admin-only until fixed,
    // same safety behavior the old `branch`-based scoping had.
    read: publishedOrBranchScopedStaff('branches'),
    create: hasAnyRole('admin', 'editor', 'medical-reviewer'),
    update: branchScopedContent(['editor', 'medical-reviewer'], 'branches', false),
    delete: branchScopedContent(['editor'], 'branches', false),
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
                // Internal/technical field — name is the one editors search
                // and click into, so hide slug from the list table (and its
                // Columns picker) entirely rather than just deprioritizing
                // it. Still fully visible/editable on the doctor's own edit
                // form, just not in the list view.
                disableListColumn: true,
              },
            },
            {
              // Controls display order everywhere doctors are listed
              // (/doctor listing, the branch page's regular doctor grid —
              // see doctorsData.ts / homeData.ts / branchesData.ts, which
              // all sort by this field now instead of slug). Lower numbers
              // show first; ties fall back to id. Not required — new
              // doctors default to 0 and can be sorted into place after
              // saving. Mirrors Branches.ts's identical displayOrder field.
              name: 'displayOrder',
              type: 'number',
              defaultValue: 0,
              admin: {
                description:
                  'ลำดับการแสดงผล (ตัวเลขน้อยแสดงก่อน) — ใช้ที่หน้ารายชื่อแพทย์และกริดแพทย์ประจำสาขา',
                position: 'sidebar',
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
              // LEGACY — kept temporarily during the multi-branch rollout
              // (CR: "หมอ 1 profile หลายสาขา"). This is still the real field
              // every existing doctor doc has one value in (one doc per
              // branch today); `branches`/`mainBranch` below are the new
              // replacement. Not removed yet because: (1) access control
              // (branchScopedContent/publishedOrBranchScopedStaff above)
              // still reads this field, (2) the /doctor listing page's
              // groupDoctorsByName() fallback still needs it during the
              // transition while admins manually merge duplicate doctor
              // records one at a time (see the admin backfill plan — no
              // automatic merge-by-name, an admin reviews and merges each
              // doctor by hand). Safe to delete once every doctor has been
              // merged into `branches`/`mainBranch` and the grouping
              // fallback is retired.
              name: 'branch',
              type: 'relationship',
              relationTo: 'branches',
              required: true,
              validate: validateBranchInScope(false),
              admin: {
                description: '(เดิม) จะถูกแทนที่ด้วย "สาขาที่ออกตรวจ" ด้านล่าง — อย่าเพิ่งลบจนกว่าทีมจะรวมโปรไฟล์แพทย์ครบทุกคน',
              },
            },
            {
              // NEW — replaces `branch` above. A doctor can now practice at
              // more than one branch under a single shared profile, instead
              // of one separate published record per branch. Left optional
              // (not required) for now so existing docs don't fail
              // validation before the one-off backfill script
              // (cms/scripts/backfillDoctorBranches.ts) has run — this gets
              // tightened to required once every doctor has real data here.
              name: 'branches',
              type: 'relationship',
              relationTo: 'branches',
              hasMany: true,
              validate: validateBranchesInScope(true),
              admin: {
                description:
                  'สาขาที่แพทย์ท่านนี้ออกตรวจ (เลือกได้หลายสาขา) — โปรไฟล์เดียวกันจะใช้ร่วมกันในทุกสาขาที่เลือกไว้ที่นี่ ยกเว้นตารางออกตรวจซึ่งแยกตามสาขาด้านล่าง',
              },
            },
            {
              // NEW — decides which ONE of the selected `branches` this
              // doctor is treated as "แพทย์หลักประจำสาขา" (featured lead
              // doctor) at — see the isBranchFeatured/quote/featuredHighlights
              // tab further down. A doctor at 3 branches still has only one
              // "main" branch; the other branches just list them normally.
              name: 'mainBranch',
              type: 'relationship',
              relationTo: 'branches',
              validate: validateMainBranchInBranches,
              admin: {
                description: 'สาขาหลัก — ต้องเป็นหนึ่งในสาขาที่เลือกไว้ที่ "สาขาที่ออกตรวจ" ด้านบน ใช้กำหนดว่าจะแสดงเป็นแพทย์แนะนำ (featured) ที่หน้าไหน',
              },
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
          // Both fields are now composited on top of a shared "room"
          // background (cms/globals/DoctorDisplaySettings.ts's
          // profileBackground) at every touchpoint — /doctor/[slug] hero,
          // /doctor listing cards, and the branch page's doctor grid — so
          // the uploaded file itself must be a transparent-background PNG
          // cutout of just the doctor, not a full photo with its own
          // background baked in. Media.ts's mimeTypes still allows
          // jpeg/webp too (not hard-blocked), but those formats can't carry
          // transparency, so uploading one here will show as an opaque
          // rectangle over the room background instead of a floating
          // cutout.
          label: 'รูปภาพโปรไฟล์',
          fields: [
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'รูปแพทย์สำหรับ hero หน้าโปรไฟล์ — ต้องเป็น PNG ตัดพื้นหลังโปร่งใส (เฉพาะตัวคน) แนะนำสัดส่วนแนวตั้งประมาณ 4:5 พื้นหลังห้องจะดึงมาจาก Doctor Display Settings แทนอัตโนมัติ',
              },
            },
            {
              name: 'cardPhoto',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'รูปแพทย์สำหรับการ์ด thumbnail (หน้ารายชื่อแพทย์ + กริดแพทย์ประจำสาขา) — ต้องเป็น PNG ตัดพื้นหลังโปร่งใสเช่นกัน แนะนำสัดส่วนแนวตั้งประมาณ 4:5',
              },
            },
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
              // LEGACY — kept alongside `scheduleByBranch` below during the
              // multi-branch rollout, same reasoning as the `branch` field
              // above (one doc = one branch today, so this flat table was
              // never ambiguous about which branch it belonged to). Safe to
              // delete once every doctor has real data in
              // `scheduleByBranch`.
              name: 'schedule',
              type: 'array',
              admin: { description: '(เดิม) จะถูกแทนที่ด้วย "ตารางออกตรวจแยกตามสาขา" ด้านล่าง' },
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
              // NEW — replaces `schedule` above. One group per branch this
              // doctor practices at, rendered as one tab per branch on the
              // public profile page (src/app/[locale]/(public)/doctor/
              // [slug]/page.tsx) instead of a single flat table with a
              // repeated branch column.
              name: 'scheduleByBranch',
              type: 'array',
              admin: {
                description: 'ตารางออกตรวจ แยกตามสาขา — แต่ละกลุ่มด้านล่างคือ 1 สาขา ใช้แสดงเป็นแท็บเลือกสาขาบนหน้าเว็บ',
              },
              fields: [
                {
                  name: 'branch',
                  type: 'relationship',
                  relationTo: 'branches',
                  required: true,
                  admin: { description: 'ควรเป็นหนึ่งในสาขาที่เลือกไว้ที่ "สาขาที่ออกตรวจ" ด้านบนสุดของฟอร์ม' },
                },
                {
                  name: 'rows',
                  type: 'array',
                  admin: { description: 'วัน-เวลาออกตรวจของสาขานี้' },
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
          // existing specialtyLabel/subSpecialty fields above rather than
          // duplicating them here.
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
              // Deliberately NOT reusing portrait/cardPhoto, even though
              // it's the same PNG-cutout format — a doctor's featured pose
              // is usually its own separate shot (though re-uploading the
              // same file to all 3 fields is fine if that's all that
              // exists). Composited on top of the wide, shared
              // "featuredBackground" room image (Doctor Display Settings
              // global) inside the branch page's featured card — NOT a
              // background-image by itself the way it originally was (see
              // src/app/[locale]/(public)/branch/[slug]/page.tsx). Falls
              // back to cardPhoto/portrait if left blank (see
              // doctorsData.ts) so a doctor checked as featured without
              // this filled in doesn't render with a broken image.
              name: 'featuredPhoto',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'รูปแพทย์สำหรับการ์ดแพทย์หลัก — ต้องเป็น PNG ตัดพื้นหลังโปร่งใสเช่นเดียวกับ Portrait/Card Photo แนะนำสัดส่วนแนวตั้งประมาณ 4:5 พื้นหลังห้องกว้างจะดึงมาจาก Doctor Display Settings แทนอัตโนมัติ',
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
