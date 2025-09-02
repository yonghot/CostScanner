'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Database } from '@/types/supabase'
import { isValidEmail, isRequired } from '@/utils/validation'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom')
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
        password: formData.password
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 에러 메시지 초기화
    if (error) setError(null)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 이메일 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          이메일 주소
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="your@email.com"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="비밀번호"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* 비밀번호 찾기 링크 */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="text-sm">
          <a href="#" className="font-medium text-primary hover:text-primary-dark">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          로그인
        </button>
      </div>

      {/* 회원가입 링크 */}
      <div className="text-center">
        <span className="text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-dark">
            회원가입
          </Link>
        </span>
      </div>
    </form>
  )
}