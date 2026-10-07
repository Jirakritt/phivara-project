import type { CollectionConfig } from 'payload'

import { hasAnyRole, isStaff } from '../access/roles'

// Homepage "special day" popup — one image shown over the homepage within a
// scheduled window (see src/components/HomePopup.tsx and
// src/app/api/popup/active/route.ts for how it's served).
//
// A collection (not a Global) so staff can prepare several campaigns ahead
// of time (e.g. Songkran, Mother's Day) and let each switch on/off by its own
// schedule. If more than one is active at the same moment, the one that
// started most recently wins — only ever one popup is shown.
//
// `read` is staff-only on purpose: the public site never queries this
// collection directly, it goes through the /api/popup/active route (Local
// API, bypasses access) which returns only the currently-active popup — so
// an unpublished/future campaign can't be discovered via GET /api/popups.
//
// "Re-show after N minutes" is enforced in the visitor's browser
// (localStorage), not here — see HomePopup.tsx. The popup's `id` plus its
// image identity form the "campaign key": a brand-new popup, or a replaced
// image, counts as a new round and shows immediately, while merely editing
// the schedule or interval does not reset a visitor's cooldown.
export const Popups: CollectionConfig = {
  slug: 'popups',
  labels: { singular: 'Popup', plural: 'Popups' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'enabled', 'startAt', 'endAt', 'reshowIntervalMinutes'],
  },
  access: {
    read: isStaff,
    create: hasAnyRole('admin', 'editor'),
    update: hasAnyRole('admin', 'editor'),
    delete: hasAnyRole('admin', 'editor'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'ชื่อสำหรับทีมงาน (ไม่แสดงบนหน้าเว็บ) เช่น "สงกรานต์ 2569"' },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'ปิดเพื่อหยุดแสดง popup นี้ทันที (แม้ยังอยู่ในช่วงเวลา)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'รูปที่แสดงใน popup (ใช้รูปเดียวทุกภาษาและทุกอุปกรณ์) แนะนำแนวตั้งหรือสี่เหลี่ยมจัตุรัส กว้างอย่างน้อย 800px — เปลี่ยนรูปแล้วผู้เข้าชมจะเห็น popup ทันทีโดยไม่ต้องรอช่วงเวลาแสดงซ้ำ',
      },
    },
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'คำอธิบายรูปสำหรับผู้ใช้ screen reader (ไม่บังคับ — ถ้าเว้นว่างจะใช้ชื่อด้านบน)' },
    },
    {
      name: 'startAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: 'วัน-เวลาที่เริ่มแสดง (ตามเวลาของเครื่องที่ใช้แก้ไข)',
      },
    },
    {
      name: 'endAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: 'วัน-เวลาที่หยุดแสดง',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        const start = siblingData?.startAt ? new Date(siblingData.startAt as string).getTime() : NaN
        const end = value ? new Date(value as string).getTime() : NaN
        if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
          return 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มแสดง'
        }
        return true
      },
    },
    {
      name: 'reshowIntervalMinutes',
      type: 'number',
      required: true,
      defaultValue: 15,
      min: 1,
      admin: {
        position: 'sidebar',
        step: 1,
        description:
          'ผู้เข้าชมคนเดิมที่ refresh หน้า จะเห็น popup อีกครั้งเมื่อพ้นกี่นาทีนับจากครั้งที่แสดงล่าสุด (ค่าเริ่มต้น 15)',
      },
    },
    {
      name: 'linkUrl',
      type: 'text',
      admin: {
        description: 'ลิงก์เมื่อคลิกรูป (ไม่บังคับ) — ใส่ https://… หรือ path ภายในเว็บ เช่น /th/membership',
      },
      validate: (value: unknown) => {
        if (!value) return true
        const v = String(value).trim()
        if (/^https?:\/\//i.test(v) || (v.startsWith('/') && !v.startsWith('//'))) return true
        return 'ต้องขึ้นต้นด้วย https://, http:// หรือ / (เช่น /th/membership)'
      },
    },
  ],
}
