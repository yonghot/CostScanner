'use client';

import { RecipeUI as Recipe } from '@/types';
import { mockIngredients } from '@/lib/mock-data';
import { 
  formatPrice, 
  formatTime,
  getDifficultyColor,
  getDifficultyLabel,
  getProfitColor
} from '@/lib/utils/formatting';

interface RecipeDetailsModalProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
}

export default function RecipeDetailsModal({ recipe, onClose, onEdit }: RecipeDetailsModalProps) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
              <div className="flex items-center space-x-4 text-sm">
                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                  {recipe.category}
                </span>
                {recipe.difficulty && (
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </span>
                )}
                <span className="text-gray-600">
                  {recipe.servings}인분
                </span>
                {totalTime > 0 && (
                  <span className="text-gray-600">
                    {formatTime(totalTime)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                수정
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Recipe Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cost Analysis */}
              <div className="bg-gradient-to-r from-green-50 to-primary/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">원가 분석</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(recipe.total_cost || 0)}
                    </div>
                    <div className="text-sm text-gray-600">총 원가</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(recipe.cost_per_serving || 0)}
                    </div>
                    <div className="text-sm text-gray-600">인분당 원가</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {recipe.selling_price ? formatPrice(recipe.selling_price) : '-'}
                    </div>
                    <div className="text-sm text-gray-600">판매가격</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getProfitColor(recipe.profit_margin || 0)}`}>
                      {recipe.profit_margin ? `${recipe.profit_margin}%` : '-'}
                    </div>
                    <div className="text-sm text-gray-600">수익률</div>
                  </div>
                </div>
                {recipe.profit_amount && (
                  <div className="mt-4 text-center">
                    <div className="text-lg">
                      <span className="text-gray-600">총 수익: </span>
                      <span className="font-semibold text-green-600">
                        {formatPrice(recipe.profit_amount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">재료</h3>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          재료명
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          수량
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          단가
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          금액
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recipe.ingredients.map((recipeIngredient) => {
                        const ingredient = mockIngredients.find(ing => ing.id === recipeIngredient.ingredient_id);
                        if (!ingredient) return null;

                        return (
                          <tr key={recipeIngredient.ingredient_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {recipeIngredient.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {recipeIngredient.quantity}{recipeIngredient.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {formatPrice(ingredient.current_price)}/{ingredient.unit}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                              {formatPrice(recipeIngredient.cost)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900">
                          총합
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">
                          {formatPrice(recipe.total_cost || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Instructions */}
              {recipe.instructions && recipe.instructions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">조리순서</h3>
                  <div className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 text-gray-700">
                          {instruction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Time Information */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">시간 정보</h4>
                <div className="space-y-2 text-sm">
                  {recipe.prep_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">준비시간:</span>
                      <span className="font-medium">{formatTime(recipe.prep_time)}</span>
                    </div>
                  )}
                  {recipe.cook_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">조리시간:</span>
                      <span className="font-medium">{formatTime(recipe.cook_time)}</span>
                    </div>
                  )}
                  {totalTime > 0 && (
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600 font-medium">총 시간:</span>
                      <span className="font-bold">{formatTime(totalTime)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Stats */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">레시피 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">재료 수:</span>
                    <span className="font-medium">{recipe.ingredients.length}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">인분:</span>
                    <span className="font-medium">{recipe.servings}인분</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">최종 수정:</span>
                    <span className="font-medium">{recipe.updated_at}</span>
                  </div>
                </div>
              </div>

              {/* Profit Analysis */}
              {recipe.selling_price && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-green-900 mb-3">수익성 분석</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">인분당 이익:</span>
                      <span className="font-bold text-green-800">
                        {recipe.profit_amount && recipe.servings ? 
                          formatPrice(recipe.profit_amount / recipe.servings) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">총 이익:</span>
                      <span className="font-bold text-green-800">
                        {recipe.profit_amount ? formatPrice(recipe.profit_amount) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">수익률:</span>
                      <span className={`font-bold ${getProfitColor(recipe.profit_margin || 0)}`}>
                        {recipe.profit_margin ? `${recipe.profit_margin.toFixed(1)}%` : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}