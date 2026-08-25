import type { CollectionConfig } from 'payload'

import { hasAnyRole } from '../access/roles'

function isValidHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
}

// Fully staff-managed membership tiers (Silver/Gold/Diamond today, but
// admins can add, remove, rename, or reorder tiers freely — nothing about
// the tier set is hardcoded anymore). Referenced from:
//  - Members.membershipTier (relationship, single) — which tier a member is on
//  - MemberPrivileges.cards.tiers (relationship, hasMany) — which tiers see
//    a given privilege card
// The member profile page (src/components/member/ProfileDashboard.tsx)
// renders the member's own card and the tier-comparison grid entirely from
// this collection's data (order + 3 gradient colors), replacing what used
// to be fixed `.mcard--gold/silver/diamond` CSS classes and hardcoded JS
// constants (TIER_LABEL/TIER_ORDER/TIER_DISCOUNT). There's deliberately no
// discount-percentage field here — per-tier discounts are just regular
// MemberPrivileges cards (e.g. "ส่วนลด 15% ทุกบริการ") scoped to one tier,
// not a separate numeric field to keep in sync.
export const MembershipTiers: CollectionConfig = {
  slug: 'membership-tiers',
  defaultSort: 'order',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'order'],
    description:
      'ระดับสมาชิก PHIVARA — เพิ่ม/ลบ/แก้ไข/จัดลำดับได้อิสระ ใช้กำหนดหน้าบัตรสมาชิก (สี) และผูกกับการ์ดสิทธิพิเศษ (member-privileges)',
  },
  access: {
    read: () => true,
    create: hasAnyRole('admin', 'editor'),
    update: hasAnyRole('admin', 'editor'),
    delete: hasAnyRole('admin', 'editor'),
  },
  fields: [
    { name: 'label', type: 'text', localized: true, required: true, admin: { description: 'ชื่อ tier ที่แสดงให้สมาชิกเห็น เช่น "Diamond"' } },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'รหัสภายในของ tier นี้ (ห้ามซ้ำ, ห้ามมีช่องว่าง) เช่น "diamond" — ไม่แสดงให้สมาชิกเห็น' },
      validate: (value: unknown) => (typeof value === 'string' && /^[a-z0-9-]+$/.test(value) ? true : 'ใช้ได้เฉพาะตัวพิมพ์เล็ก a-z, ตัวเลข, และ - เท่านั้น'),
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'ลำดับการแสดงผล (เลขน้อยไปมาก) — ใช้เรียงตารางเปรียบเทียบ tier ในหน้าโปรไฟล์สมาชิก' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'gradientStart',
          type: 'text',
          required: true,
          defaultValue: '#2C2313',
          admin: { description: 'สีเริ่มต้น (hex เช่น #2C2313)', width: '33%' },
          validate: (value: unknown) => (isValidHexColor(value) ? true : 'กรอกเป็นรหัสสี hex 6 หลัก เช่น #C7A76B'),
        },
        {
          name: 'gradientMid',
          type: 'text',
          required: true,
          defaultValue: '#C7A76B',
          admin: { description: 'สีกลาง (hex)', width: '33%' },
          validate: (value: unknown) => (isValidHexColor(value) ? true : 'กรอกเป็นรหัสสี hex 6 หลัก เช่น #C7A76B'),
        },
        {
          name: 'gradientEnd',
          type: 'text',
          required: true,
          defaultValue: '#2C2313',
          admin: { description: 'สีปลาย (hex)', width: '33%' },
          validate: (value: unknown) => (isValidHexColor(value) ? true : 'กรอกเป็นรหัสสี hex 6 หลัก เช่น #C7A76B'),
        },
      ],
    },
    {
      // Read-only live preview of the gradient card this tier produces —
      // see cms/admin/components/TierCardPreview.tsx. Writes nothing.
      name: 'cardPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '/cms/admin/components/TierCardPreview#TierCardPreview',
        },
      },
    },
  ],
}
