import type { CollectionConfig } from 'payload'

import { isAdmin, isStaff } from '../access/roles'

// Captures every submission from the site-wide VIP Concierge booking modal
// (public/js/vip-modal.js's #vipForm — the single shared form behind every
// ".booking-trigger"/".vip-trigger" button on the site) AND the standalone
// appointment form on each doctor's detail page (public/js/
// doctor-appointment-form.js's #vipDirectForm) — both post to the same
// /api/leads route so staff triage every booking request from one list.
// Before this collection existed, both forms only validated fields
// client-side and showed a fake "Thank you" message — nothing was ever
// sent anywhere and every submission was lost the moment the form closed.
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'branch', 'service', 'preferredDate', 'status', 'createdAt'],
    description: 'Booking requests submitted through the VIP Concierge modal and doctor appointment forms across the site.',
  },
  access: {
    // Public form submissions — anyone can create a lead, nobody outside
    // staff can read/list/modify other people's contact info.
    create: () => true,
    read: isStaff,
    update: isStaff,
    // Deletion stays admin-only so a lead can't be accidentally wiped
    // during day-to-day triage.
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'phone',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string') return 'Phone number is required'
        const compact = value.replace(/[\s().-]/g, '')
        // Same pattern enforced client-side in vip-modal.js's validatePhone()
        // — kept in sync so a submission that bypasses the modal's own JS
        // (e.g. a direct API call) can't slip in a malformed number.
        const valid = /^0\d{8,9}$/.test(compact) || /^\+66\d{8,9}$/.test(compact)
        return valid || 'Enter a 9–10 digit phone number or use the +66 format'
      },
    },
    {
      // Deliberately a plain slug (text), not a `relationship` to
      // branches — branches are fully deleted and recreated on every
      // `npm run seed` run (safe-to-re-run content reset), but leads are
      // real visitor data that must survive that reset untouched. A hard
      // foreign key here would make the two incompatible: reseeding would
      // fail the moment a real lead exists, because Postgres can't delete
      // a branch row that a required FK still points to. The slug is
      // stable across reseeds (branches keep the same `slug` even though
      // their internal id changes), so it stays a meaningful reference
      // without creating that dependency.
      name: 'branch',
      type: 'text',
      required: true,
      admin: { description: 'Branch slug selected in the modal, e.g. "sanampao" (not a relationship — see field comment)' },
    },
    {
      name: 'service',
      type: 'select',
      required: true,
      options: [
        { label: 'Plastic Surgery', value: 'plastic-surgery' },
        { label: 'Anti-Aging & Longevity', value: 'longevity' },
        { label: 'Dermatology', value: 'dermatology' },
        { label: 'Aesthetic Wellness', value: 'wellness' },
        { label: 'PHIVARA AUM Membership', value: 'membership' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Free-text notes/preferred time. Pre-filled with doctor/program context when the modal was opened from a specific card (see triggerContext() in vip-modal.js).' },
    },
    {
      name: 'preferredDate',
      type: 'date',
      admin: {
        description: 'Only set by the doctor detail page\'s own appointment form (public/js/doctor-appointment-form.js) — the shared VIP modal has no date field, so this stays empty for those leads.',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'sourcePath',
      type: 'text',
      admin: { description: 'Page path the form was submitted from, e.g. /program/pv02 — for triage context, not shown to the visitor.', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { description: 'Internal triage status — not visible to the visitor.' },
    },
  ],
}
