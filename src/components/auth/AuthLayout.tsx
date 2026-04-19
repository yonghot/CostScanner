'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_CONFIG } from '@/constants/app'
import AuthVisualPanel from './AuthVisualPanel'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

/**
 * Auth 페이지 2-column 레이아웃.
 * 좌측(40%): 폼 영역 — 로고, 헤드라인, 탭(로그인/회원가입), children
 * 우측(60%): AuthVisualPanel — 다크 패널 + 실시간 가격 + 소셜프루프
 *
 * 모바일(lg 미만)에서는 우측 패널 숨김, 좌측만 풀폭으로 표시.
 */
export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const pathname = usePathname()
  const mode = pathname?.includes('signup') ? 'signup' : 'login'

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] bg-cream">
      {/* 좌측: 폼 영역 */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[480px]">
          {/* 로고 */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group focus-ring rounded-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-brand transition-transform group-hover:scale-105">
              <BarChart3 className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-ink-900">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* 헤드라인 */}
          <div className="mt-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
            )}
          </div>

          {/* 탭 전환: 로그인 ↔ 회원가입 (라우팅 기반) */}
          <Tabs value={mode} className="mt-7">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="login" asChild>
                <Link href="/auth/login">로그인</Link>
              </TabsTrigger>
              <TabsTrigger value="signup" asChild>
                <Link href="/auth/signup">회원가입</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 폼 컨텐츠 */}
          <div className="mt-7">{children}</div>

          {/* 약관 안내 */}
          <p className="mt-8 text-center text-xs text-ink-500">
            계속 진행하시면{' '}
            <Link href="#" className="font-medium text-ink-700 hover:text-ink-900 underline-offset-4 hover:underline">
              이용약관
            </Link>
            {' '}및{' '}
            <Link href="#" className="font-medium text-ink-700 hover:text-ink-900 underline-offset-4 hover:underline">
              개인정보 처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>

      {/* 우측: 비주얼 패널 */}
      <AuthVisualPanel />
    </div>
  )
}
