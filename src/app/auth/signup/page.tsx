import { Metadata } from 'next'
import { Suspense } from 'react'
import SignUpForm from '@/components/auth/SignUpForm'
import AuthLayout from '@/components/auth/AuthLayout'

export const metadata: Metadata = {
  title: '회원가입 - CostScanner',
  description: 'CostScanner에 가입하고 식자재 원가 관리 솔루션을 시작하세요.',
}

export default function SignUpPage() {
  return (
    <AuthLayout
      title="새 계정 만들기"
      subtitle="식자재 원가 관리를 위한 첫 걸음을 시작하세요"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthLayout>
  )
}