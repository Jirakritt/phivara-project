// One-off diagnostic — dumps the footer global's raw linkGroups (both the
// exact per-locale stored values AND what the real getHomeData() pipeline
// resolves for th/en) so we can see why addFooterLinks.ts reported the
// requested links as "already present" even though the rendered site only
// shows one link per column. Safe to run any time, makes no changes.
// Delete after use.
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { getHomeData } from '../../src/lib/homeData'

async function run() {
  const payload = await getPayload({ config })

  console.log('=== RAW per-locale (fallbackLocale: false) ===')
  const th = await payload.findGlobal({ slug: 'footer', locale: 'th', fallbackLocale: false, depth: 0 })
  const en = await payload.findGlobal({ slug: 'footer', locale: 'en', fallbackLocale: false, depth: 0 })
  console.log('--- th ---')
  console.log(JSON.stringify(th.linkGroups, null, 2))
  console.log('--- en ---')
  console.log(JSON.stringify(en.linkGroups, null, 2))

  console.log('\n=== What the real site pipeline resolves (getHomeData) ===')
  const dataTh = await getHomeData('th')
  const dataEn = await getHomeData('en')
  console.log('--- th footer ---')
  console.log(JSON.stringify(dataTh.footer, null, 2))
  console.log('--- en footer ---')
  console.log(JSON.stringify(dataEn.footer, null, 2))

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
