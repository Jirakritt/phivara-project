import React from 'react'

// Custom admin view — "คู่มือการใช้งาน CMS" — wired via payload.config.ts
// admin.components.views.manual (path: /manual, so it renders at
// /admin/manual). Being a route under /admin means Payload's own
// authentication already gates access before this component ever renders;
// no extra auth check needed here.
//
// The manual itself is a set of static, self-contained HTML files
// (cms-manual/*.html at the project root — see cms-manual/index.html for
// the full list) served by src/app/cms-manual/[[...slug]]/route.ts. Rather
// than rebuild 13 hand-written pages as React components, this view just
// embeds them in an iframe; clicking between manual pages (แพทย์, บทความ,
// ฯลฯ) navigates inside the iframe itself via their own relative links, no
// extra routing needed on the Payload side. That route handler re-checks
// the session independently (defense in depth for anyone who bookmarks the
// raw /cms-manual/... URL directly).
export function ManualView() {
  return (
    <div className="phivara-manual-view">
      <iframe
        src="/cms-manual/index.html"
        title="คู่มือการใช้งาน CMS"
        className="phivara-manual-view__frame"
      />
    </div>
  )
}
