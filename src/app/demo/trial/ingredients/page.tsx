'use client'

import { useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  MoreVertical
} from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils/formatting'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/ui/status-badge'
import SignupPromptModal from '@/components/demo/SignupPromptModal'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Ingredient } from '@/types'
import AddIngredientModal from '@/components/demo/AddIngredientModal'
import EditIngredientModal from '@/components/demo/EditIngredientModal'
import DeleteIngredientModal from '@/components/demo/DeleteIngredientModal'

const categoryLabels = {
  'vegetables': '채소류',
  'meat': '육류',
  'seafood': '수산물',
  'dairy': '유제품',
  'grains': '곡류',
  'seasonings': '조미료',
  'processed': '가공품',
  'beverages': '음료',
  'others': '기타'
}

export default function DemoIngredientsPage() {
  const { demoState, deleteIngredient } = useDemoContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null)
  const [signupPrompt, setSignupPrompt] = useState({ isOpen: false, feature: '', description: '' })

  // Filter ingredients based on search term and category
  const filteredIngredients = demoState.ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get recent price for each ingredient
  const getRecentPrice = (ingredientId: string) => {
    if (!demoState.priceRecords || !Array.isArray(demoState.priceRecords)) {
      return null
    }
    
    const recentPrices = demoState.priceRecords
      .filter(record => record.ingredient_id === ingredientId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    return recentPrices.length > 0 ? recentPrices[0] : null
  }

  // Calculate price trend (mock data)
  const getPriceTrend = (ingredientId: string) => {
    const change = (Math.random() - 0.5) * 0.3 // Random change between -15% to +15%
    return {
      change,
      trend: change >= 0 ? 'up' as const : 'down' as const
    }
  }

  const handleEdit = (ingredient: Ingredient) => {
    setSignupPrompt({
      isOpen: true,
      feature: '식자재 수정',
      description: '데모 버전에서는 식자재 수정 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const handleDelete = (ingredient: Ingredient) => {
    setSignupPrompt({
      isOpen: true,
      feature: '식자재 삭제',
      description: '데모 버전에서는 식자재 삭제 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const handleDetailView = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '상세보기',
      description: '데모 버전에서는 상세보기 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const handleAddIngredient = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '새 식자재 추가',
      description: '데모 버전에서는 새 식자재 추가 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const categories = Array.from(new Set(demoState.ingredients.map(ing => ing.category)))

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">식자재 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            총 {demoState.ingredients.length}개의 식자재가 등록되어 있습니다
          </p>
        </div>
        <Button onClick={handleAddIngredient}>
          <Plus className="h-4 w-4 mr-2" />
          새 식자재 추가
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="식자재명 또는 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">모든 카테고리</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            식자재 목록 ({filteredIngredients.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>식자재명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>단위</TableHead>
                  <TableHead>최근 가격</TableHead>
                  <TableHead>가격 변동</TableHead>
                  <TableHead>공급업체 수</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.map((ingredient) => {
                  const recentPrice = getRecentPrice(ingredient.id)
                  const priceTrend = getPriceTrend(ingredient.id)
                  const supplierCount = (demoState.priceRecords && Array.isArray(demoState.priceRecords)) ? 
                    demoState.priceRecords
                      .filter(record => record.ingredient_id === ingredient.id)
                      .map(record => record.supplier_id)
                      .filter((id, index, self) => self.indexOf(id) === index).length : 0

                  return (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{ingredient.name}</div>
                          {ingredient.description && (
                            <div className="text-sm text-gray-500">{ingredient.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryLabels[ingredient.category as keyof typeof categoryLabels] || ingredient.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{ingredient.unit}</TableCell>
                      <TableCell>
                        {recentPrice ? (
                          <div className="font-medium">
                            {formatCurrency(recentPrice.price)}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {priceTrend.trend === 'up' ? (
                            <div className="flex items-center text-red-600">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span className="text-sm">+{formatPercent(Math.abs(priceTrend.change))}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-success">
                              <TrendingDown className="h-4 w-4 mr-1" />
                              <span className="text-sm">-{formatPercent(Math.abs(priceTrend.change))}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">{supplierCount}개</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge isActive={ingredient.is_active} entityType="ingredient" />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(ingredient)}>
                              <Edit className="h-4 w-4 mr-2" />
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDetailView}>
                              <Eye className="h-4 w-4 mr-2" />
                              상세보기
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(ingredient)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredIngredients.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? '검색 조건을 변경해보세요' 
                  : '첫 번째 식자재를 추가해보세요'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddIngredientModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
      
      {editingIngredient && (
        <EditIngredientModal
          ingredient={editingIngredient}
          open={!!editingIngredient}
          onOpenChange={(open) => !open && setEditingIngredient(null)}
        />
      )}

      {deletingIngredient && (
        <DeleteIngredientModal
          ingredient={deletingIngredient}
          open={!!deletingIngredient}
          onOpenChange={(open) => !open && setDeletingIngredient(null)}
        />
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