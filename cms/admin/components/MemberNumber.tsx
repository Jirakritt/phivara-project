'use client'

// The "PHV 0002 0074"-style member number shown on the member-facing
// profile card (src/components/member/ProfileDashboard.tsx's
// memberNumber()) is now a real, stored column on Members (see
// cms/collections/Members.ts — populated by an afterChange hook right after
// a member is created, using the shared formula in cms/lib/memberNumber.ts),
// so it can be searched via listSearchableFields. This file just renders
// that stored value: MemberNumberCell for the list view (reads `cellData`
// directly), MemberNumberField for the edit view (reads the field's current
// value via useField so it reflects live edits without a page reload).
import { Link, useConfig, useField } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

// A custom Cell replaces Payload's DefaultCell wholesale, which is what
// normally wraps the row's first column in a Link through to the edit view
// (see @payloadcms/ui's Table/DefaultCell) — a plain <span> here silently
// made the whole row unclickable once memberNumber became defaultColumns[0].
// Rebuilding that same link (using the `link`/`linkURL` props Payload still
// passes in even to custom Cells) restores click-through to member detail.
export function MemberNumberCell({ cellData, collectionSlug, link, linkURL, rowData, viewType }: DefaultCellComponentProps) {
  const { config } = useConfig()
  const display = cellData ? String(cellData) : '—'

  if (!link) return <span>{display}</span>

  const href =
    linkURL ||
    `${config.routes.admin}/collections/${collectionSlug}${viewType === 'trash' ? '/trash' : ''}/${encodeURIComponent(rowData.id)}`

  return (
    <Link href={href} prefetch={false}>
      {display}
    </Link>
  )
}

export function MemberNumberField() {
  const { value } = useField<string>({ path: 'memberNumber' })
  return (
    <div className="field-type">
      <label className="field-label">รหัสสมาชิก (Member Number)</label>
      <p style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.04em' }}>
        {value || 'ยังไม่มี — บันทึกเอกสารอีกครั้งเพื่อให้ระบบสร้างให้'}
      </p>
    </div>
  )
}
