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
  ],
}
