// Additive, idempotent update for the `footer` global's link columns —
// unlike seedFooter.ts (a one-time full overwrite, unsafe to re-run once
// staff have edited footer content in /admin), this script reads whatever
// is currently live, appends only the specific links below if they aren't
// already present (matched by url), and leaves everything else — including
// any manual edits already made in the CMS — untouched.
//
// Requested additions (2026-08-24):
//   "สำรวจ" (Explore)  -> โปรแกรมตรวจ (/program), สมาชิก (/membership)
//   "บริษัท" (Company) -> ติดต่อ (/contact)
//
// Preserves array-row ids across the th -> en update pass the same way
// seedMemberPrivileges.ts does (label is localized so each locale needs its
// own updateGlobal call; skipping the id re-attach would make Payload
// create duplicate rows on the 2nd pass instead of updating in place).
//
// Run with: npx tsx cms/seed/addFooterLinks.ts
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

// Keyed by group ARRAY INDEX, not heading text — matching by heading text
// silently no-ops if that field is ever empty (which is exactly what
// happened here; see fixFooterThaiText.ts), so index is the more robust
// anchor. Index 0 = "สำรวจ"/"Explore", index 1 = "บริษัท"/"Company" (per
// cms/seed/data/footer.ts's original seed order).
const ADDITIONS: Record<number, { th: string; en: string; url: string }[]> = {
  0: [
    { th: 'โปรแกรมตรวจ', en: 'Programs', url: '/program' },
    { th: 'สมาชิก', en: 'Membership', url: '/membership' },
  ],
  1: [{ th: 'ติดต่อ', en: 'Contact', url: '/contact' }],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

async function run() {
  const payload = await getPayload({ config })
  console.log('Adding footer links...')

  const thCurrent = (await payload.findGlobal({ slug: 'footer', locale: 'th', fallbackLocale: false, depth: 0 })) as AnyRecord
  const enCurrent = (await payload.findGlobal({ slug: 'footer', locale: 'en', fallbackLocale: false, depth: 0 })) as AnyRecord

  const groupsTh: AnyRecord[] = thCurrent.linkGroups || []
  const groupsEn: AnyRecord[] = enCurrent.linkGroups || []

  let addedCount = 0
  const nextGroupsTh = groupsTh.map((group, i) => {
    const additions = ADDITIONS[i]
    if (!additions) return group
    const existingUrls = new Set((group.links || []).map((l: AnyRecord) => l.url))
    const newLinks = additions.filter((a) => !existingUrls.has(a.url))
    addedCount += newLinks.length
    if (!newLinks.length) return group
    return {
      ...group,
      links: [...(group.links || []), ...newLinks.map((a) => ({ label: a.th, url: a.url }))],
    }
  })

  if (!addedCount) {
    console.log('  nothing to add — all requested links already present.')
    process.exit(0)
  }

  const th = (await payload.updateGlobal({
    slug: 'footer',
    locale: 'th',
    data: { linkGroups: nextGroupsTh },
  })) as AnyRecord

  const nextGroupsEn = (th.linkGroups as AnyRecord[]).map((thGroup, i) => {
    const enGroup: AnyRecord = groupsEn[i] || {}
    const enLinksByUrl = new Map((enGroup.links || []).map((l: AnyRecord) => [l.url, l.label]))
    const additions = ADDITIONS[i] || []
    const additionByUrl = new Map(additions.map((a) => [a.url, a.en]))
    return {
      ...enGroup,
      id: thGroup.id,
      links: (thGroup.links as AnyRecord[]).map((link) => ({
        id: link.id,
        url: link.url,
        label: enLinksByUrl.get(link.url) ?? additionByUrl.get(link.url) ?? link.label,
      })),
    }
  })

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: { linkGroups: nextGroupsEn },
  })

  console.log(`  added ${addedCount} link(s).`)
  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
