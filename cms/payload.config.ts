import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

// Payload defaults migrations to `src/migrations` when a `src` folder
// exists, but this project deliberately keeps all CMS internals (collections,
// access, seed, admin components) under `cms/` and reserves `src/` for the
// Next.js frontend app — so migrations live at `cms/migrations` too, for the
// same reason.
const dirname = path.dirname(fileURLToPath(import.meta.url))

// Fail loudly at startup rather than silently signing every session/auth
// token with an empty string if this env var is ever missing (e.g. a
// broken .env on a fresh deploy) — see the site's security review notes.
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required but was not set.')
}

import { Media } from './collections/Media'
import { Branches } from './collections/Branches'
import { Doctors } from './collections/Doctors'
import { Programs } from './collections/Programs'
import { Articles } from './collections/Articles'
import { Awards } from './collections/Awards'
import { Leads } from './collections/Leads'
import { Members } from './collections/Members'
import { MembershipTiers } from './collections/MembershipTiers'
import { Users } from './collections/Users'
import { switchableEmailAdapter } from './email/adapter'
import { Membership } from './globals/Membership'
import { MemberPrivileges } from './globals/MemberPrivileges'
import { Ecosystem } from './globals/Ecosystem'
import { EmailSettings } from './globals/EmailSettings'
import { HomeHero } from './globals/HomeHero'
import { Footer } from './globals/Footer'
import { TopBar } from './globals/TopBar'
import { LanguageSettings } from './globals/LanguageSettings'
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { DoctorDisplaySettings } from './globals/DoctorDisplaySettings'

export default buildConfig({
  collections: [Users, Members, MembershipTiers, Media, Branches, Doctors, Programs, Articles, Awards, Leads],
  globals: [Membership, MemberPrivileges, Ecosystem, HomeHero, Footer, TopBar, LanguageSettings, PrivacyPolicy, EmailSettings, DoctorDisplaySettings],

  // Sends member-account emails (verify/forgot-password — see
  // cms/collections/Members.ts's `auth` config) via whichever provider is
  // selected in the email-settings Global, switching at send time with no
  // restart needed. Cast through `as any` — Payload's own `email:` field is
  // typed against nodemailer's `SendMailOptions`, but this adapter talks
  // straight to the Gmail/Microsoft Graph REST APIs over `fetch` and never
  // installs nodemailer as a dependency (see cms/email/types.ts). The
  // runtime shape returned by switchableEmailAdapter() matches exactly what
  // Payload expects; only the type import is being sidestepped here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  email: switchableEmailAdapter() as any,

  // TH is the source language and the site's permanent default/fallback.
  // 13 more locales are pre-provisioned here so an Admin can turn each one
  // on later purely from the CMS (LanguageSettings global) with no further
  // deploy — Payload ties localized fields to this static list, so a
  // locale that was never added here at all would still need a code
  // change + migration. EN is the only one live going into this project;
  // the rest start fully off (see LanguageSettings.ts's DEFAULT_ON).
  //
  // `filterAvailableLocales` hides any locale from the CMS's own locale
  // switcher unless LanguageSettings has turned its "cmsEditable" flag on
  // for it — so staff only ever see languages that are actually meant to
  // be worked on right now, not all 14 at once. Thai (the config's
  // `defaultLocale`) is always kept regardless of that setting. Fails open
  // to th/en only if LanguageSettings can't be read for any reason (e.g.
  // very first boot before its default document exists), so a problem here
  // can never lock the whole admin UI out of every locale.
  localization: {
    locales: [
      { code: 'th', label: 'ไทย (Thai)' },
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
    ],
    defaultLocale: 'th',
    fallback: true,
    filterAvailableLocales: async ({ locales, req }) => {
      try {
        // Cast through `unknown` — LanguageSettings' generated type has one
        // concrete property per locale code (en, ja, zh, ...), not an index
        // signature, but we need to look one up dynamically by whatever
        // code we're currently checking.
        const settings = (await req.payload.findGlobal({ slug: 'language-settings' })) as unknown as Record<
          string,
          { cmsEditable?: boolean } | undefined
        >
        return locales.filter((locale) => locale.code === 'th' || settings?.[locale.code]?.cmsEditable)
      } catch {
        return locales.filter((locale) => locale.code === 'th' || locale.code === 'en')
      }
    },
  },

  // Adds a persistent toolbar (bold/italic/headings/lists/link/etc.) above
  // every richText field — Payload's default is an inline toolbar that only
  // appears when text is selected, which editors asked to make more
  // discoverable. Applies to all 3 richText fields (Articles body, Programs
  // detail content, Doctors bio) since they all use this shared root editor.
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
  }),

  // Powers the Media collection's imageSizes (thumbnail/card/hero) —
  // without this, Payload just warns and skips resizing.
  sharp,

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  secret: process.env.PAYLOAD_SECRET,

  // Staff-facing admin panel — add role-based access control per
  // collection (access.read/update/create) once staff roles are defined
  // (e.g. content-editor vs. medical-reviewer vs. admin).
  admin: {
    user: 'users',
    // PHIVARA-branded logo/icon (see cms/admin/components/Graphics.tsx) —
    // replaces Payload's default graphics on the Login view and above the Nav.
    // Nav (cms/admin/components/Nav.tsx) replaces the default sidebar with
    // the grouped/iconed nav matching the reviewed CMS mockup.
    components: {
      graphics: {
        Logo: '/cms/admin/components/Graphics#Logo',
        Icon: '/cms/admin/components/Graphics#Icon',
      },
      Nav: '/cms/admin/components/Nav#Nav',
      // Custom Dashboard (cms/admin/components/Dashboard.tsx) — replaces the
      // default collections grid with the mockup's overview cards, backed by
      // real counts/timestamps via the Local API.
      views: {
        dashboard: {
          Component: '/cms/admin/components/Dashboard#Dashboard',
        },
        // "คู่มือการใช้งาน CMS" — /admin/manual, linked from Nav.tsx's
        // sidebar footer. Embeds the static cms-manual/*.html pages (served
        // by src/app/cms-manual/[[...slug]]/route.ts) in an iframe. Being a
        // route under /admin, Payload's own auth already gates it — no
        // per-collection access rule needed here.
        manual: {
          Component: '/cms/admin/components/ManualView#ManualView',
          path: '/manual',
        },
      },
    },
  },
})
