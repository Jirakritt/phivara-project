// Additive, standalone seed for the `privacy-policy` global only — sets its
// initial content to match what was previously hardcoded in
// src/app/[locale]/(public)/privacy-policy/page.tsx, verbatim (including
// the [bracketed] legal placeholders pending PHIVARA's legal/compliance
// review). Safe to run once against a live site since `privacy-policy` is
// a brand new field with no existing data yet. Like seedTopbar.ts/
// seedFooter.ts, there's no "clear first" step needed (a Global is a
// single doc, updateGlobal just overwrites it) — but that also means
// re-running this AFTER someone has edited the policy in /admin will stomp
// their edits back to these defaults, so treat it as a one-time initial
// seed, not a repeatable maintenance script.
//
// Run with: npm run seed:privacy-policy
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { heading, lexicalDoc, list, paragraph } from './lib/lexical'
import { privacyPolicyBlocks } from './data/privacyPolicy'
import type { PrivacyPolicyBlock } from './data/privacyPolicy'

function buildDoc(blocks: PrivacyPolicyBlock[]) {
  const nodes = blocks.map((b) => {
    if (b.type === 'h2') return heading('h2', b.text)
    if (b.type === 'ul') return list('bullet', b.items)
    return paragraph(b.text)
  })
  return lexicalDoc(nodes)
}

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding PHIVARA privacy policy content...')

  await payload.updateGlobal({
    slug: 'privacy-policy',
    locale: 'th',
    data: { body: buildDoc(privacyPolicyBlocks.th) },
  })
  await payload.updateGlobal({
    slug: 'privacy-policy',
    locale: 'en',
    data: { body: buildDoc(privacyPolicyBlocks.en) },
  })

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
