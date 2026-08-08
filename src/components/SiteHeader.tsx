import type { ReactNode } from 'react'

// Ported 1:1 from phivara-design-html/js/site-shell.js's <phivara-header>
// custom element (same markup/classNames/ids so the existing CSS and
// public/js/main.js — which wires up #langToggle, #burgerBtn, #mobileMenu,
// #siteHeader — keep working unmodified).
//
// Rendered as a real React component instead of a custom element so it
// participates in Next.js hydration cleanly (a custom element that
// replaces itself via `this.replaceWith(...)` would fight React's
// hydration of the same DOM node).
//
// Internal nav links are plain <a> tags on purpose, not next/link. Every
// page loads its own copy of the legacy public/js/*.js files (preloader,
// reveal animations, mobile menu, language toggle — see site-runtime.js)
// via next/script, and Next.js only executes a given script src once per
// document. A next/link client-side transition to another page reuses the
// existing document, so those scripts never re-run for the new page and
// things like the preloader silently never hide. Forcing a full page load
// on every internal nav click keeps every page's legacy JS behaving
// exactly like it did on the original static multi-page site.

// 'membership' and 'notFound' aren't among the 6 real nav items below
// (membership.html never had its own top-nav entry on the original site
// either — it's only reachable via CTA buttons; not-found.tsx obviously
// isn't a nav destination at all) — both are accepted here purely so
// SiteHeader can be given an honest `page` value without ever matching a
// NAVIGATION entry, which correctly leaves every tab unhighlighted, same as
// the original static page's behavior.
type NavKey = 'home' | 'ecosystem' | 'program' | 'doctor' | 'article' | 'contact' | 'membership' | 'notFound'

const NAVIGATION: Array<{ key: NavKey; href: string; th: string; en: string }> = [
  { key: 'home', href: '#top', th: 'หน้าแรก', en: 'Home' },
  { key: 'ecosystem', href: '/ecosystem', th: 'เกี่ยวกับเรา', en: 'About Us' },
  { key: 'program', href: '/program', th: 'โปรแกรมตรวจ', en: 'Programs' },
  { key: 'doctor', href: '/doctor', th: 'แพทย์ผู้เชี่ยวชาญ', en: 'Doctors' },
  { key: 'article', href: '/article', th: 'คลังความรู้', en: 'Journal' },
  { key: 'contact', href: '/contact', th: 'ติดต่อ', en: 'Contact' },
]

// Icons are only ever shown in the mobile slide-out menu (see
// `.mobile-menu a .nav-icon` in main.css — hidden by default, shown there)
// so the desktop top nav stays exactly as it was. Same hand-drawn line-icon
// convention as the rest of the site (fill:none, stroke:currentColor,
// round caps/joins — see .doc-branch-label svg in doctor-detail.css) rather
// than pulling in an icon library for six glyphs.
const NAV_ICONS: Record<NavKey, ReactNode> = {
  home: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
    </>
  ),
  ecosystem: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  program: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </>
  ),
  doctor: (
    <>
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5 20c0-4 3.2-6.6 7-6.6s7 2.6 7 6.6" />
    </>
  ),
  article: (
    <>
      <path d="M4 5.5c2.4-1 5-1 7 .3V19c-2-1.3-4.6-1.3-7-.3V5.5Z" />
      <path d="M20 5.5c-2.4-1-5-1-7 .3V19c2-1.3 4.6-1.3 7-.3V5.5Z" />
    </>
  ),
  contact: (
    <path d="M6.2 4h2.6l1.3 3.6-1.8 1.4a10.8 10.8 0 0 0 4.7 4.7l1.4-1.8 3.6 1.3v2.6a1.4 1.4 0 0 1-1.5 1.4A14.6 14.6 0 0 1 4.8 5.5 1.4 1.4 0 0 1 6.2 4Z" />
  ),
  membership: null,
  notFound: null,
}

function NavLinks({ page }: { page: NavKey }) {
  return (
    <>
      {NAVIGATION.map((item) => {
        // 'home's href is '#top' in the table above, which only makes sense
        // when you're already ON the home page (scroll-to-top). On every
        // other page that same href was previously used as-is, so clicking
        // "หน้าแรก" just jumped to the top of the current page instead of
        // navigating home — same fix as the logo link right below already
        // has for this exact case.
        const href = item.key === 'home' && page !== 'home' ? '/' : item.href
        return (
          <a
            key={item.key}
            href={href}
            className={item.key === page ? 'active' : undefined}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              {NAV_ICONS[item.key]}
            </svg>
            {/* data-th/data-en go on this inner span, not the <a> itself —
                site-runtime.js's language toggle does
                element.textContent = element.getAttribute('data-th'|'data-en')
                on every [data-th]/[data-en] match, which would wipe out the
                svg icon sibling above if it lived on the same element (same
                pattern already used for .prog-detail-link below). */}
            <span data-th={item.th} data-en={item.en}>{item.th}</span>
          </a>
        )
      })}
    </>
  )
}

export default function SiteHeader({ page = 'home' as NavKey }: { page?: NavKey }) {
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div className="tb-left" data-th="PHIVARA Aesthetic &amp; Longevity Center" data-en="PHIVARA Aesthetic &amp; Longevity Center">
            PHIVARA Aesthetic &amp; Longevity Center
          </div>
          <div className="tb-right">
            <span data-th="สายด่วนส่วนตัว: 02-XXX-XXXX" data-en="Private Hotline: 02-XXX-XXXX">สายด่วนส่วนตัว: 02-XXX-XXXX</span>
            <span data-th="LINE: @phivara" data-en="LINE: @phivara">LINE: @phivara</span>
            <div className="lang-toggle" id="langToggle" aria-label="Language">
              <span className="active" data-val="th">TH</span>
              <span data-val="en">EN</span>
            </div>
          </div>
        </div>
      </div>
      <header className="site" id="siteHeader">
        <div className="wrap">
          <a href={page === 'home' ? '#top' : '/'} className="logo-lockup">
            <img src="/assets/images/brand/emblem.png" alt="PHIVARA emblem" />
            <span className="word">
              PHIVARA
              <small>The Art of Beaugevity</small>
            </span>
          </a>
          <nav className="main-nav" id="mainNav" aria-label="Primary navigation">
            <NavLinks page={page} />
          </nav>
          <div className="header-cta">
            <a href="#vipModalOverlay" className="btn btn-outline-dark btn-txt vip-trigger" data-th="จองปรึกษาส่วนตัว" data-en="Book a Private Consultation">
              จองปรึกษาส่วนตัว
            </a>
            <button type="button" className="burger" id="burgerBtn" aria-label="Open navigation" aria-controls="mobileMenu" aria-expanded="false">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
      <nav className="mobile-menu" id="mobileMenu" aria-label="Mobile navigation">
        <NavLinks page={page} />
      </nav>
    </>
  )
}
