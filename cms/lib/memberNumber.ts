// Shared "PHV 0002 0074"-style member-number formula — deterministic from a
// member's numeric `id`. Mirrors src/components/member/ProfileDashboard.tsx's
// own memberNumber() exactly; the two must never drift apart. Used by
// Members.ts's afterChange hook to persist the real value into the
// `memberNumber` column right after a member is created (the id isn't known
// until the row exists), and by the migration that backfills the column for
// accounts that existed before it did.
export function computeMemberNumber(id: number | string): string {
  const numericId = typeof id === 'number' ? id : parseInt(String(id), 10)
  if (!Number.isFinite(numericId)) return ''
  return `PHV ${String(numericId).padStart(4, '0')} ${String((numericId * 37) % 10000).padStart(4, '0')}`
}
