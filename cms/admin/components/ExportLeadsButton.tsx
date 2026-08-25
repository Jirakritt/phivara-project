'use client'

// "Export to Excel" item rendered inside the "⋮" menu next to the
// Columns/Filters controls on the Leads list (wired up via
// admin.components.listMenuItems in cms/collections/Leads.ts — the one
// documented slot that renders in that same toolbar row).
// Reads the list's CURRENT filter/search/sort state from Payload's
// useListQuery() and forwards it as-is to GET /api/leads/export-xlsx (see
// cms/lib/leadsExport.ts), so the downloaded .xlsx always matches whatever
// is on screen — same idea as clicking "export" in a spreadsheet tool after
// applying a filter.
//
// A plain navigation (window.location.href) is used rather than
// fetch+blob so the browser sends the admin session cookie automatically
// (same-origin) and handles the Content-Disposition download itself — no
// need to juggle blobs/object URLs for what's otherwise a simple GET.
import { PopupList, useConfig, useListQuery } from '@payloadcms/ui'

export function ExportLeadsButton() {
  const { config } = useConfig()
  const { query } = useListQuery()

  const handleClick = () => {
    const params = new URLSearchParams()
    if (query?.where) params.set('where', JSON.stringify(query.where))
    if (query?.search) params.set('search', String(query.search))
    if (query?.sort) params.set('sort', String(query.sort))

    const url = `${config.routes.api}/leads/export-xlsx${params.toString() ? `?${params.toString()}` : ''}`
    window.location.href = url
  }

  return <PopupList.Button onClick={handleClick}>Export to Excel</PopupList.Button>
}
