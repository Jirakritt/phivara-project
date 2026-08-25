import 'server-only'

import { getPayloadClient } from './payload'

// Payload names its auth cookie `${payload.config.cookiePrefix}-token`
// (defaults to `payload-token`) at the PROJECT level, not per collection —
// there's no built-in way to give a second auth-enabled collection (like
// `members` here) a cookie of its own. That meant `users` (staff/CMS login)
// and `members` (public site login) were silently fighting over the exact
// same browser cookie: whichever logged in last kicked the other out
// entirely. Confirmed live — QA logging in as a test member locked the real
// admin out of `/admin` mid-session, with no error until the next page load.
//
// Fixed by giving members their own cookie (this constant) and routing
// every code path that sets or reads a member SESSION through
// src/app/api/member-auth/* (login/logout/reset-password/me/update) instead
// of Payload's auto-generated `/api/members/login` etc. REST endpoints,
// which remain permanently wired to the shared `payload-token` cookie.
// Register, forgot-password, and verify-email still call Payload's native
// REST endpoints directly (see src/lib/memberAuthClient.ts) — none of those
// three ever sets a session cookie in the first place (verify deliberately
// doesn't auto-login; see RegisterForm/VerifyEmailClient's own comments),
// so there's no collision risk to fix on those paths.
export const MEMBER_COOKIE_NAME = 'phivara-member-token'

// Payload's own JWT auth check (`payload.auth({ headers })`) only ever
// reads its own `${cookiePrefix}-token` cookie — there's no option to point
// it at a different cookie name. This remaps whatever's in our
// custom-named cookie onto the name Payload expects, so `payload.auth()`
// can still do its normal JWT verification + `req.user` hydration without
// this file re-implementing any of that itself.
function remapMemberCookie(incomingHeaders: Headers, cookiePrefix: string): Headers {
  const cookieHeader = incomingHeaders.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${MEMBER_COOKIE_NAME}=([^;]+)`))
  const headers = new Headers(incomingHeaders)
  if (match) {
    headers.set('cookie', `${cookiePrefix}-token=${match[1]}`)
  } else {
    headers.delete('cookie')
  }
  return headers
}

// Verifies the current request's member session cookie (if any) and
// returns the authenticated member, or `null`. Used by every server-side
// page guard (profile, register/basic-info) and by the /api/member-auth/*
// route handlers — the one place any of this app's code checks "is a
// member logged in right now".
export async function authenticateMember(incomingHeaders: Headers) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: remapMemberCookie(incomingHeaders, payload.config.cookiePrefix) })
  const member = user && user.collection === 'members' ? user : null
  return { payload, member }
}
