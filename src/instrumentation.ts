// Runs once when the Next.js server process starts, in the Node.js runtime
// only (the NEXT_RUNTIME guard below skips this for the Edge runtime, where
// none of this applies). Registers a narrow safety net for a confirmed
// production incident (2026-09-09): `pm2 describe phivara` showed
// `restarts: 40`, and the error log had the same pattern repeated 3x in the
// last 200 lines alone —
//
//   FATAL 57P01 "terminating connection due to administrator command"
//   -> uncaughtException
//   -> whole process crashes, pm2 restarts it
//
// Root cause: cms/payload.config.ts hands `pool: { connectionString }`
// straight to postgresAdapter(), which passes it straight to `pg.Pool` —
// checked node_modules/@payloadcms/db-postgres and @payloadcms/drizzle
// directly, neither attaches an `error` listener to the pool anywhere.
// node-postgres's own docs are explicit that every Pool needs one: when the
// server disconnects an *idle* client (Postgres restarted, an admin ran
// pg_terminate_backend, a network blip — anything that isn't "your query is
// broken"), that surfaces as an `error` event on the pool. With zero
// listeners, Node treats it as an unhandled EventEmitter error, which
// escalates to a process-wide uncaughtException — crashing the entire app
// for every in-flight request, not just whatever happened to be using that
// one connection.
//
// We can't reach the actual `pg.Pool` instance to attach `.on('error', ...)`
// directly from payload.config.ts — postgresAdapter() only returns a
// factory, and the real Pool is created lazily inside payload.init(), which
// this file runs before. So this guards at the process level instead, and
// deliberately only swallows the specific transient-disconnect error
// codes/messages this exact bug produces. Anything else still crashes and
// lets pm2 restart exactly as before — this is not a blanket "ignore every
// crash" handler.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const isTransientPgDisconnect = (err: unknown): boolean => {
    const e = err as { code?: string; message?: string } | null | undefined
    if (!e) return false
    // 57P01 admin_shutdown / 57P02 crash_shutdown / 57P03 cannot_connect_now
    // — Postgres-level "the server end hung up on us". ECONNRESET/EPIPE
    // cover the same situation at the TCP level (e.g. a VPS network blip)
    // rather than a Postgres FATAL.
    if (e.code && ['57P01', '57P02', '57P03', 'ECONNRESET', 'EPIPE'].includes(e.code)) return true
    return typeof e.message === 'string' && e.message.includes('terminating connection')
  }

  process.on('uncaughtException', (err) => {
    if (isTransientPgDisconnect(err)) {
      // The dead client is simply dropped from the pool; node-postgres
      // opens a fresh connection automatically on the next query. No action
      // needed beyond logging — the whole point is to NOT crash for this.
      // eslint-disable-next-line no-console
      console.error(
        '[db] idle Postgres connection was dropped by the server (pool will reconnect automatically) — ignoring:',
        (err as Error)?.message || err,
      )
      return
    }

    // Anything else is a real, unexpected crash — exactly what would have
    // taken the process down before this file existed. Preserve that
    // behavior (and pm2's restart-on-crash) instead of silently swallowing
    // a genuine bug.
    // eslint-disable-next-line no-console
    console.error('[instrumentation] uncaughtException — exiting so pm2 can restart:', err)
    process.exit(1)
  })
}
