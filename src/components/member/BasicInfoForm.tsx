'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { updateMember } from '@/lib/memberAuthClient'
import { localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export interface BasicInfoBranchOption {
  slug: string
  nameTh: string
  nameEn: string
}

// Step 3 of 3 — ported from register-basic-info.html. "สาขาที่สนใจ" is a
// real <select> sourced from the live Branches list (per confirmed scope),
// not the mockup's free-text input.
export default function BasicInfoForm({
  locale,
  memberId,
  branches,
}: {
  locale: LocaleCode
  memberId: number
  branches: BasicInfoBranchOption[]
}) {
  const router = useRouter()
  const t = translator(locale)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [preferredBranch, setPreferredBranch] = useState('')
  const [wantsUpdates, setWantsUpdates] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!dob) {
      setError(t('กรุณาระบุวันเกิด', 'Please enter your date of birth'))
      return
    }
    if (!preferredBranch) {
      setError(t('กรุณาเลือกสาขาที่สนใจ', 'Please select a preferred branch'))
      return
    }
    setSubmitting(true)
    try {
      await updateMember(memberId, {
        firstName,
        lastName,
        phone,
        dob,
        preferredBranch,
        emailOptIn: wantsUpdates,
      })
      router.push(localizedHref(locale, '/profile'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'Something went wrong. Please try again.'))
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      <div className="auth-form-grid">
        <div className="auth-field">
          <span>{t('ชื่อ', 'First name')} <span className="req">*</span></span>
          <input type="text" placeholder={t('สมชาย', 'John')} required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="auth-field">
          <span>{t('นามสกุล', 'Last name')} <span className="req">*</span></span>
          <input type="text" placeholder={t('ก้องเกียรติ', 'Doe')} required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className="auth-field">
          <span>{t('เบอร์โทรศัพท์', 'Phone number')} <span className="req">*</span></span>
          <input type="tel" placeholder="08X-XXX-XXXX" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="auth-field">
          <span>{t('วันเกิด', 'Date of birth')} <span className="req">*</span></span>
          <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
          <span className="auth-field-hint">{t('ไว้มอบสิทธิพิเศษวันเกิดให้คุณ', 'So we can send you a birthday privilege')}</span>
        </div>

        <div className="auth-field auth-field-wide">
          <span>{t('สาขาที่สนใจ', 'Preferred branch')} <span className="req">*</span></span>
          <select required value={preferredBranch} onChange={(e) => setPreferredBranch(e.target.value)}>
            <option value="">{t('เลือกสาขาที่คุณไปใช้บริการบ่อยที่สุด', 'Select the branch you visit most')}</option>
            {branches.map((b) => (
              <option key={b.slug} value={b.slug}>{t(b.nameTh, b.nameEn)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="auth-checkbox-row">
        <input type="checkbox" id="wantsUpdates" checked={wantsUpdates} onChange={(e) => setWantsUpdates(e.target.checked)} />
        <label htmlFor="wantsUpdates">{t('รับข่าวสาร สิทธิพิเศษ และโปรโมชั่นจาก PHIVARA ทางอีเมล (เปลี่ยนแปลงได้ทุกเมื่อในหน้าโปรไฟล์)', 'Receive PHIVARA news, privileges and promotions by email (you can change this anytime on your profile)')}</label>
      </div>

      {error && <span className="auth-field-error">{error}</span>}

      <button type="submit" className="auth-btn" disabled={submitting}>
        {submitting ? t('กำลังบันทึก...', 'Saving...') : t('เข้าสู่โปรไฟล์ของฉัน', 'Go to my profile')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </form>
  )
}
