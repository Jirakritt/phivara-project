import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf } from '../access/roles'
import { generateStaffForgotPasswordEmailHTML, generateStaffForgotPasswordEmailSubject } from '../email/templates'

// Staff accounts for the admin panel. `role` drives who can touch what —
// wired into each collection's `access` config below (e.g. marketing edits
// Articles/Programs, ops edits Branches, medical reviews Doctors/Programs
// before publish).
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Branded email with an ABSOLUTE link (Payload's default sent plain text
    // with the relative path /admin/reset/<token>, which mail clients can't open).
    forgotPassword: {
      expiration: 1000 * 60 * 60, // 1 hour, matches the email copy
      generateEmailHTML: generateStaffForgotPasswordEmailHTML,
      generateEmailSubject: generateStaffForgotPasswordEmailSubject,
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Staff can read the directory (needed for author pickers etc.);
    // only admins can create or remove accounts. Update: admins can edit
    // anyone, every other role can edit only its OWN account (needed so any
    // user can change their own password); role/assignedBranches remain
    // admin-only via the field-level access below.
    read: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      access: {
        // Only admins can promote/demote a user; editors can't self-escalate.
        update: isAdminField,
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Content Editor', value: 'editor' },
        { label: 'Medical Reviewer', value: 'medical-reviewer' },
      ],
    },
    {
      // Scopes a Content Editor / Medical Reviewer to only the branch(es)
      // listed here — see branchScopedContent/publishedOrBranchScopedStaff
      // in cms/access/roles.ts. Left empty (or role = admin), the user has
      // no branch-tagged content in scope at all, so this must be filled in
      // for every non-admin account before they can do anything useful.
      name: 'assignedBranches',
      type: 'relationship',
      relationTo: 'branches',
      hasMany: true,
      access: {
        // Only admins can change who's assigned to which branch; editors
        // can't grant themselves a wider scope.
        update: isAdminField,
      },
      admin: {
        condition: (data) => data?.role !== 'admin',
        description: 'สาขาที่ผู้ใช้คนนี้ดูแล: ใช้จำกัดสิทธิ์แก้ไข/ลบข้อมูลเฉพาะสาขาที่เลือก (Admin ไม่ต้องตั้งค่านี้ เพราะเข้าถึงได้ทุกสาขาอยู่แล้ว)',
      },
    },
  ],
}
