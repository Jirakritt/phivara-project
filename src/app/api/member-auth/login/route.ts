import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEMBER_COOKIE_NAME } from '@/lib/memberSession'
import { getPayloadClient } from '@/lib/payload'

// Replaces Payload's auto-generated POST /api/members/login for the one
// thing that matters here: which cookie the session lands in. See
// src/lib/memberSession.ts's header comment for why a member login can't
// use Payload's own REST endpoint any more (it sets the same cookie the
// `users`/staff/CMS login also uses, silently logging staff out of /admin).
// Everything else about the operation — credential checking, lockout,
// verify-email enforcement — still runs through Payload's real `login`
// operation via the Local API; this route only takes over the cookie.
export async function POST(request: Request) {
  let email: unknown
  let password: unknown
  try {
    const body = await request.json()
    email = body.email
    password = body.password
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  try {
    const { exp, token, user } = await payload.login({
      collection: 'members',
      data: { email, password },
    })

    if (!token) {
      // Should never happen (Members.ts doesn't set removeTokenFromResponses),
      // but fail loudly rather than silently skip setting the cookie.
      throw new Error('Login succeeded but no token was returned')
    }

    const cookieStore = await cookies()
    cookieStore.set(MEMBER_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      // `exp` (JWT expiry, unix seconds) is typed optional even though
      // Payload's login operation always sets it — fall back to its own
      // default tokenExpiration (2h) rather than leaving the cookie with no
      // expiry in the one case that type allows for.
      expires: exp ? new Date(exp * 1000) : new Date(Date.now() + 1000 * 60 * 60 * 2),
    })

    return NextResponse.json({ user })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return NextResponse.json({ message }, { status: 401 })
  }
}
