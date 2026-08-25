import { NextResponse } from 'next/server'

import { authenticateMember } from '@/lib/memberSession'

// Always updates the CURRENTLY LOGGED-IN member's own record — no `:id` in
// the URL, unlike Payload's native `/api/members/:id`, since the only
// caller (updateMember() in memberAuthClient.ts) only ever edits "myself".
// `overrideAccess: false` + passing `user: member` makes Payload run this
// exactly like an authenticated request from that member would: the
// collection's `isSelfOrStaff` access control and each field's own
// `access.update` (e.g. `membershipTier`'s staff-only field access in
// cms/collections/Members.ts) both still apply, so a member still can't
// grant themselves a tier or edit anyone else's record.
export async function PATCH(request: Request) {
  const { payload, member } = await authenticateMember(request.headers)
  if (!member) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  try {
    const doc = await payload.update({
      collection: 'members',
      id: member.id,
      data,
      user: member,
      overrideAccess: false,
    })
    return NextResponse.json({ doc })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ message }, { status: 400 })
  }
}
