import type { Access, FieldAccess, Where } from 'payload'

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

// ---------------------------------------------------------------------
// Branch scoping — Content Editors and Medical Reviewers can be assigned
// to one or more branches (Users.assignedBranches) and are then limited to
// content tied to those branches. Admins are always unrestricted.
//
// Kept as a loosely-typed local shape (rather than importing the generated
// `User` type) so these helpers don't care whether a given caller passes
// the full Payload user doc or just a plain object with `role` +
// `assignedBranches` — e.g. the Dashboard build its own `where` clauses
// with `branchScopeWhere` outside of Payload's `Access` call signature.
// ---------------------------------------------------------------------

type BranchScopedRole = 'editor' | 'medical-reviewer'

interface UserWithBranches {
  role: 'admin' | 'editor' | 'medical-reviewer'
  assignedBranches?: (number | string | { id: number | string })[] | null
}

export const getUserBranchIds = (user: UserWithBranches | null | undefined): Array<number | string> =>
  (user?.assignedBranches || []).map((b) => (typeof b === 'object' && b !== null ? b.id : b))

// Builds a `where` clause for an arbitrary Local API query (payload.find /
// payload.count) that matches branchScopedContent's rules, for places that
// need to filter data outside of Payload's own access-control pipeline —
// e.g. the Dashboard's overview counts, which use the Local API directly
// and would otherwise show every branch's numbers to everyone regardless
// of role. Returns `undefined` for admins (no filter needed). A branch-
// scoped user with no branches assigned yet gets a clause that matches
// nothing, since there's nothing in scope for them.
export const branchScopeWhere = (
  user: UserWithBranches | null | undefined,
  branchField = 'branch',
  allowUnassigned = true,
): Where | undefined => {
  if (!user || user.role === 'admin') return undefined
  const branchIds = getUserBranchIds(user)
  if (!branchIds.length) return { id: { equals: -1 } } as Where
  if (allowUnassigned) {
    return { or: [{ [branchField]: { in: branchIds } }, { [branchField]: { exists: false } }] } as Where
  }
  return { [branchField]: { in: branchIds } } as Where
}

// Same idea as branchScopeWhere, but for Leads — branch is stored as a
// slug string there, not a relationship (see leadsBranchScopedAccess's
// comment), so the user's assigned branch ids need to be resolved to
// slugs first via a Local API lookup.
export const leadsBranchScopeWhere = async (
  payload: { find: (args: { collection: 'branches'; where: Where; limit: number; depth: number }) => Promise<{ docs: Array<{ slug?: string | null }> }> },
  user: UserWithBranches | null | undefined,
): Promise<Where | undefined> => {
  if (!user || user.role === 'admin') return undefined
  const branchIds = getUserBranchIds(user)
  if (!branchIds.length) return { id: { equals: '__none__' } } as Where
  const { docs } = await payload.find({
    collection: 'branches',
    where: { id: { in: branchIds } } as Where,
    limit: branchIds.length,
    depth: 0,
  })
  const slugs = docs.map((d) => d.slug).filter(Boolean)
  if (!slugs.length) return { id: { equals: '__none__' } } as Where
  return { branch: { in: slugs } } as Where
}

// For collections whose own documents carry a `branch` relationship field
// (Doctors, Programs, Articles) — restricts create/update/delete-eligible
// docs to whatever branch(es) the current user is assigned to.
//
// `allowUnassigned`: when true, documents with no branch set (e.g. a
// program available at every location) are treated as shared/global and
// stay editable by every branch-scoped editor — set false to reserve
// those shared docs for admins only (used for delete, so a branch editor
// can't remove a cross-branch resource).
export const branchScopedContent =
  (roles: BranchScopedRole[], branchField = 'branch', allowUnassigned = true): Access =>
  ({ req: { user } }) => {
    const u = user as UserWithBranches | null
    if (!u) return false
    if (u.role === 'admin') return true
    if (!roles.includes(u.role as BranchScopedRole)) return false
    const branchIds = getUserBranchIds(u)
    if (!branchIds.length) return false
    if (allowUnassigned) {
      return {
        or: [{ [branchField]: { in: branchIds } }, { [branchField]: { exists: false } }],
      }
    }
    return { [branchField]: { in: branchIds } }
  }

// Read access for the same branch-tagged collections: any staff member
// sees drafts (matching the old publishedOrStaff behavior), but a
// branch-scoped editor/reviewer only sees their own branch's docs (plus
// shared/unassigned ones) — everything else looks published-only to them,
// same as a public visitor. If an editor/reviewer has no branches assigned
// yet, they fall back to published-only too, since there's nothing in
// scope for them to review.
export const publishedOrBranchScopedStaff =
  (branchField = 'branch'): Access =>
  ({ req: { user } }): boolean | Where => {
    const u = user as UserWithBranches | null
    if (!u) return { _status: { equals: 'published' } } as Where
    if (u.role === 'admin') return true
    const branchIds = getUserBranchIds(u)
    if (!branchIds.length) return { _status: { equals: 'published' } } as Where
    return {
      or: [{ [branchField]: { in: branchIds } }, { [branchField]: { exists: false } }],
    } as Where
  }

// Field-level validate for a collection's `branch` relationship field —
// admins can set/clear it freely; a branch-scoped editor/reviewer can only
// point it at one of their own assigned branches (never assign another
// branch's content).
//
// `allowUnassigned`: when true (Articles, Programs — see their admin
// descriptions: "leave blank for shared/general content"), a branch-scoped
// editor/reviewer is also allowed to leave the field blank, matching the
// `allowUnassigned:true` used by those collections' own access functions.
// When false (Doctors — branch is required on every doctor, no shared case
// exists there), leaving it blank is still rejected. Defaults to false so
// existing call sites that don't pass an argument keep their current
// (required) behavior.
export const validateBranchInScope =
  (allowUnassigned = false) =>
  (value: unknown, { req }: { req: { user: unknown } }) => {
    const user = req.user as UserWithBranches | null
    if (!user || user.role === 'admin') return true
    if (user.role !== 'editor' && user.role !== 'medical-reviewer') return true
    const branchIds = getUserBranchIds(user)
    if (!value) {
      if (allowUnassigned) return true
      return 'กรุณาเลือกสาขา — คุณกำหนดสาขาให้เนื้อหาได้เฉพาะสาขาที่คุณดูแลเท่านั้น'
    }
    const valueId = typeof value === 'object' && value !== null ? (value as { id: number | string }).id : value
    if (branchIds.includes(valueId as number | string)) return true
    return 'คุณกำหนดสาขาได้เฉพาะสาขาที่คุณดูแลเท่านั้น'
  }

// Branches collection itself: an editor can update only the branch(es)
// they're assigned to (their own location's address/hours/gallery, etc);
// medical reviewers never touch operational branch data. Matches against
// the doc's own `id`, not a nested `branch` field.
export const branchScopedOwnRecord =
  (): Access =>
  ({ req: { user } }) => {
    const u = user as UserWithBranches | null
    if (!u) return false
    if (u.role === 'admin') return true
    if (u.role !== 'editor') return false
    const branchIds = getUserBranchIds(u)
    if (!branchIds.length) return false
    return { id: { in: branchIds } }
  }

// Leads store the branch as a plain slug string, not a relationship (see
// the field comment in Leads.ts — branches get fully recreated on every
// reseed, so a hard FK there would break). To scope a branch-assigned
// editor/reviewer to only their branch's leads, their assigned branch ids
// have to be resolved to slugs first via a Local API lookup.
export const leadsBranchScopedAccess: Access = async ({ req }) => {
  const u = req.user as UserWithBranches | null
  if (!u) return false
  if (u.role === 'admin') return true
  if (u.role !== 'editor' && u.role !== 'medical-reviewer') return false
  const branchIds = getUserBranchIds(u)
  if (!branchIds.length) return false
  const { docs } = await req.payload.find({
    collection: 'branches',
    where: { id: { in: branchIds } },
    limit: branchIds.length,
    depth: 0,
  })
  const slugs = docs.map((d) => d.slug).filter(Boolean)
  if (!slugs.length) return false
  return { branch: { in: slugs } }
}
