import { Metadata } from 'next'
import DashboardOverview from '@/components/dashboard/DashboardOverview'

export const metadata: Metadata = {
  title: '대시보드 - CostScanner',
  description: '식자재 원가 현황과 트렌드를 한눈에 확인하세요.',
}

export default function DashboardPage() {
  // 개발 중에는 인증 체크를 비활성화합니다
  // 실제 Supabase 설정 완료 후 인증 로직을 활성화하세요
  
  // 임시 사용자 데이터
  const mockUser = { id: 'demo-user-id' }
  
  // 임시 대시보드 데이터
  const mockSummaryData = {
    total_recipes: 12,
    active_price_alerts: 5,
    avg_recipe_cost: 15000,
    monthly_spending: 2500000,
    cost_savings_this_month: 180000,
    top_expensive_ingredient: '한우등심'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">
          식자재 원가 현황을 확인하고 분석하세요
        </p>
      </div>
      
      <DashboardOverview 
        summaryData={mockSummaryData} 
        userId={mockUser.id}
      />
    </div>
  )
}