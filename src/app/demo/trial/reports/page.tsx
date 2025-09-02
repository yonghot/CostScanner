'use client'

import { useDemoContext } from '@/contexts/DemoContext'
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  DollarSign
} from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils/formatting'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

export default function DemoReportsPage() {
  const { demoState } = useDemoContext()
  const [signupPrompt, setSignupPrompt] = useState({ isOpen: false, feature: '', description: '' })

  // Mock report data
  const monthlyData = [
    { month: '1월', cost: 2650000, savings: 150000 },
    { month: '2월', cost: 2750000, savings: 120000 },
    { month: '3월', cost: 2850000, savings: 250000 },
    { month: '4월', cost: 2550000, savings: 180000 },
    { month: '5월', cost: 2950000, savings: 200000 },
    { month: '6월', cost: 2850000, savings: 250000 }
  ]

  const categoryAnalysis = [
    { category: '채소류', cost: 850000, percentage: 30, trend: 'down', change: -5.2 },
    { category: '육류', cost: 1200000, percentage: 42, trend: 'up', change: 8.1 },
    { category: '수산물', cost: 450000, percentage: 16, trend: 'up', change: 3.5 },
    { category: '유제품', cost: 200000, percentage: 7, trend: 'down', change: -2.1 },
    { category: '기타', cost: 150000, percentage: 5, trend: 'up', change: 1.8 }
  ]

  const topIngredients = [
    { name: '한우등심', cost: 450000, change: 12.5, trend: 'up' },
    { name: '연어', cost: 320000, change: -8.2, trend: 'down' },
    { name: '양파', cost: 180000, change: 15.1, trend: 'up' },
    { name: '대파', cost: 150000, change: -8.5, trend: 'down' },
    { name: '마늘', cost: 120000, change: 11.1, trend: 'up' }
  ]

  const handlePeriodSettings = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '기간 설정',
      description: '데모 버전에서는 리포트 기간 설정 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const handleDownloadReport = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '리포트 다운로드',
      description: '데모 버전에서는 리포트 다운로드 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리포트</h1>
          <p className="mt-1 text-sm text-gray-500">
            식자재 원가 분석 및 트렌드 리포트
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handlePeriodSettings}>
            <Calendar className="h-4 w-4 mr-2" />
            기간 설정
          </Button>
          <Button onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">이달 총 지출</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(2850000)}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingDown className="h-4 w-4 text-success mr-1" />
              <span className="text-sm text-success">지난달 대비 -8.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">이달 절약액</p>
                <p className="text-2xl font-bold text-success-dark">{formatCurrency(250000)}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-sm text-success">지난달 대비 +25.0%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 식자재 단가</p>
                <p className="text-2xl font-bold text-gray-900">₩4,250</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-destructive mr-1" />
              <span className="text-sm text-destructive">지난달 대비 +3.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">가격 알림</p>
                <p className="text-2xl font-bold text-warning">8개</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <FileText className="h-6 w-6 text-warning" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">활성 알림</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              월별 지출 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-8">{data.month}</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{width: `${(data.cost / 3000000) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(data.cost)}</div>
                    <div className="text-xs text-success">절약 {formatCurrency(data.savings)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              카테고리별 지출 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryAnalysis.map((item, index) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{formatCurrency(item.cost)}</span>
                      <div className="flex items-center">
                        {item.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-destructive" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-success" />
                        )}
                        <span className={`text-xs ml-1 ${item.trend === 'up' ? 'text-destructive' : 'text-success'}`}>
                          {item.trend === 'up' ? '+' : ''}{item.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>주요 식자재 가격 변동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topIngredients.map((ingredient, index) => (
              <div key={ingredient.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{ingredient.name}</div>
                    <div className="text-sm text-gray-500">이달 지출</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(ingredient.cost)}</div>
                  <div className={`text-sm flex items-center ${
                    ingredient.trend === 'up' ? 'text-destructive' : 'text-success'
                  }`}>
                    {ingredient.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {ingredient.trend === 'up' ? '+' : ''}{ingredient.change}%
                  </div>
                </div>
              </div>
            ))}
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