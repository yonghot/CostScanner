'use client'

import { useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { 
  Users, 
  Search, 
  Plus, 
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Package
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/ui/status-badge'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

export default function DemoSuppliersPage() {
  const { demoState } = useDemoContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [signupPrompt, setSignupPrompt] = useState({ isOpen: false, feature: '', description: '' })

  // Filter suppliers based on search term
  const filteredSuppliers = demoState.suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get supplier stats
  const getSupplierStats = (supplierId: string) => {
    if (!demoState.priceRecords || !Array.isArray(demoState.priceRecords)) {
      return {
        ingredientCount: 0,
        priceRecordCount: 0,
        avgPrice: 0,
        rating: 4.2 + Math.random() * 0.8 // Mock rating
      }
    }

    const supplierPrices = demoState.priceRecords.filter(pr => pr.supplier_id === supplierId)
    const ingredientCount = new Set(supplierPrices.map(pr => pr.ingredient_id)).size
    const avgPrice = supplierPrices.length > 0 
      ? supplierPrices.reduce((sum, pr) => sum + pr.price, 0) / supplierPrices.length 
      : 0

    return {
      ingredientCount,
      priceRecordCount: supplierPrices.length,
      avgPrice,
      rating: 4.2 + Math.random() * 0.8 // Mock rating
    }
  }

  const handleAddSupplier = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '새 공급업체 추가',
      description: '데모 버전에서는 새 공급업체 추가 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const handleDetailView = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '상세보기',
      description: '데모 버전에서는 공급업체 상세보기 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공급업체 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            총 {demoState.suppliers.length}개의 공급업체가 등록되어 있습니다
          </p>
        </div>
        <Button onClick={handleAddSupplier}>
          <Plus className="h-4 w-4 mr-2" />
          새 공급업체 추가
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="공급업체명 또는 담당자로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const stats = getSupplierStats(supplier.id)
          
          return (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    {supplier.name}
                  </CardTitle>
                  <StatusBadge isActive={supplier.is_active} entityType="supplier" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  {supplier.contact_person && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {supplier.contact_person}
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {supplier.phone}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {supplier.email}
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {supplier.address}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-semibold text-primary-dark">{stats.ingredientCount}</div>
                    <div className="text-primary-dark text-xs">공급 식자재</div>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <div className="font-semibold text-success-dark">{stats.priceRecordCount}</div>
                    <div className="text-success-dark text-xs">가격 기록</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{stats.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">(평가)</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleDetailView}>
                    상세보기
                  </Button>
                </div>

                {/* Payment Terms */}
                {supplier.payment_terms && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    결제조건: {supplier.payment_terms}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? '검색 결과가 없습니다' : '등록된 공급업체가 없습니다'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? '검색 조건을 변경해보세요' 
                : '첫 번째 공급업체를 추가해보세요'}
            </p>
            {!searchTerm && (
              <Button onClick={handleAddSupplier}>
                <Plus className="h-4 w-4 mr-2" />
                새 공급업체 추가
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <SignupPromptModal
        isOpen={signupPrompt.isOpen}
        onOpenChange={(open) => setSignupPrompt(prev => ({ ...prev, isOpen: open }))}
        feature={signupPrompt.feature}
        description={signupPrompt.description}
      />
    </div>
  )
}