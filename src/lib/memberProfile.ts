// Shared "is this member's step-3 profile actually complete" check — used
// by both a Client Component (LoginForm.tsx, to decide where to redirect
// after login) and two Server Components (register/basic-info/page.tsx,
// profile/page.tsx, to gate access). Deliberately a plain function in a
// file with no 'use client'/'use server' directive so it's safe to import
// from either side.
//
// Firstname/lastName/phone/dob/preferredBranch are all non-required at the
// Members collection schema level (see cms/collections/Members.ts's field
// comments) — registration step 1 only ever submits email+password, so a
// hard DB-level `required: true` would make that step fail outright. This
// function is the actual enforcement point instead: "complete" is an
// application-level concept, checked here, not a database constraint.
export interface ProfileCompletenessFields {
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  dob?: string | null
  preferredBranch?: string | null
}

export function hasCompleteProfile(member: ProfileCompletenessFields): boolean {
  return Boolean(member.firstName && member.lastName && member.phone && member.dob && member.preferredBranch)
}
