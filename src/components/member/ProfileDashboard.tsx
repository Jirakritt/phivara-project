'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { logoutMember, updateMember } from '@/lib/memberAuthClient'
import type { MemberSummary } from '@/lib/memberAuthClient'
import { localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'
import type { PrivilegeCard, PrivilegeIcon } from '@/lib/memberPrivileges'
import { normalizeTierRef } from '@/lib/membershipTierUtils'
import type { MembershipTierInfo } from '@/lib/membershipTierUtils'

type TabKey = 'info' | 'tier' | 'privilege' | 'consent'

// Builds the same "dark → bright → dark" diagonal foil look the old
// hardcoded `.mcard--gold/silver/diamond` CSS classes had, but from
// whatever 3 colors staff picked for this tier in the CMS (see
// cms/collections/MembershipTiers.ts) instead of a fixed class per tier —
// a tier that doesn't exist yet at build time (an admin adding "Platinum"
// tomorrow) still renders correctly with zero code changes.
function tierCardGradient(tier: MembershipTierInfo | null): string {
  if (!tier) return 'linear-gradient(150deg,#2C2313 0%,#C7A76B 50%,#2C2313 100%)'
  return `linear-gradient(150deg,${tier.gradientStart} 0%,${tier.gradientMid} 50%,${tier.gradientEnd} 100%)`
}

// Preset icon set for cms/globals/MemberPrivileges.ts's `icon` select field
// — staff pick one of these 8 by name in the CMS, this maps that choice to
// the actual inline SVG (same viewBox/stroke style as every other icon on
// this dashboard, so a CMS-authored card looks identical to a hardcoded
// one). Keep this list in sync with MemberPrivileges.ts's `options` array.
const PRIVILEGE_ICONS: Record<PrivilegeIcon, ReactNode> = {
  discount: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M20 12V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  priority: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  doctor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M3 8h18M12 8v13M12 8c-1.5-4-6-4-6-1.5S9 8 12 8zm0 0c1.5-4 6-4 6-1.5S15 8 12 8z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20M9 3l3 6-3 12M15 3l-3 6 3 12" />
    </svg>
  ),
  badge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
    </svg>
  ),
}

function memberNumber(id: number): string {
  return `PHV ${String(id).padStart(4, '0')} ${String((id * 37) % 10000).padStart(4, '0')}`
}

function memberSince(createdAt: string, locale: LocaleCode): string {
  const d = new Date(createdAt)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = locale === 'th' ? d.getFullYear() + 543 : d.getFullYear()
  return `${month}/${year}`
}

export interface ProfileBranchOption {
  slug: string
  nameTh: string
  nameEn: string
}

// Ported from member-profile-v2-nocontainer.html, scoped to the fields this
// project actually has: no address/title-prefix/avatar-upload (not in
// Members.ts), no spend-based tier progress bar (no purchase/spend system
// exists — membershipTier is admin-set, see cms/collections/Members.ts),
// no SMS/affiliate-marketing consent toggles (only emailOptIn is a real
// field). See conversation scope confirmation for the full list of
// deliberate simplifications from the mockup.
export default function ProfileDashboard({
  locale,
  member: initialMember,
  branches,
  privileges,
  tiers,
}: {
  locale: LocaleCode
  member: MemberSummary
  branches: ProfileBranchOption[]
  privileges: PrivilegeCard[]
  tiers: MembershipTierInfo[]
}) {
  const router = useRouter()
  const t = translator(locale)
  const [member, setMember] = useState(initialMember)
  const [tab, setTab] = useState<TabKey>('info')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: member.firstName || '',
    lastName: member.lastName || '',
    phone: member.phone || '',
    dob: member.dob ? member.dob.slice(0, 10) : '',
    preferredBranch: member.preferredBranch || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [changingPassword, setChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  const tierId = normalizeTierRef(member.membershipTier)
  const currentTier = tiers.find((t) => t.id === tierId) ?? null
  const branchName = branches.find((b) => b.slug === member.preferredBranch)

  async function handleSaveInfo() {
    setSaving(true)
    setError('')
    try {
      const updated = await updateMember(member.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        dob: form.dob || null,
        preferredBranch: form.preferredBranch || null,
      })
      setMember(updated)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('บันทึกไม่สำเร็จ', 'Failed to save'))
    } finally {
      setSaving(false)
    }
  }

  async function handleEmailOptInToggle(checked: boolean) {
    setMember((m) => ({ ...m, emailOptIn: checked }))
    try {
      await updateMember(member.id, { emailOptIn: checked })
    } catch {
      setMember((m) => ({ ...m, emailOptIn: !checked }))
    }
  }

  async function handleChangePassword() {
    setPasswordError('')
    if (newPassword.length < 8) {
      setPasswordError(t('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', 'Password must be at least 8 characters'))
      return
    }
    try {
      await updateMember(member.id, { password: newPassword })
      setPasswordSaved(true)
      setNewPassword('')
      setChangingPassword(false)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t('เปลี่ยนรหัสผ่านไม่สำเร็จ', 'Failed to change password'))
    }
  }

  async function handleLogout() {
    await logoutMember()
    router.push(localizedHref(locale, '/login'))
  }

  return (
    <>
      <link rel="stylesheet" href="/css/member-profile.css" />
      <link rel="stylesheet" href="/css/member-profile-v2-nocontainer.css" />

      <main className="member-dash">
        <div className="wrap member-dash__wrap">
          <aside className="member-dash__side">
            <div className="mcard" style={{ background: tierCardGradient(currentTier) }}>
              <div className="mcard__top">
                <span className="mcard__logo">PHIVARA</span>
                <span className="mcard__chip" />
              </div>
              <div>
                <div className="mcard__tier">
                  {currentTier ? t(`สมาชิก ${currentTier.label}`, `${currentTier.label.toUpperCase()} MEMBER`) : t('ยังไม่ได้กำหนดระดับ', 'No tier yet')}
                </div>
                <div className="mcard__number">{memberNumber(member.id)}</div>
              </div>
              <div className="mcard__bottom">
                <div>
                  <span className="mcard__label">MEMBER</span>
                  <span className="mcard__value">{member.firstName} {member.lastName}</span>
                </div>
                <div>
                  <span className="mcard__label">MEMBER SINCE</span>
                  <span className="mcard__value">{memberSince(member.createdAt, locale)}</span>
                </div>
              </div>
            </div>

            <div className="side-actions">
              <a href={localizedHref(locale, '/contact')} className="btn-pill btn-pill-gold">
                {t('นัดหมาย Concierge', 'Book Concierge')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
              <button type="button" className="btn-pill btn-pill-ghost" onClick={handleLogout}>{t('ออกจากระบบ', 'Log out')}</button>
            </div>
          </aside>

          <section className="member-dash__main">
            <div className="dash-head">
              <div
                className="dash-avatar"
                style={{
                  background: `${(currentTier?.gradientMid || '#C7A76B')}30`,
                  boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${(currentTier?.gradientMid || '#C7A76B')}80, 0 10px 20px -8px ${(currentTier?.gradientMid || '#C7A76B')}50`,
                  color: currentTier?.gradientMid || '#8a6a2f',
                }}
              >
                <svg className="dash-avatar__mark" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 5L27 14L17 29L7 14Z" />
                  <path d="M7 14L27 14" />
                  <path d="M17 5L12 14L17 29" />
                  <path d="M17 5L22 14L17 29" />
                </svg>
              </div>
              <div className="dash-head__text">
                <h1>{t('สวัสดี', 'Hello')}, {member.firstName || member.email}</h1>
                <p>{memberNumber(member.id)} · {member.email}</p>
              </div>
            </div>

            <div className="dash-tabs" role="tablist">
              {(['info', 'tier', 'privilege', 'consent'] as TabKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`dash-tab${tab === key ? ' active' : ''}`}
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                >
                  {
                    {
                      info: t('ข้อมูลส่วนตัว', 'Profile info'),
                      tier: t('ระดับสมาชิก', 'Membership tier'),
                      privilege: t('สิทธิพิเศษ', 'Privileges'),
                      consent: t('ความยินยอม', 'Consent'),
                    }[key]
                  }
                </button>
              ))}
            </div>

            {tab === 'info' && (
              <div className="dash-panel">
                <div className="profile-section__head">
                  <div>
                    <h2>{t('ข้อมูลส่วนตัว', 'Profile info')}</h2>
                    <p>{t('ข้อมูลพื้นฐานของคุณ ใช้สำหรับการติดต่อและยืนยันตัวตนเวลาเข้ารับบริการที่สาขา', 'Your basic details, used for contact and identity confirmation at any branch.')}</p>
                  </div>
                </div>
                <div className="profile-card">
                  <div className="info-grid">
                    <div className="info-field">
                      <label>{t('ชื่อ', 'First name')}</label>
                      <input type="text" value={editing ? form.firstName : member.firstName || ''} disabled={!editing} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
                    </div>
                    <div className="info-field">
                      <label>{t('นามสกุล', 'Last name')}</label>
                      <input type="text" value={editing ? form.lastName : member.lastName || ''} disabled={!editing} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
                    </div>
                    <div className="info-field">
                      <label>{t('อีเมล', 'Email')}</label>
                      <input type="email" value={member.email} disabled />
                    </div>
                    <div className="info-field">
                      <label>{t('เบอร์โทรศัพท์', 'Phone number')}</label>
                      <input type="tel" value={editing ? form.phone : member.phone || ''} disabled={!editing} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className="info-field">
                      <label>{t('วันเกิด', 'Date of birth')}</label>
                      <input type="date" value={editing ? form.dob : member.dob ? member.dob.slice(0, 10) : ''} disabled={!editing} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} />
                    </div>
                    <div className="info-field">
                      <label>{t('สาขาที่สนใจ', 'Preferred branch')}</label>
                      {editing ? (
                        <select value={form.preferredBranch} onChange={(e) => setForm((f) => ({ ...f, preferredBranch: e.target.value }))}>
                          <option value="">{t('ไม่ระบุ', 'Not set')}</option>
                          {branches.map((b) => (
                            <option key={b.slug} value={b.slug}>{t(b.nameTh, b.nameEn)}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" value={branchName ? t(branchName.nameTh, branchName.nameEn) : t('ไม่ระบุ', 'Not set')} disabled />
                      )}
                    </div>
                  </div>
                  {error && <p className="auth-field-error" style={{ marginTop: 12 }}>{error}</p>}
                  <div className="profile-edit-actions">
                    {editing ? (
                      <button type="button" className="btn-pill btn-pill-gold" onClick={handleSaveInfo} disabled={saving}>
                        {saving ? t('กำลังบันทึก...', 'Saving...') : t('บันทึกการเปลี่ยนแปลง', 'Save changes')}
                      </button>
                    ) : (
                      <button type="button" className="btn-pill btn-pill-gold" onClick={() => setEditing(true)}>{t('แก้ไขข้อมูล', 'Edit info')}</button>
                    )}
                  </div>

                  <div className="security-row">
                    <div className="security-row__text">
                      <strong>{t('รหัสผ่าน', 'Password')}</strong>
                      <span>{passwordSaved ? t('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว', 'Password changed') : t('เปลี่ยนรหัสผ่านของคุณได้ที่นี่', 'Change your password here')}</span>
                    </div>
                    {!changingPassword && (
                      <button type="button" className="btn-pill btn-pill-outline" onClick={() => setChangingPassword(true)}>{t('เปลี่ยนรหัสผ่าน', 'Change password')}</button>
                    )}
                  </div>
                  {changingPassword && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 12, flexWrap: 'wrap' }}>
                      <input
                        type="password"
                        placeholder={t('รหัสผ่านใหม่', 'New password')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ flex: '1 1 220px', minHeight: 44, padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 9 }}
                      />
                      <button type="button" className="btn-pill btn-pill-gold" onClick={handleChangePassword}>{t('บันทึก', 'Save')}</button>
                      <button type="button" className="btn-pill btn-pill-outline" onClick={() => { setChangingPassword(false); setNewPassword(''); setPasswordError('') }}>{t('ยกเลิก', 'Cancel')}</button>
                      {passwordError && <span className="auth-field-error" style={{ flexBasis: '100%' }}>{passwordError}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'tier' && (
              <div className="dash-panel">
                <div className="profile-section__head">
                  <div>
                    <h2>{t('ระดับสมาชิก', 'Membership tier')}</h2>
                    <p>{t('ระดับสมาชิกของคุณกำหนดโดยทีมงาน PHIVARA — ยิ่งระดับสูง ยิ่งได้รับสิทธิพิเศษมากขึ้น', 'Your tier is set by the PHIVARA team — higher tiers unlock more privileges.')}</p>
                  </div>
                </div>

                {!currentTier ? (
                  <div className="profile-card">
                    <p>{t('ยังไม่ได้รับการกำหนดระดับสมาชิก ทีมงาน PHIVARA จะติดต่อคุณเมื่อมีการกำหนดระดับ', "You haven't been assigned a tier yet — the PHIVARA team will be in touch once one is set.")}</p>
                  </div>
                ) : (
                  <div className="tier-current" style={{ background: `linear-gradient(135deg,${currentTier.gradientStart},${currentTier.gradientMid})` }}>
                    <div className="tier-current__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" /></svg>
                    </div>
                    <div className="tier-current__body">
                      <div className="eyebrow-light">{t('ระดับสมาชิกปัจจุบัน', 'Current tier')}</div>
                      <h3>{currentTier.label} Member</h3>
                    </div>
                  </div>
                )}

                <div className="tier-compare" style={{ gridTemplateColumns: `repeat(${Math.max(tiers.length, 1)}, 1fr)` }}>
                  {tiers.map((t2) => {
                    const tierPrivileges = privileges.filter((p) => p.tiers.includes(t2.id))
                    return (
                      <div key={t2.id} className={`tier-compare-card${currentTier?.id === t2.id ? ' current' : ''}`}>
                        {currentTier?.id === t2.id && <span className="current-tag">{t('ระดับของคุณ', 'Your tier')}</span>}
                        <div className="tier-icon" style={{ background: t2.gradientMid }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" /></svg>
                        </div>
                        <h4>{t2.label}</h4>
                        {tierPrivileges.length > 0 ? (
                          <ul className="tier-compare-card__benefits">
                            {tierPrivileges.map((p, i) => (
                              <li key={i}>{p.title}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="tier-compare-card__empty">{t('ยังไม่มีสิทธิพิเศษกำหนดไว้', 'No privileges set yet')}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {tab === 'privilege' && (
              <div className="dash-panel">
                <div className="profile-section__head">
                  <div>
                    <h2>{t('สิทธิพิเศษของคุณ', 'Your privileges')}</h2>
                    <p>
                      {currentTier
                        ? t(`สิทธิพิเศษที่คุณได้รับตอนนี้ ตามระดับสมาชิก ${currentTier.label}`, `Privileges you currently get as a ${currentTier.label} member`)
                        : t('ยังไม่มีสิทธิพิเศษที่ใช้งานได้ตอนนี้', 'No privileges active yet')}
                    </p>
                  </div>
                </div>
                {currentTier && (
                  <div className="privilege-grid">
                    {privileges
                      .filter((card) => card.tiers.includes(currentTier.id))
                      .map((card, i) => (
                        <div className="privilege-card" key={`${card.title}-${i}`}>
                          <div className="privilege-card__icon">{PRIVILEGE_ICONS[card.icon] ?? PRIVILEGE_ICONS.star}</div>
                          <div className="privilege-card__body">
                            <h4>{card.title}</h4>
                            <p>{card.description}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'consent' && (
              <div className="dash-panel">
                <div className="profile-section__head">
                  <div>
                    <h2>{t('ความยินยอมและการรับข่าวสาร', 'Consent & communication')}</h2>
                    <p>
                      {t('จัดการว่าเราติดต่อคุณอย่างไรได้ อ่านรายละเอียดเพิ่มเติมได้ที่', 'Manage how we contact you. Read more at')}{' '}
                      <a href={localizedHref(locale, '/privacy-policy')}>{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</a>
                    </p>
                  </div>
                </div>
                <div className="profile-card">
                  <div className="consent-row">
                    <div className="consent-row__text">
                      <strong>{t('รับข่าวสารและโปรโมชั่นทางอีเมล', 'Receive news & promotions by email')}</strong>
                      <p>{t('สิทธิพิเศษ โปรแกรมใหม่ และกิจกรรมเฉพาะสมาชิก ส่งตรงถึงอีเมลคุณ', 'Privileges, new programs, and member-only events, sent to your inbox.')}</p>
                    </div>
                    <label className="member-switch">
                      <input type="checkbox" checked={Boolean(member.emailOptIn)} onChange={(e) => handleEmailOptInToggle(e.target.checked)} />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
