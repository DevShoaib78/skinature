import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Optional preview lock.
 *
 * When PREVIEW_BASIC_AUTH ("user:pass") is set — e.g. on a Vercel preview shared
 * with the client — the ENTIRE site requires HTTP Basic Auth and is marked
 * noindex, so only people with the password can view it and search engines skip
 * it. When the variable is unset (the real production launch), this is a complete
 * no-op. Runs on the Edge runtime, so it uses atob (not Buffer).
 */
export function middleware(req: NextRequest) {
  const expected = process.env.PREVIEW_BASIC_AUTH
  if (!expected) {
    // Founders-testing phase on the live domain: no password, but keep search
    // engines out until real launch. Controlled by SITE_NOINDEX (remove at launch).
    if (process.env.SITE_NOINDEX) {
      const res = NextResponse.next()
      res.headers.set('X-Robots-Tag', 'noindex, nofollow')
      return res
    }
    return NextResponse.next()
  }

  const header = req.headers.get('authorization') ?? ''
  const [scheme, encoded] = header.split(' ')
  let ok = false
  if (scheme === 'Basic' && encoded) {
    try {
      ok = atob(encoded) === expected
    } catch {
      ok = false
    }
  }

  if (!ok) {
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Skinature Preview", charset="UTF-8"',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export const config = {
  // Gate everything except Next's own static assets and the favicon.
  matcher: ['/((?!_next/static|_next/image|favicon.png).*)'],
}
