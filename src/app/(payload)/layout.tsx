import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
// PHIVARA brand theme (colors/fonts) for the admin panel — see the file's
// own top comment for the approach. Imported after Payload's own CSS so it
// can override it (custom CSS outside Payload's @layer already wins on
// specificity regardless of order, but this keeps intent obvious too).
import './custom.scss'

type Args = {
  children: React.ReactNode
}

// Powers Payload's admin panel form actions (save, publish, etc.) — required
// by RootLayout, not optional.
const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// Wraps the /admin route group only — the public site in src/app/(frontend)
// has its own layout and is unaffected by this.
const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
