import { get } from '@vercel/edge-config'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const isInMaintenanceMode = process.env.EDGE_CONFIG ? await get('isInMaintenanceMode') : false
  if (req.url.includes("/maintenance") || isInMaintenanceMode) {
    req.nextUrl.pathname = `/maintenance`
    return NextResponse.rewrite(req.nextUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/(.*)',
}
