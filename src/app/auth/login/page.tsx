import { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import AuthLayout from '@/components/auth/AuthLayout'

export const metadata: Metadata = {
  title: '로그인 - CostScanner',
  description: 'CostScanner에 로그인하여 식자재 원가 관리를 시작하세요.',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="다시 오신 걸 환영해요"
      subtitle="로그인하고 오늘의 시장 가격을 확인하세요."
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}