'use client'

// Replaces the default long list of per-locale checkbox groups (see
// cms/globals/LanguageSettings.ts — those fields are still the real,
// saved schema; this component just renders a nicer UI over them and is
// wired in as the sole visible field via a `type: 'ui'` field whose
// `admin.components.Field` points here). Matches the reviewed mockup
// phivara-design-html/cms/edit-language-settings-v2.html, ported into a
// real Payload custom field component:
//   - one legend explaining the two toggles instead of repeating it per
//     language
//   - Thai pinned above the grid, no toggles (always on)
//   - each other locale as a card with a status chip
//   - cards auto-sort live -> draft -> off (CSS `order`, computed below)
//   - off cards fade back (data-status="off" — see custom.scss)
//   - "เผยแพร่บนหน้าเว็บ" only appears once "แก้ไขได้ใน CMS" is on
//   - real per-language aria-labels on each switch
//   - unsaved-changes indicator + the actual Save button are just
//     Payload's own document controls — no need to reimplement those,
//     since this all lives inside Payload's real form.
import React from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { FieldType } from '@payloadcms/ui'

import { LOCALE_META } from '../localeMeta'

type Status = 'live' | 'draft' | 'off'

const STATUS_RANK: Record<Status, number> = { live: 0, draft: 1, off: 2 }
const STATUS_LABEL: Record<Status, string> = {
  live: 'เผยแพร่แล้ว',
  draft: 'กำลังแปล (ยังไม่เผยแพร่)',
  off: 'ปิดใช้งาน',
}

function statusOf(cmsChecked: unknown, liveChecked: unknown): Status {
  if (liveChecked) return 'live'
  if (cmsChecked) return 'draft'
  return 'off'
}

interface LocaleCardProps {
  code: string
  label: string
  rtl?: boolean
  status: Status
  cmsChecked: boolean
  liveChecked: boolean
  order: number
}

function LocaleCard({ code, label, rtl, status, cmsChecked, liveChecked, order }: LocaleCardProps) {
  // Reading is driven by the parent's single useFormFields subscription
  // (passed in as cmsChecked/liveChecked props) so there's one source of
  // truth for render state; these two useField calls are only used for
  // their setValue — the documented way to write a specific field's value
  // by explicit path from outside its own default rendering.
  const cmsField = useField<boolean>({ path: `${code}.cmsEditable` }) as FieldType<boolean>
  const liveField = useField<boolean>({ path: `${code}.publiclyLive` }) as FieldType<boolean>

  function handleCmsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked
    cmsField.setValue(checked)
    // A language can't be publicly live without being editable first.
    if (!checked) liveField.setValue(false)
  }

  function handleLiveChange(e: React.ChangeEvent<HTMLInputElement>) {
    liveField.setValue(e.target.checked)
  }

  return (
    <div className="phivara-lang-card" data-status={status} style={{ order }}>
      <div className="phivara-lang-card__head">
        <div className="phivara-lang-card__name">{label}</div>
        <span className="phivara-lang-card__code">{code.toUpperCase()}</span>
      </div>

      <span className={`phivara-status-chip phivara-status-chip--${status}`}>{STATUS_LABEL[status]}</span>

      <label className="phivara-lang-toggle-row">
        <span>แก้ไขได้ใน CMS</span>
        <span className="phivara-switch">
          <input
            type="checkbox"
            checked={cmsChecked}
            onChange={handleCmsChange}
            aria-label={`แก้ไขได้ใน CMS — ${label}`}
          />
          <span className="phivara-switch__slider" />
        </span>
      </label>

      {cmsChecked && (
        <label className="phivara-lang-toggle-row">
          <span>เผยแพร่บนหน้าเว็บ</span>
          <span className="phivara-switch">
            <input
              type="checkbox"
              checked={liveChecked}
              onChange={handleLiveChange}
              aria-label={`เผยแพร่บนหน้าเว็บ — ${label}`}
            />
            <span className="phivara-switch__slider" />
          </span>
        </label>
      )}

      {rtl && (
        <div className="phivara-rtl-note">
          ⚠️ ภาษาเขียนขวาไปซ้าย (RTL) — ต้องปรับ layout เพิ่มก่อนเปิดใช้งานจริง
        </div>
      )}
    </div>
  )
}

export function LanguageSettingsGrid() {
  // One subscription to the whole form's field state, selected down to
  // just the 13 x 2 booleans this screen cares about — cheap (26 flags)
  // and keeps sort/dim/counter logic in one place instead of duplicating
  // per-card reads.
  const rows = useFormFields(([fields]) =>
    LOCALE_META.map(({ code, label, rtl }, index) => {
      const cmsChecked = Boolean(fields[`${code}.cmsEditable`]?.value)
      const liveChecked = Boolean(fields[`${code}.publiclyLive`]?.value)
      const status = statusOf(cmsChecked, liveChecked)
      return { code, label, rtl, index, status, cmsChecked, liveChecked }
    }),
  )

  const liveCount = rows.filter((r) => r.status === 'live').length + 1 // +1 for Thai, always live

  return (
    <div className="phivara-lang-settings">
      <div className="phivara-lang-settings__head">
        <div>
          <h3>การจัดการภาษา</h3>
          <p>ควบคุมว่าภาษาไหนแก้ไขได้ใน CMS และภาษาไหนเผยแพร่บนหน้าเว็บจริง</p>
        </div>
        <div className="phivara-lang-stat">
          เปิดใช้งานบนหน้าเว็บ <strong>{liveCount} / {LOCALE_META.length + 1}</strong> ภาษา
        </div>
      </div>

      <div className="phivara-lang-legend">
        <div className="phivara-lang-legend__item">
          <span className="dot dot--cms" />
          <div>
            <strong>แก้ไขได้ใน CMS</strong>
            <p>เปิดให้ทีม content เห็นภาษานี้ในตัวเลือกภาษาของ CMS เพื่อเริ่มกรอก/แก้คำแปล — ยังไม่แสดงบนหน้าเว็บจริง</p>
          </div>
        </div>
        <div className="phivara-lang-legend__item">
          <span className="dot dot--live" />
          <div>
            <strong>เผยแพร่บนหน้าเว็บ</strong>
            <p>
              เปิดให้ผู้เข้าชมเว็บไซต์จริงเลือกภาษานี้ได้ — ควรเปิดหลังทีม content ตรวจทานคำแปลใน CMS เสร็จแล้วเท่านั้น
              (ตัวเลือกนี้จะโผล่มาก็ต่อเมื่อเปิด &ldquo;แก้ไขได้ใน CMS&rdquo; ก่อน)
            </p>
          </div>
        </div>
      </div>

      <div className="phivara-lang-primary">
        <div className="phivara-lang-primary__name">
          <span className="flag">🇹🇭</span>
          <div>
            <strong>ไทย (Thai)</strong>
            <span>ภาษาหลักของเว็บไซต์ — ภาษาต้นฉบับสำหรับทุกเนื้อหา</span>
          </div>
        </div>
        <span className="phivara-lang-primary__badge">🔒 เปิดใช้งานเสมอ</span>
      </div>

      <p className="phivara-lang-section-label">
        ภาษาอื่นๆ ({LOCALE_META.length} ภาษา) — เรียงตามสถานะ: เผยแพร่แล้ว → กำลังแปล → ปิดใช้งาน
      </p>

      <div className="phivara-lang-grid">
        {rows.map((row) => (
          <LocaleCard
            key={row.code}
            code={row.code}
            label={row.label}
            rtl={row.rtl}
            status={row.status}
            cmsChecked={row.cmsChecked}
            liveChecked={row.liveChecked}
            order={STATUS_RANK[row.status] * 100 + row.index}
          />
        ))}
      </div>
    </div>
  )
}
