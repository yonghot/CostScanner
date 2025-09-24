'use client'

import { useState } from 'react'
import { useDemoContext } from '@/contexts/DemoContext'
import { Plus, X } from 'lucide-react'
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
import { IngredientCategory } from '@/types'

interface AddIngredientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categoryOptions: { value: IngredientCategory; label: string }[] = [
  { value: '채소', label: '채소류' },
  { value: '육류', label: '육류' },
  { value: '해산물', label: '수산물' },
  { value: '유제품', label: '유제품' },
  { value: '곡류', label: '곡류' },
  { value: '조미료', label: '조미료' },
  { value: '향신료', label: '향신료' },
  { value: '난류', label: '난류' },
  { value: '기타', label: '기타' }
]

export default function AddIngredientModal({ open, onOpenChange }: AddIngredientModalProps) {
  const { addIngredient } = useDemoContext()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '채소' as IngredientCategory,
    unit: '',
    description: '',
    is_active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addIngredient({
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit.trim(),
        description: formData.description.trim() || undefined,
        is_active: formData.is_active,
        // UI-specific fields
        current_price: 0,
        price_history: [],
        suppliers: [],
        status: 'available' as const,
        // Base entity fields
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Reset form
      setFormData({
        name: '',
        category: '채소' as IngredientCategory,
        unit: '',
        description: '',
        is_active: true
      })

      onOpenChange(false)
    } catch (error) {
      // Failed to add ingredient - 로거로 대체 필요
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
            <Plus className="h-5 w-5 mr-2 text-primary" />
            새 식자재 추가
          </DialogTitle>
          <DialogDescription>
            새로운 식자재 정보를 입력하여 관리 목록에 추가하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                식자재명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="예: 양파, 소고기 등"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <select
                id="category"
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
            <Label htmlFor="unit">
              단위 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={handleChange('unit')}
              placeholder="예: kg, 개, 팩, L 등"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="식자재에 대한 추가 정보나 설명을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>


          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange('is_active')}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <Label htmlFor="is_active">활성 상태로 추가</Label>
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
                  추가 중...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  식자재 추가
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}