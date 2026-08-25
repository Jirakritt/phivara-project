import ExcelJS from 'exceljs'
import type { PayloadHandler, Where } from 'payload'

import type { Lead } from '../../payload-types'

// Backing handler for the "Export to Excel" button on the Leads admin list
// (see cms/admin/components/ExportLeadsButton.tsx, wired up via
// cms/collections/Leads.ts's `endpoints`). Registered at GET
// /api/leads/export-xlsx.
//
// Deliberately built as a real .xlsx (via exceljs) rather than reusing
// Payload's official CSV/JSON export plugin — the latter doesn't produce a
// native Excel file (no @payloadcms/plugin-import-export xlsx format as of
// this Payload version), and the team asked specifically for .xlsx.
//
// The `where`/`search`/`sort` query params are whatever the admin list's
// current filter/search/sort state is (see the button component for how
// they're built from Payload's useListQuery()) — passed straight through to
// payload.find() so the exported file always matches what's on screen.
// `user`/`overrideAccess: false` keeps leadsBranchScopedAccess in effect, so
// a branch-scoped staff member can only ever export their own branch's
// leads, same as the list view.

// Kept in sync by hand with the `service`/`status` field `options` in
// Leads.ts (see that file's comment on why `service` can't read the CMS
// live) — used here to print the human label instead of the raw stored
// value in the exported sheet.
const SERVICE_LABELS: Record<string, string> = {
  wellness: 'Aesthetic',
  longevity: 'Longevity',
  'plastic-surgery': 'Plastic Surgery',
  dermatology: 'Dermatology',
  membership: 'PHIVARA AUM Membership',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  closed: 'Closed',
}

function formatDate(value: unknown): string {
  if (!value || typeof value !== 'string') return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function buildExportFilename(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `phivara-leads-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}.xlsx`
}

function buildLeadsWorkbook(docs: Lead[]): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Leads')

  sheet.columns = [
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Phone', key: 'phone', width: 16 },
    { header: 'Branch', key: 'branch', width: 14 },
    { header: 'Service', key: 'service', width: 22 },
    { header: 'Notes', key: 'notes', width: 40 },
    { header: 'Preferred Date', key: 'preferredDate', width: 16 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Created At', key: 'createdAt', width: 18 },
  ]
  sheet.getRow(1).font = { bold: true }

  for (const doc of docs) {
    sheet.addRow({
      name: doc.name ?? '',
      phone: doc.phone ?? '',
      branch: doc.branch ?? '',
      service: SERVICE_LABELS[doc.service] ?? doc.service ?? '',
      notes: doc.notes ?? '',
      preferredDate: doc.preferredDate ? formatDate(doc.preferredDate) : '',
      status: STATUS_LABELS[doc.status] ?? doc.status ?? '',
      createdAt: formatDate(doc.createdAt),
    })
  }

  return workbook
}

export const exportLeadsHandler: PayloadHandler = async (req) => {
  const { payload, user, searchParams } = req

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let where: Where | undefined
  const whereParam = searchParams.get('where')
  if (whereParam) {
    try {
      where = JSON.parse(whereParam) as Where
    } catch {
      // Malformed where — ignore rather than fail the whole export, same
      // fallback behavior as an empty filter.
      where = undefined
    }
  }

  const search = searchParams.get('search')
  if (search) {
    // Leads has no admin.listSearchableFields configured, so the admin
    // list's search box defaults to searching `useAsTitle` ('name') only —
    // mirrored here so an active search narrows the export the same way.
    const searchClause: Where = { name: { contains: search } }
    where = where ? { and: [where, searchClause] } : searchClause
  }

  const sortParam = searchParams.get('sort')

  const result = await payload.find({
    collection: 'leads',
    where,
    sort: sortParam || undefined,
    user,
    overrideAccess: false,
    limit: 0,
    depth: 0,
  })

  const workbook = buildLeadsWorkbook(result.docs)
  const buffer = await workbook.xlsx.writeBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${buildExportFilename()}"`,
    },
  })
}
