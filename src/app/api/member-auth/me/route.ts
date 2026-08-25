import { NextResponse } from 'next/server'

import { authenticateMember } from '@/lib/memberSession'

export async function GET(request: Request) {
  const { member } = await authenticateMember(request.headers)
  return NextResponse.json({ user: member })
}
