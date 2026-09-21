import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Turns off the draft-mode cookie set by /api/preview (see that file's
// comment for the full picture) — after this, non-live locales 404 again
// for this browser, same as any regular visitor.
export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()
  return NextResponse.redirect(new URL('/', request.url))
}
