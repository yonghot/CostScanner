import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // 개발 중에는 인증 체크를 비활성화합니다
  // 실제 Supabase 설정 완료 후 인증 로직을 활성화하세요
  
  // 임시 세션 데이터
  const mockSession = {
    user: {
      id: 'demo-user-id',
      email: 'demo@example.com',
      user_metadata: {
        name: '데모 사용자',
        business_name: 'CostScanner 데모'
      }
    }
  }

  return (
    <DashboardLayout session={mockSession}>
      {children}
    </DashboardLayout>
  )
}