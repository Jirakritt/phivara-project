'use client'

// Custom row label for Ecosystem.disciplines — shows the discipline's own
// Title (e.g. "เวชศาสตร์อายุยืนยาว" / "Longevity Medicine", whichever locale
// is active) instead of the generic "Discipline 01/02/03/04" Payload shows
// by default for unlabeled array rows. Wired via the `admin.components.RowLabel`
// on the disciplines field in cms/globals/Ecosystem.ts.
import { useRowLabel } from '@payloadcms/ui'

type DisciplineRow = {
  title?: string
}

export function DisciplineRowLabel() {
  const { data, rowNumber } = useRowLabel<DisciplineRow>()
  const fallback = `Discipline ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`

  return <span>{data?.title || fallback}</span>
}
