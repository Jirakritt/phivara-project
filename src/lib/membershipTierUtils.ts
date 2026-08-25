// Client-safe pieces split out of ./membershipTiers.ts — this file must
// NEVER import anything that pulls in the Payload Local API (getPayloadClient
// et al.), because src/components/member/ProfileDashboard.tsx is a 'use
// client' component that imports from here. Next.js bundles an entire
// module's import graph for the browser once any client component imports
// anything from it, and Payload's server-only internals use Node builtins
// (like 'fs') that don't exist in a browser bundle — importing them
// transitively broke the profile page with "Module not found: Can't resolve
// 'fs'". Keep this file to pure types/functions only.
export interface MembershipTierInfo {
  id: number
  slug: string
  label: string
  order: number
  gradientStart: string
  gradientMid: string
  gradientEnd: string
}

// A relationship field's value can arrive as a raw id (depth: 0 / not yet
// populated) or a populated document ({ id, ...fields }) depending on the
// query that produced it — this normalizes either shape down to just the
// id, which is all any tier-matching logic in this app actually needs.
export function normalizeTierRef(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  if (typeof value === 'object' && value !== null && 'id' in (value as Record<string, unknown>)) {
    const id = (value as { id: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}
