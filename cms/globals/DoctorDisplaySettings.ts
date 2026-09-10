import type { GlobalConfig } from 'payload'

import { hasAnyRole, isAdminField } from '../access/roles'

// Site-wide "room" backdrops composited behind every doctor cutout photo
// (Doctors.ts's portrait/cardPhoto/featuredPhoto fields — now expected to
// be transparent PNGs with the doctor cut out, not full photos). One pair
// of images here is reused everywhere on the site instead of each doctor
// having their own background, so switching the studio/branch look is a
// single edit here rather than re-uploading every doctor's photo. Plain
// JPG/PNG is fine — see Media.ts's mimeTypes — since only the doctor
// cutouts need transparency, not these.
export const DoctorDisplaySettings: GlobalConfig = {
  slug: 'doctor-display-settings',
  label: 'พื้นหลังห้องรูปแพทย์ (Doctor Display Settings)',
  access: {
    read: () => true,
    update: hasAnyRole('admin', 'editor'),
  },
  fields: [
    {
      name: 'profileBackground',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'พื้นหลังห้องที่ใช้ร่วมกันทั่วเว็บ สำหรับรูปแพทย์แบบ "โปรไฟล์" ทั้งหมด — hero ที่หน้า /doctor/[slug] และการ์ด thumbnail (หน้ารายชื่อแพทย์ + กริดแพทย์ประจำสาขา) แนะนำสัดส่วนแนวตั้งประมาณ 4:5 ให้ใกล้เคียงกับรูปแพทย์ที่ตัดขอบไว้',
      },
    },
    {
      name: 'featuredBackground',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'พื้นหลังห้องสำหรับการ์ด "แพทย์หลักประจำสาขา" (featured) เท่านั้น — ใช้ร่วมกันทุกสาขา แนะนำสัดส่วนแนวนอนกว้าง ~1.9:1 (เช่น 1200x630px)',
      },
    },
    // A doctor practicing at several branches exists as several separate
    // published Doctors records sharing the same name (one record = one
    // branch, see Doctors.ts's `branch` field comment). The /doctor listing
    // (only) can either show every record as-is (once per branch) or merge
    // same-name records into a single card — see groupDoctorsByName() in
    // src/lib/doctorsData.ts and its call site in
    // src/app/[locale]/(public)/doctor/page.tsx. These 2 fields are
    // admin-only (isAdminField) per 2026-09-10 request — editors/reviewers
    // can see but not change how this site-wide behavior works.
    {
      name: 'groupDoctorsByBranch',
      type: 'checkbox',
      label: 'รวมหมอที่ประจำหลายสาขาเป็นการ์ดเดียว (หน้ารายชื่อแพทย์ /doctor)',
      defaultValue: true,
      access: {
        update: isAdminField,
      },
      admin: {
        description:
          'เมื่อเปิด: หมอที่ชื่อซ้ำกันในหลาย record (เพราะประจำหลายสาขา) จะถูกรวมแสดงเป็นการ์ดเดียวในหน้า /doctor พร้อมป้ายรวมทุกสาขา แทนการแสดงซ้ำทีละสาขา — ไม่กระทบหน้าโปรไฟล์สาขาหรือหน้ารายละเอียดหมอ ซึ่งยังอิงข้อมูลจริงเสมอ เฉพาะ Admin เท่านั้นที่แก้ค่านี้ได้',
      },
    },
    {
      name: 'multiBranchLabelStyle',
      type: 'select',
      label: 'รูปแบบป้ายสาขาบนการ์ดที่รวมหลายสาขา',
      defaultValue: 'list',
      options: [
        { label: 'แบบ A — ป้ายกลม (pill)', value: 'pills' },
        { label: 'แบบ B — บรรทัด PHIVARA + ชื่อสาขา', value: 'list' },
      ],
      access: {
        update: isAdminField,
      },
      admin: {
        condition: (data) => Boolean(data?.groupDoctorsByBranch),
        description:
          'ใช้เฉพาะตอนเปิด "รวมหมอที่ประจำหลายสาขาเป็นการ์ดเดียว" ด้านบน เฉพาะ Admin เท่านั้นที่แก้ค่านี้ได้',
      },
    },
    // Where the branch label(s) sit on every doctor card on /doctor —
    // applies to both the single-branch label and the multi-branch
    // pills/list above, uniformly across every card (not per-doctor).
    // Admin-only per 2026-09-10 request, same as the 2 fields above.
    {
      name: 'branchLabelPosition',
      type: 'select',
      label: 'ตำแหน่งแสดงป้ายสาขาบนการ์ดแพทย์',
      defaultValue: 'top',
      options: [
        { label: 'บนสุด (ใต้รูป)', value: 'top' },
        { label: 'ล่างสุด (เหนือปุ่ม "ดูประวัติแพทย์")', value: 'bottom' },
      ],
      access: {
        update: isAdminField,
      },
      admin: {
        description:
          'กำหนดตำแหน่งป้ายสาขาบนการ์ดแพทย์ทุกใบในหน้า /doctor (มีผลทั้งการ์ดสาขาเดียวและการ์ดที่รวมหลายสาขา) เฉพาะ Admin เท่านั้นที่แก้ค่านี้ได้',
      },
    },
  ],
}
