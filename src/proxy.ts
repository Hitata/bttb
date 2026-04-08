import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const [headerB64, payloadB64, signatureB64] = token.split('.')
    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return false
    const payload = JSON.parse(atob(payloadB64))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes: JWT-based auth via admin_session cookie
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow login endpoint through
    if (pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    // /admin page itself is always accessible (shows login form)
    // Only protect sub-paths and API routes
    if (pathname.startsWith('/admin/clients') || pathname.startsWith('/api/admin')) {
      const token = request.cookies.get('admin_session')?.value
      if (!token) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/admin?login=true', request.url))
      }

      const valid = await verifyJWT(token, process.env.ADMIN_JWT_SECRET!)
      if (!valid) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/admin?login=true', request.url))
      }
    }

    return NextResponse.next()
  }

  // Dashboard routes: session-based auth (existing)
  if (pathname.startsWith('/dashboard')) {
    const token =
      request.cookies.get("authjs.session-token") ??
      request.cookies.get("__Secure-authjs.session-token");

    if (!token) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
  ],
};
