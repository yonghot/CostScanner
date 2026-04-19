'use client';

import { RecipeUI as Recipe } from '@/types';
import { formatPrice } from '@/lib/utils/formatting';
import { ChefHat, Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipesTableProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onViewDetails: (recipe: Recipe) => void;
}

/**
 * 원가율(원가 ÷ 판매가) 기반 칩 색상.
 * < 30% : 초록 (건강)
 * 30~40% : 주황 (주의)
 * >= 40% : 빨강 (위험)
 */
function getCostRatioChipClass(costRatio: number): string {
  if (costRatio < 30) return 'bg-[#DEF4E6] text-[#1F9D55]';
  if (costRatio >= 40) return 'bg-[#FDE5E1] text-[#E8412D]';
  return 'bg-[#FEF3D4] text-[#B85200]';
}

function getCostRatioLabel(costRatio: number): string {
  if (costRatio < 30) return '건강';
  if (costRatio >= 40) return '위험';
  return '주의';
}

export default function RecipesTable({ recipes, onEdit, onDelete, onViewDetails }: RecipesTableProps) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-1 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink-900">메뉴 {recipes.length}개</h3>
          <p className="text-xs text-ink-500 mt-0.5">원가율로 메뉴별 수익성을 한눈에 확인하세요</p>
        </div>
      </div>

      {/* Card list */}
      <div className="divide-y divide-ink-50">
        {recipes.map((recipe) => {
          const totalCost = recipe.total_cost || 0;
          const sellPrice = recipe.selling_price || 0;
          const costRatio = sellPrice > 0 ? (totalCost / sellPrice) * 100 : 0;
          const profitMargin = recipe.profit_margin || 0;

          return (
            <div
              key={recipe.id}
              className="group px-5 py-4 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                  <ChefHat className="text-primary" size={20} />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-ink-900 truncate">{recipe.name}</h4>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ink-100 text-ink-700">
                      {recipe.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-ink-500">
                    <span>
                      판매 <span className="tabular-nums font-semibold text-ink-700">{formatPrice(sellPrice || 0)}</span>
                    </span>
                    <span className="text-ink-300">·</span>
                    <span>
                      원가 <span className="tabular-nums font-semibold text-ink-700">{formatPrice(totalCost)}</span>
                    </span>
                    {profitMargin > 0 && (
                      <>
                        <span className="text-ink-300">·</span>
                        <span>
                          수익률 <span className="tabular-nums font-semibold text-success">{profitMargin.toFixed(1)}%</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Cost ratio chip */}
                {sellPrice > 0 && (
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-full tabular-nums',
                        getCostRatioChipClass(costRatio)
                      )}
                    >
                      {costRatio.toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-ink-500 font-medium">
                      원가율 · {getCostRatioLabel(costRatio)}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onViewDetails(recipe)}
                    className="p-2 rounded-lg text-ink-500 hover:text-primary hover:bg-primary-50 transition-colors"
                    aria-label="상세 보기"
                    title="상세"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(recipe)}
                    className="p-2 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                    aria-label="수정"
                    title="수정"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(recipe.id)}
                    className="p-2 rounded-lg text-ink-500 hover:text-error hover:bg-error/10 transition-colors"
                    aria-label="삭제"
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-ink-500">등록된 레시피가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
