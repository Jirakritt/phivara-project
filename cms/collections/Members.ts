import type { Access, CollectionConfig, FieldAccess } from 'payload'

import { isStaff } from '../access/roles'
import {
  generateForgotPasswordEmailHTML,
  generateForgotPasswordEmailSubject,
  generateVerifyEmailHTML,
  generateVerifyEmailSubject,
} from '../email/templates'
import { computeMemberNumber } from '../lib/memberNumber'

// PHIVARA Private Membership accounts — the public-facing customer/member
// login, entirely separate from `users` (staff/admin panel accounts). A
// second Payload auth-enabled collection is the supported way to run two
// independent login systems side by side: `req.user.collection` tells us
// which one is currently authenticated (see access functions below), so a
// staff session and a member session never get confused with each other
// even though both ultimately produce a `req.user`.
//
// `auth.verify: true` + `auth.forgotPassword` below turn on Payload's own
// built-in email-verification and password-reset flows (token generation,
// expiry, the `/api/members/verify/:token` and
// `/api/members/reset-password` REST endpoints) — the frontend pages under
// src/app/[locale]/(member)/* just call those endpoints (or the Local API
// equivalents `payload.verifyEmail`/`payload.forgotPassword`/
// `payload.resetPassword`) rather than reimplementing token logic here.
// The actual email delivery goes through the switchable Gmail/Microsoft
// Graph adapter configured in payload.config.ts's `email` option (see
// cms/email/adapter.ts) — generateEmailHTML/generateEmailSubject below only
// decide *what* the email says, not how it's sent.

const isStaffField: FieldAccess = ({ req: { user } }) => Boolean(user && user.collection === 'users')

// A member may read/update their own record; any logged-in staff account
// (regardless of role — matches Users.read's "any staff can read the
// directory" precedent) can read/update every member. Nobody else.
const isSelfOrStaff: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return true
  return { id: { equals: user.id } }
}

function isValidThaiPhone(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const compact = value.replace(/[\s().-]/g, '')
  // Same pattern as cms/collections/Leads.ts's phone validator, kept in
  // sync deliberately — one real-world phone format for the whole site.
  return /^0\d{8,9}$/.test(compact) || /^\+66\d{8,9}$/.test(compact)
}

export const Members: CollectionConfig = {
  slug: 'members',
  auth: {
    verify: {
      generateEmailHTML: generateVerifyEmailHTML,
      generateEmailSubject: generateVerifyEmailSubject,
    },
    forgotPassword: {
      expiration: 1000 * 60 * 60, // 1 hour, matches reset-password.html's "ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง" copy
      generateEmailHTML: generateForgotPasswordEmailHTML,
      generateEmailSubject: generateForgotPasswordEmailSubject,
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['memberNumber', 'email', 'firstName', 'lastName', 'membershipTier', '_verified', 'createdAt'],
    description: 'บัญชีสมาชิก PHIVARA Private Membership ที่ลูกค้าสมัครเองผ่านหน้าเว็บ (คนละระบบกับ Users ซึ่งเป็นบัญชีพนักงาน)',
    // Default search box only queries `useAsTitle` (email) — this adds
    // firstName/lastName/memberNumber as real DB-backed search targets too.
    // memberNumber only works here because it's a real stored column (see
    // the field def below + its afterChange hook) — a `type: 'ui'` virtual
    // field, which is what this used to be, can't be searched since it has
    // no actual column for Payload's search query to match against.
    listSearchableFields: ['email', 'firstName', 'lastName', 'memberNumber'],
  },
  access: {
    create: () => true,
    read: isSelfOrStaff,
    update: isSelfOrStaff,
    delete: isStaff,
  },
  // Populates the memberNumber column right after a member is created —
  // it's derived from `id`, which Postgres only assigns once the row
  // exists, so it can't be set in a beforeChange/default and needs this
  // follow-up update instead. Guarded by `!doc.memberNumber` so the
  // resulting nested `update` call (which re-triggers afterChange as an
  // 'update' operation) doesn't loop.
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && !doc.memberNumber) {
          await req.payload.update({
            collection: 'members',
            id: doc.id,
            data: { memberNumber: computeMemberNumber(doc.id) },
            req,
          })
        }
      },
    ],
  },
  fields: [
    {
      // Same "PHV 0002 0074" number the member sees on their own profile
      // card (src/components/member/ProfileDashboard.tsx's memberNumber())
      // — now a real stored column (populated by the afterChange hook
      // above via cms/lib/memberNumber.ts's shared formula) rather than
      // computed on the fly, specifically so staff can search by it (see
      // listSearchableFields above). readOnly since it's system-generated;
      // see cms/admin/components/MemberNumber.tsx for the display
      // components.
      name: 'memberNumber',
      type: 'text',
      unique: true,
      index: true,
      label: 'รหัสสมาชิก',
      admin: {
        readOnly: true,
        description: 'สร้างอัตโนมัติหลังสมัครสมาชิก ใช้ค้นหาได้จากช่องค้นหาด้านบน',
        components: {
          Cell: '/cms/admin/components/MemberNumber#MemberNumberCell',
          Field: '/cms/admin/components/MemberNumber#MemberNumberField',
        },
      },
    },
    // firstName/lastName/phone/dob/preferredBranch (below) are NOT
    // required at the schema level even though the register-basic-info
    // step treats all five as required in its own form validation — a
    // member exists (email+password, unverified) for the entire stretch
    // between step 1 (register) and step 3 (basic info), and Payload's
    // `create` on register only ever receives email+password. Enforcing
    // `required: true` here would make step 1 fail outright. "Complete
    // profile" is an application-level concept — see
    // src/lib/memberProfile.ts's hasCompleteProfile(), checked at the
    // basic-info PATCH and gating the profile page — not a DB constraint.
    // A member row with any of these five blank in this admin UI just
    // means that visitor verified their email but hasn't finished step 3
    // yet, not a bug.
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    {
      name: 'phone',
      type: 'text',
      validate: (value: unknown) => (!value || isValidThaiPhone(value) ? true : 'Enter a 9–10 digit phone number or use the +66 format'),
    },
    {
      name: 'dob',
      type: 'date',
      admin: {
        description: 'วันเกิด — บังคับกรอกที่หน้าสมัคร (ขั้นตอนที่ 3) แต่ไม่ได้บังคับระดับฐานข้อมูล เพราะบัญชีถูกสร้างตั้งแต่ขั้นตอนที่ 1 (แค่อีเมล+รหัสผ่าน) ก่อนจะมีข้อมูลนี้',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      // Deliberately a plain slug (text), not a `relationship` to
      // branches — same reasoning as Leads.branch: branches are fully
      // deleted and recreated on every `npm run seed` run, but a member's
      // account must survive that reset untouched. Populated from a real
      // dropdown on the frontend (fetched from the live Branches list at
      // request time), just not stored as a hard foreign key.
      name: 'preferredBranch',
      type: 'text',
      admin: {
        description:
          'Branch slug ที่สมาชิกเลือกไว้ตอนสมัคร — บังคับกรอกที่หน้าสมัคร (ขั้นตอนที่ 3) แต่ไม่ได้บังคับระดับฐานข้อมูลด้วยเหตุผลเดียวกับ dob ด้านบน — ไม่ใช่ relationship ด้วยเหตุผลเดียวกับ Leads.branch',
      },
    },
    {
      // Was a fixed select-enum (none/silver/gold/diamond); now a
      // relationship to cms/collections/MembershipTiers.ts so staff can
      // add/remove/reorder tiers freely without a code change. `null` =
      // "ยังไม่ได้กำหนด" (no tier assigned yet) — there's no literal "none"
      // record any more, an unset relationship IS the "none" state (see
      // src/components/member/ProfileDashboard.tsx's `tier` null-checks).
      name: 'membershipTier',
      type: 'relationship',
      relationTo: 'membership-tiers',
      access: {
        // Only staff can set/change a member's tier — the member never
        // grants this to themselves (no real purchase flow exists yet;
        // this is set manually by an admin per confirmed scope).
        update: isStaffField,
      },
      admin: { description: 'กำหนดโดยแอดมินเท่านั้น — ระบบยังไม่มีการซื้อขาย/คำนวณระดับสมาชิกอัตโนมัติ (จัดการรายชื่อ tier ได้ที่เมนู "ระดับสมาชิก (Tiers)")' },
    },
    {
      name: 'emailOptIn',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'รับข่าวสาร สิทธิพิเศษ และโปรโมชั่นทางอีเมล' },
    },
    {
      // Which locale the member was looking at when they registered (e.g.
      // 'th', 'en') — used purely to pick the language of transactional
      // emails (verify/reset) in cms/email/templates.ts. Plain text rather
      // than a `select` tied to src/lib/i18n.ts's LOCALE_CODES so this
      // Node-only cms/ file doesn't reach into src/ for it (kept in sync by
      // convention, same as this project's other intentionally-loose
      // string fields like Leads.branch).
      name: 'preferredLocale',
      type: 'text',
      defaultValue: 'th',
      admin: { description: "ภาษาที่สมาชิกใช้งานตอนสมัคร เช่น 'th', 'en' — ใช้เลือกภาษาของอีเมลยืนยัน/รีเซ็ตรหัสผ่านเท่านั้น" },
    },
  ],
}
