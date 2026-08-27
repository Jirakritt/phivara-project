import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

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
  ],
}
