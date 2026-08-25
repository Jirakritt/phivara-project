import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// The homepage hero ("banner") — eyebrow/headline/lead/CTA text plus the
// rotating background image slideshow. Previously this was all hardcoded
// directly in src/app/(frontend)/page.tsx (and the image list in
// public/js/main.js), which meant staff couldn't change it without a code
// deploy. Modeled as a Global, same reasoning as Membership/Ecosystem: this
// is a single section, not a repeatable list.
export const HomeHero: GlobalConfig = {
  slug: 'home-hero',
  access: {
    read: () => true,
    update: hasAnyRole('admin', 'editor'),
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'THE ART OF BEAUGEVITY' },
    { name: 'headline', type: 'text', localized: true, required: true },
    { name: 'lead', type: 'textarea', localized: true },
    { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'จองปรึกษาส่วนตัว' },
    {
      name: 'backgroundImages',
      type: 'array',
      minRows: 1,
      // Not localized — the same photos rotate regardless of site language,
      // so this is one shared list rather than a per-locale one.
      admin: { description: 'Rotating hero background slideshow (public/js/main.js cross-fades between these every 7s).' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      // "WHY PHIVARA EXISTS" section right below the hero (src/app/[locale]/
      // (public)/page.tsx's <section className="intro" id="about">) — used
      // to be hardcoded brand copy, now editable here. UI-only grouping
      // (collapsible doesn't nest the stored data, so homeData.ts's flat
      // resolve() helper keeps working unchanged).
      type: 'collapsible',
      label: 'ทำไมต้อง PHIVARA (Why Phivara Exists)',
      fields: [
        { name: 'introEyebrow', type: 'text', localized: true, defaultValue: 'WHY PHIVARA EXISTS' },
        { name: 'introQuote', type: 'textarea', localized: true, required: true },
        { name: 'introBody1', type: 'textarea', localized: true },
        { name: 'introBody2', type: 'textarea', localized: true },
        { name: 'introTagline', type: 'text', localized: true, defaultValue: '— The Art of Beaugevity' },
        {
          type: 'row',
          fields: [
            { name: 'diagramLabelTl', type: 'text', localized: true, admin: { description: 'จุดบนซ้าย', width: '25%' } },
            { name: 'diagramLabelTr', type: 'text', localized: true, admin: { description: 'จุดบนขวา', width: '25%' } },
            { name: 'diagramLabelBl', type: 'text', localized: true, admin: { description: 'จุดล่างซ้าย', width: '25%' } },
            { name: 'diagramLabelBr', type: 'text', localized: true, admin: { description: 'จุดล่างขวา', width: '25%' } },
          ],
        },
      ],
    },
    {
      // "INTEGRATED EXPERTISE" tabbed section (src/app/[locale]/(public)/
      // page.tsx's <section className="expertise" id="expertise">) — the
      // 4 tabs' key (plastic/longevity/dermatology/wellness) stay
      // hardcoded in code since they must match Programs.category's select
      // options exactly (see cms/collections/Programs.ts). Display text AND
      // display order (each subgroup's "...Order" number field) are
      // editable. Read by both page.tsx (server-rendered eyebrow/heading)
      // and public/js/main.js (client-built tab bar + panel headers, via
      // window.__PHIVARA_MAIN_STRINGS__ — main.js sorts the 4 tabs by
      // categoryOrder before rendering).
      type: 'collapsible',
      label: 'หมวดความเชี่ยวชาญ (Integrated Expertise)',
      fields: [
        { name: 'expertiseEyebrow', type: 'text', localized: true, defaultValue: 'INTEGRATED EXPERTISE' },
        { name: 'expertiseHeadline', type: 'text', localized: true, required: true },
        {
          type: 'collapsible',
          label: 'Plastic Surgery (ศัลยกรรมตกแต่ง)',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'expertisePlasticLabel', type: 'text', localized: true, admin: { description: 'ชื่อ tab', width: '25%' } },
                { name: 'expertisePlasticTag', type: 'text', localized: true, admin: { description: 'แท็กเล็กเหนือหัวข้อ', width: '25%' } },
                { name: 'expertisePlasticTitle', type: 'text', localized: true, admin: { description: 'หัวข้อในแผงเนื้อหา', width: '25%' } },
                // Not localized — a single display-order number applies
                // across every locale (the 4 tabs should appear in the
                // same order for th/en/etc). Sorted ascending in
                // public/js/main.js before the tab bar is built.
                { name: 'expertisePlasticOrder', type: 'number', defaultValue: 1, admin: { description: 'ลำดับ tab (เลขน้อยแสดงก่อน)', width: '25%' } },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Anti-Aging & Longevity (เวชศาสตร์อายุยืนยาว)',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'expertiseLongevityLabel', type: 'text', localized: true, admin: { description: 'ชื่อ tab', width: '25%' } },
                { name: 'expertiseLongevityTag', type: 'text', localized: true, admin: { description: 'แท็กเล็กเหนือหัวข้อ', width: '25%' } },
                { name: 'expertiseLongevityTitle', type: 'text', localized: true, admin: { description: 'หัวข้อในแผงเนื้อหา', width: '25%' } },
                { name: 'expertiseLongevityOrder', type: 'number', defaultValue: 2, admin: { description: 'ลำดับ tab (เลขน้อยแสดงก่อน)', width: '25%' } },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Dermatology (ผิวหนัง)',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'expertiseDermatologyLabel', type: 'text', localized: true, admin: { description: 'ชื่อ tab', width: '25%' } },
                { name: 'expertiseDermatologyTag', type: 'text', localized: true, admin: { description: 'แท็กเล็กเหนือหัวข้อ', width: '25%' } },
                { name: 'expertiseDermatologyTitle', type: 'text', localized: true, admin: { description: 'หัวข้อในแผงเนื้อหา', width: '25%' } },
                { name: 'expertiseDermatologyOrder', type: 'number', defaultValue: 3, admin: { description: 'ลำดับ tab (เลขน้อยแสดงก่อน)', width: '25%' } },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Aesthetic Wellness (สุขภาวะเชิงความงาม)',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'expertiseWellnessLabel', type: 'text', localized: true, admin: { description: 'ชื่อ tab', width: '25%' } },
                { name: 'expertiseWellnessTag', type: 'text', localized: true, admin: { description: 'แท็กเล็กเหนือหัวข้อ', width: '25%' } },
                { name: 'expertiseWellnessTitle', type: 'text', localized: true, admin: { description: 'หัวข้อในแผงเนื้อหา', width: '25%' } },
                { name: 'expertiseWellnessOrder', type: 'number', defaultValue: 4, admin: { description: 'ลำดับ tab (เลขน้อยแสดงก่อน)', width: '25%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      // "PHIVARA DESTINATIONS" branch-highlight section (src/app/[locale]/
      // (public)/page.tsx's <section className="flagship" id="flagship">).
      // Just the section eyebrow/heading — the branch cards themselves
      // already come from the `branches` collection (see cms/collections/
      // Branches.ts, "สาขา" in the CMS nav), nothing to duplicate here.
      type: 'collapsible',
      label: 'สาขา (Destinations)',
      fields: [
        { name: 'destinationsEyebrow', type: 'text', localized: true, defaultValue: 'PHIVARA DESTINATIONS' },
        { name: 'destinationsHeadline', type: 'text', localized: true, required: true },
      ],
    },
    {
      // "OUR SPECIALISTS" doctor-carousel section (src/app/[locale]/
      // (public)/page.tsx's <section className="specialists" id="specialists">).
      // Just the section copy — the doctor cards themselves already come
      // from the `doctors` collection ("แพทย์ผู้เชี่ยวชาญ" in the CMS nav).
      type: 'collapsible',
      label: 'แพทย์ผู้เชี่ยวชาญ (Specialists)',
      fields: [
        { name: 'specialistsEyebrow', type: 'text', localized: true, defaultValue: 'OUR SPECIALISTS' },
        { name: 'specialistsHeadline', type: 'text', localized: true, required: true },
        { name: 'specialistsLead', type: 'textarea', localized: true },
        { name: 'specialistsLinkLabel', type: 'text', localized: true },
      ],
    },
    {
      // "THE JOURNAL" article-grid section (src/app/[locale]/(public)/
      // page.tsx's <section className="journal" id="journal">). Just the
      // section eyebrow/heading — the article cards themselves already come
      // from the `articles` collection ("บทความ" in the CMS nav).
      type: 'collapsible',
      label: 'บทความ (Journal)',
      fields: [
        { name: 'journalEyebrow', type: 'text', localized: true, defaultValue: 'THE JOURNAL' },
        { name: 'journalHeadline', type: 'text', localized: true, required: true },
      ],
    },
    {
      // "AWARDS & RECOGNITION" carousel section (src/app/[locale]/(public)/
      // page.tsx's <section className="awards">). Just the section eyebrow/
      // heading — the award cards themselves already come from the
      // `awards` collection ("รางวัลและการรับรอง" in the CMS nav).
      type: 'collapsible',
      label: 'รางวัล (Awards)',
      fields: [
        { name: 'awardsEyebrow', type: 'text', localized: true, defaultValue: 'AWARDS & RECOGNITION' },
        { name: 'awardsHeadline', type: 'text', localized: true, required: true },
      ],
    },
  ],
}
