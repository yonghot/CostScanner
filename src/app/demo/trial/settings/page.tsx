'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Crown,
  Lock,
  Mail,
  Monitor,
  RefreshCw,
  Save,
  Shield,
  Sparkles,
  User as UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useDemoContext } from '@/contexts/DemoContext'
import { cn } from '@/lib/utils'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

type ToggleKey =
  | 'price_alerts'
  | 'weekly_reports'
  | 'system_updates'
  | 'marketing_emails'
  | 'dark_mode'
  | 'compact_layout'
  | 'auto_translate'

const NOTIFICATION_TOGGLES: Array<{
  key: ToggleKey
  label: string
  desc: string
  icon: typeof Bell
}> = [
  {
    key: 'price_alerts',
    label: '가격 변동 알림',
    desc: '식자재 가격이 임계값을 넘을 때 즉시 알림',
    icon: Bell,
  },
  {
    key: 'weekly_reports',
    label: '주간 리포트',
    desc: '매주 월요일 원가/매출 요약 메일 발송',
    icon: Mail,
  },
  {
    key: 'system_updates',
    label: '서비스 업데이트',
    desc: '신기능, 점검 일정 등 공지사항',
    icon: Sparkles,
  },
  {
    key: 'marketing_emails',
    label: '마케팅 메일',
    desc: '프로모션 · 이벤트 · 외부 콘텐츠 큐레이션',
    icon: Mail,
  },
]

const DISPLAY_TOGGLES: Array<{
  key: ToggleKey
  label: string
  desc: string
  icon: typeof Monitor
}> = [
  {
    key: 'dark_mode',
    label: '다크 모드',
    desc: '저조도 환경에서 시인성 향상',
    icon: Monitor,
  },
  {
    key: 'compact_layout',
    label: '컴팩트 레이아웃',
    desc: '한 화면에 더 많은 데이터 표시',
    icon: Monitor,
  },
  {
    key: 'auto_translate',
    label: '자동 번역',
    desc: '외국어 공급처 정보를 한국어로 자동 변환',
    icon: Sparkles,
  },
]

export default function DemoSettingsPage() {
  const { demoState, resetDemo } = useDemoContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [signupPrompt, setSignupPrompt] = useState({
    isOpen: false,
    feature: '',
    description: '',
  })

  const [userForm, setUserForm] = useState({
    name: demoState.user.name,
    business_name: demoState.user.business_name || '',
    phone: demoState.user.phone || '',
    email: demoState.user.email,
  })

  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    price_alerts: true,
    weekly_reports: true,
    system_updates: false,
    marketing_emails: false,
    dark_mode: false,
    compact_layout: false,
    auto_translate: false,
  })

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  })

  const promptSignup = (feature: string, description: string) => {
    setSignupPrompt({ isOpen: true, feature, description })
  }

  const handleUserUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    promptSignup(
      '프로필 저장',
      '데모 모드에서는 프로필 정보가 영구 저장되지 않습니다. 회원가입 후 정식 계정으로 변경 사항을 보관하세요.'
    )
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    promptSignup(
      '비밀번호 변경',
      '데모 계정에는 비밀번호 변경 기능이 적용되지 않습니다. 회원가입 후 보안 설정을 이용하세요.'
    )
  }

  const handleReset = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      resetDemo()
      setShowResetConfirm(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-cream min-h-full p-6 lg:p-8 space-y-6">
      {/* ── 헤더 ─────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary-600">
            설정
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
            계정 · 환경 설정
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            알림, 화면, 보안, 데모 데이터를 한 화면에서 관리하세요
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
          <Sparkles size={12} /> 데모 계정
        </span>
      </div>

      {/* ── 본문: 좌측 폼 + 우측 사이드 ────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 좌측 컬럼 (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* 계정 정보 카드 */}
          <SectionCard
            icon={UserIcon}
            iconColor="primary"
            title="계정 정보"
            description="대표 이름과 사업장 정보를 관리하세요"
          >
            <form onSubmit={handleUserUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FieldGroup label="이름" htmlFor="name">
                  <input
                    id="name"
                    type="text"
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="이름을 입력하세요"
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </FieldGroup>
                <FieldGroup label="사업장명" htmlFor="business_name">
                  <input
                    id="business_name"
                    type="text"
                    value={userForm.business_name}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        business_name: e.target.value,
                      }))
                    }
                    placeholder="예: 맛있는 식당"
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FieldGroup label="이메일" htmlFor="email" hint="데모 모드에서는 변경 불가">
                  <input
                    id="email"
                    type="email"
                    value={userForm.email}
                    disabled
                    className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-500"
                  />
                </FieldGroup>
                <FieldGroup label="전화번호" htmlFor="phone">
                  <input
                    id="phone"
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="010-0000-0000"
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 tabular-nums focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </FieldGroup>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-brand transition-colors hover:bg-primary-600"
                >
                  <Save size={14} /> 정보 저장
                </button>
              </div>
            </form>
          </SectionCard>

          {/* 알림 설정 카드 */}
          <SectionCard
            icon={Bell}
            iconColor="warning"
            title="알림 설정"
            description="중요한 변동만 받아보도록 채널을 조정하세요"
          >
            <div className="space-y-2">
              {NOTIFICATION_TOGGLES.map((item) => (
                <ToggleRow
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  desc={item.desc}
                  checked={toggles[item.key]}
                  onChange={(checked) =>
                    setToggles((prev) => ({ ...prev, [item.key]: checked }))
                  }
                />
              ))}
            </div>
          </SectionCard>

          {/* 화면 환경 카드 */}
          <SectionCard
            icon={Monitor}
            iconColor="success"
            title="화면 환경"
            description="작업 환경에 맞춰 UI 밀도와 테마를 조정하세요"
          >
            <div className="space-y-2">
              {DISPLAY_TOGGLES.map((item) => (
                <ToggleRow
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  desc={item.desc}
                  checked={toggles[item.key]}
                  onChange={(checked) =>
                    setToggles((prev) => ({ ...prev, [item.key]: checked }))
                  }
                />
              ))}
            </div>
          </SectionCard>

          {/* 비밀번호 변경 카드 */}
          <SectionCard
            icon={Lock}
            iconColor="primary"
            title="비밀번호 변경"
            description="3개월마다 변경하는 것을 권장합니다"
          >
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <FieldGroup label="현재 비밀번호" htmlFor="current">
                <input
                  id="current"
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      current: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </FieldGroup>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FieldGroup label="새 비밀번호" htmlFor="next">
                  <input
                    id="next"
                    type="password"
                    value={passwordForm.next}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        next: e.target.value,
                      }))
                    }
                    placeholder="8자 이상 영문/숫자/특수문자"
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </FieldGroup>
                <FieldGroup label="새 비밀번호 확인" htmlFor="confirm">
                  <input
                    id="confirm"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                    placeholder="다시 한 번 입력"
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </FieldGroup>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 hover:bg-ink-50"
                >
                  <Lock size={14} /> 비밀번호 변경
                </button>
              </div>
            </form>
          </SectionCard>

          {/* 데모 초기화 카드 */}
          <div className="rounded-2xl border border-l-4 border-l-warning bg-card p-5 shadow-soft-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink-900">
                    데모 데이터 초기화
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">
                    추가/수정/삭제한 모든 식자재, 레시피, 공급처 데이터가
                    초기 샘플로 되돌아갑니다.
                  </p>
                </div>
              </div>
              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-warning/40 bg-warning/5 px-3 py-2 text-xs font-bold text-warning hover:bg-warning/10"
                >
                  <RefreshCw size={14} /> 초기화
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-warning px-3 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        초기화 중
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} /> 확인
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    disabled={isLoading}
                    className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-bold text-ink-700 hover:bg-ink-50 disabled:opacity-50"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측 사이드 (1/3) */}
        <div className="space-y-6">
          {/* 프로필 사이드 카드 */}
          <div className="rounded-2xl border bg-card p-6 shadow-soft-1">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-xl font-extrabold text-white">
                {demoState.user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-extrabold text-ink-900">
                  {demoState.user.name}
                </div>
                <div className="truncate text-xs text-ink-500">
                  {demoState.user.email}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-ink-50 p-3">
              <SideStat
                label="식자재"
                value={demoState.ingredients.length}
              />
              <SideStat label="레시피" value={demoState.recipes.length} />
              <SideStat label="공급처" value={demoState.suppliers.length} />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-500">
              <CheckCircle2 size={12} className="text-success" />
              <span>
                {demoState.user.business_name || '데모 사업장'} ·{' '}
                {demoState.user.business_type || '한식당'}
              </span>
            </div>
          </div>

          {/* 프로 플랜 업그레이드 CTA */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary-50 via-white to-primary-50/40 p-6 shadow-soft-2">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10" />
            <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-primary/5" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white shadow-brand">
                <Crown size={11} /> Pro
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-ink-900">
                프로 플랜으로 업그레이드
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                실시간 가격 모니터링, OCR 영수증 인식, 자동 리포트 발송 등
                전 기능을 제한 없이 사용하세요.
              </p>
              <ul className="mt-4 space-y-1.5">
                {[
                  '무제한 식자재 · 레시피 등록',
                  '주간 자동 리포트 메일 발송',
                  'OCR 영수증 자동 분석',
                  '카카오톡 가격 알림 연동',
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-xs text-ink-700"
                  >
                    <CheckCircle2 size={12} className="text-success" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-brand transition-colors hover:bg-primary-600"
              >
                정식 가입하기 <ArrowUpRight size={14} />
              </Link>
              <div className="mt-3 text-center text-[10px] text-ink-500 tabular-nums">
                ₩29,000 / 월 · 14일 무료 체험
              </div>
            </div>
          </div>

          {/* 보안 안내 */}
          <div className="rounded-2xl border bg-card p-5 shadow-soft-1">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-success" />
              <h4 className="text-sm font-extrabold text-ink-900">보안 안내</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">
              모든 데이터는 SSL/TLS로 암호화되어 전송되며, AWS 서울 리전에
              안전하게 저장됩니다. 데모 데이터는 브라우저 로컬에만 보관됩니다.
            </p>
          </div>
        </div>
      </div>

      <SignupPromptModal
        isOpen={signupPrompt.isOpen}
        onOpenChange={(open) =>
          setSignupPrompt((prev) => ({ ...prev, isOpen: open }))
        }
        feature={signupPrompt.feature}
        description={signupPrompt.description}
      />
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Sub components                              */
/* ─────────────────────────────────────────── */

type SectionAccent = 'primary' | 'success' | 'warning'

const SECTION_ICON_BG: Record<SectionAccent, string> = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
}

function SectionCard({
  icon: Icon,
  iconColor,
  title,
  description,
  children,
}: {
  icon: typeof UserIcon
  iconColor: SectionAccent
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-soft-1">
      <header className="mb-5 flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
            SECTION_ICON_BG[iconColor]
          )}
        >
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-ink-900">{title}</h2>
          <p className="mt-0.5 text-xs text-ink-500">{description}</p>
        </div>
      </header>
      {children}
    </section>
  )
}

function FieldGroup({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-bold text-ink-700"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-ink-500">{hint}</p>}
    </div>
  )
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: typeof Bell
  label: string
  desc: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-colors',
        checked ? 'bg-primary-50/40' : 'hover:bg-ink-50'
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
          checked ? 'bg-primary-100 text-primary-700' : 'bg-ink-100 text-ink-500'
        )}
      >
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-ink-900">{label}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-ink-500">
          {desc}
        </div>
      </div>
      <span className="relative inline-flex flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-ink-200 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-white shadow-soft-1 transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

function SideStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-extrabold tabular-nums text-ink-900">
        {value}
      </div>
      <div className="mt-0.5 text-[10px] font-semibold text-ink-500">
        {label}
      </div>
    </div>
  )
}
