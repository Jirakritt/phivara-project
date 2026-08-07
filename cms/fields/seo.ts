import type { Field } from 'payload'

// Shared SEO tab, reused across Articles/Programs/Doctors (all three had an
// identical inline `seo` group with just title+description — consolidated
// here so the fields stay in sync, and to add ogImage/noIndex once instead
// of three times).
//
// `title`/`description` power the page's <title>/<meta name="description">
// (see generateMetadata in each src/app/(frontend)/.../[slug]/page.tsx —
// falls back to the page's own title/summary when left blank, so filling
// these in is optional, not required).
//
// `ogImage` is the preview image shown when a link is shared on LINE/
// Facebook/Twitter — falls back to the page's own cover/hero image when
// empty. Uses Media's `og` image size (1200x630, the standard social-share
// ratio) rather than the `card`/`hero` sizes, which are the wrong shape.
//
// `noIndex` tells Google not to list the page in search results — for
// content that should stay live but not show up in search (e.g. an old
// article being phased out, or a duplicate/test page).
export const seoFields = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Browser tab title / Google search result title. Leave blank to use the page title.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Google search result snippet (~150–160 characters). Leave blank to use the page summary.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Preview image shown when this page is shared on LINE, Facebook, or Twitter. Leave blank to use the page\'s own cover image.' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Hide this page from Google search results (the page itself stays live and reachable by direct link).' },
    },
  ],
})
