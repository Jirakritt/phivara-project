import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEMBER_COOKIE_NAME } from '@/lib/memberSession'

// No Payload call needed — logout is just clearing our own cookie. Kept as
// a route (rather than doing this client-side) so the cookie's httpOnly
// flag can actually be cleared; client JS can't touch an httpOnly cookie.
export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(MEMBER_COOKIE_NAME)
  return NextResponse.json({ success: true })
}
