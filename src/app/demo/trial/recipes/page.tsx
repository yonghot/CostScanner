'use client'

import { useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { 
  ChefHat, 
  Search, 
  Plus, 
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Eye
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatting'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/ui/status-badge'
import SignupPromptModal from '@/components/demo/SignupPromptModal'

export default function DemoRecipesPage() {
  const { demoState } = useDemoContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [signupPrompt, setSignupPrompt] = useState({ isOpen: false, feature: '', description: '' })

  // Filter recipes based on search term
  const filteredRecipes = demoState.recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate recipe cost based on ingredients
  const getRecipeCost = (recipeId: string) => {
    if (!demoState.recipeIngredients || !Array.isArray(demoState.recipeIngredients) || 
        !demoState.priceRecords || !Array.isArray(demoState.priceRecords)) {
      return 0
    }
    
    const recipeIngredients = demoState.recipeIngredients.filter(ri => ri.recipe_id === recipeId)
    let totalCost = 0
    
    recipeIngredients.forEach(ri => {
      const recentPrice = demoState.priceRecords
        .filter(pr => pr.ingredient_id === ri.ingredient_id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      
      if (recentPrice) {
        totalCost += recentPrice.price * ri.quantity
      }
    })
    
    return totalCost
  }

  const handleAddRecipe = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '새 레시피 추가',
      description: '데모 버전에서는 새 레시피 추가 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  const handleDetailView = () => {
    setSignupPrompt({
      isOpen: true,
      feature: '상세보기',
      description: '데모 버전에서는 레시피 상세보기 기능이 제한됩니다. 회원가입 후 이용해주세요.'
    })
  }

  // Get ingredient count for recipe
  const getIngredientCount = (recipeId: string) => {
    if (!demoState.recipeIngredients || !Array.isArray(demoState.recipeIngredients)) {
      return 0
    }
    return demoState.recipeIngredients.filter(ri => ri.recipe_id === recipeId).length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">레시피 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            총 {demoState.recipes.length}개의 레시피가 등록되어 있습니다
          </p>
        </div>
        <Button onClick={handleAddRecipe}>
          <Plus className="h-4 w-4 mr-2" />
          새 레시피 추가
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="레시피명 또는 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const cost = getRecipeCost(recipe.id)
          const ingredientCount = getIngredientCount(recipe.id)
          
          return (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <ChefHat className="h-5 w-5 mr-2 text-primary" />
                    {recipe.name}
                  </CardTitle>
                  <StatusBadge isActive={recipe.is_active} entityType="recipe" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {recipe.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{recipe.servings}인분</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{recipe.cook_time}분</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">재료</span>
                    <span className="text-sm text-gray-500">{ingredientCount}개</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">예상 원가</span>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="font-semibold text-success-dark">
                        {formatCurrency(cost)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">인당 단가</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(cost / recipe.servings)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm text-success">원가 안정</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleDetailView}>
                      <Eye className="h-4 w-4 mr-2" />
                      상세보기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? '검색 결과가 없습니다' : '등록된 레시피가 없습니다'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? '검색 조건을 변경해보세요' 
                : '첫 번째 레시피를 추가해보세요'}
            </p>
            {!searchTerm && (
              <Button onClick={handleAddRecipe}>
                <Plus className="h-4 w-4 mr-2" />
                새 레시피 추가
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