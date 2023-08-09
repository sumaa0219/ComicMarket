import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE?.toLowerCase() === 'true') {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  } else {
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/(.*)',
}
