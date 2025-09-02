'use client'

import { useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

export default function DemoSettingsPage() {
  const { demoState, updateUser, resetDemo } = useDemoContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [signupPrompt, setSignupPrompt] = useState({ isOpen: false, feature: '', description: '' })
  const [userForm, setUserForm] = useState({
    name: demoState.user.name,
    business_name: demoState.user.business_name || '',
    phone: demoState.user.phone || '',
    email: demoState.user.email
  })
  
  const [notifications, setNotifications] = useState({
    price_alerts: true,
    weekly_reports: true,
    system_updates: false,
    marketing_emails: false
  })

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupPrompt({
      isOpen: true,
      feature: '정보 저장',
      description: '데모 버전에서는 사용자 정보 저장 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const handleReset = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      resetDemo()
      setShowResetConfirm(false)
    } catch (error) {
      console.error('Failed to reset demo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">설정</h1>
          <p className="mt-1 text-sm text-gray-500">
            계정 정보 및 시스템 설정을 관리하세요
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary-dark border-primary/20">
          데모 계정
        </Badge>
      </div>

      {/* User Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            계정 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_name">회사명</Label>
                <Input
                  id="business_name"
                  value={userForm.business_name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, business_name: e.target.value }))}
                  placeholder="회사명을 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  value={userForm.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">데모 모드에서는 이메일 변경이 불가능합니다</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="전화번호를 입력하세요"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    저장 중...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    정보 저장
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">가격 알림</div>
                <div className="text-sm text-gray-500">식자재 가격 변동 시 알림</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.price_alerts}
                onChange={(e) => setNotifications(prev => ({ ...prev, price_alerts: e.target.checked }))}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">주간 리포트</div>
                <div className="text-sm text-gray-500">매주 원가 분석 리포트 발송</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.weekly_reports}
                onChange={(e) => setNotifications(prev => ({ ...prev, weekly_reports: e.target.checked }))}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">시스템 업데이트</div>
                <div className="text-sm text-gray-500">새 기능 및 업데이트 소식</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.system_updates}
                onChange={(e) => setNotifications(prev => ({ ...prev, system_updates: e.target.checked }))}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">마케팅 이메일</div>
                <div className="text-sm text-gray-500">프로모션 및 마케팅 정보</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketing_emails}
                onChange={(e) => setNotifications(prev => ({ ...prev, marketing_emails: e.target.checked }))}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            구독 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div>
                <div className="font-medium text-primary-dark">프로 플랜 (데모)</div>
                <div className="text-sm text-primary-dark">모든 기능을 무제한으로 체험하세요</div>
              </div>
              <Badge className="bg-primary">
                무료 체험
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="font-medium text-gray-900">등록 식자재</div>
                <div className="text-2xl font-bold text-primary">{demoState.ingredients.length}</div>
                <div className="text-sm text-gray-500">무제한</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="font-medium text-gray-900">관리 레시피</div>
                <div className="text-2xl font-bold text-primary">{demoState.recipes.length}</div>
                <div className="text-sm text-gray-500">무제한</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="font-medium text-gray-900">협력 공급업체</div>
                <div className="text-2xl font-bold text-primary">{demoState.suppliers.length}</div>
                <div className="text-sm text-gray-500">무제한</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-warning">
            <RefreshCw className="h-5 w-5 mr-2" />
            데모 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <div className="font-medium text-warning-dark">데모 초기화</div>
                  <div className="text-sm text-warning mt-1">
                    모든 데이터를 초기 상태로 되돌립니다. 추가하거나 수정한 모든 내용이 삭제됩니다.
                  </div>
                </div>
              </div>
            </div>

            {!showResetConfirm ? (
              <Button 
                variant="outline" 
                className="border-warning/30 text-warning hover:bg-warning/10"
                onClick={() => setShowResetConfirm(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                데모 초기화
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  정말로 데모를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="destructive"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        초기화 중...
                      </div>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        확인
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowResetConfirm(false)}
                    disabled={isLoading}
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SignupPromptModal
        isOpen={signupPrompt.isOpen}
        onOpenChange={(open) => setSignupPrompt(prev => ({ ...prev, isOpen: open }))}
        feature={signupPrompt.feature}
        description={signupPrompt.description}
      />
    </div>
  )
}