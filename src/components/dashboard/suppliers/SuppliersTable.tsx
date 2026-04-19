'use client';

import { useMemo, useState } from 'react';
import { SupplierUI, FilterOptions, SortOptions } from '@/types';
import {
  formatDate,
  formatPhoneNumber,
  formatPrice,
  generateStars,
} from '@/lib/utils/formatting';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScatterQuadrant } from '@/components/ui/charts/ScatterQuadrant';
import { RadarChart } from '@/components/ui/charts/RadarChart';
import { Sparkline } from '@/components/ui/charts/Sparkline';
import { chartSeriesColors } from '@/lib/chart-colors';
import { LayoutGrid, List, Phone, Pencil, Trash2, Sparkles } from 'lucide-react';
import {
  Bar,
  BarChart as RBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

interface SuppliersTableProps {
  suppliers: SupplierUI[];
  onEdit: (supplier: SupplierUI) => void;
  onDelete: (id: string) => void;
  onContact: (supplier: SupplierUI) => void;
}

/**
 * 공급업체 종합 점수 계산 — Mock 가중치 기반.
 * 실제 백엔드 데이터로 교체 가능하도록 단일 함수로 분리.
 */
type SupplierScore = {
  priceScore: number;     // 0..1 (가격 경쟁력)
  reliabilityScore: number; // 0..1 (신뢰도)
  speedScore: number;     // 0..1 (배송 속도)
  qualityScore: number;   // 0..1 (품질)
  varietyScore: number;   // 0..1 (다양성)
  totalScore: number;     // 0..1 (종합)
  color: string;          // 매트릭스/배지 컬러
};

function scoreSupplier(s: SupplierUI, idx: number): SupplierScore {
  // rating(0..5) → 품질, 신뢰도 베이스
  const r = Math.max(0, Math.min(5, s.rating)) / 5;
  // delivery_time 텍스트에서 속도 추정
  const dt = s.delivery_time || '';
  const speedScore = dt.includes('당일')
    ? 0.95
    : dt.includes('1-2')
    ? 0.78
    : dt.includes('2-3')
    ? 0.55
    : 0.5;
  // 최소주문금액 낮을수록 가격 점수 높음 (0.65 base)
  const priceScore = Math.max(0.1, 1 - Math.min(1, (s.min_order || 0) / 250000));
  // specialties 다양성
  const varietyScore = Math.min(1, (s.specialties?.length || 1) / 5);
  // 신뢰도 = rating + 활성여부 보너스
  const reliabilityScore = Math.min(1, r + (s.is_active ? 0.05 : -0.1));
  const qualityScore = r;
  const totalScore =
    priceScore * 0.4 + reliabilityScore * 0.3 + qualityScore * 0.3;
  return {
    priceScore,
    reliabilityScore,
    speedScore,
    qualityScore,
    varietyScore,
    totalScore,
    color: chartSeriesColors[idx % chartSeriesColors.length],
  };
}

/** 대표 품목 가격 mock — 공급업체 상세 카드용 */
const REPRESENTATIVE_ITEMS: Array<{ name: string; price: number; ratio: number }> = [
  { name: '양파',     price: 1850, ratio: 0.72 },
  { name: '대파',     price: 2380, ratio: 0.85 },
  { name: '한우등심', price: 12800, ratio: 0.6 },
  { name: '계란',     price: 7200, ratio: 0.78 },
  { name: '감자',     price: 1640, ratio: 0.68 },
];

/** 12개월 배송 기록 mock */
const DELIVERY_HISTORY = [
  { month: '1', count: 12 },
  { month: '2', count: 15 },
  { month: '3', count: 14 },
  { month: '4', count: 13 },
  { month: '5', count: 16 },
  { month: '6', count: 17 },
  { month: '7', count: 15 },
  { month: '8', count: 14 },
  { month: '9', count: 16 },
  { month: '10', count: 15 },
  { month: '11', count: 17 },
  { month: '12', count: 16 },
];

export default function SuppliersTable({
  suppliers,
  onEdit,
  onDelete,
  onContact,
}: SuppliersTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'name', direction: 'asc' });
  const [selectedId, setSelectedId] = useState<string | null>(suppliers[0]?.id ?? null);
  const [tab, setTab] = useState<'matrix' | 'list'>('matrix');

  // ── Filter ─────────────────────────────────────
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      if (filters.status) {
        const isActive = filters.status === 'active';
        if ((isActive && !supplier.is_active) || (!isActive && supplier.is_active)) {
          return false;
        }
      }
      return true;
    });
  }, [suppliers, filters]);

  // ── Sort ───────────────────────────────────────
  const sortedSuppliers = useMemo(() => {
    return [...filteredSuppliers].sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sort.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'min_order':
          aValue = a.min_order;
          bValue = b.min_order;
          break;
        case 'total_orders':
          aValue = a.total_orders || 0;
          bValue = b.total_orders || 0;
          break;
        case 'last_order_date':
          aValue = new Date(a.last_order_date || '1900-01-01');
          bValue = new Date(b.last_order_date || '1900-01-01');
          break;
        default:
          aValue = a[sort.field as keyof SupplierUI];
          bValue = b[sort.field as keyof SupplierUI];
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue, 'ko-KR')
          : bValue.localeCompare(aValue, 'ko-KR');
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      return 0;
    });
  }, [filteredSuppliers, sort]);

  // ── Score map (memoized) ───────────────────────
  const scoreMap = useMemo(() => {
    const map = new Map<string, SupplierScore>();
    sortedSuppliers.forEach((s, i) => map.set(s.id, scoreSupplier(s, i)));
    return map;
  }, [sortedSuppliers]);

  const selected =
    sortedSuppliers.find((s) => s.id === selectedId) ?? sortedSuppliers[0];
  const selectedScore = selected ? scoreMap.get(selected.id) : undefined;

  // ── Quadrant points ────────────────────────────
  const quadrantPoints = useMemo(() => {
    return sortedSuppliers.map((s) => {
      const sc = scoreMap.get(s.id)!;
      return {
        id: s.id,
        x: sc.priceScore,
        y: sc.qualityScore,
        r: 10 + sc.speedScore * 18,
        label: s.name.slice(0, 2),
        color: sc.color,
      };
    });
  }, [sortedSuppliers, scoreMap]);

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft-1">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-ink-900">필터</h3>
          <button
            onClick={() => setFilters({})}
            className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50"
          >
            초기화
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">상태</label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: (e.target.value as any) || undefined,
                }))
              }
              className="w-full rounded-md border border-ink-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">전체</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="pending">대기</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">전문 분야</label>
            <select className="w-full rounded-md border border-ink-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">전체</option>
              <option value="육류">육류</option>
              <option value="채소">채소</option>
              <option value="과일">과일</option>
              <option value="해산물">해산물</option>
              <option value="곡류">곡류</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">평점 기준</label>
            <select className="w-full rounded-md border border-ink-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">전체</option>
              <option value="4.5">4.5점 이상</option>
              <option value="4.0">4.0점 이상</option>
              <option value="3.5">3.5점 이상</option>
              <option value="3.0">3.0점 이상</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs: Matrix / List */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'matrix' | 'list')}>
        <TabsList>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <LayoutGrid size={14} />
            매트릭스
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List size={14} />
            리스트
          </TabsTrigger>
        </TabsList>

        {/* ── 매트릭스 뷰 ─────────────────────────── */}
        <TabsContent value="matrix">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
            {/* Quadrant card */}
            <div className="rounded-2xl border bg-card p-6 shadow-soft-1">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">가격 vs 품질 매트릭스</h3>
                  <p className="mt-0.5 text-sm text-ink-500">원 크기 = 배송 신뢰도</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                  <Sparkles size={12} />
                  AI 추천
                </span>
              </div>
              <ScatterQuadrant
                points={quadrantPoints}
                xLabel="← 저가     가격     고가 →"
                yLabel="← 낮음     품질     높음 →"
                idealQuadrant="tl"
                onPointClick={(p) => p.id && setSelectedId(p.id)}
              />
            </div>

            {/* Ranking */}
            <div className="rounded-2xl border bg-card shadow-soft-1">
              <div className="border-b border-ink-100 p-5">
                <h3 className="text-lg font-bold text-ink-900">종합 랭킹</h3>
                <p className="mt-0.5 text-sm text-ink-500">
                  가격 40% · 신뢰도 30% · 품질 30%
                </p>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {[...sortedSuppliers]
                  .sort(
                    (a, b) =>
                      (scoreMap.get(b.id)?.totalScore ?? 0) -
                      (scoreMap.get(a.id)?.totalScore ?? 0)
                  )
                  .map((s, i) => {
                    const sc = scoreMap.get(s.id)!;
                    const isActive = s.id === selected?.id;
                    const isTop = i < 3;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedId(s.id)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                          isActive
                            ? 'border-primary bg-primary-50/70'
                            : 'border-ink-100 bg-white hover:border-ink-200'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold tabular-nums',
                            isTop ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600'
                          )}
                        >
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-bold text-ink-900">{s.name}</div>
                          <div className="mt-1 flex items-center gap-2.5 text-xs text-ink-500">
                            <span>
                              가격{' '}
                              <b className="text-ink-800 tabular-nums">
                                {Math.round(sc.priceScore * 100)}
                              </b>
                            </span>
                            <span>
                              신뢰{' '}
                              <b className="text-ink-800 tabular-nums">
                                {Math.round(sc.reliabilityScore * 100)}
                              </b>
                            </span>
                            <span>
                              품질{' '}
                              <b className="text-ink-800 tabular-nums">
                                {Math.round(sc.qualityScore * 100)}
                              </b>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-extrabold text-ink-900 tabular-nums">
                            {Math.round(sc.totalScore * 100)}
                          </div>
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                            종합
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* 선택된 공급업체 상세 — 3 카드 */}
          {selected && selectedScore && (
            <SupplierDetailCards
              supplier={selected}
              score={selectedScore}
              onEdit={onEdit}
              onContact={onContact}
              onDelete={onDelete}
            />
          )}
        </TabsContent>

        {/* ── 리스트 뷰 ─────────────────────────── */}
        <TabsContent value="list">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-soft-1">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-ink-100">
                <thead className="bg-ink-50">
                  <tr>
                    <SortHeader
                      label="공급업체명"
                      field="name"
                      sort={sort}
                      onSort={handleSort}
                    />
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      30일 추이
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      연락처
                    </th>
                    <SortHeader
                      label="평점"
                      field="rating"
                      sort={sort}
                      onSort={handleSort}
                    />
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      전문 분야
                    </th>
                    <SortHeader
                      label="최소주문"
                      field="min_order"
                      sort={sort}
                      onSort={handleSort}
                    />
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      배송
                    </th>
                    <SortHeader
                      label="총 주문"
                      field="total_orders"
                      sort={sort}
                      onSort={handleSort}
                    />
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      상태
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 bg-card">
                  {sortedSuppliers.map((supplier) => {
                    const sc = scoreMap.get(supplier.id)!;
                    // 미니 trend (스파크라인) — total_orders 기반 가짜 시계열
                    const trend = Array.from({ length: 8 }, (_, i) => {
                      const base = (supplier.total_orders ?? 50) / 10;
                      return base + Math.sin(i + supplier.name.length) * 1.5;
                    });
                    return (
                      <tr key={supplier.id} className="hover:bg-ink-50/50">
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-white"
                              style={{ background: sc.color }}
                            >
                              {supplier.name[0]}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-ink-900">
                                {supplier.name}
                              </div>
                              <div className="text-xs text-ink-500">
                                담당: {supplier.contact_person || '미지정'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Sparkline
                            data={trend}
                            width={80}
                            height={28}
                            color={sc.color}
                            strokeWidth={1.5}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-sm text-ink-800">
                            <div className="tabular-nums">
                              {formatPhoneNumber(supplier.phone || '')}
                            </div>
                            <div className="text-xs text-ink-500">
                              {supplier.email || ''}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold tabular-nums text-ink-900">
                              {supplier.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-warning">
                              {generateStars(supplier.rating)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {supplier.specialties.slice(0, 2).map((s, i) => (
                              <span
                                key={i}
                                className="inline-flex rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700"
                              >
                                {s}
                              </span>
                            ))}
                            {supplier.specialties.length > 2 && (
                              <span className="inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                                +{supplier.specialties.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-ink-800">
                          {formatPrice(supplier.min_order)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-800">
                          {supplier.delivery_time}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-sm font-bold tabular-nums text-ink-900">
                            {supplier.total_orders || 0}회
                          </div>
                          {supplier.last_order_date && (
                            <div className="text-xs text-ink-500">
                              {formatDate(supplier.last_order_date, 'MM/DD')}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold',
                              supplier.is_active
                                ? 'bg-success/10 text-success'
                                : 'bg-ink-100 text-ink-600'
                            )}
                          >
                            {supplier.is_active ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onContact(supplier)}
                              className="rounded-md p-1.5 text-success hover:bg-success/10"
                              aria-label="연락"
                            >
                              <Phone size={15} />
                            </button>
                            <button
                              onClick={() => onEdit(supplier)}
                              className="rounded-md p-1.5 text-primary hover:bg-primary-50"
                              aria-label="수정"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => onDelete(supplier.id)}
                              className="rounded-md p-1.5 text-error hover:bg-error/10"
                              aria-label="삭제"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {sortedSuppliers.length === 0 && (
              <div className="py-10 text-center text-sm text-ink-500">
                조건에 맞는 공급업체가 없습니다.
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-5 rounded-2xl border border-success/20 bg-success/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-success">
                총 {sortedSuppliers.length}개 공급업체
              </span>
              <div className="flex items-center gap-4 tabular-nums">
                <span className="text-success">
                  활성 {sortedSuppliers.filter((s) => s.is_active).length}개
                </span>
                <span className="text-ink-500">
                  비활성 {sortedSuppliers.filter((s) => !s.is_active).length}개
                </span>
                <span className="text-primary">
                  평균 평점{' '}
                  {(
                    sortedSuppliers.reduce((sum, s) => sum + s.rating, 0) /
                    Math.max(1, sortedSuppliers.length)
                  ).toFixed(1)}
                  점
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* Sortable header                                          */
/* ──────────────────────────────────────────────────────── */
function SortHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: string;
  sort: SortOptions;
  onSort: (f: string) => void;
}) {
  const active = sort.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer select-none px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500 hover:bg-ink-100"
    >
      {label}
      {active && <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}

/* ──────────────────────────────────────────────────────── */
/* 선택된 공급업체 상세 카드 (3개)                          */
/* ──────────────────────────────────────────────────────── */
function SupplierDetailCards({
  supplier,
  score,
  onContact,
  onEdit,
  onDelete,
}: {
  supplier: SupplierUI;
  score: SupplierScore;
  onContact: (s: SupplierUI) => void;
  onEdit: (s: SupplierUI) => void;
  onDelete: (id: string) => void;
}) {
  // 미니 RadarChart 60×60 미사용 — 큰 240px 사이즈로 상세 카드에서 사용
  return (
    <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* 1. 다차원 점수 — Radar */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft-1">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-extrabold text-white"
            style={{ background: score.color }}
          >
            {supplier.name[0]}
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-bold text-ink-900">
              {supplier.name}
            </div>
            <div className="text-xs text-ink-500">
              {supplier.address?.split(' ')[0] || '서울'} ·{' '}
              {supplier.delivery_time || '미지정'} · {supplier.total_orders ?? 0}회 거래
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <RadarChart
            axes={['가격', '신뢰', '속도', '품질', '다양성']}
            values={[
              score.priceScore,
              score.reliabilityScore,
              score.speedScore,
              score.qualityScore,
              score.varietyScore,
            ]}
            compareValues={[0.5, 0.6, 0.6, 0.6, 0.5]}
            size={240}
            color={score.color}
          />
        </div>
        <div className="mt-2 text-center text-[11px] text-ink-500">
          점선 = 시장 평균 비교
        </div>
      </div>

      {/* 2. 대표 품목 가격 */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft-1">
        <h4 className="text-base font-bold text-ink-900">가격 비교 · 대표 품목</h4>
        <p className="mb-3 mt-0.5 text-xs text-ink-500">
          시장 평균 대비 이 공급처의 가격 비율
        </p>
        <div className="flex flex-col gap-2.5">
          {REPRESENTATIVE_ITEMS.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-sm font-semibold text-ink-800">
                {item.name}
              </span>
              <div className="flex flex-1 items-center gap-2">
                <div className="relative h-2 flex-1 rounded-full bg-ink-100">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${Math.round(item.ratio * 100)}%`,
                      background: score.color,
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-sm font-bold tabular-nums text-ink-900">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-success/10 px-3 py-2.5 text-sm font-semibold text-success">
          이 공급처 전환 시 월 ₩124,000 절약 예상
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onContact(supplier)}
            className="flex-1 rounded-lg bg-success px-3 py-2 text-xs font-bold text-white hover:opacity-90"
          >
            연락하기
          </button>
          <button
            onClick={() => onEdit(supplier)}
            className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-xs font-bold text-ink-700 hover:bg-ink-50"
          >
            수정
          </button>
          <button
            onClick={() => onDelete(supplier.id)}
            className="rounded-lg border border-error/30 px-2.5 py-2 text-error hover:bg-error/10"
            aria-label="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* 3. 배송 기록 */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft-1">
        <h4 className="text-base font-bold text-ink-900">배송 기록</h4>
        <p className="mb-3 mt-0.5 text-xs text-ink-500">최근 12개월 월별 건수</p>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RBarChart
              data={DELIVERY_HISTORY}
              margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
            >
              <CartesianGrid stroke="hsl(42 30% 91%)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: 'hsl(30 12% 53%)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(30 12% 53%)' }}
                tickLine={false}
                axisLine={false}
              />
              <RTooltip
                cursor={{ fill: 'hsl(42 30% 91% / 0.4)' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid hsl(42 30% 91%)',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill={chartSeriesColors[0]} />
            </RBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              정시율
            </div>
            <div className="mt-0.5 flex items-baseline gap-1 text-2xl font-extrabold tabular-nums text-ink-900">
              96<span className="text-sm font-bold text-ink-500">%</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              평균 지연
            </div>
            <div className="mt-0.5 flex items-baseline gap-1 text-2xl font-extrabold tabular-nums text-ink-900">
              12<span className="text-sm font-bold text-ink-500">분</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              클레임
            </div>
            <div className="mt-0.5 flex items-baseline gap-1 text-2xl font-extrabold tabular-nums text-ink-900">
              2<span className="text-sm font-bold text-ink-500">건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
