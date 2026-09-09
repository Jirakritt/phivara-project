// k6 load test for phivara-project (PHIVARA website).
//
// WHY THIS SHAPE: the site is Next.js SSR + Payload CMS running as a single
// pm2 fork-mode process, sharing one vCPU with Postgres on the combined
// Web+DB VPS spec under discussion (1 vCPU / 4GB RAM). Cheap requests
// (ISR-cached pages within their `revalidate` window, static assets) barely
// touch CPU; requests that force a fresh render + DB query are the real
// cost. This script deliberately mixes both kinds — weighted toward the
// pages real visitors actually hit most (home > listings > detail pages) —
// so the results reflect realistic load, not a synthetic best case.
//
// HOW TO RUN
//   1. Install k6:        https://k6.io/docs/get-started/installation/
//        macOS:  brew install k6
//        Linux:  see k6 docs (apt/yum repo or static binary)
//   2. Point it at the target:
//        BASE_URL=https://www.phivara.site k6 run k6-loadtest.js
//      Default BASE_URL (if you don't set it) is http://localhost:3000 —
//      safe for testing against a local `npm run build && npm start`
//      before ever pointing this at production.
//   3. Optional overrides (see the `stages` array below to change the
//      ramp shape, or pass -e VUS_MAX=200 style env vars if you extend
//      this script further):
//        k6 run --summary-export=result.json k6-loadtest.js
//
// READING THE RESULTS
//   - Watch `http_req_duration` (p95/p90) per group in the end-of-run
//     summary — group names match the page type (home, program-listing,
//     program-detail, etc.), so you can see exactly which route type
//     degrades first.
//   - `http_req_failed` rate climbing above ~1% or p95 duration blowing
//     past ~1-2s under a given VU count is the practical "this is where
//     it breaks" signal — note the VU count/timestamp from the stage
//     that was active when it happened (k6's console output timestamps
//     each stage transition).
//   - Cross-reference against pm2/htop on the VPS while the test runs
//     (`pm2 monit`, `htop`, `SELECT * FROM pg_stat_activity;`) to see
//     whether CPU, Postgres connections, or Node itself is the actual
//     bottleneck — the "1 vCPU shared with Postgres" theory from the
//     capacity estimate is a guess until you see it happen live.
//
// DO NOT run the higher-VU stages against production during business
// hours without warning the team first — this script is intentionally
// capable of pushing real load. Start with the local/UAT target.

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const LOCALE = __ENV.LOCALE || 'th' // switch to 'en' to test the other locale tree

// Known-good slugs as of 2026-09-08 (pulled from live production content
// while building this script) — swap these out if content changes, or the
// requests will start 404ing (a 404 is still a fast, cheap response for
// the server, so stale slugs won't inflate your latency numbers, but they
// will stop exercising the real detail-page render path you care about).
const PROGRAM_SLUGS = ['pv01', 'pv02', 'pv27', 'pv28', 'pv31', 'pv32']
const ARTICLE_SLUGS = [
  'sustainable-beauty-everyday-lifestyle',
  'natural-looking-nose-job',
  'surgery-recovery',
  'face-harmony',
  'breast-augmentation-for-your-body',
  'natural-looking-plastic-surgery',
  'facial-laser-types',
  'dehydrated-skin-signs',
  'skin-booster-benefits',
  'early-signs-of-aging',
  'inflammaging-aging',
  'sleep-quality-aging-skin-health',
  'biological-age-younger-than-your-age',
  'hormones-affect-facial-appearance',
  'natural-looking-botox',
  'non-surgical-skin-tightening',
]
const BRANCH_SLUGS = ['pt1', 'pt2', 'pt3', 'ptp', 'pts']
// Fill these in with real doctor slugs before running — not confirmed at
// script-writing time. Leaving empty just skips the doctor-detail group.
const DOCTOR_SLUGS = []

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Custom metrics so the summary breaks out "cheap" (ISR-cacheable) vs
// "expensive" (always-fresh-render) traffic separately — the whole point
// of mixing them is to see if expensive requests degrade even while cheap
// ones stay fast, which is what CPU contention with Postgres would look
// like in practice.
const cheapDuration = new Trend('cheap_page_duration', true)
const expensiveDuration = new Trend('expensive_page_duration', true)
const errorRate = new Rate('errors')

// Realistic-ish visit weighting: home and the 3 main listing pages get hit
// far more than any single detail page. Adjust the weights array if your
// actual analytics show a different mix once you have real traffic data.
const ROUTES = [
  { weight: 20, type: 'cheap', group: 'home', path: () => `/${LOCALE}` },
  { weight: 12, type: 'cheap', group: 'program-listing', path: () => `/${LOCALE}/program` },
  { weight: 10, type: 'cheap', group: 'doctor-listing', path: () => `/${LOCALE}/doctor` },
  { weight: 10, type: 'cheap', group: 'article-listing', path: () => `/${LOCALE}/article` },
  { weight: 8, type: 'cheap', group: 'ecosystem', path: () => `/${LOCALE}/ecosystem` },
  { weight: 6, type: 'cheap', group: 'contact', path: () => `/${LOCALE}/contact` },
  { weight: 15, type: 'expensive', group: 'program-detail', path: () => `/${LOCALE}/program/${pick(PROGRAM_SLUGS)}` },
  { weight: 12, type: 'expensive', group: 'article-detail', path: () => `/${LOCALE}/article/${pick(ARTICLE_SLUGS)}` },
  { weight: 4, type: 'expensive', group: 'branch-detail', path: () => `/${LOCALE}/branch/${pick(BRANCH_SLUGS)}` },
]

function weightedPick() {
  const pool = DOCTOR_SLUGS.length
    ? ROUTES.concat([{ weight: 12, type: 'expensive', group: 'doctor-detail', path: () => `/${LOCALE}/doctor/${pick(DOCTOR_SLUGS)}` }])
    : ROUTES
  const total = pool.reduce((sum, r) => sum + r.weight, 0)
  let n = Math.random() * total
  for (const route of pool) {
    if (n < route.weight) return route
    n -= route.weight
  }
  return pool[0]
}

// Ramp shape: climbs through the "should be fine" range (~40-80 VUs, per
// the earlier capacity estimate for the 1 vCPU / 4GB combined Web+DB
// spec), then keeps pushing past it to find where it actually breaks.
// Trim this back to a lower ceiling if you only want to confirm the
// estimate rather than stress-test past it.
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // warm-up
    { duration: '1m', target: 40 }, // low end of the estimated safe range
    { duration: '2m', target: 40 }, // hold — confirm it's actually stable here
    { duration: '1m', target: 80 }, // high end of the estimated safe range
    { duration: '2m', target: 80 }, // hold
    { duration: '1m', target: 150 }, // push past the estimate
    { duration: '2m', target: 150 }, // hold — expect degradation to start showing here
    { duration: '1m', target: 0 }, // ramp down
  ],
  thresholds: {
    // These are *targets*, not guarantees — k6 will just flag them red in
    // the summary if breached, it won't stop the run. Adjust to whatever
    // your actual acceptable UX bar is.
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.02'],
  },
}

export default function () {
  const route = weightedPick()
  const url = `${BASE_URL}${route.path()}`

  group(route.group, function () {
    const res = http.get(url, {
      headers: { 'User-Agent': 'k6-loadtest/phivara-capacity-check' },
    })

    const ok = check(res, {
      'status is 200 or 404 (not 5xx)': (r) => r.status === 200 || r.status === 404,
      'responded within 5s': (r) => r.timings.duration < 5000,
    })
    errorRate.add(!ok)

    if (route.type === 'cheap') {
      cheapDuration.add(res.timings.duration)
    } else {
      expensiveDuration.add(res.timings.duration)
    }
  })

  // Think-time between requests, mimicking a real visitor reading a page
  // rather than a bot hammering links — this is what makes "VUs" translate
  // to something closer to "concurrent visitors" instead of pure request
  // throughput.
  sleep(Math.random() * 6 + 2) // 2-8s
}
