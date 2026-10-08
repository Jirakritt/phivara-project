import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access/roles'

// Site-wide "black & white" mode — e.g. for a period of mourning or a
// campaign. Rendered as a single `html{filter:grayscale(N%)}` rule by
// src/lib/grayscaleMode.ts, injected from the root layouts (public site
// only — never the Payload admin, so staff always see real colours).
//
// Semantics (see getGrayscaleCss()):
//   enabled = false              → never applies (master switch)
//   enabled, no dates            → applies until an admin switches it off
//   enabled, startAt and/or endAt → applies only inside that window
//     (only startAt: from then on; only endAt: from now until then)
//
// Admin-only to change (update: isAdmin) — a site-wide visual change is an
// operational decision, same treatment as LanguageSettings. `read` is
// public because it's not sensitive and the frontend fetches it via the
// Local API anyway. The afterChange hook purges Next's route cache so a
// save is visible right away instead of waiting for the homepage's 60s ISR.
export const GrayscaleMode: GlobalConfig = {
  slug: 'grayscale-mode',
  label: 'โหมดขาว-ดำ (Grayscale)',
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/', 'layout')
        } catch {
          // Not running inside Next (e.g. a migrate/seed script) — nothing cached to purge.
        }
      },
    ],
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'เปิดโหมดขาว-ดำ',
      admin: {
        description:
          'สวิตช์หลัก — ปิดเมื่อไรเว็บกลับเป็นสีปกติทันที (ไม่ว่าจะตั้งวันเวลาไว้อย่างไร) ถ้าเปิดและไม่ใส่วัน-เวลา โหมดจะทำงานต่อเนื่องจนกว่าจะปิดเอง',
      },
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      defaultValue: '100',
      label: 'ระดับความเป็นขาว-ดำ',
      options: Array.from({ length: 11 }, (_, i) => ({ label: `${i * 10}%`, value: String(i * 10) })),
      admin: { description: '0% = สีปกติ, 100% = ขาว-ดำเต็มที่ (ปรับได้ทีละ 10%)' },
    },
    {
      name: 'startAt',
      type: 'date',
      label: 'เริ่มแสดง (ไม่บังคับ)',
      admin: {
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: 'เว้นว่างได้ — ถ้าไม่ใส่จะเริ่มทันทีที่เปิดสวิตช์ (ตามเวลาของเครื่องที่ใช้แก้ไข)',
      },
    },
    {
      name: 'endAt',
      type: 'date',
      label: 'หยุดแสดง (ไม่บังคับ)',
      admin: {
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: 'เว้นว่างได้ — ถ้าไม่ใส่จะทำงานต่อเนื่องจนกว่าจะปิดสวิตช์ (การเปลี่ยนตามเวลาอัตโนมัติอาจช้าได้สูงสุดประมาณ 1 นาที)',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        const start = siblingData?.startAt ? new Date(siblingData.startAt as string).getTime() : NaN
        const end = value ? new Date(value as string).getTime() : NaN
        if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
          return 'เวลาหยุดต้องอยู่หลังเวลาเริ่มแสดง'
        }
        return true
      },
    },
  ],
}
