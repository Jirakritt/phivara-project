'use client'

// Live preview of the member-facing card this tier produces — lets staff
// see the actual gradient (and label) while editing, instead of having to
// save and go check the member profile page. Mirrors the gradient formula
// in src/components/member/ProfileDashboard.tsx's tierCardGradient() and
// the general shape of its .mcard, but is otherwise a standalone read-only
// UI field (type: 'ui') wired via cms/collections/MembershipTiers.ts —
// purely cosmetic, writes nothing.
import { useFormFields } from '@payloadcms/ui'

const FALLBACK = { start: '#2C2313', mid: '#C7A76B', end: '#2C2313' }

function isHex(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
}

export function TierCardPreview() {
  const label = useFormFields(([fields]) => fields.label?.value)
  const gradientStart = useFormFields(([fields]) => fields.gradientStart?.value)
  const gradientMid = useFormFields(([fields]) => fields.gradientMid?.value)
  const gradientEnd = useFormFields(([fields]) => fields.gradientEnd?.value)

  const start = isHex(gradientStart) ? gradientStart : FALLBACK.start
  const mid = isHex(gradientMid) ? gradientMid : FALLBACK.mid
  const end = isHex(gradientEnd) ? gradientEnd : FALLBACK.end
  const displayLabel = typeof label === 'string' && label.trim() ? label : 'ระดับสมาชิก'

  return (
    <div className="field-type">
      <label className="field-label">ตัวอย่างบัตรสมาชิก (Preview)</label>
      <div
        style={{
          width: 320,
          maxWidth: '100%',
          aspectRatio: '1.586 / 1',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(150deg, ${start} 0%, ${mid} 50%, ${end} 100%)`,
          color: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: '0.16em', opacity: 0.85 }}>PHIVARA PRIVATE MEMBERSHIP</div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '0.04em' }}>{displayLabel}</div>
      </div>
    </div>
  )
}
