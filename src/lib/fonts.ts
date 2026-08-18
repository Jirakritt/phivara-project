import type { LocaleCode } from './i18n'

// The site's default typefaces ('Sukhumvit Set' — self-hosted, see
// main_gpt.css's @font-face rules — plus Google-served 'Prompt'/'Lora'/
// 'Cormorant Garamond') only cover Thai + Latin (+ Vietnamese, which
// 'Prompt' also has a subset for). Scripts outside that — CJK, Arabic,
// Khmer, Lao, and Cyrillic — would silently fall through to whatever
// generic sans-serif the visitor's OS ships, which works but doesn't
// match the brand's typography. This maps each such locale to the Noto
// family that covers it, loaded only for that locale's visitors (see
// [locale]/layout.tsx) rather than shipping every script's font on every
// page load.
//
// Noto Serif has no dedicated Khmer/Lao cut in general availability, so
// those two reuse their Sans family for both --serif and --sans; every
// other entry pairs a serif (for h1/h2/h3, matching the Thai/English serif
// headings elsewhere) with a sans (for body copy/UI).
export const LOCALE_GOOGLE_FONTS: Partial<
  Record<LocaleCode, { googleFontsQuery: string; sans: string; serif: string }>
> = {
  ja: {
    googleFontsQuery:
      'family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;500;600',
    sans: "'Noto Sans JP', sans-serif",
    serif: "'Noto Serif JP', 'Noto Sans JP', serif",
  },
  zh: {
    googleFontsQuery:
      'family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;500;600',
    sans: "'Noto Sans SC', sans-serif",
    serif: "'Noto Serif SC', 'Noto Sans SC', serif",
  },
  ko: {
    googleFontsQuery:
      'family=Noto+Sans+KR:wght@300;400;500;600;700&family=Noto+Serif+KR:wght@400;500;600',
    sans: "'Noto Sans KR', sans-serif",
    serif: "'Noto Serif KR', 'Noto Sans KR', serif",
  },
  km: {
    googleFontsQuery: 'family=Noto+Sans+Khmer:wght@300;400;500;600;700',
    sans: "'Noto Sans Khmer', sans-serif",
    serif: "'Noto Sans Khmer', sans-serif",
  },
  lo: {
    googleFontsQuery: 'family=Noto+Sans+Lao:wght@300;400;500;600;700',
    sans: "'Noto Sans Lao', sans-serif",
    serif: "'Noto Sans Lao', sans-serif",
  },
  ar: {
    googleFontsQuery:
      'family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700',
    sans: "'Noto Sans Arabic', sans-serif",
    serif: "'Noto Naskh Arabic', 'Noto Sans Arabic', serif",
  },
  ru: {
    googleFontsQuery: 'family=Noto+Sans:wght@300;400;500;600;700&family=Noto+Serif:wght@400;500;600',
    sans: "'Noto Sans', sans-serif",
    serif: "'Noto Serif', 'Noto Sans', serif",
  },
}
