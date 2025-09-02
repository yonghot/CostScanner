'use client'

import { useState } from 'react'
import { 
  User, 
  ArrowRight, 
  CheckCircle,
  X 
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface SignupPromptModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  feature: string
  description?: string
}

export default function SignupPromptModal({
  isOpen,
  onOpenChange,
  feature,
  description
}: SignupPromptModalProps) {
  const benefits = [
    '무제한 식자재 등록 및 관리',
    '실시간 가격 모니터링 및 알림',
    '상세한 원가 분석 리포트',
    '공급업체 비교 및 추천',
    '레시피 원가 계산 및 수익성 분석',
    'OCR 영수증 스캔 기능',
    '자동화된 가격 수집',
    '월간/분기별 트렌드 분석'
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary-dark">
              데모 제한
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {feature} 기능을 사용하려면<br />
            회원가입이 필요합니다
          </DialogTitle>
          {description && (
            <DialogDescription className="text-gray-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Demo Limitation Notice */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-white">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  체험 버전에서는 일부 기능이 제한됩니다
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  회원가입 후 모든 기능을 무제한으로 이용하세요.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">
              회원가입 후 이용 가능한 기능
            </h4>
            <div className="space-y-2">
              {benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
              <div className="text-sm text-gray-500 pl-6">
                그 외 4가지 추가 기능...
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-4">
            <Button asChild className="w-full">
              <Link href="/auth/signup" className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                무료 회원가입
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">
                이미 계정이 있으시나요? 로그인
              </Link>
            </Button>
          </div>

          {/* Demo Continue Option */}
          <div className="text-center pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              계속 체험하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}