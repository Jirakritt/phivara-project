import { UI_DICTIONARY } from './dictionary'

// Canonical list of every locale code provisioned in Payload (see
// cms/payload.config.ts's `localization.locales` — keep these two arrays in
// sync manually; they live in different halves of the app (cms/ vs src/)
// so importing one from the other would pull Payload's Node-only Local API
// into code paths — like middleware.ts — that must stay Edge-safe).
export const LOCALE_CODES = [
  'th', 'en', 'ja', 'zh', 'vi', 'km', 'ar', 'ms', 'id', 'de', 'ru', 'lo', 'ko', 'fr',
] as const

export type LocaleCode = (typeof LOCALE_CODES)[number]

export const DEFAULT_LOCALE: LocaleCode = 'th'

// Phase 2 shipped real page content for th/en; Phase 3 added UI-string
// translations (src/lib/dictionary.ts) for ja/zh/vi; a Phase 4 follow-up
// added ar (Arabic, RTL — see RTL_LOCALES/isRtl() below and site-shell.css's
// `[dir="rtl"]` rules) — every hardcoded label/heading/button now renders
// correctly in all 6, though CMS-driven content (doctor bios, article
// bodies, program descriptions) still falls back to the English value for
// every non-th/en locale until a content editor adds real translations
// for those fields in Payload. The other 8 codes in LOCALE_CODES exist
// purely so Admin can provision them later from the CMS's Language
// Settings screen with no further deploy. Update this once a language's
// frontend translations actually exist.
export const CONTENT_READY_LOCALES: LocaleCode[] = ['th', 'en', 'ja', 'zh', 'vi', 'ar']

export function isLocaleCode(value: string): value is LocaleCode {
  return (LOCALE_CODES as readonly string[]).includes(value)
}

// Native-script display names for the language switcher dropdown (see
// LanguageSwitcher.tsx). Covers all 14 provisioned codes, not just the
// CONTENT_READY_LOCALES ones, so the label is already right the moment a
// new language goes publiclyLive — no separate deploy needed for this part.
export const LOCALE_LABELS: Record<LocaleCode, string> = {
  th: 'ไทย',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  vi: 'Tiếng Việt',
  km: 'ខ្មែរ',
  ar: 'العربية',
  ms: 'Bahasa Melayu',
  id: 'Bahasa Indonesia',
  de: 'Deutsch',
  ru: 'Русский',
  lo: 'ລາວ',
  ko: '한국어',
  fr: 'Français',
}

export const RTL_LOCALES: LocaleCode[] = ['ar']

export function isRtl(locale: LocaleCode): boolean {
  return RTL_LOCALES.includes(locale)
}

// getPubliclyLiveLocales() moved to src/lib/i18n-server.ts — it needs
// Payload's Local API (Node-only), which must never end up in this file
// since src/middleware.ts (Edge runtime) imports from here too. See that
// file's top comment for the full explanation.

/**
 * Picks the right-language string out of a `{ xTh, xEn }` pair already
 * fetched by src/lib/*.ts. Signature stayed 2-arg (th, en) on purpose
 * through Phase 3 — rather than rewriting every t(th, en) call site across
 * ~15 files into a `t(key)` dictionary lookup, pickText() itself now also
 * consults UI_DICTIONARY (src/lib/dictionary.ts), keyed by the exact `th`
 * string passed in. For a literal UI string (nav labels, headings,
 * buttons, ...) that lookup succeeds and returns the real ja/zh/vi
 * translation. For CMS-driven content (e.g. t(doctor.nameTh,
 * doctor.nameEn)) the `th` value is a per-record runtime string that was
 * never added to the dictionary, so the lookup misses and this falls back
 * to `en` — showing the English CMS value until a content editor adds a
 * real ja/zh/vi translation for that field in Payload. th/en themselves
 * never touch the dictionary (they're always the actual source values).
 */
export function pickText(locale: LocaleCode, th: string, en: string): string {
  if (locale === 'th') return th
  if (locale === 'en') return en
  return UI_DICTIONARY[th]?.[locale] ?? en
}

/** Server Component helper — `const t = translator(locale)` then `t(thText, enText)`. */
export function translator(locale: LocaleCode) {
  return (th: string, en: string) => pickText(locale, th, en)
}

/** Prefixes an app-relative path with the current locale, e.g. `/doctor` -> `/en/doctor`. */
export function localizedHref(locale: LocaleCode, path: string): string {
  if (path.startsWith('#') || path.startsWith('http://') || path.startsWith('https://')) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean === '/' ? '' : clean}`
}
