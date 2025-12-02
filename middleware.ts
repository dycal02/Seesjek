import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List halaman yang perlu proteksi (dashboard dan turunannya)
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Cek apakah ada session cookie
    const session = request.cookies.get('session')?.value;

    if (!session) {
      // Tidak ada session, redirect ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode dan verify session (basic check)
      const sessionData = JSON.parse(Buffer.from(session, 'base64').toString());
      if (!sessionData.username) {
        // Session tidak valid, redirect ke login
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      // Error parsing session, redirect ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check jika user sudah login dan mencoba akses halaman login
  if (pathname === '/login' || pathname === '/') {
    const session = request.cookies.get('session')?.value;
    
    if (session) {
      try {
        const sessionData = JSON.parse(Buffer.from(session, 'base64').toString());
        if (sessionData.username) {
          // Sudah login, redirect ke dashboard
          if (pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
          if (pathname === '/login') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
        }
      } catch (error) {
        // Session tidak valid, lanjutkan ke halaman
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
