import type { LocaleCode } from './i18n'
import { DEFAULT_LOCALE } from './i18n'
import { getPayloadClient } from './payload'
import { parseRichTextBlocks } from './richText'
import type { RichTextBlock } from './richText'

// Source: cms/globals/PrivacyPolicy.ts (a Payload Global — privacy-policy
// is a single legal page, not a collection). Same deliberate
// fallback-to-en(-then-th) exception as membershipData.ts/ecosystemData.ts/
// homeData.ts's chrome helpers: a legal page must never render blank for a
// visitor, so an untranslated locale shows English (or Thai, if English
// also isn't filled in yet) rather than being hidden.
const EN_LOCALE: LocaleCode = 'en'

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
function formatThaiDate(dateString: string): string {
  const d = new Date(dateString)
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
}
function formatEnDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

export interface PrivacyPolicyContent {
  blocks: RichTextBlock[]
  // The Global's own `updatedAt` (shared across every locale's content,
  // since they all live on the same document row) — replaces the old
  // hardcoded "[วันที่ประกาศใช้]" placeholder with the real last-edit date
  // the moment any staff member saves a change in the CMS. Null only if
  // the global has genuinely never been saved (shouldn't happen once
  // seeded).
  updatedAtTh: string | null
  updatedAtEn: string | null
}

// A brand-new Lexical field starts as either fully empty or a single blank
// default paragraph — both count as "no content" for fallback purposes,
// same "empty/undefined = not translated yet" rule as hasLocaleContent()
// in payload.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasRichTextContent(doc: any): boolean {
  const children = doc?.body?.root?.children
  if (!Array.isArray(children) || children.length === 0) return false
  return children.some((node: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node?.children || []).some((c: any) => (c.text || '').trim().length > 0),
  )
}

export async function getPrivacyPolicyContent(locale: LocaleCode): Promise<PrivacyPolicyContent> {
  const payload = await getPayloadClient()
  const [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'privacy-policy', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'privacy-policy', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'privacy-policy', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]

  const source = hasRichTextContent(target) ? target : hasRichTextContent(en) ? en : th
  const blocks = parseRichTextBlocks(source?.body)
  const updatedAtRaw: string | undefined = th?.updatedAt

  return {
    blocks,
    updatedAtTh: updatedAtRaw ? formatThaiDate(updatedAtRaw) : null,
    updatedAtEn: updatedAtRaw ? formatEnDate(updatedAtRaw) : null,
  }
}
