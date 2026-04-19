'use client';

import { useMemo } from 'react';
import { RecipeUI as Recipe } from '@/types';
import { mockIngredients } from '@/lib/mock-data';
import {
  formatPrice,
  formatTime,
  getDifficultyColor,
  getDifficultyLabel
} from '@/lib/utils/formatting';
import { CostDNABar } from '@/components/ui/charts/CostDNABar';
import { PriceChange } from '@/components/ui/charts/PriceChange';
import { Sparkles, X, Pencil, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeDetailsModalProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
}

// 차트 6색 — tailwind chart-1~6 토큰과 동일
const SEGMENT_COLORS = [
  '#FF7A00', // chart-1 primary
  '#F2A900', // chart-2
  '#1F9D55', // chart-3
  '#2B6CB0', // chart-4
  '#8B5CF6', // chart-5
  '#E8412D', // chart-6
];

/**
 * 원가율(원가/판매가) 기반 칩 색상.
 */
function getCostRatioChipClass(ratio: number): string {
  if (ratio < 30) return 'bg-[#DEF4E6] text-[#1F9D55]';
  if (ratio >= 40) return 'bg-[#FDE5E1] text-[#E8412D]';
  return 'bg-[#FEF3D4] text-[#B85200]';
}

/**
 * 식자재 id로부터 결정적 가격 변동률(±15% 범위) 계산.
 * mock 데이터 기준이라 매번 같은 값을 반환.
 */
function getDeterministicChange(id: string): number {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  // -0.15 ~ +0.15 사이 결정적 값
  const norm = (seed % 30000) / 100000;
  return norm - 0.15;
}

export default function RecipeDetailsModal({ recipe, onClose, onEdit }: RecipeDetailsModalProps) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const totalCost = recipe.total_cost || 0;
  const sellPrice = recipe.selling_price || 0;
  const margin = sellPrice - totalCost;
  const costRatio = sellPrice > 0 ? (totalCost / sellPrice) * 100 : 0;

  // CostDNABar 세그먼트 변환
  const dnaSegments = useMemo(() => {
    return recipe.ingredients.map((ing, i) => ({
      label: ing.name,
      cost: ing.cost,
      color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
    }));
  }, [recipe.ingredients]);

  // 가장 비싼 재료 — AI 제안 모의용
  const topIngredient = useMemo(() => {
    if (!recipe.ingredients.length) return null;
    return [...recipe.ingredients].sort((a, b) => b.cost - a.cost)[0];
  }, [recipe.ingredients]);

  return (
    <div
      className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream rounded-2xl shadow-soft-3 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 py-5 bg-white border-b border-ink-100 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-primary-50 text-primary-700">
                {recipe.category}
              </span>
              {recipe.difficulty && (
                <span
                  className={cn(
                    'inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full',
                    getDifficultyColor(recipe.difficulty)
                  )}
                >
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              )}
              <span className="text-xs text-ink-500">
                {recipe.servings}인분
              </span>
              {totalTime > 0 && (
                <span className="text-xs text-ink-500">· {formatTime(totalTime)}</span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-ink-900">{recipe.name}</h2>
            {recipe.description && (
              <p className="text-sm text-ink-600 mt-1.5">{recipe.description}</p>
            )}
          </div>

          {/* Right: price + actions */}
          <div className="flex items-start gap-5">
            <div className="text-right">
              <div className="text-xs text-ink-500 font-medium">판매가</div>
              <div className="text-2xl font-extrabold text-ink-900 tabular-nums mt-0.5">
                {sellPrice ? formatPrice(sellPrice) : '-'}
              </div>
              {sellPrice > 0 && (
                <div className="mt-1.5 flex justify-end">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full tabular-nums',
                      getCostRatioChipClass(costRatio)
                    )}
                  >
                    원가율 {costRatio.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors shadow-brand"
              >
                <Pencil size={13} />
                수정
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-7 py-6 space-y-6">
            {/* 원가 DNA */}
            {sellPrice > 0 && dnaSegments.length > 0 && (
              <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider">원가 DNA</h3>
                    <p className="text-xs text-ink-500 mt-0.5">메뉴 한 그릇의 원가 구조를 유전자처럼 풀어봅니다</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-500">이익</div>
                    <div className={cn(
                      'text-lg font-extrabold tabular-nums',
                      margin >= 0 ? 'text-success' : 'text-error'
                    )}>
                      {formatPrice(margin)}
                    </div>
                  </div>
                </div>
                <CostDNABar
                  sellPrice={sellPrice}
                  segments={dnaSegments}
                  profitColor="#1F9D55"
                  height={48}
                />

                {/* Health indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <div className="rounded-xl bg-ink-50 p-4">
                    <div className="text-[11px] text-ink-500 font-medium">원가율</div>
                    <div className="text-xl font-extrabold text-ink-900 tabular-nums mt-1">
                      {costRatio.toFixed(0)}%
                    </div>
                    <span className={cn(
                      'inline-flex mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full',
                      getCostRatioChipClass(costRatio)
                    )}>
                      {costRatio < 30 ? '건강' : costRatio < 40 ? '주의' : '위험'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-4">
                    <div className="text-[11px] text-ink-500 font-medium">마진율</div>
                    <div className="text-xl font-extrabold text-ink-900 tabular-nums mt-1">
                      {(100 - costRatio).toFixed(0)}%
                    </div>
                    <span className="inline-flex mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ink-100 text-ink-700">
                      목표 65%
                    </span>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-4">
                    <div className="text-[11px] text-ink-500 font-medium">총 원가</div>
                    <div className="text-xl font-extrabold text-ink-900 tabular-nums mt-1">
                      {formatPrice(totalCost)}
                    </div>
                    <span className="inline-flex mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ink-100 text-ink-700">
                      {recipe.servings}인분 기준
                    </span>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-4">
                    <div className="text-[11px] text-ink-500 font-medium">인분당 원가</div>
                    <div className="text-xl font-extrabold text-ink-900 tabular-nums mt-1">
                      {formatPrice(recipe.cost_per_serving || 0)}
                    </div>
                    {recipe.profit_amount && (
                      <span className="inline-flex mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#DEF4E6] text-[#1F9D55] tabular-nums">
                        수익 {formatPrice(recipe.profit_amount)}
                      </span>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Ingredients table */}
            <section className="rounded-2xl border border-ink-100 bg-white shadow-soft-1 overflow-hidden">
              <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-ink-900">재료 구성</h3>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {recipe.ingredients.length}개 재료 · 가격 변동은 실시간 반영
                  </p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-3 h-8 text-xs font-semibold rounded-lg text-ink-600 hover:bg-ink-50 transition-colors">
                  <RefreshCw size={13} />
                  가격 재계산
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-ink-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                        재료
                      </th>
                      <th className="px-3 py-3 text-center text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                        사용량
                      </th>
                      <th className="px-3 py-3 text-right text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                        단가
                      </th>
                      <th className="px-3 py-3 text-right text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                        원가
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                        비중
                      </th>
                      <th className="px-6 py-3 text-right text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                        30일 변동
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    {recipe.ingredients.map((recipeIngredient, idx) => {
                      const ingredient = mockIngredients.find(
                        ing => ing.id === recipeIngredient.ingredient_id
                      );
                      const pct = totalCost > 0 ? (recipeIngredient.cost / totalCost) * 100 : 0;
                      const change = getDeterministicChange(recipeIngredient.ingredient_id);
                      const segColor = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];

                      return (
                        <tr key={recipeIngredient.ingredient_id} className="hover:bg-ink-50/40 transition-colors">
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-1.5 h-7 rounded-full"
                                style={{ background: segColor }}
                              />
                              <span className="text-sm font-semibold text-ink-900">
                                {recipeIngredient.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap text-sm text-ink-600 text-center tabular-nums">
                            {recipeIngredient.quantity}{recipeIngredient.unit}
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap text-sm text-ink-600 text-right tabular-nums">
                            {ingredient
                              ? `${formatPrice(ingredient.current_price)}/${ingredient.unit}`
                              : '-'}
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap text-sm font-bold text-ink-900 text-right tabular-nums">
                            {formatPrice(recipeIngredient.cost)}
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${pct}%`, background: segColor }}
                                />
                              </div>
                              <span className="text-xs text-ink-600 tabular-nums font-semibold">
                                {pct.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-right">
                            <PriceChange change={change} chip size="sm" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-ink-50/30">
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-ink-700">
                        총합
                      </td>
                      <td className="px-3 py-3 text-sm font-extrabold text-ink-900 text-right tabular-nums">
                        {formatPrice(totalCost)}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* AI 원가 개선 제안 배너 */}
              {topIngredient && (
                <div className="px-6 py-4 bg-primary-50 border-t border-ink-100 border-l-4 border-l-primary flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-brand">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-primary-700">AI 원가 개선 제안</div>
                    <div className="text-xs text-primary-700 mt-1 leading-relaxed">
                      <span className="font-semibold">{topIngredient.name}</span>을(를) 가락시장 직배송 공급처로 변경하면
                      그릇당 <strong className="tabular-nums">{formatPrice(Math.round(topIngredient.cost * 0.12))}</strong> 절약 가능 ·
                      월 예상 <strong className="tabular-nums">{formatPrice(Math.round(topIngredient.cost * 0.12 * 42 * 30))}</strong>
                    </div>
                  </div>
                  <button className="flex-shrink-0 inline-flex items-center px-4 h-9 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors shadow-brand">
                    적용하기
                  </button>
                </div>
              )}
            </section>

            {/* 보조 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 시간 정보 */}
              {totalTime > 0 && (
                <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft-1">
                  <h4 className="text-sm font-bold text-ink-900 mb-3">시간 정보</h4>
                  <div className="space-y-2 text-sm">
                    {recipe.prep_time && (
                      <div className="flex justify-between">
                        <span className="text-ink-600">준비시간</span>
                        <span className="font-semibold text-ink-900 tabular-nums">{formatTime(recipe.prep_time)}</span>
                      </div>
                    )}
                    {recipe.cook_time && (
                      <div className="flex justify-between">
                        <span className="text-ink-600">조리시간</span>
                        <span className="font-semibold text-ink-900 tabular-nums">{formatTime(recipe.cook_time)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-ink-100">
                      <span className="text-ink-700 font-medium">총 시간</span>
                      <span className="font-extrabold text-ink-900 tabular-nums">{formatTime(totalTime)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 태그 */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft-1">
                  <h4 className="text-sm font-bold text-ink-900 mb-3">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-ink-50 text-ink-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 레시피 메타 */}
              <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft-1">
                <h4 className="text-sm font-bold text-ink-900 mb-3">레시피 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-600">재료 수</span>
                    <span className="font-semibold text-ink-900 tabular-nums">{recipe.ingredients.length}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-600">인분</span>
                    <span className="font-semibold text-ink-900 tabular-nums">{recipe.servings}인분</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-600">최종 수정</span>
                    <span className="font-semibold text-ink-900 tabular-nums text-xs">{recipe.updated_at}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 조리순서 */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft-1">
                <h3 className="text-base font-bold text-ink-900 mb-4">조리순서</h3>
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold tabular-nums">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-sm text-ink-700 pt-0.5 leading-relaxed">
                        {instruction}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
