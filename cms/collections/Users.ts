import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField } from '../access/roles'

// Staff accounts for the admin panel. `role` drives who can touch what —
// wired into each collection's `access` config below (e.g. marketing edits
// Articles/Programs, ops edits Branches, medical reviews Doctors/Programs
// before publish).
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Staff can read the directory (needed for author pickers etc.);
    // only admins can create, update, or remove accounts.
    read: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    update: isAdmin,
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
        description: 'สาขาที่ผู้ใช้คนนี้ดูแล — ใช้จำกัดสิทธิ์แก้ไข/ลบข้อมูลเฉพาะสาขาที่เลือก (Admin ไม่ต้องตั้งค่านี้ เพราะเข้าถึงได้ทุกสาขาอยู่แล้ว)',
      },
    },
  ],
}
