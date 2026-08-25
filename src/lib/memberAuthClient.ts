'use client'

// register/requestPasswordReset/verifyMemberEmail still call Payload's own
// auto-generated REST endpoints directly (POST /api/members,
// /api/members/forgot-password, /api/members/verify/:token) — none of
// those three ever sets a session cookie (register requires email
// verification first; forgot-password just triggers an email; verify
// deliberately doesn't auto-login — see VerifyEmailClient's comment), so
// there's nothing for them to collide with.
//
// login/logout/resetMemberPassword/getCurrentMember/updateMember instead
// call this app's own /api/member-auth/* routes (src/app/api/member-auth/),
// NOT Payload's native /api/members/login etc. Reason: Payload's REST auth
// endpoints set/read a single project-wide `${cookiePrefix}-token` cookie
// that the `users` (staff/CMS) auth collection also uses — logging in as a
// member here would silently kick staff out of `/admin` in the same
// browser (and vice versa). See src/lib/memberSession.ts's header comment
// for the full story. The /api/member-auth/* routes give members a cookie
// of their own instead.

export interface PayloadApiError {
  message: string
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { errors?: PayloadApiError[]; message?: string }
    return body.errors?.[0]?.message || body.message || `Request failed (${res.status})`
  } catch {
    return `Request failed (${res.status})`
  }
}

async function postJSON<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<T>
}

export interface MemberSummary {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  dob?: string | null
  preferredBranch?: string | null
  // Was a fixed 'none'|'silver'|'gold'|'diamond' enum; now a relationship to
  // cms/collections/MembershipTiers.ts (see that file for why) — `null`
  // means no tier assigned yet, same meaning the old 'none' had. Whether
  // this arrives as a raw id or a populated object depends on the query
  // depth of whatever endpoint returned this MemberSummary, so consumers
  // should normalize it via src/lib/membershipTiers.ts's normalizeTierRef
  // rather than assuming either shape directly.
  membershipTier?: number | { id: number } | null
  emailOptIn?: boolean | null
  _verified?: boolean | null
  createdAt: string
}

export function registerMember(email: string, password: string, preferredLocale: string) {
  return postJSON<{ doc: MemberSummary }>('/api/members', { email, password, preferredLocale })
}

export function loginMember(email: string, password: string) {
  return postJSON<{ user: MemberSummary }>('/api/member-auth/login', { email, password })
}

export function logoutMember() {
  return fetch('/api/member-auth/logout', { method: 'POST' })
}

export function requestPasswordReset(email: string) {
  return postJSON<{ message: string }>('/api/members/forgot-password', { email })
}

export function resetMemberPassword(token: string, password: string) {
  return postJSON<{ user: MemberSummary }>('/api/member-auth/reset-password', { token, password })
}

export function verifyMemberEmail(token: string) {
  return fetch(`/api/members/verify/${encodeURIComponent(token)}`, { method: 'POST' })
}

export async function getCurrentMember(): Promise<MemberSummary | null> {
  const res = await fetch('/api/member-auth/me')
  if (!res.ok) return null
  const body = (await res.json()) as { user?: MemberSummary }
  return body.user || null
}

// `id` no longer needs to be passed in by callers (the route always updates
// "whoever's cookie is currently authenticated") but is kept as a parameter
// for call-site clarity and so a future caller can't accidentally omit it
// and be surprised the route ignores it entirely.
export async function updateMember(id: number, data: Record<string, unknown>): Promise<MemberSummary> {
  void id
  const res = await fetch('/api/member-auth/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const body = (await res.json()) as { doc: MemberSummary }
  return body.doc
}
