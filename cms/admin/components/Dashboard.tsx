import type { AdminViewServerProps } from 'payload'
import type { Where } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { branchScopeWhere, leadsBranchScopeWhere } from '../../access/roles'

// Combines any number of possibly-undefined `where` clauses with `and`,
// dropping the ones that aren't set. Returns `undefined` if none are set,
// so a plain `payload.count({ collection })` call (no filter) still works
// for admins instead of an empty `{ and: [] }`.
function mergeWhere(...clauses: Array<Where | undefined>): Where | undefined {
  const present = clauses.filter((c): c is Where => Boolean(c))
  if (!present.length) return undefined
  if (present.length === 1) return present[0]
  return { and: present }
}

// Custom Dashboard — matches the reviewed CMS mockup
// (phivara-design-html/cms/dashboard.html): a greeting, overview cards per
// collection/global with real counts (via the Local API, not the mockup's
// hardcoded numbers), and a "recently updated" list built from real
// updatedAt timestamps. Wired via payload.config.ts
// admin.components.views.dashboard.
//
// Note on "recent activity": Payload has no built-in audit log (no record of
// *who* changed *what* action), so unlike the mockup's invented activity
// feed, this lists the most recently updated real documents with genuine
// timestamps rather than fabricating actor/action text that isn't tracked.
// Note: this replaces Payload's built-in `dashboard` root view, which the
// surrounding admin route already wraps in DefaultTemplate (Nav + header) —
// wrapping again here would render a second Nav. Only the page content
// itself belongs here.
export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  const { payload, user } = req

  // A Content Editor / Medical Reviewer scoped to specific branches
  // (Users.assignedBranches) should only see counts for their own branch's
  // doctors/programs/articles/leads here — otherwise these cards show
  // every branch's numbers to everyone, which doesn't match what they can
  // actually open from the collection lists (see roles.ts's
  // branchScopeWhere / leadsBranchScopeWhere for the same rule the list
  // views themselves already enforce). Admins get `undefined` back, i.e.
  // no extra filter, same as before.
  const doctorsWhere = branchScopeWhere(user, 'branch', false)
  const programsWhere = branchScopeWhere(user, 'branch', true)
  const articlesWhere = branchScopeWhere(user, 'branch', true)
  const leadsWhere = await leadsBranchScopeWhere(payload, user)

  const [
    doctorsCount,
    doctorsDraft,
    programsCount,
    programsDraft,
    articlesCount,
    articlesDraft,
    branchesCount,
    mediaCount,
    leadsToday,
    homeHero,
    ecosystem,
    membership,
  ] = await Promise.all([
    payload.count({ collection: 'doctors', where: doctorsWhere }),
    payload.count({ collection: 'doctors', where: mergeWhere(doctorsWhere, { _status: { equals: 'draft' } }) }),
    payload.count({ collection: 'programs', where: programsWhere }),
    payload.count({ collection: 'programs', where: mergeWhere(programsWhere, { _status: { equals: 'draft' } }) }),
    payload.count({ collection: 'articles', where: articlesWhere }),
    payload.count({ collection: 'articles', where: mergeWhere(articlesWhere, { _status: { equals: 'draft' } }) }),
    payload.count({ collection: 'branches' }),
    payload.count({ collection: 'media' }),
    payload.count({
      collection: 'leads',
      where: mergeWhere(leadsWhere, { createdAt: { greater_than_equal: startOfToday().toISOString() } }),
    }),
    payload.findGlobal({ slug: 'home-hero' }),
    payload.findGlobal({ slug: 'ecosystem' }),
    payload.findGlobal({ slug: 'membership' }),
  ])

  const recentDocs = await fetchRecentlyUpdated(payload, {
    doctors: doctorsWhere,
    programs: programsWhere,
    articles: articlesWhere,
  })

  const contentCards = [
    {
      href: '/collections/doctors',
      label: 'แพทย์ผู้เชี่ยวชาญ',
      stat: statLine(doctorsCount.totalDocs, doctorsDraft.totalDocs),
      icon: icons.doctors,
    },
    {
      href: '/collections/programs',
      label: 'โปรแกรมตรวจ',
      stat: statLine(programsCount.totalDocs, programsDraft.totalDocs),
      icon: icons.programs,
    },
    {
      href: '/collections/articles',
      label: 'บทความ',
      stat: statLine(articlesCount.totalDocs, articlesDraft.totalDocs),
      icon: icons.articles,
    },
    {
      href: '/collections/branches',
      label: 'สาขา',
      stat: `${branchesCount.totalDocs} สาขา`,
      icon: icons.branches,
    },
    {
      href: '/collections/leads',
      label: 'รายชื่อผู้สนใจ (Leads)',
      stat: `${leadsToday.totalDocs} รายการใหม่วันนี้`,
      icon: icons.leads,
    },
    {
      href: '/collections/media',
      label: 'คลังรูปภาพ',
      stat: `${mediaCount.totalDocs} ไฟล์`,
      icon: icons.media,
    },
  ]

  const globalCards = [
    { href: '/globals/home-hero', label: 'หน้าแรก (Hero)', doc: homeHero, icon: icons.hero },
    { href: '/globals/ecosystem', label: 'ระบบนิเวศ PHIVARA', doc: ecosystem, icon: icons.ecosystem },
    { href: '/globals/membership', label: 'สมาชิก (Membership)', doc: membership, icon: icons.membership },
  ]

  return (
    <Gutter>
      <div className="phivara-dashboard">
        <div className="phivara-dashboard__head">
          <div>
            <h1>สวัสดี{user?.name ? `, ${user.name}` : ''} 👋</h1>
            <p>ภาพรวมเนื้อหาทั้งหมดของเว็บไซต์ PHIVARA</p>
          </div>
        </div>

        <p className="phivara-dashboard__label">เนื้อหาเว็บไซต์</p>
        <div className="phivara-dashboard__grid">
          {contentCards.map((card) => (
            <a key={card.href} className="phivara-dashboard__card" href={`/admin${card.href}`}>
              <div className="icon-wrap">{card.icon}</div>
              <h3>{card.label}</h3>
              <div className="stat">{card.stat}</div>
              <span className="go">จัดการ →</span>
            </a>
          ))}
        </div>

        <p className="phivara-dashboard__label">ตั้งค่าหน้าเว็บ (Globals)</p>
        <div className="phivara-dashboard__grid">
          {globalCards.map((card) => (
            <a key={card.href} className="phivara-dashboard__card" href={`/admin${card.href}`}>
              <div className="icon-wrap">{card.icon}</div>
              <h3>{card.label}</h3>
              <div className="stat">
                แก้ไขล่าสุด <strong>{relativeTime(card.doc?.updatedAt)}</strong>
              </div>
              <span className="go">แก้ไข →</span>
            </a>
          ))}
        </div>

        <p className="phivara-dashboard__label">เอกสารที่แก้ไขล่าสุด</p>
        <div className="phivara-dashboard__activity">
          {recentDocs.length === 0 && (
            <div className="phivara-dashboard__activity-row">
              <span className="what">ยังไม่มีการแก้ไขเอกสาร</span>
            </div>
          )}
          {recentDocs.map((doc) => (
            <a key={`${doc.collectionSlug}-${doc.id}`} className="phivara-dashboard__activity-row" href={`/admin/collections/${doc.collectionSlug}/${doc.id}`}>
              <span className="what">
                <strong>{doc.collectionLabel}</strong> — {doc.title}
              </span>
              <span className="when">{relativeTime(doc.updatedAt)}</span>
            </a>
          ))}
        </div>
      </div>
    </Gutter>
  )
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function statLine(total: number, draft: number) {
  return draft > 0 ? `${total} รายการ · ${draft} ฉบับร่าง` : `${total} รายการ`
}

function relativeTime(iso?: string | null) {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'เมื่อสักครู่'
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ชม. ที่แล้ว`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'เมื่อวาน'
  if (days < 30) return `${days} วันที่แล้ว`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} เดือนที่แล้ว`
  return `${Math.floor(months / 12)} ปีที่แล้ว`
}

type RecentDoc = {
  id: string | number
  collectionLabel: string
  collectionSlug: string
  title: string
  updatedAt: string
}

// Pulls the most recently updated document from each of the three
// draft-enabled collections and returns the newest few overall — a real,
// verifiable substitute for the mockup's fabricated activity feed.
async function fetchRecentlyUpdated(
  payload: AdminViewServerProps['initPageResult']['req']['payload'],
  whereBySource: Partial<Record<'doctors' | 'programs' | 'articles', Where | undefined>> = {},
): Promise<RecentDoc[]> {
  const sources: Array<{ slug: 'doctors' | 'programs' | 'articles'; label: string; titleField: string }> = [
    { slug: 'programs', label: 'โปรแกรมตรวจ', titleField: 'title' },
    { slug: 'doctors', label: 'แพทย์ผู้เชี่ยวชาญ', titleField: 'nameTh' },
    { slug: 'articles', label: 'บทความ', titleField: 'title' },
  ]

  // Branch-scoped so a Content Editor/Medical Reviewer never sees another
  // branch's doc land in "recently updated" here — clicking through to one
  // would just hit an access-denied page, since the list/edit views
  // already enforce the same branch scope (see Doctors/Programs/Articles
  // access config).
  const results = await Promise.all(
    sources.map((source) =>
      payload.find({
        collection: source.slug,
        where: whereBySource[source.slug],
        limit: 4,
        sort: '-updatedAt',
        depth: 0,
      }),
    ),
  )

  const docs: RecentDoc[] = results.flatMap((result, i) =>
    result.docs.map((doc) => ({
      id: doc.id,
      collectionLabel: sources[i].label,
      collectionSlug: sources[i].slug,
      title: String((doc as unknown as Record<string, unknown>)[sources[i].titleField] ?? doc.id),
      updatedAt: doc.updatedAt,
    })),
  )

  return docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4)
}

const iconWrap = (paths: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    {paths}
  </svg>
)

const icons = {
  doctors: iconWrap(
    <>
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </>,
  ),
  programs: iconWrap(
    <>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>,
  ),
  articles: iconWrap(
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>,
  ),
  branches: iconWrap(
    <>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 9h1M9 13h1M14 9h1M14 13h1" />
    </>,
  ),
  leads: iconWrap(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 8h18" />
    </>,
  ),
  media: iconWrap(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </>,
  ),
  hero: iconWrap(<path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />),
  ecosystem: iconWrap(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" />
    </>,
  ),
  membership: iconWrap(<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />),
}
