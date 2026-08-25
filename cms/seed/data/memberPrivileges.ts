// Seed content for the `member-privileges` Global (cms/globals/
// MemberPrivileges.ts) — the exact 6 cards that used to be hardcoded JSX in
// src/components/member/ProfileDashboard.tsx before that tab became
// CMS-driven. The old single "ส่วนลด" card whose % changed based on the
// viewing member's tier is now 3 separate cards (one per tier, per-tier %)
// since a card's copy here is fixed, not computed — see the conversation
// that requested this feature for why (1 card can target multiple tiers,
// but not vary its own text per tier).
//
// One deliberate icon change: the original birthday card used a plain
// checkmark (✓) SVG, which was never really "about" anything — the new
// preset icon set (cms/globals/MemberPrivileges.ts's `icon` options) has an
// actual gift-box icon, which fits a birthday privilege far better, so that
// card uses 'gift' here instead of trying to recreate the checkmark.
export interface MemberPrivilegeCardSeed {
  title: { th: string; en: string }
  description: { th: string; en: string }
  icon: 'discount' | 'priority' | 'doctor' | 'gift' | 'star' | 'heart' | 'diamond' | 'badge'
  // Slugs (cms/collections/MembershipTiers.ts's `slug` field), not raw
  // select values any more — seedMemberPrivileges.ts resolves each of these
  // to the tier's real id at seed time via a Local API lookup, since the
  // `tiers` field on the CMS side is now a relationship, not a fixed enum.
  tiers: ('silver' | 'gold' | 'diamond')[]
}

export const memberPrivilegeCards: MemberPrivilegeCardSeed[] = [
  {
    title: { th: 'ส่วนลด 5% ทุกบริการ', en: '5% off every service' },
    description: {
      th: 'ใช้ได้ทุกโปรแกรมตรวจและทรีตเมนต์ ทุกสาขา ไม่มีขั้นต่ำ',
      en: 'Valid on every program and treatment, at every branch, no minimum.',
    },
    icon: 'discount',
    tiers: ['silver'],
  },
  {
    title: { th: 'ส่วนลด 10% ทุกบริการ', en: '10% off every service' },
    description: {
      th: 'ใช้ได้ทุกโปรแกรมตรวจและทรีตเมนต์ ทุกสาขา ไม่มีขั้นต่ำ',
      en: 'Valid on every program and treatment, at every branch, no minimum.',
    },
    icon: 'discount',
    tiers: ['gold'],
  },
  {
    title: { th: 'ส่วนลด 15% ทุกบริการ', en: '15% off every service' },
    description: {
      th: 'ใช้ได้ทุกโปรแกรมตรวจและทรีตเมนต์ ทุกสาขา ไม่มีขั้นต่ำ',
      en: 'Valid on every program and treatment, at every branch, no minimum.',
    },
    icon: 'discount',
    tiers: ['diamond'],
  },
  {
    title: { th: 'คิวด่วน ไม่ต้องรอ', en: 'Priority queue' },
    description: {
      th: 'จองคิวผ่าน Concierge ได้ก่อนคิวทั่วไป สำหรับทุกสาขา',
      en: 'Book ahead of the general queue through Concierge, at any branch.',
    },
    icon: 'priority',
    tiers: ['silver', 'gold', 'diamond'],
  },
  {
    title: { th: 'ปรึกษาแพทย์ฟรี 1 ครั้ง/ปี', en: 'One free doctor consultation / year' },
    description: {
      th: 'นัดปรึกษาแพทย์ผู้เชี่ยวชาญโดยไม่มีค่าใช้จ่าย',
      en: 'Book a specialist consultation at no cost.',
    },
    icon: 'doctor',
    tiers: ['gold', 'diamond'],
  },
  {
    title: { th: 'ของขวัญวันเกิดพิเศษ', en: 'Birthday privilege' },
    description: {
      th: 'รับทรีตเมนต์พิเศษฟรีในเดือนเกิดของคุณ',
      en: 'A complimentary treatment in your birthday month.',
    },
    icon: 'gift',
    tiers: ['silver', 'gold', 'diamond'],
  },
]
