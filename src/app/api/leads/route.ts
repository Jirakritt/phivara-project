import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

// Backs both site-wide lead-capture forms: the VIP Concierge modal
// (public/js/vip-modal.js's #vipForm) and each doctor detail page's own
// appointment form (public/js/doctor-appointment-form.js's #vipDirectForm).
// Before this route existed, both forms only validated fields client-side
// and showed a fake "Thank you" message — nothing was ever persisted. This
// is a plain fetch()-based POST endpoint rather than pointing the forms
// straight at Payload's own /api/leads REST endpoint, mainly so the client
// can send the branch as its slug (already known to the page via
// window.__PHIVARA_DATA__) instead of needing to know Payload's internal
// document id for the relationship field.
const SERVICE_VALUES = new Set(['plastic-surgery', 'longevity', 'dermatology', 'wellness', 'membership'])

function isValidPhone(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const compact = value.replace(/[\s().-]/g, '')
  return /^0\d{8,9}$/.test(compact) || /^\+66\d{8,9}$/.test(compact)
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const branchSlug = typeof body.branch === 'string' ? body.branch.trim() : ''
  const service = typeof body.service === 'string' ? body.service.trim() : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
  const sourcePath = typeof body.sourcePath === 'string' ? body.sourcePath.slice(0, 300) : ''
  // Only sent by the doctor detail page's appointment form (<input
  // type="date">, so already "YYYY-MM-DD") — the shared VIP modal has no
  // date field, so this is optional here.
  const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : ''

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  if (!isValidPhone(phone)) return NextResponse.json({ error: 'Enter a valid phone number' }, { status: 400 })
  if (!branchSlug) return NextResponse.json({ error: 'Branch is required' }, { status: 400 })
  if (!SERVICE_VALUES.has(service)) return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    return NextResponse.json({ error: 'Invalid preferred date' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  // Still validated against real branches (so a bogus slug can't slip in),
  // but stored as the slug itself rather than resolved to a document id —
  // Leads.branch is a plain text field, not a relationship, specifically so
  // leads survive branch re-seeding untouched. See the field comment in
  // cms/collections/Leads.ts for the full reasoning.
  const branchResult = await payload.find({
    collection: 'branches',
    where: { slug: { equals: branchSlug } },
    limit: 1,
    depth: 0,
  })
  const branch = branchResult.docs[0]
  if (!branch) return NextResponse.json({ error: 'Unknown branch' }, { status: 400 })

  await payload.create({
    collection: 'leads',
    data: {
      name,
      phone,
      branch: branchSlug,
      service: service as 'plastic-surgery' | 'longevity' | 'dermatology' | 'wellness' | 'membership',
      notes: notes || undefined,
      sourcePath: sourcePath || undefined,
      preferredDate: preferredDate || undefined,
      status: 'new',
    },
    // The collection's own access already allows public create (`create:
    // () => true`); overrideAccess just skips the redundant check since
    // this route has already validated the payload above.
    overrideAccess: true,
  })

  return NextResponse.json({ success: true })
}
