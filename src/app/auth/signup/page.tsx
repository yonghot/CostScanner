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
      title="원가 관리, 이제 시작할까요?"
      subtitle="14일 무료 체험. 카드 등록 없이 바로 시작하세요."
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthLayout>
  )
}