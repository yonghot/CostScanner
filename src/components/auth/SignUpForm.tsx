'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  Mail,
  Lock,
  User,
  Store,
  Phone,
  Briefcase,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/supabase'
import {
  isValidEmail,
  isValidPassword,
  isRequired,
  hasMinLength,
} from '@/utils/validation'
import { cn } from '@/lib/utils'

const STRENGTH_LABEL = ['약함', '약함', '보통', '강함', '매우 강함'] as const

function calculatePasswordScore(pw: string): number {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) || /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^\w\s]/.test(pw)) score++
  return Math.min(score, 4)
}

export default function SignUpForm() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    businessName: '',
    businessType: '',
    phone: '',
  })

  const supabase = createClientComponentClient<Database>()

  // 비밀번호 강도 (0~4) — 4-bar 표시용
  const pwScore = useMemo(
    () => calculatePasswordScore(formData.password),
    [formData.password]
  )

  // 강도 색상
  const strengthColor =
    pwScore >= 3 ? 'bg-success' : pwScore >= 2 ? 'bg-warning' : 'bg-price-up'
  const strengthTextColor =
    pwScore >= 3
      ? 'text-success'
      : pwScore >= 2
      ? 'text-warning'
      : 'text-price-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 클라이언트 사이드 검증
    if (!isRequired(formData.name) || !hasMinLength(formData.name, 2)) {
      setError('이름은 2자 이상 입력해주세요.')
      return
    }

    if (!isValidEmail(formData.email)) {
      setError('올바른 이메일 주소를 입력해주세요.')
      return
    }

    if (!isValidPassword(formData.password)) {
      setError(
        '비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.'
      )
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호 확인이 일치하지 않습니다.')
      return
    }

    if (!isRequired(formData.businessName)) {
      setError('사업체명을 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            business_name: formData.businessName,
            business_type: formData.businessType,
            phone: formData.phone,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setError('이미 등록된 이메일 주소입니다.')
        } else {
          setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
        return
      }

      setSuccess(true)
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 에러 메시지 초기화
    if (error) setError(null)
  }

  // 성공 화면
  if (success) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Check className="h-8 w-8 text-success" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold text-ink-900">
          회원가입이 완료되었습니다
        </h3>
        <p className="mt-2 text-sm text-ink-500">
          이메일을 확인하고 계정을 활성화해주세요.
        </p>
        <Button asChild className="mt-6 h-12 px-6 shadow-brand">
          <Link href="/auth/login">로그인 페이지로 이동</Link>
        </Button>
      </div>
    )
  }

  // 입력 필드 공통 클래스
  const inputBaseClass = cn(
    'block h-12 w-full rounded-lg border-[1.5px] border-ink-200 bg-white pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400',
    'transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
    'disabled:cursor-not-allowed disabled:opacity-50'
  )

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

      {/* 사업체명 */}
      <div>
        <label
          htmlFor="businessName"
          className="mb-2 block text-sm font-semibold text-ink-700"
        >
          매장명
        </label>
        <div className="relative">
          <Store className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            value={formData.businessName}
            onChange={handleInputChange}
            className={inputBaseClass}
            placeholder="회사명 또는 상호명"
            disabled={isLoading}
          />
        </div>
        <p className="mt-1.5 text-xs text-ink-500">
          고객에게 표시되지 않아요. 리포트 이름으로 쓰입니다.
        </p>
      </div>

      {/* 이름 */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-ink-700"
        >
          이름
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className={inputBaseClass}
            placeholder="홍길동"
            disabled={isLoading}
          />
        </div>
      </div>

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
            required
            value={formData.email}
            onChange={handleInputChange}
            className={inputBaseClass}
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
            required
            value={formData.password}
            onChange={handleInputChange}
            className={cn(inputBaseClass, 'pr-11')}
            placeholder="8자 이상, 대소문자/숫자/특수문자 포함"
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

        {/* 비밀번호 강도 표시기 (4 bar) */}
        {formData.password.length > 0 && (
          <div className="mt-2.5">
            <div
              role="meter"
              aria-label="비밀번호 강도"
              aria-valuenow={pwScore}
              aria-valuemin={0}
              aria-valuemax={4}
              className="flex gap-1"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-200',
                    i < pwScore ? strengthColor : 'bg-ink-100'
                  )}
                />
              ))}
            </div>
            <p className="mt-1.5 text-xs text-ink-500">
              강도:{' '}
              <span className={cn('font-semibold', strengthTextColor)}>
                {STRENGTH_LABEL[pwScore]}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-ink-700"
        >
          비밀번호 확인
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={inputBaseClass}
            placeholder="비밀번호를 다시 입력하세요"
            disabled={isLoading}
          />
        </div>
        {formData.confirmPassword.length > 0 &&
          formData.password !== formData.confirmPassword && (
            <p className="mt-1.5 text-xs font-semibold text-price-up">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
      </div>

      {/* 업종 */}
      <div>
        <label
          htmlFor="businessType"
          className="mb-2 block text-sm font-semibold text-ink-700"
        >
          업종 <span className="font-normal text-ink-400">(선택)</span>
        </label>
        <div className="relative">
          <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            className={cn(inputBaseClass, 'appearance-none pr-9 cursor-pointer')}
            disabled={isLoading}
          >
            <option value="">업종을 선택하세요</option>
            <option value="restaurant">음식점</option>
            <option value="hotel">호텔/리조트</option>
            <option value="catering">케이터링</option>
            <option value="food-service">단체급식</option>
            <option value="food-manufacturing">식품제조</option>
            <option value="retail">소매업</option>
            <option value="other">기타</option>
          </select>
        </div>
      </div>

      {/* 연락처 */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-ink-700"
        >
          연락처 <span className="font-normal text-ink-400">(선택)</span>
        </label>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className={inputBaseClass}
            placeholder="010-1234-5678"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-[15px] font-bold tracking-tight',
          'shadow-brand transition-all hover:bg-primary-600 active:scale-[0.99]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
        style={{ height: '52px' }}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? '처리 중…' : '무료로 시작하기'}
      </button>

      {/* 구분선 */}
      <div className="relative flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-ink-100" />
        <span className="text-xs font-semibold text-ink-400">또는</span>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      {/* 소셜 회원가입 (UI 전용) */}
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
