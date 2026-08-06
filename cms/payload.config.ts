import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Branches } from './collections/Branches'
import { Doctors } from './collections/Doctors'
import { Programs } from './collections/Programs'
import { Articles } from './collections/Articles'
import { Leads } from './collections/Leads'
import { Users } from './collections/Users'
import { Membership } from './globals/Membership'
import { Ecosystem } from './globals/Ecosystem'
import { HomeHero } from './globals/HomeHero'

export default buildConfig({
  collections: [Users, Media, Branches, Doctors, Programs, Articles, Leads],
  globals: [Membership, Ecosystem, HomeHero],

  // TH is the source language on the current site; EN is the secondary
  // locale already present as data-en attributes throughout the HTML.
  localization: {
    locales: ['th', 'en'],
    defaultLocale: 'th',
    fallback: true,
  },

  editor: lexicalEditor({}),

  // Powers the Media collection's imageSizes (thumbnail/card/hero) —
  // without this, Payload just warns and skips resizing.
  sharp,

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  // Staff-facing admin panel — add role-based access control per
  // collection (access.read/update/create) once staff roles are defined
  // (e.g. content-editor vs. medical-reviewer vs. admin).
  admin: {
    user: 'users',
  },
})
