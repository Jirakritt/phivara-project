// Minimal in-memory fixed-window rate limiter, used by src/middleware.ts to
// throttle a small number of public, unauthenticated POST endpoints
// (Leads creation, member forgot-password) that had no abuse protection at
// all before this — see the site's security review notes.
//
// Deliberately in-memory rather than Redis-backed: this app runs as a
// single pm2 process (fork mode, one instance) on one VPS, so a Map here
// persists correctly for the life of that process without needing an
// external store. If this ever moves to multiple instances/processes,
// this needs to move to a shared store (Redis) instead — a single
// process's in-memory counter can't see requests handled by a sibling
// process.
//
// Next.js middleware normally runs on the Edge runtime, but self-hosted via
// `next start` (this project's deploy — see pm2 config) it executes in the
// same Node.js process as everything else, so module-level state like this
// Map really does persist across requests exactly like a normal Node
// singleton would.

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// Sweeps expired buckets periodically so long-running memory doesn't grow
// unbounded from one-off visitor IPs — piggybacks on request traffic rather
// than running its own timer/interval.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000
let lastCleanup = Date.now()

function cleanupExpiredBuckets(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * Returns true if the request identified by `key` is within `limit`
 * requests per `windowMs`, incrementing its counter as a side effect.
 * Returns false (and does NOT count the request further) once the caller
 * has already hit the limit for the current window.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  cleanupExpiredBuckets(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= limit) return false

  bucket.count += 1
  return true
}
