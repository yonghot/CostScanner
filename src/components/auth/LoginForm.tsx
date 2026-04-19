'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from 'lucide-react'
import { Database } from '@/types/supabase'
import { isValidEmail, isRequired } from '@/utils/validation'
import { cn } from '@/lib/utils'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom')

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 클라이언트 사이드 검증
    if (!isValidEmail(formData.email)) {
      setError('올바른 이메일 주소를 입력해주세요.')
      return
    }

    if (!isRequired(formData.password)) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else {
          setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
        return
      }

      // 로그인 성공 시 리디렉션
      router.push(redirectedFrom || '/dashboard')
      router.refresh()
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 에러 메시지 초기화
    if (error) setError(null)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* 에러 메시지 */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-price-up/20 bg-price-up-bg px-4 py-3 text-sm font-medium text-price-up"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 이메일 */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-ink-700"
        >
          이메일
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={cn(
              'block h-12 w-full rounded-lg border-[1.5px] border-ink-200 bg-white pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400',
              'transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            placeholder="your@email.com"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-ink-700"
        >
          비밀번호
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={cn(
              'block h-12 w-full rounded-lg border-[1.5px] border-ink-200 bg-white pl-11 pr-11 text-sm text-ink-900 placeholder:text-ink-400',
              'transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-400 hover:bg-ink-50 hover:text-ink-600 focus-ring"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* 로그인 유지 + 비밀번호 찾기 */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-ink-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-primary accent-primary focus:ring-2 focus:ring-primary/30"
          />
          로그인 유지
        </label>
        <Link
          href="#"
          className="font-semibold text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
        >
          비밀번호 찾기
        </Link>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'inline-flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-[15px] font-bold tracking-tight',
          'shadow-brand transition-all hover:bg-primary-600 active:scale-[0.99]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
        style={{ height: '52px' }}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? '로그인 중…' : '로그인'}
      </button>

      {/* 구분선 */}
      <div className="relative flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-ink-100" />
        <span className="text-xs font-semibold text-ink-400">또는</span>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      {/* 소셜 로그인 (UI 전용) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink-200 bg-white text-sm font-semibold text-ink-700 transition-all hover:bg-ink-50 hover:border-ink-300 focus-ring disabled:opacity-50"
        >
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded text-[10px] font-black text-black"
            style={{ background: '#FEE500' }}
            aria-hidden
          >
            K
          </span>
          카카오로 계속
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink-200 bg-white text-sm font-semibold text-ink-700 transition-all hover:bg-ink-50 hover:border-ink-300 focus-ring disabled:opacity-50"
        >
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded text-[10px] font-black text-white"
            style={{ background: '#03C75A' }}
            aria-hidden
          >
            N
          </span>
          네이버로 계속
        </button>
      </div>
    </form>
  )
}
