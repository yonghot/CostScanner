'use client';

import { useState } from 'react';
import { mockIngredients, mockRecipes, mockSuppliers } from '@/lib/mock-data';
import { formatPrice, formatNumberToKorean } from '@/lib/utils/formatting';

export default function ReportsPageRoute() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('cost_trend');

  // Calculate report data
  const totalIngredients = mockIngredients.length;
  const totalRecipes = mockRecipes.length;
  const totalSuppliers = mockSuppliers.length;
  
  const averageIngredientCost = mockIngredients.reduce((sum, ing) => sum + ing.current_price, 0) / totalIngredients;
  const totalInventoryValue = mockIngredients.reduce((sum, ing) => sum + (ing.current_price * 10), 0); // 임시로 기본 재고량 10 사용
  
  const highValueIngredients = mockIngredients
    .filter(ing => ing.current_price > averageIngredientCost)
    .sort((a, b) => b.current_price - a.current_price)
    .slice(0, 5);

  const topProfitableRecipes = mockRecipes
    .filter(recipe => recipe.profit_margin && recipe.profit_margin > 0)
    .sort((a, b) => (b.profit_margin || 0) - (a.profit_margin || 0))
    .slice(0, 5);

  const priceChanges = mockIngredients
    .filter(ing => ing.price_history.length >= 2)
    .map(ing => {
      const current = ing.price_history[ing.price_history.length - 1].price;
      const previous = ing.price_history[ing.price_history.length - 2].price;
      const change = ((current - previous) / previous) * 100;
      return { name: ing.name, change, current, previous };
    })
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 10);

  const supplierPerformance = mockSuppliers.map(supplier => {
    const suppliedIngredients = mockIngredients.filter(ing => ing.suppliers.includes(supplier.id));
    return {
      name: supplier.name,
      rating: supplier.rating,
      ingredientCount: suppliedIngredients.length,
      avgDeliveryTime: supplier.delivery_time,
      totalValue: suppliedIngredients.reduce((sum, ing) => sum + ing.current_price, 0)
    };
  }).sort((a, b) => b.rating - a.rating);

  const downloadReport = (format: 'csv' | 'pdf') => {
    // Simulate download
    alert(`${format.toUpperCase()} 리포트를 다운로드합니다.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리포트</h1>
          <p className="mt-1 text-sm text-gray-500">
            원가 분석 리포트를 생성하고 트렌드를 확인하세요
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => downloadReport('csv')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            CSV 다운로드
          </button>
          <button
            onClick={() => downloadReport('pdf')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            PDF 다운로드
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              리포트 유형
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="cost_trend">원가 트렌드 분석</option>
              <option value="profit_analysis">수익성 분석</option>
              <option value="supplier_performance">공급업체 성과</option>
              <option value="inventory_report">재고 현황</option>
              <option value="price_changes">가격 변동 현황</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              분석 기간
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="week">지난 7일</option>
              <option value="month">지난 30일</option>
              <option value="quarter">지난 3개월</option>
              <option value="year">지난 1년</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-md">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 재고 가치</p>
              <p className="text-2xl font-bold text-primary">{formatNumberToKorean(totalInventoryValue)}</p>
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
              <p className="text-sm font-medium text-gray-600">평균 식자재 단가</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(averageIngredientCost)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">등록된 레시피</p>
              <p className="text-2xl font-bold text-purple-600">{totalRecipes}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-md">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 공급업체</p>
              <p className="text-2xl font-bold text-orange-600">{totalSuppliers}개</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Changes Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">가격 변동 현황</h3>
          <div className="space-y-3">
            {priceChanges.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {formatPrice(item.previous)} → {formatPrice(item.current)}
                  </span>
                  <span className={`text-sm font-semibold ${
                    item.change > 0 ? 'text-red-600' : item.change < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Profitable Recipes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">수익성 높은 레시피</h3>
          <div className="space-y-3">
            {topProfitableRecipes.map((recipe, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{recipe.name}</span>
                  <div className="text-xs text-gray-500">{recipe.category}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-green-600">
                    {recipe.profit_margin}%
                  </span>
                  {recipe.profit_amount && (
                    <div className="text-xs text-gray-500">
                      {formatPrice(recipe.profit_amount)} 수익
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Value Ingredients */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">고가 식자재</h3>
          <div className="space-y-3">
            {highValueIngredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{ingredient.name}</span>
                  <div className="text-xs text-gray-500">{ingredient.category}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-primary">
                    {formatPrice(ingredient.current_price)}/{ingredient.unit}
                  </span>
                  <div className="text-xs text-gray-500">
                    재고: 10{ingredient.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">공급업체 성과</h3>
          <div className="space-y-3">
            {supplierPerformance.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{supplier.name}</span>
                  <div className="text-xs text-gray-500">
                    {supplier.ingredientCount}개 품목 공급
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-yellow-600">★ {supplier.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    평균 {supplier.avgDeliveryTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">분석 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {mockRecipes.filter(r => (r.profit_margin || 0) > 40).length}
            </div>
            <div className="text-sm text-green-600">고수익 레시피 (40%+)</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700">
              {priceChanges.filter(p => p.change > 10).length}
            </div>
            <div className="text-sm text-red-600">가격 급등 식자재 (10%+)</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {supplierPerformance.filter(s => s.rating >= 4.0).length}
            </div>
            <div className="text-sm text-primary">우수 공급업체 (4.0+)</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-primary/5 to-indigo-50 p-6 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 추천 사항</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• 가격이 급등한 식자재는 대체 공급업체 검토를 고려해보세요.</p>
          <p>• 수익률이 낮은 레시피는 재료 구성이나 판매가 조정이 필요합니다.</p>
          <p>• 평점이 높은 공급업체와의 거래량 확대를 검토해보세요.</p>
          <p>• 재고 회전율이 낮은 고가 식자재는 주문량 조정이 필요합니다.</p>
        </div>
      </div>
    </div>
  )
}