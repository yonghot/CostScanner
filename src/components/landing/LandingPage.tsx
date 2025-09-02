'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Zap, Users } from 'lucide-react'
import { APP_CONFIG, FEATURES } from '@/constants/app'
import DashboardPreview from './DashboardPreview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* 헤더 */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              기능
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              요금제
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900">
              문의
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">
                로그인
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">
                무료로 시작
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-24 px-4 lg:py-32">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto mb-16 space-y-8">
            <h1 className="text-display text-foreground leading-tight">
              식자재 원가 관리의<br />
              <span className="text-gradient">새로운 기준</span>
            </h1>
            
            <p className="text-subtitle leading-relaxed max-w-3xl mx-auto">
              실시간 가격 모니터링, 지능형 비용 분석, 공급업체 비교까지.<br />
              CostScanner로 식자재 원가를 효율적으로 관리하세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/auth/signup">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8" asChild>
                <Link href="/demo/trial">
                  체험하기
                </Link>
              </Button>
            </div>
          </div>
          
          {/* 대시보드 프리뷰 */}
          <div id="demo" className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent rounded-xl"></div>
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-2 shadow-2xl max-w-6xl mx-auto border">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-headline text-foreground leading-tight">
                강력한 기능으로 원가 관리 효율성을 높이세요
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                복잡한 식자재 원가 관리를 자동화하고, 데이터 기반의 의사결정을 지원합니다.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="professional-card interactive-hover group">
              <div className="professional-card-content space-y-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-title text-foreground leading-snug">
                    {FEATURES.PRICE_MONITORING}
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    실시간으로 식자재 가격을 모니터링하고 변동 추이를 분석합니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="professional-card interactive-hover group">
              <div className="professional-card-content space-y-6">
                <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Zap className="h-7 w-7 text-success" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-title text-foreground leading-snug">
                    {FEATURES.AUTOMATED_COLLECTION}
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    웹 스크래핑, OCR, API 연동을 통해 자동으로 가격 정보를 수집합니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="professional-card interactive-hover group">
              <div className="professional-card-content space-y-6">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-title text-foreground leading-snug">
                    {FEATURES.SUPPLIER_COMPARISON}
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    여러 공급업체의 가격과 품질을 비교하여 최적의 선택을 지원합니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="professional-card interactive-hover group">
              <div className="professional-card-content space-y-6">
                <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                  <Shield className="h-7 w-7 text-warning" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-title text-foreground leading-snug">
                    {FEATURES.COST_ANALYSIS}
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    고급 분석 알고리즘으로 원가 구조를 분석하고 절감 방안을 제시합니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="professional-card interactive-hover group">
              <div className="professional-card-content space-y-6">
                <div className="w-14 h-14 bg-danger/10 rounded-xl flex items-center justify-center group-hover:bg-danger/20 transition-colors">
                  <BarChart3 className="h-7 w-7 text-danger" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-title text-foreground leading-snug">
                    {FEATURES.TREND_PREDICTION}
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    과거 데이터를 기반으로 미래 가격 변동을 예측하고 대응책을 제안합니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="professional-card interactive-hover group">
              <div className="professional-card-content space-y-6">
                <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center group-hover:bg-info/20 transition-colors">
                  <BarChart3 className="h-7 w-7 text-info" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-title text-foreground leading-snug">
                    {FEATURES.RECIPE_MANAGEMENT}
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    레시피별 정확한 원가를 계산하고 수익성을 분석합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section id="pricing" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-headline text-foreground leading-tight">
                합리적인 요금제로 시작하세요
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                규모에 맞는 요금제를 선택하여 비용 부담 없이 원가 관리 효율성을 높이세요.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {/* 무료 플랜 */}
            <Card className="relative group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-title text-foreground">무료</h3>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">₩0</span>
                        <span className="text-muted-foreground">/월</span>
                      </div>
                      <p className="text-body text-muted-foreground">개인 사업자를 위한 기본 기능</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <ul className="space-y-4 text-left">
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">식자재 10개 등록</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">레시피 5개 관리</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">기본 가격 모니터링</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">월간 리포트</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button variant="secondary" className="w-full h-12" asChild>
                    <Link href="/auth/signup">
                      무료로 시작하기
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* 프로 플랜 */}
            <Card className="relative group hover:shadow-lg transition-all duration-300 border-primary shadow-md">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">인기</div>
              </div>
              <CardContent className="p-8 pt-10">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-title text-foreground">프로</h3>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">₩29,900</span>
                        <span className="text-muted-foreground">/월</span>
                      </div>
                      <p className="text-body text-muted-foreground">중소형 식당을 위한 완전한 솔루션</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <ul className="space-y-4 text-left">
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">무제한 식자재 등록</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">무제한 레시피 관리</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">실시간 가격 알림</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">OCR 거래명세서 처리</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">상세 분석 리포트</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button className="w-full h-12" asChild>
                    <Link href="/auth/signup">
                      14일 무료 체험
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* 비즈니스 플랜 */}
            <Card className="relative group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-title text-foreground">비즈니스</h3>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">₩99,900</span>
                        <span className="text-muted-foreground">/월</span>
                      </div>
                      <p className="text-body text-muted-foreground">대형 식당 체인을 위한 엔터프라이즈</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <ul className="space-y-4 text-left">
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">프로 플랜의 모든 기능</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">다중 매장 관리</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">API 연동 지원</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">전용 고객 지원</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-body text-foreground">맞춤형 리포트</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button variant="secondary" className="w-full h-12" asChild>
                    <Link href="#contact">
                      문의하기
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 문의 섹션 */}
      <section id="contact" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-headline text-foreground leading-tight">
                궁금한 점이 있으신가요?
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                CostScanner 도입에 대해 문의하거나 데모를 요청하세요. 전문가가 직접 상담해드립니다.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">연락처 정보</h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <strong>이메일:</strong> hello@costscanner.co.kr
                  </p>
                  <p className="text-gray-600">
                    <strong>전화:</strong> 02-1234-5678
                  </p>
                  <p className="text-gray-600">
                    <strong>운영시간:</strong> 평일 9:00 - 18:00
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">무료 플랜에는 어떤 제한이 있나요?</h4>
                    <p className="text-gray-600 text-sm">식자재 10개, 레시피 5개까지 등록 가능하며, 기본적인 가격 모니터링 기능만 제공됩니다.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">데이터는 안전하게 보관되나요?</h4>
                    <p className="text-gray-600 text-sm">모든 데이터는 암호화되어 안전하게 보관되며, 보안 인증을 받은 인프라를 사용합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="p-0">
              <CardHeader>
                <CardTitle className="text-title">데모 요청</CardTitle>
              </CardHeader>
              <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="성함을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="이메일을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사업장 유형
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>개인 카페/식당</option>
                    <option>중형 식당 체인</option>
                    <option>대형 프랜차이즈</option>
                    <option>기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    문의 내용
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="문의 사항을 자세히 입력해주세요"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full h-12">
                  문의 보내기
                </Button>
              </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-headline text-primary-foreground leading-tight">
              지금 시작하여 원가 관리 효율성을 높이세요
            </h2>
            <p className="text-body text-primary-foreground/80 leading-relaxed">
              무료 체험으로 CostScanner의 강력한 기능을 직접 경험해보세요.
            </p>
            <Button size="lg" variant="secondary" className="h-14 px-10" asChild>
              <Link href="/auth/signup">
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BarChart3 className="h-6 w-6" />
              <span className="text-lg font-semibold">{APP_CONFIG.name}</span>
            </div>
            
            <div className="text-gray-400">
              © 2024 {APP_CONFIG.company}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}