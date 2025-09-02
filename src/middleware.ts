import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 개발 중에는 인증 체크를 비활성화합니다
  // 실제 배포 시에는 Supabase 설정을 완료한 후 인증 로직을 활성화하세요
  
  return NextResponse.next()
  
  /* 
  // 실제 Supabase 설정 완료 후 아래 코드를 활성화하세요
  
  const res = NextResponse.next()
  
  // Supabase 환경변수 확인
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res
  }

  const { createMiddlewareClient } = await import('@supabase/auth-helpers-nextjs')
  const { Database } = await import('./types/supabase')
  
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 인증이 필요한 경로들
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // 인증이 필요한 경로에 세션이 없으면 로그인 페이지로 리디렉션
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 로그인된 사용자가 인증 페이지에 접근하면 대시보드로 리디렉션
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPath = authPaths.includes(req.nextUrl.pathname)
  
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
  */
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}