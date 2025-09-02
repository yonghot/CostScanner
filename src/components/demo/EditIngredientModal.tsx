'use client'

import { useState, useEffect } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { Edit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Ingredient, IngredientCategory } from '@/types'

interface EditIngredientModalProps {
  ingredient: Ingredient
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categoryOptions: { value: IngredientCategory; label: string }[] = [
  { value: 'vegetables', label: '채소류' },
  { value: 'meat', label: '육류' },
  { value: 'seafood', label: '수산물' },
  { value: 'dairy', label: '유제품' },
  { value: 'grains', label: '곡류' },
  { value: 'seasonings', label: '조미료' },
  { value: 'processed', label: '가공품' },
  { value: 'beverages', label: '음료' },
  { value: 'others', label: '기타' }
]

export default function EditIngredientModal({ ingredient, open, onOpenChange }: EditIngredientModalProps) {
  const { updateIngredient } = useDemoContext()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables' as IngredientCategory,
    unit: '',
    description: '',
    storage_info: '',
    is_active: true
  })

  // Update form data when ingredient changes
  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        description: ingredient.description || '',
        storage_info: ingredient.storage_info || '',
        is_active: ingredient.is_active
      })
    }
  }, [ingredient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateIngredient(ingredient.id, {
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit.trim(),
        description: formData.description.trim() || null,
        storage_info: formData.storage_info.trim() || null,
        is_active: formData.is_active
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update ingredient:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2 text-primary" />
            식자재 수정
          </DialogTitle>
          <DialogDescription>
            {ingredient?.name}의 정보를 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                식자재명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="예: 양파, 소고기 등"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">카테고리</Label>
              <select
                id="edit-category"
                value={formData.category}
                onChange={handleChange('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-unit">
              단위 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-unit"
              value={formData.unit}
              onChange={handleChange('unit')}
              placeholder="예: kg, 개, 팩, L 등"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">설명</Label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="식자재에 대한 추가 정보나 설명을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-storage_info">보관 정보</Label>
            <Input
              id="edit-storage_info"
              value={formData.storage_info}
              onChange={handleChange('storage_info')}
              placeholder="예: 냉장 보관, 상온 보관, 냉동 보관 등"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-is_active"
              checked={formData.is_active}
              onChange={handleChange('is_active')}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <Label htmlFor="edit-is_active">활성 상태</Label>
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
            <Button type="submit" disabled={isLoading || !formData.name.trim() || !formData.unit.trim()}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  수정 중...
                </div>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  수정 완료
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}