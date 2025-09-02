'use client';

import { useState } from 'react';
import { RecipeUI as Recipe, RecipeFormData, RecipeIngredient } from '@/types';
import { mockRecipes, mockIngredients } from '@/lib/mock-data';
import { formatPrice, formatNumberToKorean } from '@/lib/utils/formatting';
import RecipesTable from '@/components/dashboard/recipes/RecipesTable';
import RecipeForm from '@/components/dashboard/recipes/RecipeForm';
import RecipeDetailsModal from '@/components/dashboard/recipes/RecipeDetailsModal';

export default function RecipesPageRoute() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();
  const [detailsRecipe, setDetailsRecipe] = useState<Recipe | undefined>();

  // Calculate statistics
  const totalRecipes = recipes.length;
  const totalValue = recipes.reduce((sum, recipe) => sum + (recipe.total_cost || 0), 0);
  const averageCost = totalValue / totalRecipes || 0;
  const profitableRecipes = recipes.filter(r => (r.profit_margin || 0) > 20).length;
  const averageProfitMargin = recipes.reduce((sum, r) => sum + (r.profit_margin || 0), 0) / totalRecipes || 0;

  const handleAddRecipe = () => {
    setEditingRecipe(undefined);
    setIsFormOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleDeleteRecipe = (id: string) => {
    if (confirm('이 레시피를 삭제하시겠습니까?')) {
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    }
  };

  const handleViewDetails = (recipe: Recipe) => {
    setDetailsRecipe(recipe);
  };

  const handleSaveRecipe = (formData: RecipeFormData) => {
    // Calculate costs based on current ingredient prices
    const ingredientsWithCosts = formData.ingredients.map(ingredient => {
      const mockIngredient = mockIngredients.find(mi => mi.id === ingredient.ingredient_id);
      const cost = mockIngredient ? mockIngredient.current_price * ingredient.quantity : 0;
      
      return {
        ingredient_id: ingredient.ingredient_id,
        name: mockIngredient?.name || 'Unknown',
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        cost: cost
      };
    });

    const totalCost = ingredientsWithCosts.reduce((sum, ing) => sum + ing.cost, 0);
    const costPerServing = formData.servings > 0 ? totalCost / formData.servings : 0;
    
    let profitAmount = 0;
    let profitMargin = 0;
    
    if (formData.selling_price) {
      profitAmount = (formData.selling_price - costPerServing) * formData.servings;
      profitMargin = costPerServing > 0 ? ((formData.selling_price - costPerServing) / costPerServing) * 100 : 0;
    }

    if (editingRecipe) {
      // Edit existing recipe
      setRecipes(prev => prev.map(recipe => 
        recipe.id === editingRecipe.id
          ? {
              ...recipe,
              ...formData,
              ingredients: ingredientsWithCosts,
              total_cost: totalCost,
              cost_per_serving: costPerServing,
              profit_margin: formData.selling_price ? profitMargin : undefined,
              profit_amount: formData.selling_price ? profitAmount : undefined,
              updated_at: new Date().toISOString()
            }
          : recipe
      ));
    } else {
      // Add new recipe
      const newRecipe: Recipe = {
        id: `rec_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...formData,
        ingredients: ingredientsWithCosts,
        total_cost: totalCost,
        cost_per_serving: costPerServing,
        profit_margin: formData.selling_price ? profitMargin : undefined,
        profit_amount: formData.selling_price ? profitAmount : undefined,
        is_active: true
      };
      setRecipes(prev => [...prev, newRecipe]);
    }
    
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  const handleCloseDetails = () => {
    setDetailsRecipe(undefined);
  };

  const handleEditFromDetails = () => {
    if (detailsRecipe) {
      setDetailsRecipe(undefined);
      handleEditRecipe(detailsRecipe);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">레시피 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            레시피별 원가를 계산하고 수익성을 분석하세요
          </p>
        </div>
        <button
          onClick={handleAddRecipe}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          + 새 레시피 추가
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-md">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 레시피</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecipes}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 원가</p>
              <p className="text-lg font-bold text-green-600">{formatNumberToKorean(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-md">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 원가</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(averageCost)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">수익성 좋음</p>
              <p className="text-2xl font-bold text-purple-600">{profitableRecipes}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-md">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 수익률</p>
              <p className="text-2xl font-bold text-orange-600">{averageProfitMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Table */}
      <RecipesTable 
        recipes={recipes}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
        onViewDetails={handleViewDetails}
      />

      {/* Recipe Form Modal */}
      {isFormOpen && (
        <RecipeForm
          recipe={editingRecipe}
          onSave={handleSaveRecipe}
          onCancel={handleCancelForm}
        />
      )}

      {/* Recipe Details Modal */}
      {detailsRecipe && (
        <RecipeDetailsModal
          recipe={detailsRecipe}
          onClose={handleCloseDetails}
          onEdit={handleEditFromDetails}
        />
      )}
    </div>
  );
}