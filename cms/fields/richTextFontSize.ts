import { FixedToolbarFeature, TextStateFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { fontSizeState } from './fontSizes'

// Rich-text editor config with the "font size" toolbar menu (14px to 30px, 2px
// steps; see fontSizes.ts). Use it as `editor: fontSizeEditor` on a richText field.
// ONLY use it on fields whose frontend renders through <RichTextContent>
// (src/components/RichTextContent.tsx), otherwise editors can pick a size that
// the website never shows. Currently: Programs.aboutProgram, Doctors.bio,
// Ecosystem hero.lead, PrivacyPolicy.body. The shared root editor in
// payload.config.ts is unchanged for every other field.
export const fontSizeEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    TextStateFeature({ state: fontSizeState }),
  ],
})
