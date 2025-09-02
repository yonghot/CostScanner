import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CostScanner - 식자재 원가 관리 솔루션',
  description: '식자재 가격 모니터링, 비용 분석, 공급업체 비교를 위한 통합 B2B 솔루션',
  keywords: ['식자재', '원가관리', '가격모니터링', '공급업체비교', 'B2B'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}