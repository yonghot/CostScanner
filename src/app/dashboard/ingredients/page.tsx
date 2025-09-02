'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { IngredientUI, IngredientFormData } from '@/types';
import { mockIngredients } from '@/lib/mock-data';
import { formatPrice, formatNumberToKorean } from '@/lib/utils/formatting';
import IngredientsTable from '@/components/dashboard/ingredients/IngredientsTable';
import IngredientForm from '@/components/dashboard/ingredients/IngredientForm';

export default function IngredientsPageRoute() {
  const [ingredients, setIngredients] = useState<IngredientUI[]>(mockIngredients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<IngredientUI | undefined>();

  // Calculate statistics
  const totalIngredients = ingredients.length;
  const availableIngredients = ingredients.filter(i => i.status === 'available').length;
  const lowStockIngredients = ingredients.filter(i => i.status === 'low_stock').length;
  const outOfStockIngredients = ingredients.filter(i => i.status === 'out_of_stock').length;
  const totalValue = ingredients.reduce((sum, ingredient) => {
    const stock = ingredient.stock_level || 0;
    return sum + (stock * ingredient.current_price);
  }, 0);

  const handleAddIngredient = () => {
    setEditingIngredient(undefined);
    setIsFormOpen(true);
  };

  const handleEditIngredient = (ingredient: IngredientUI) => {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  };

  const handleDeleteIngredient = (id: string) => {
    if (confirm('이 식자재를 삭제하시겠습니까?')) {
      setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
    }
  };

  const handleSaveIngredient = (formData: IngredientFormData) => {
    if (editingIngredient) {
      // Edit existing ingredient
      setIngredients(prev => prev.map(ingredient => 
        ingredient.id === editingIngredient.id
          ? {
              ...ingredient,
              ...formData,
              updated_at: new Date().toISOString()
            }
          : ingredient
      ));
    } else {
      // Add new ingredient
      const newIngredient: IngredientUI = {
        id: `ing_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...formData,
        current_price: formData.current_price || 0,
        price_history: [{
          date: new Date().toISOString().split('T')[0],
          price: formData.current_price || 0
        }],
        suppliers: [],
        stock_level: 0,
        status: 'available',
        is_active: true
      };
      setIngredients(prev => [...prev, newIngredient]);
    }
    setIsFormOpen(false);
    setEditingIngredient(undefined);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingIngredient(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">식자재 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            등록된 식자재를 관리하고 가격 변동을 모니터링하세요
          </p>
        </div>
        <button
          onClick={handleAddIngredient}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          + 새 식자재 추가
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-md">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 식자재</p>
              <p className="text-2xl font-bold text-gray-900">{totalIngredients}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">재고 충분</p>
              <p className="text-2xl font-bold text-green-600">{availableIngredients}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">재고 부족</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockIngredients}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">재고 없음</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockIngredients}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">재고 총액</p>
              <p className="text-lg font-bold text-purple-600">{formatNumberToKorean(totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <IngredientsTable 
        ingredients={ingredients}
        onEdit={handleEditIngredient}
        onDelete={handleDeleteIngredient}
      />

      {/* Ingredient Form Modal */}
      {isFormOpen && (
        <IngredientForm
          ingredient={editingIngredient}
          onSave={handleSaveIngredient}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}