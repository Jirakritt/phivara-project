import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEMBER_COOKIE_NAME } from '@/lib/memberSession'
import { getPayloadClient } from '@/lib/payload'

// Same reasoning as login/route.ts — Payload's own reset-password operation
// auto-logs the member in on success, which means it also has to go through
// this app's own cookie instead of Payload's shared one. The token-based
// identity check (is this reset link still valid) still runs for real via
// Payload's own `resetPassword` operation over the Local API.
export async function POST(request: Request) {
  let token: unknown
  let password: unknown
  try {
    const body = await request.json()
    token = body.token
    password = body.password
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  if (typeof token !== 'string' || typeof password !== 'string' || !token || !password) {
    return NextResponse.json({ message: 'Token and password are required' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  try {
    const { token: sessionToken, user } = await payload.resetPassword({
      collection: 'members',
      data: { token, password },
      overrideAccess: true,
    })

    if (!sessionToken) {
      throw new Error('Password reset but no session token was returned')
    }

    const cookieStore = await cookies()
    cookieStore.set(MEMBER_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      // Payload's resetPassword operation doesn't return `exp` the way
      // login does — mirror Members.ts's own (default) tokenExpiration
      // instead of leaving this cookie without an expiry.
      maxAge: 60 * 60 * 2,
    })

    return NextResponse.json({ user })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Reset failed'
    return NextResponse.json({ message }, { status: 400 })
  }
}
