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

import { Media } from './collections/Media'
import { Branches } from './collections/Branches'
import { Doctors } from './collections/Doctors'
import { Programs } from './collections/Programs'
import { Articles } from './collections/Articles'
import { Awards } from './collections/Awards'
import { Leads } from './collections/Leads'
import { Users } from './collections/Users'
import { Membership } from './globals/Membership'
import { Ecosystem } from './globals/Ecosystem'
import { HomeHero } from './globals/HomeHero'

export default buildConfig({
  collections: [Users, Media, Branches, Doctors, Programs, Articles, Awards, Leads],
  globals: [Membership, Ecosystem, HomeHero],

  // TH is the source language on the current site; EN is the secondary
  // locale already present as data-en attributes throughout the HTML.
  localization: {
    locales: ['th', 'en'],
    defaultLocale: 'th',
    fallback: true,
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

  secret: process.env.PAYLOAD_SECRET || '',

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
      },
    },
  },
})
