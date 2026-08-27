'use client'

// Custom admin sidebar — replaces Payload's default Nav to match the
// reviewed CMS mockup (phivara-design-html/cms/dashboard.html .admin-sidebar).
// Wired via payload.config.ts admin.components.Nav.
//
// Preserves Payload's real nav open/close behavior (mobile hamburger toggle,
// slide animation) by reading the shared state from useNav() and applying
// the same state classes Payload's own Nav uses — the header's hamburger
// button still works because it toggles the same shared context. Entity
// visibility (which collections/globals the current user may see) is read
// from useEntityVisibility() so role-based access control keeps working.
// Logout uses the real logout route via useConfig()/formatAdminURL, matching
// what Payload's own <Logout> component does.
import type { CollectionSlug, GlobalSlug } from 'payload'

import { Link, useAuth, useConfig, useEntityVisibility, useNav } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { usePathname } from 'next/navigation'
import React from 'react'

type NavItem = {
  slug: string
  label: string
  type: 'collection' | 'global'
  icon: React.ReactNode
}

const icon = (paths: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    {paths}
  </svg>
)

const contentItems: NavItem[] = [
  {
    slug: 'doctors',
    label: 'แพทย์ผู้เชี่ยวชาญ',
    type: 'collection',
    icon: icon(
      <>
        <path d="M20 21a8 8 0 1 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>,
    ),
  },
  {
    slug: 'programs',
    label: 'โปรแกรมตรวจ',
    type: 'collection',
    icon: icon(
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>,
    ),
  },
  {
    slug: 'articles',
    label: 'บทความ',
    type: 'collection',
    icon: icon(
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>,
    ),
  },
  {
    slug: 'branches',
    label: 'สาขา',
    type: 'collection',
    icon: icon(
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h1M9 13h1M14 9h1M14 13h1" />
      </>,
    ),
  },
  {
    slug: 'leads',
    label: 'รายชื่อผู้สนใจ (Leads)',
    type: 'collection',
    icon: icon(
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 8h18" />
      </>,
    ),
  },
  {
    // The `members` collection = actual PHIVARA Private Membership
    // customer accounts (login, tier, profile — see cms/collections/
    // Members.ts). Deliberately labeled differently from the
    // `membership` GLOBAL below ("สมาชิก (Membership)", the public
    // /membership marketing page's copy) — same-sounding Thai words for
    // two very different things, so this spells out "บัญชี" (accounts)
    // to keep them from being confused in the sidebar.
    slug: 'members',
    label: 'บัญชีสมาชิก (Members)',
    type: 'collection',
    icon: icon(
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>,
    ),
  },
  {
    // Fully staff-managed tier set (see cms/collections/MembershipTiers.ts)
    // — Members.membershipTier and MemberPrivileges.cards.tiers both
    // reference this collection now, so an admin can add/remove/reorder
    // tiers here without touching code.
    slug: 'membership-tiers',
    label: 'ระดับสมาชิก (Tiers)',
    type: 'collection',
    icon: icon(<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />),
  },
  {
    slug: 'media',
    label: 'คลังรูปภาพ',
    type: 'collection',
    icon: icon(
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </>,
    ),
  },
  {
    slug: 'awards',
    label: 'รางวัลและการรับรอง',
    type: 'collection',
    icon: icon(
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
      </>,
    ),
  },
]

const settingsItems: NavItem[] = [
  {
    slug: 'home-hero',
    label: 'หน้าแรก (Hero)',
    type: 'global',
    icon: icon(<path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />),
  },
  {
    slug: 'ecosystem',
    label: 'ระบบนิเวศ PHIVARA',
    type: 'global',
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" />
      </>,
    ),
  },
  {
    slug: 'membership',
    label: 'สมาชิก (Membership)',
    type: 'global',
    icon: icon(<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />),
  },
  {
    // Per-tier privilege cards shown on a logged-in member's own profile
    // page (tab === 'privilege' — see cms/globals/MemberPrivileges.ts).
    // Distinct from `membership` above, which is the public /membership
    // marketing page's own separate "AUM Privileges" list.
    slug: 'member-privileges',
    label: 'สิทธิพิเศษสมาชิก (Privileges)',
    type: 'global',
    icon: icon(
      <>
        <path d="M20 6L9 17l-5-5" />
      </>,
    ),
  },
  {
    slug: 'footer',
    label: 'ท้ายหน้าเว็บ (Footer)',
    type: 'global',
    icon: icon(
      <>
        <rect x="3" y="14" width="18" height="7" rx="1" />
        <path d="M3 10h18M7 14v7M17 14v7" />
      </>,
    ),
  },
  {
    slug: 'topbar',
    label: 'แถบบนสุด (Top Bar)',
    type: 'global',
    icon: icon(
      <>
        <rect x="3" y="4" width="18" height="5" rx="1" />
        <path d="M7 15h5M7 18h8" />
      </>,
    ),
  },
  {
    slug: 'privacy-policy',
    label: 'นโยบายความเป็นส่วนตัว',
    type: 'global',
    icon: icon(
      <>
        <path d="M12 3l8 3v6c0 4.5-3 8.2-8 9-5-.8-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>,
    ),
  },
  {
    // Which transactional-email provider (Gmail / Microsoft Graph) member
    // verification + password-reset emails send through — see
    // cms/globals/EmailSettings.ts. Credentials themselves stay in .env,
    // never entered here.
    slug: 'email-settings',
    label: 'ตั้งค่าอีเมลระบบ (Email Settings)',
    type: 'global',
    icon: icon(
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>,
    ),
  },
  {
    // The two shared "room" backdrop photos composited behind every
    // doctor's transparent PNG cutout site-wide — see
    // cms/globals/DoctorDisplaySettings.ts. Was reachable only by typing
    // /admin/globals/doctor-display-settings directly until this entry was
    // added, since this sidebar is fully custom (not Payload's
    // auto-generated one) and doesn't pick up new globals on its own.
    slug: 'doctor-display-settings',
    label: 'พื้นหลังห้องรูปแพทย์',
    type: 'global',
    icon: icon(
      <>
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <path d="M9 9h12v12H9z" />
      </>,
    ),
  },
]

export function Nav() {
  const { hydrated, navOpen, navRef, shouldAnimate } = useNav()
  const { isEntityVisible } = useEntityVisibility()
  const { user } = useAuth()
  const { config } = useConfig()
  const pathname = usePathname()
  const adminRoute = config.routes.admin

  const href = (item: NavItem) =>
    formatAdminURL({
      adminRoute,
      path: `/${item.type === 'collection' ? 'collections' : 'globals'}/${item.slug}`,
    })

  // Plain startsWith would wrongly mark "members" active while on
  // "membership-tiers" (its path is a literal string-prefix of
  // "membership-tiers"'s path) — require an exact match or a "/" boundary
  // right after so one slug can't prefix-match another.
  const isActive = (item: NavItem) => {
    const base = href(item)
    return pathname === base || pathname?.startsWith(`${base}/`)
  }

  const visible = (item: NavItem) =>
    item.type === 'collection'
      ? isEntityVisible({ collectionSlug: item.slug as CollectionSlug })
      : isEntityVisible({ globalSlug: item.slug as GlobalSlug })

  const navClassName = [
    'nav',
    'phivara-nav',
    navOpen && 'nav--nav-open',
    shouldAnimate && 'nav--nav-animate',
    hydrated && 'nav--nav-hydrated',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={navClassName} inert={!navOpen ? true : undefined}>
      {/* Reuses Payload's real `nav__scroll` class so the built-in sticky
          positioning, height, flex layout, and padding vars (which reserve
          space below the top header bar) keep working — we only add our own
          visual styling (background, logo, groups) on top via .phivara-nav. */}
      <div className="nav__scroll" ref={navRef}>
        <Link href={formatAdminURL({ adminRoute, path: '' })} className="phivara-nav__logo" prefetch={false}>
          <img src="/assets/images/brand/emblem.png" alt="PHIVARA" />
          <span className="word">
            PHIVARA
            <small>Content Studio</small>
          </span>
        </Link>

        <nav className="phivara-nav__groups">
          <div className="phivara-nav__group">
            <div className="phivara-nav__label">เนื้อหาเว็บไซต์</div>
            <ul>
              {contentItems.filter(visible).map((item) => (
                <li key={item.slug}>
                  <Link href={href(item)} className={isActive(item) ? 'active' : ''} prefetch={false}>
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="phivara-nav__group">
            <div className="phivara-nav__label">ตั้งค่าหน้าเว็บ</div>
            <ul>
              {settingsItems.filter(visible).map((item) => (
                <li key={item.slug}>
                  <Link href={href(item)} className={isActive(item) ? 'active' : ''} prefetch={false}>
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="phivara-nav__foot">
          {/* Users.access.read allows any logged-in staff member to read
              the directory (needed for author pickers elsewhere), so
              isEntityVisible alone would show this link to everyone —
              only Admins actually manage accounts/roles, so gate the link
              on the real role too. */}
          {user?.role === 'admin' && isEntityVisible({ collectionSlug: 'users' }) && (
            <Link
              href={formatAdminURL({ adminRoute, path: '/collections/users' })}
              prefetch={false}
            >
              ผู้ใช้งาน &amp; สิทธิ์การเข้าถึง
            </Link>
          )}
          {/* Same admin-only gating as the Users link above — LanguageSettings.access.read
              is public (the frontend needs it), so isEntityVisible alone isn't enough
              to hide this from non-admin staff. */}
          {user?.role === 'admin' && isEntityVisible({ globalSlug: 'language-settings' }) && (
            <Link
              href={formatAdminURL({ adminRoute, path: '/globals/language-settings' })}
              prefetch={false}
            >
              การจัดการภาษา
            </Link>
          )}
          <Link href={formatAdminURL({ adminRoute, path: '/manual' })} prefetch={false}>
            คู่มือการใช้งาน CMS
          </Link>
          <Link
            href={formatAdminURL({ adminRoute, path: config.admin.routes.logout })}
            prefetch={false}
          >
            ออกจากระบบ
          </Link>
        </div>
      </div>
    </aside>
  )
}
