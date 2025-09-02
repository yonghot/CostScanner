'use client';

import { useState } from 'react';
import { IngredientUI, FilterOptions, SortOptions } from '@/types';
import { 
  formatPrice, 
  formatDate, 
  getStatusColor, 
  getStatusLabel,
  getCategoryColor,
  getPriceChangeColor,
  getPriceChangeIcon
} from '@/lib/utils/formatting';

interface IngredientsTableProps {
  ingredients: IngredientUI[];
  onEdit: (ingredient: IngredientUI) => void;
  onDelete: (id: string) => void;
}

export default function IngredientsTable({ ingredients, onEdit, onDelete }: IngredientsTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'name', direction: 'asc' });

  // Filter ingredients
  const filteredIngredients = ingredients.filter(ingredient => {
    if (filters.category && ingredient.category !== filters.category) return false;
    if (filters.status && ingredient.status !== filters.status) return false;
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (ingredient.currentPrice < min || ingredient.currentPrice > max) return false;
    }
    return true;
  });

  // Sort ingredients
  const sortedIngredients = [...filteredIngredients].sort((a, b) => {
    const aValue = a[sort.field as keyof Ingredient];
    const bValue = b[sort.field as keyof Ingredient];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.direction === 'asc' 
        ? aValue.localeCompare(bValue, 'ko-KR')
        : bValue.localeCompare(aValue, 'ko-KR');
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getPriceChange = (ingredient: Ingredient) => {
    if (ingredient.priceHistory.length < 2) return 0;
    const current = ingredient.priceHistory[ingredient.priceHistory.length - 1].price;
    const previous = ingredient.priceHistory[ingredient.priceHistory.length - 2].price;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">필터</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">전체</option>
              <option value="육류">육류</option>
              <option value="채소">채소</option>
              <option value="향신료">향신료</option>
              <option value="조미료">조미료</option>
              <option value="곡류">곡류</option>
              <option value="난류">난류</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고 상태
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">전체</option>
              <option value="available">재고 충분</option>
              <option value="low_stock">재고 부족</option>
              <option value="out_of_stock">재고 없음</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최소 가격
            </label>
            <input
              type="number"
              value={filters.priceRange?.min || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceRange: {
                  ...prev.priceRange,
                  min: e.target.value ? parseInt(e.target.value) : 0,
                  max: prev.priceRange?.max || Infinity
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="최소 가격"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 가격
            </label>
            <input
              type="number"
              value={filters.priceRange?.max === Infinity ? '' : filters.priceRange?.max || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceRange: {
                  min: prev.priceRange?.min || 0,
                  max: e.target.value ? parseInt(e.target.value) : Infinity
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="최대 가격"
            />
          </div>
        </div>
        
        <button
          onClick={() => setFilters({})}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          필터 초기화
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  식자재명
                  {sort.field === 'name' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('currentPrice')}
                >
                  현재 가격
                  {sort.field === 'currentPrice' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격 변동
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  재고 현황
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastUpdated')}
                >
                  최근 업데이트
                  {sort.field === 'lastUpdated' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedIngredients.map((ingredient) => {
                const priceChange = getPriceChange(ingredient);
                return (
                  <tr key={ingredient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ingredient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ingredient.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(ingredient.category)}`}>
                        {ingredient.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(ingredient.currentPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        /{ingredient.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getPriceChangeColor(priceChange)}`}>
                        <span className="mr-1">
                          {getPriceChangeIcon(priceChange)}
                        </span>
                        {Math.abs(priceChange).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ingredient.status)}`}>
                          {getStatusLabel(ingredient.status)}
                        </span>
                        {ingredient.stockLevel !== undefined && (
                          <span className="text-xs text-gray-500">
                            {ingredient.stockLevel}{ingredient.unit}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ingredient.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEdit(ingredient)}
                        className="text-primary hover:text-primary-dark"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDelete(ingredient.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedIngredients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">조건에 맞는 식자재가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-primary">
              총 {sortedIngredients.length}개의 식자재가 표시됩니다.
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-600">
              재고 충분: {sortedIngredients.filter(i => i.status === 'available').length}개
            </span>
            <span className="text-yellow-600">
              재고 부족: {sortedIngredients.filter(i => i.status === 'low_stock').length}개
            </span>
            <span className="text-red-600">
              재고 없음: {sortedIngredients.filter(i => i.status === 'out_of_stock').length}개
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}