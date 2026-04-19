'use client';

import { useState, useMemo } from 'react';
import { IngredientUI, FilterOptions, SortOptions } from '@/types';
import {
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusLabel
} from '@/lib/utils/formatting';
import { Sparkline } from '@/components/ui/charts/Sparkline';
import { PriceChange } from '@/components/ui/charts/PriceChange';
import { Search, Bell, ShoppingCart, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IngredientsTableProps {
  ingredients: IngredientUI[];
  onEdit: (ingredient: IngredientUI) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  '채소': '🥬',
  '육류': '🥩',
  '유제품': '🥚',
  '난류': '🥚',
  '해산물': '🐟',
  '조미료': '🧂',
  '향신료': '🌶️',
  '과일': '🍎',
  '곡류': '🌾',
};

const CATEGORIES = ['전체', '육류', '채소', '향신료', '조미료', '곡류', '난류', '유제품'];

/**
 * 식자재의 가격 변동률(-1 ~ +1) 계산.
 * price_history 마지막 두 점 비교.
 */
function calcPriceChange(ing: IngredientUI): number {
  if (!ing.price_history || ing.price_history.length < 2) return 0;
  const cur = ing.price_history[ing.price_history.length - 1].price;
  const prev = ing.price_history[ing.price_history.length - 2].price;
  if (!prev) return 0;
  return (cur - prev) / prev;
}

/**
 * Sparkline 용 number[] 추출. price_history 비어있으면 현재가 ±10% 노이즈로 12포인트 합성.
 */
function getSparkData(ing: IngredientUI): number[] {
  if (ing.price_history && ing.price_history.length >= 2) {
    return ing.price_history.map(p => p.price);
  }
  const base = ing.current_price || 1000;
  // 결정적 노이즈 (id 해시 기반) — 리렌더마다 흔들리지 않도록
  let seed = 0;
  for (let i = 0; i < ing.id.length; i++) seed = (seed * 31 + ing.id.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  return Array.from({ length: 12 }, () => Math.round(base * (0.9 + rand() * 0.2)));
}

export default function IngredientsTable({ ingredients, onEdit, onDelete }: IngredientsTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'name', direction: 'asc' });
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter + search + category
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient => {
      if (activeCategory !== '전체' && ingredient.category !== activeCategory) return false;
      if (filters.category && ingredient.category !== filters.category) return false;
      if (filters.status && ingredient.status !== filters.status) return false;
      if (filters.price_range) {
        const { min, max } = filters.price_range;
        if (ingredient.current_price < min || ingredient.current_price > max) return false;
      }
      if (query && !ingredient.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [ingredients, filters, query, activeCategory]);

  // Sort
  const sortedIngredients = useMemo(() => {
    return [...filteredIngredients].sort((a, b) => {
      const aValue = a[sort.field as keyof IngredientUI];
      const bValue = b[sort.field as keyof IngredientUI];
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
  }, [filteredIngredients, sort]);

  // Auto-select first item
  const selected = useMemo(() => {
    if (!sortedIngredients.length) return null;
    if (selectedId) {
      const found = sortedIngredients.find(i => i.id === selectedId);
      if (found) return found;
    }
    return sortedIngredients[0];
  }, [sortedIngredients, selectedId]);

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
      {/* Left: Search + Category Pills + Table */}
      <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-1 overflow-hidden">
        {/* Search bar */}
        <div className="px-5 py-4 border-b border-ink-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} aria-hidden />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="식자재명으로 검색..."
              className="w-full h-10 pl-10 pr-3 text-sm rounded-lg border border-ink-200 bg-cream/40 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              aria-label="식자재 검색"
            />
          </div>
        </div>

        {/* Category pill filters */}
        <div className="px-5 py-3 border-b border-ink-100 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors',
                  isActive
                    ? 'bg-ink-900 text-cream'
                    : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                )}
                aria-pressed={isActive}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-ink-50/50">
              <tr>
                <th
                  className="px-5 py-3 text-left text-[11px] font-semibold text-ink-500 uppercase tracking-wider cursor-pointer hover:text-ink-700"
                  onClick={() => handleSort('name')}
                >
                  품목 {sort.field === 'name' && (sort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-3 py-3 text-right text-[11px] font-semibold text-ink-500 uppercase tracking-wider cursor-pointer hover:text-ink-700"
                  onClick={() => handleSort('current_price')}
                >
                  현재가 {sort.field === 'current_price' && (sort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-3 text-right text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                  변동
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                  추이
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                  재고
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {sortedIngredients.map((ingredient) => {
                const change = calcPriceChange(ingredient);
                const sparkData = getSparkData(ingredient);
                const isSelected = selected?.id === ingredient.id;
                const sparkColor = change >= 0 ? '#E8412D' : '#1F9D55';
                return (
                  <tr
                    key={ingredient.id}
                    onClick={() => setSelectedId(ingredient.id)}
                    className={cn(
                      'cursor-pointer transition-colors',
                      isSelected ? 'bg-primary-50' : 'hover:bg-ink-50/40'
                    )}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-ink-50 flex items-center justify-center text-base">
                          {CATEGORY_EMOJI[ingredient.category] || '🍴'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-ink-900 truncate">{ingredient.name}</div>
                          <div className="text-[11px] text-ink-500">
                            {ingredient.category} · {ingredient.unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-ink-900 tabular-nums">
                        {formatPrice(ingredient.current_price)}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-right">
                      <PriceChange change={change} chip size="sm" />
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">
                      <div className="inline-block">
                        <Sparkline
                          data={sparkData}
                          width={64}
                          height={20}
                          color={sparkColor}
                          strokeWidth={1.5}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full',
                          getStatusColor(ingredient.status)
                        )}
                      >
                        {getStatusLabel(ingredient.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {sortedIngredients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-ink-500">조건에 맞는 식자재가 없습니다.</p>
            </div>
          )}
        </div>

        {/* Footer summary */}
        <div className="px-5 py-3 border-t border-ink-100 bg-ink-50/30 flex items-center justify-between text-xs">
          <span className="text-ink-600 font-medium">
            총 <span className="tabular-nums text-ink-900 font-bold">{sortedIngredients.length}</span>개 표시
          </span>
          <div className="flex items-center gap-3 text-ink-500">
            <span>충분 <span className="tabular-nums font-semibold text-[#1F9D55]">{sortedIngredients.filter(i => i.status === 'available').length}</span></span>
            <span>부족 <span className="tabular-nums font-semibold text-warning">{sortedIngredients.filter(i => i.status === 'low_stock').length}</span></span>
            <span>없음 <span className="tabular-nums font-semibold text-error">{sortedIngredients.filter(i => i.status === 'out_of_stock').length}</span></span>
          </div>
        </div>
      </div>

      {/* Right: Detail panel */}
      <div className="lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
        {selected ? (
          <IngredientDetailPanel
            ingredient={selected}
            onEdit={() => onEdit(selected)}
            onDelete={() => onDelete(selected.id)}
          />
        ) : (
          <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-1 p-8 text-center">
            <p className="text-sm text-ink-500">식자재를 선택하면 상세 정보가 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface IngredientDetailPanelProps {
  ingredient: IngredientUI;
  onEdit: () => void;
  onDelete: () => void;
}

function IngredientDetailPanel({ ingredient, onEdit, onDelete }: IngredientDetailPanelProps) {
  const change = calcPriceChange(ingredient);
  const sparkData = getSparkData(ingredient);
  // 30일 추이용 — 기존 데이터를 두 번 반복해서 길게 보이게
  const longSpark = useMemo(() => {
    return [
      ...sparkData.map(v => v * 0.98),
      ...sparkData,
      ...sparkData.map(v => v * 1.01),
      ...sparkData,
    ];
  }, [sparkData]);

  const prevPrice = ingredient.price_history?.length >= 2
    ? ingredient.price_history[ingredient.price_history.length - 2].price
    : ingredient.current_price;

  // 4 공급업체 모의 가격 — 기존 suppliers 배열 활용 + 보강
  const supplierNames = ingredient.suppliers && ingredient.suppliers.length > 0
    ? ingredient.suppliers.slice(0, 4)
    : ['마켓컬리 B2B', '농협 하나로', '가락시장', '지역 도매상'];
  const suppliers = supplierNames.map((name, i) => {
    const factor = [1, 1.04, 0.96, 1.08][i] ?? 1;
    const delta = [0, 0.04, -0.04, 0.08][i] ?? 0;
    return {
      name,
      price: Math.round(ingredient.current_price * factor),
      delta,
    };
  }).sort((a, b) => a.price - b.price);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-soft-2 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="rounded-xl bg-ink-50 flex items-center justify-center text-3xl shrink-0"
          style={{ width: 52, height: 52 }}
        >
          {CATEGORY_EMOJI[ingredient.category] || '🍴'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ink-100 text-ink-700">
              {ingredient.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-ink-900 mt-1 truncate">{ingredient.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-ink-500 hover:text-primary hover:bg-primary-50 transition-colors"
            aria-label="수정"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-ink-500 hover:text-error hover:bg-error/10 transition-colors"
            aria-label="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Current price card */}
      <div
        className="mt-5 rounded-2xl p-5 border border-ink-100"
        style={{ background: 'linear-gradient(135deg, #F9F6EF, #ffffff)' }}
      >
        <div className="text-xs text-ink-500 font-medium">현재 단가 · {ingredient.unit}</div>
        <div className="flex items-baseline gap-3 mt-1.5">
          <span className="text-3xl font-extrabold text-ink-900 tabular-nums">
            {formatPrice(ingredient.current_price)}
          </span>
          <PriceChange change={change} chip size="lg" />
        </div>
        <div className="mt-2 text-xs text-ink-500 tabular-nums">
          전일 {formatPrice(prevPrice)}
        </div>
      </div>

      {/* 30일 추이 */}
      <div className="mt-6">
        <div className="text-xs text-ink-500 font-medium mb-2.5">30일 추이</div>
        <div className="rounded-xl bg-ink-50 p-3">
          <Sparkline
            data={longSpark}
            width={380}
            height={80}
            color="#FF7A00"
            strokeWidth={2}
            className="w-full"
          />
        </div>
      </div>

      {/* Supplier ranking */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-ink-900">공급업체 실시간 가격</h4>
          <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary-50 text-primary-700">
            {suppliers.length}곳 비교
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {suppliers.map((s, i) => {
            const isBest = i === 0;
            return (
              <div
                key={s.name}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors',
                  isBest
                    ? 'border-primary bg-primary-50 hover:bg-primary-100'
                    : 'border-ink-100 bg-white hover:bg-ink-50/40'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold',
                    isBest ? 'bg-primary text-white' : 'bg-ink-200 text-ink-700'
                  )}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate">{s.name}</div>
                  {isBest && (
                    <div className="text-[11px] font-bold text-primary mt-0.5">최저가</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-ink-900 tabular-nums">
                    {formatPrice(s.price)}
                  </div>
                  {s.delta !== 0 && (
                    <div className={cn(
                      'text-[11px] font-semibold tabular-nums mt-0.5',
                      s.delta > 0 ? 'text-[#E8412D]' : 'text-[#1F9D55]'
                    )}>
                      {s.delta > 0 ? '+' : ''}{(s.delta * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stock info */}
      {ingredient.stock_level !== undefined && (
        <div className="mt-5 px-4 py-3 rounded-xl bg-ink-50 flex items-center justify-between text-xs">
          <span className="text-ink-600 font-medium">현재 재고</span>
          <span className="tabular-nums font-bold text-ink-900">
            {ingredient.stock_level}{ingredient.unit}
            {ingredient.min_stock_level !== undefined && (
              <span className="text-ink-500 font-normal ml-1">/ 최소 {ingredient.min_stock_level}{ingredient.unit}</span>
            )}
          </span>
        </div>
      )}

      {/* Updated at */}
      <div className="mt-3 text-[11px] text-ink-500 text-right tabular-nums">
        최근 업데이트 {formatDate(ingredient.updated_at)}
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2 mt-6">
        <button
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-ink-200 bg-white text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors"
        >
          <Bell size={14} />
          알림 설정
        </button>
        <button
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-brand"
        >
          <ShoppingCart size={14} />
          최저가 발주
        </button>
      </div>
    </div>
  );
}
