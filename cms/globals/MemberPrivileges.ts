import type { GlobalConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

// Powers the "สิทธิพิเศษ" (privileges) tab on a logged-in member's own
// profile dashboard (src/components/member/ProfileDashboard.tsx's
// tab === 'privilege' panel) — NOT the same as Membership.privileges (see
// cms/globals/Membership.ts), which is the "AUM Privileges" list on the
// public, unauthenticated /membership marketing page. That distinction is
// deliberate: this list is scoped per-tier and only ever seen by an
// authenticated member looking at their own account.
//
// Each card carries its own `tiers` (relationship, hasMany — one of the
// staff-managed rows in cms/collections/MembershipTiers.ts) rather than one
// fixed tier per card, so a card that applies identically across tiers
// (e.g. "priority queue") only needs to exist once — while something like a
// discount that differs per tier (Silver 5% / Gold 10% / Diamond 15%) is
// modeled as 3 separate cards, each scoped to its own tier. A member with no
// tier assigned yet (Members.membershipTier is null — see that file) never
// matches any card's `tiers` list and so sees none, matching
// ProfileDashboard's existing null-tier gate.
export const MemberPrivileges: GlobalConfig = {
  slug: 'member-privileges',
  access: {
    read: () => true,
    update: hasAnyRole('admin', 'editor'),
  },
  admin: {
    description: 'การ์ดสิทธิพิเศษที่สมาชิกเห็นในแท็บ "สิทธิพิเศษ" หน้าบัญชีของฉัน (คนละส่วนกับหน้า /membership สาธารณะ)',
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      admin: {
        description: 'เพิ่ม/ลบ/จัดลำดับการ์ดได้อิสระ — แต่ละการ์ดเลือกได้ว่าจะโชว์ให้ระดับสมาชิกไหนเห็นบ้าง (เลือกได้มากกว่า 1 ระดับ)',
      },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'star',
          // Preset icons only (no upload) — keeps every card visually
          // consistent with the rest of the dashboard's inline-SVG icon
          // style. Rendered by src/lib/memberPrivileges.ts's consumer,
          // ProfileDashboard.tsx (PRIVILEGE_ICONS map).
          options: [
            { label: 'ส่วนลด (ตะกร้า)', value: 'discount' },
            { label: 'คิวด่วน (นาฬิกา)', value: 'priority' },
            { label: 'แพทย์ (คน)', value: 'doctor' },
            { label: 'ของขวัญ', value: 'gift' },
            { label: 'ดาว', value: 'star' },
            { label: 'หัวใจ', value: 'heart' },
            { label: 'เพชร', value: 'diamond' },
            { label: 'ป้ายรางวัล', value: 'badge' },
          ],
        },
        {
          name: 'tiers',
          type: 'relationship',
          relationTo: 'membership-tiers',
          hasMany: true,
          required: true,
          admin: { description: 'แสดงการ์ดนี้ให้สมาชิกระดับที่เลือกเห็นเท่านั้น (เลือกได้หลายระดับ) — จัดการรายชื่อ tier ได้ที่เมนู "ระดับสมาชิก (Tiers)"' },
        },
      ],
    },
  ],
}
