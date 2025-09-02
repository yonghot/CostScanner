'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { isValidEmail, isValidPassword, isRequired, hasMinLength } from '@/utils/validation'

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
    phone: ''
  })

  const supabase = createClientComponentClient<Database>()

  // 비밀번호 강도 체크
  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  }

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
      setError('비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.')
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
            phone: formData.phone
          }
        }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 에러 메시지 초기화
    if (error) setError(null)
  }

  // 성공 화면
  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          회원가입이 완료되었습니다!
        </h3>
        <p className="text-gray-600 mb-6">
          이메일을 확인하여 계정을 활성화해주세요.
        </p>
        <Button asChild>
          <Link href="/auth/login">
            로그인 페이지로 이동
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 이름 */}
      <div>
        <Label htmlFor="name">
          이름 *
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder="홍길동"
          disabled={isLoading}
        />
      </div>

      {/* 이메일 */}
      <div>
        <Label htmlFor="email">
          이메일 주소 *
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          disabled={isLoading}
        />
      </div>

      {/* 비밀번호 */}
      <div>
        <Label htmlFor="password">
          비밀번호 *
        </Label>
        <div className="mt-1 relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="pr-10"
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
        
        {/* 비밀번호 강도 표시 */}
        {formData.password && (
          <div className="mt-2 space-y-1">
            <div className="text-xs text-gray-600">비밀번호 조건:</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordStrength.length ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                8자 이상
              </div>
              <div className={`flex items-center ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordStrength.uppercase ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                대문자 포함
              </div>
              <div className={`flex items-center ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordStrength.lowercase ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                소문자 포함
              </div>
              <div className={`flex items-center ${passwordStrength.number ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordStrength.number ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                숫자 포함
              </div>
              <div className={`flex items-center ${passwordStrength.special ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordStrength.special ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                특수문자 포함
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <Label htmlFor="confirmPassword">
          비밀번호 확인 *
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="비밀번호 확인"
          disabled={isLoading}
        />
      </div>

      {/* 사업체 정보 */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="businessName">
            사업체명 *
          </Label>
          <Input
            id="businessName"
            name="businessName"
            type="text"
            required
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="회사명 또는 상호명"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="businessType">
            업종
          </Label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            disabled={isLoading}
          >
            <option value="">업종 선택</option>
            <option value="restaurant">음식점</option>
            <option value="hotel">호텔/리조트</option>
            <option value="catering">케이터링</option>
            <option value="food-service">단체급식</option>
            <option value="food-manufacturing">식품제조</option>
            <option value="retail">소매업</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div>
          <Label htmlFor="phone">
            연락처
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="010-1234-5678"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          회원가입
        </Button>
      </div>

      {/* 로그인 링크 */}
      <div className="text-center">
        <span className="text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:text-primary-dark">
            로그인
          </Link>
        </span>
      </div>
    </form>
  )
}