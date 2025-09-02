'use client';

import { useState, useEffect } from 'react';
import { Recipe, RecipeFormData, Ingredient } from '@/types';
import { recipeCategories, mockIngredients } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils/formatting';

interface RecipeFormProps {
  recipe?: Recipe;
  onSave: (data: RecipeFormData) => void;
  onCancel: () => void;
}

export default function RecipeForm({ recipe, onSave, onCancel }: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    category: '',
    servings: 1,
    ingredients: [],
    sellingPrice: undefined,
    instructions: [],
    prepTime: undefined,
    cookTime: undefined,
    difficulty: undefined,
    tags: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [newTag, setNewTag] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [costPerServing, setCostPerServing] = useState(0);
  const [profitAmount, setProfitAmount] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        category: recipe.category,
        servings: recipe.servings,
        ingredients: recipe.ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit
        })),
        sellingPrice: recipe.sellingPrice,
        instructions: recipe.instructions || [],
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        tags: recipe.tags || [],
      });
    }
  }, [recipe]);

  // Calculate costs whenever ingredients, servings, or selling price change
  useEffect(() => {
    const calculatedTotalCost = formData.ingredients.reduce((total, recipeIngredient) => {
      const ingredient = mockIngredients.find(ing => ing.id === recipeIngredient.ingredientId);
      if (!ingredient) return total;
      
      return total + (ingredient.currentPrice * recipeIngredient.quantity);
    }, 0);

    const calculatedCostPerServing = formData.servings > 0 ? calculatedTotalCost / formData.servings : 0;
    
    setTotalCost(calculatedTotalCost);
    setCostPerServing(calculatedCostPerServing);

    if (formData.sellingPrice) {
      const profit = formData.sellingPrice - calculatedCostPerServing;
      const margin = calculatedCostPerServing > 0 ? (profit / calculatedCostPerServing) * 100 : 0;
      
      setProfitAmount(profit * formData.servings);
      setProfitMargin(margin);
    } else {
      setProfitAmount(0);
      setProfitMargin(0);
    }
  }, [formData.ingredients, formData.servings, formData.sellingPrice]);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = '레시피명을 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (formData.servings <= 0) {
      newErrors.servings = '인분을 입력해주세요.';
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = '최소 하나의 재료를 추가해주세요.';
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

  const handleInputChange = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const addIngredient = () => {
    if (selectedIngredientId && selectedQuantity) {
      const ingredient = mockIngredients.find(ing => ing.id === selectedIngredientId);
      if (!ingredient) return;

      const quantity = parseFloat(selectedQuantity);
      if (quantity <= 0) return;

      // Check if ingredient already exists
      const existingIndex = formData.ingredients.findIndex(
        ing => ing.ingredientId === selectedIngredientId
      );

      if (existingIndex >= 0) {
        // Update existing ingredient quantity
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[existingIndex].quantity = quantity;
        handleInputChange('ingredients', updatedIngredients);
      } else {
        // Add new ingredient
        handleInputChange('ingredients', [
          ...formData.ingredients,
          {
            ingredientId: selectedIngredientId,
            quantity: quantity,
            unit: ingredient.unit
          }
        ]);
      }

      setSelectedIngredientId('');
      setSelectedQuantity('');
    }
  };

  const removeIngredient = (ingredientId: string) => {
    handleInputChange('ingredients', 
      formData.ingredients.filter(ing => ing.ingredientId !== ingredientId)
    );
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      handleInputChange('instructions', [...(formData.instructions || []), newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    handleInputChange('instructions', 
      (formData.instructions || []).filter((_, i) => i !== index)
    );
  };

  const addTag = () => {
    if (newTag.trim() && !(formData.tags || []).includes(newTag.trim())) {
      handleInputChange('tags', [...(formData.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    handleInputChange('tags', (formData.tags || []).filter(t => t !== tag));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {recipe ? '레시피 수정' : '새 레시피 추가'}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Recipe Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      레시피명 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="예: 불고기"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                      {recipeCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      인분 *
                    </label>
                    <input
                      type="number"
                      value={formData.servings || ''}
                      onChange={(e) => handleInputChange('servings', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.servings ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="1"
                    />
                    {errors.servings && (
                      <p className="mt-1 text-sm text-red-600">{errors.servings}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      준비시간 (분)
                    </label>
                    <input
                      type="number"
                      value={formData.prepTime || ''}
                      onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      조리시간 (분)
                    </label>
                    <input
                      type="number"
                      value={formData.cookTime || ''}
                      onChange={(e) => handleInputChange('cookTime', parseInt(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      난이도
                    </label>
                    <select
                      value={formData.difficulty || ''}
                      onChange={(e) => handleInputChange('difficulty', e.target.value as any || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">선택안함</option>
                      <option value="easy">쉬움</option>
                      <option value="medium">보통</option>
                      <option value="hard">어려움</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      판매가격
                    </label>
                    <input
                      type="number"
                      value={formData.sellingPrice || ''}
                      onChange={(e) => handleInputChange('sellingPrice', parseInt(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="원"
                      min="0"
                    />
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">원가 분석</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">총 원가:</span>
                      <span className="ml-2 font-semibold">{formatPrice(totalCost)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">인분당 원가:</span>
                      <span className="ml-2 font-semibold">{formatPrice(costPerServing)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">총 수익:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        {formData.sellingPrice ? formatPrice(profitAmount) : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">수익률:</span>
                      <span className="ml-2 font-semibold text-primary">
                        {formData.sellingPrice ? `${profitMargin.toFixed(1)}%` : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Ingredients */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    재료 *
                  </label>
                  
                  {/* Add ingredient */}
                  <div className="flex gap-2 mb-3">
                    <select
                      value={selectedIngredientId}
                      onChange={(e) => setSelectedIngredientId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">재료 선택</option>
                      {mockIngredients.map(ingredient => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({formatPrice(ingredient.currentPrice)}/{ingredient.unit})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="수량"
                      min="0"
                      step="0.1"
                    />
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      추가
                    </button>
                  </div>

                  {/* Ingredients list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {formData.ingredients.map((recipeIngredient) => {
                      const ingredient = mockIngredients.find(ing => ing.id === recipeIngredient.ingredientId);
                      if (!ingredient) return null;

                      const cost = ingredient.currentPrice * recipeIngredient.quantity;
                      
                      return (
                        <div key={recipeIngredient.ingredientId} className="flex items-center justify-between bg-white px-3 py-2 rounded-md border">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {ingredient.name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {recipeIngredient.quantity}{recipeIngredient.unit}
                            </span>
                            <span className="text-sm text-green-600 ml-2">
                              {formatPrice(cost)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeIngredient(recipeIngredient.ingredientId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {errors.ingredients && (
                    <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>
                  )}

                  {formData.ingredients.length === 0 && (
                    <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-md">
                      <p className="text-sm text-gray-500">재료를 추가해주세요</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                조리순서
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="조리 단계를 입력하세요"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInstruction();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addInstruction}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  추가
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(formData.instructions || []).map((instruction, index) => (
                  <div key={index} className="flex items-start justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600 mr-2">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-900">{instruction}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="태그 입력 (예: 한식, 인기메뉴)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  추가
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
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
                {recipe ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}