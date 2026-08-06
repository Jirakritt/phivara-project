import type { CollectionConfig } from 'payload'

import { hasAnyRole, isAdmin, publishedOrStaff } from '../access/roles'

// Source: js/doctor.js (listing card fields) + js/doctor-detail.js
// (hardcoded per-doctor detail content — this collection normalizes that
// into real, editable fields instead of if/else JS blocks).
export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'nameEn',
    defaultColumns: ['nameEn', 'specialty', 'branch'],
  },
  // Credentials/bio are medical claims — require a draft to be reviewed
  // before it goes live, instead of publishing on save.
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
      admin: { description: 'e.g. dr01 — used in doctor_detail.html?id=' },
    },
    { name: 'nameTh', type: 'text', required: true },
    { name: 'nameEn', type: 'text', required: true },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
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
      name: 'subNote',
      type: 'text',
      localized: true,
      admin: { description: 'Small credential line under the specialty, e.g. "Board Certified Plastic Surgeon"' },
    },
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
    { name: 'portrait', type: 'upload', relationTo: 'media', admin: { description: 'Large portrait for doctor_detail hero' } },
    { name: 'cardPhoto', type: 'upload', relationTo: 'media', admin: { description: 'Thumbnail for listing/carousel cards' } },
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
