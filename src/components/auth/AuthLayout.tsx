'use client'

import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { APP_CONFIG } from '@/constants/app'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* 로고 */}
        <Link href="/" className="flex justify-center items-center space-x-2">
          <BarChart3 className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold text-gray-900">{APP_CONFIG.name}</span>
        </Link>
        
        {/* 제목 */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        
        {/* 부제목 */}
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        
        {/* 추가 링크 */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-primary hover:text-primary-dark">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}