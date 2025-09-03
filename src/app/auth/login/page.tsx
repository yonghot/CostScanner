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
      title="계정에 로그인"
      subtitle="식자재 원가 관리 솔루션에 오신 것을 환영합니다"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}