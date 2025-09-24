'use client'

import { useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Ingredient } from '@/types'

interface DeleteIngredientModalProps {
  ingredient: Ingredient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteIngredientModal({ ingredient, open, onOpenChange }: DeleteIngredientModalProps) {
  const { deleteIngredient, demoState } = useDemoContext()
  const [isLoading, setIsLoading] = useState(false)

  // Check if ingredient is used in recipes
  const usedInRecipes = demoState.recipeIngredients.filter(ri => ri.ingredient_id === ingredient.id)
  const affectedRecipes = usedInRecipes.length > 0 ? 
    demoState.recipes.filter(recipe => 
      usedInRecipes.some(ri => ri.recipe_id === recipe.id)
    ) : []

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      deleteIngredient(ingredient.id)
      onOpenChange(false)
    } catch (error) {
      // Failed to delete ingredient - 로거로 대체 필요
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            식자재 삭제
          </DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 삭제할 식자재 정보 */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium text-red-900">{ingredient.name}</div>
                <div className="text-sm text-red-700">
                  {ingredient.category} • {ingredient.unit}
                </div>
              </div>
            </div>
          </div>

          {/* 영향을 받는 레시피 경고 */}
          {affectedRecipes.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-900 mb-2">
                    주의: 다음 레시피에서 사용 중입니다
                  </div>
                  <div className="space-y-1">
                    {affectedRecipes.slice(0, 3).map(recipe => (
                      <div key={recipe.id} className="text-sm text-yellow-800">
                        • {recipe.name}
                      </div>
                    ))}
                    {affectedRecipes.length > 3 && (
                      <div className="text-sm text-yellow-700">
                        및 {affectedRecipes.length - 3}개 레시피 더...
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-yellow-700">
                    삭제하면 관련 레시피에서도 이 식자재가 제거됩니다.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 삭제 확인 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-700">
              <strong>삭제될 데이터:</strong>
            </div>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li>• 식자재 기본 정보</li>
              <li>• 관련된 가격 기록 ({demoState.priceRecords.filter(pr => pr.ingredient_id === ingredient.id).length}개)</li>
              <li>• 레시피에서의 사용 정보 ({usedInRecipes.length}개)</li>
              <li>• 관련된 가격 알림 ({demoState.priceAlerts.filter(pa => pa.ingredient_id === ingredient.id).length}개)</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  삭제 중...
                </div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제하기
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}