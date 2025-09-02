'use client';

import { useState, useEffect } from 'react';
import { IngredientUI as Ingredient, IngredientFormData } from '@/types';
import { ingredientCategories, supplierSpecialties } from '@/lib/mock-data';

interface IngredientFormProps {
  ingredient?: Ingredient;
  onSave: (data: IngredientFormData) => void;
  onCancel: () => void;
}

export default function IngredientForm({ ingredient, onSave, onCancel }: IngredientFormProps) {
  const [formData, setFormData] = useState<IngredientFormData>({
    name: '',
    category: '',
    unit: '',
    current_price: 0,
    suppliers: [],
    min_stock_level: undefined,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSupplier, setNewSupplier] = useState('');

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        current_price: ingredient.current_price,
        suppliers: ingredient.suppliers,
        min_stock_level: ingredient.min_stock_level,
        description: ingredient.description || '',
      });
    }
  }, [ingredient]);

  const units = [
    'kg', 'g', 'L', 'mL', '개', '포', '박스', '봉지', '묶음', '단'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '식자재명을 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (!formData.unit) {
      newErrors.unit = '단위를 선택해주세요.';
    }

    if (!formData.current_price || formData.current_price <= 0) {
      newErrors.current_price = '올바른 가격을 입력해주세요.';
    }

    if (!formData.suppliers || formData.suppliers.length === 0) {
      newErrors.suppliers = '최소 하나의 공급업체를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof IngredientFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const addSupplier = () => {
    if (newSupplier.trim() && !(formData.suppliers || []).includes(newSupplier.trim())) {
      handleInputChange('suppliers', [...(formData.suppliers || []), newSupplier.trim()]);
      setNewSupplier('');
    }
  };

  const removeSupplier = (supplier: string) => {
    handleInputChange('suppliers', (formData.suppliers || []).filter(s => s !== supplier));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {ingredient ? '식자재 수정' : '새 식자재 추가'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  식자재명 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="예: 한우등심"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">카테고리 선택</option>
                  {ingredientCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  단위 *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.unit ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">단위 선택</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 가격 *
                </label>
                <input
                  type="number"
                  value={formData.current_price || ''}
                  onChange={(e) => handleInputChange('current_price', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.current_price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="원"
                  min="0"
                />
                {errors.current_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.current_price as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 재고 수준
                </label>
                <input
                  type="number"
                  value={formData.min_stock_level || ''}
                  onChange={(e) => handleInputChange('min_stock_level', parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="최소 재고량"
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="식자재에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>

            {/* Suppliers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공급업체 *
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="공급업체명 입력"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSupplier();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSupplier}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  추가
                </button>
              </div>

              <div className="space-y-2">
                {(formData.suppliers || []).map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <span className="text-sm text-gray-700">{supplier}</span>
                    <button
                      type="button"
                      onClick={() => removeSupplier(supplier)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {errors.suppliers && (
                <p className="mt-1 text-sm text-red-600">{errors.suppliers as string}</p>
              )}

              {formData.suppliers.length === 0 && (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-sm text-gray-500">공급업체를 추가해주세요</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ingredient ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}