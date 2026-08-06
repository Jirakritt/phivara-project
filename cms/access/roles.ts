import type { Access, FieldAccess } from 'payload'

// Shared access helpers, wired into each collection below.
// Roles come from Users.role: 'admin' | 'editor' | 'medical-reviewer'.

export const isAdmin: Access = ({ req: { user } }) => Boolean(user && user.role === 'admin')

export const isStaff: Access = ({ req: { user } }) => Boolean(user)

export const hasAnyRole =
  (...roles: Array<'admin' | 'editor' | 'medical-reviewer'>): Access =>
  ({ req: { user } }) =>
    Boolean(user && roles.includes(user.role))

// Public visitors only ever see published content; any logged-in staff
// member can see drafts too (needed to review before publish).
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

export const isAdminField: FieldAccess = ({ req: { user } }) => Boolean(user && user.role === 'admin')
