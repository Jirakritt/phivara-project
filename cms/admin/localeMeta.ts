// Single source of truth for the display metadata of every pre-provisioned
// non-Thai locale (see payload.config.ts `localization.locales` for the
// full authoritative codes list — this file only carries the *display*
// label + RTL flag, not the locale list itself, so there's one place that
// could theoretically drift: if a new locale is ever added to
// payload.config.ts, it also needs an entry here for LanguageSettings.ts's
// per-locale fields and LanguageSettingsGrid.tsx's UI to pick it up).
//
// Shared between cms/globals/LanguageSettings.ts (server — generates the
// real cmsEditable/publiclyLive checkbox fields) and
// cms/admin/components/LanguageSettingsGrid.tsx (client — renders the card
// grid that replaces their default checkbox rendering) so the two can
// never drift out of sync with each other.
export interface LocaleMeta {
  code: string
  label: string
  /** Right-to-left script — surfaced as a warning in the admin UI; the
   * public site's layout doesn't support RTL yet, so this locale needs
   * frontend work before `publiclyLive` should ever be turned on for it. */
  rtl?: boolean
}

export const LOCALE_META: LocaleMeta[] = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'zh', label: '中文 (Chinese)' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)' },
  { code: 'km', label: 'ភាសាខ្មែរ (Khmer)' },
  { code: 'ar', label: 'العربية (Arabic)', rtl: true },
  { code: 'ms', label: 'Bahasa Melayu (Malay)' },
  { code: 'id', label: 'Bahasa Indonesia (Indonesian)' },
  { code: 'de', label: 'Deutsch (German)' },
  { code: 'ru', label: 'Русский (Russian)' },
  { code: 'lo', label: 'ພາສາລາວ (Lao)' },
  { code: 'ko', label: '한국어 (Korean)' },
  { code: 'fr', label: 'Français (French)' },
]

// en is the one non-Thai locale already live going into this project —
// defaults to fully on. Everything else starts fully off until an admin
// turns it on from the Language Management screen.
export const DEFAULT_ON_LOCALES: Record<string, boolean> = { en: true }
