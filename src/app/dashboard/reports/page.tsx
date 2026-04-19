'use client';

import { useMemo, useState } from 'react';
import { mockIngredients, mockRecipes, mockSuppliers } from '@/lib/mock-data';
import { formatPrice, formatNumberToKorean } from '@/lib/utils/formatting';
import { PriceChange } from '@/components/ui/charts/PriceChange';
import { chartGridColor, chartSeriesColors, chartTextColor } from '@/lib/chart-colors';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ShoppingCart,
  Zap,
  RefreshCw,
  Download,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── 26주 멀티라인 시뮬레이션 (Phase 3 §3.5) ────────────────
function generateTrendSeries() {
  const weeks = 26;
  const make = (seed: number, amp: number, base = 100) => {
    const arr: number[] = [];
    let v = base;
    for (let i = 0; i < weeks; i++) {
      v += Math.sin(i / 3 + seed) * amp + i * 0.4 + Math.sin(i * seed) * 1.5;
      arr.push(v);
    }
    return arr;
  };
  const veg = make(0.5, 3);
  const meat = make(1.2, 2);
  const grain = make(0.2, 1);
  return Array.from({ length: weeks }, (_, i) => ({
    week: `W${i + 1}`,
    채소: Math.round(veg[i] * 10) / 10,
    육류: Math.round(meat[i] * 10) / 10,
    곡물: Math.round(grain[i] * 10) / 10,
  }));
}

// ─── 계절성 히트맵 데이터 (12개월 × 6 카테고리) ──────────────
const HEATMAP_CATEGORIES = ['채소', '육류', '생선', '유제품', '곡물', '조미료'];
const HEATMAP_MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const HEATMAP_DATA: number[][] = [
  [0.7, 0.8, 0.6, 0.3, 0.2, 0.3, 0.5, 0.8, 0.4, 0.2, 0.5, 0.7], // 채소
  [0.4, 0.5, 0.5, 0.5, 0.6, 0.7, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0], // 육류
  [0.3, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 0.9, 0.6, 0.4, 0.3, 0.5], // 생선
  [0.5, 0.5, 0.4, 0.4, 0.5, 0.6, 0.7, 0.7, 0.5, 0.4, 0.5, 0.6], // 유제품
  [0.3, 0.3, 0.3, 0.4, 0.4, 0.5, 0.6, 0.5, 0.4, 0.3, 0.3, 0.4], // 곡물
  [0.4, 0.4, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6, 0.5, 0.5, 0.6], // 조미료
];

const cellColor = (v: number) => {
  if (v < 0.33) return `rgba(31, 157, 85, ${0.15 + v * 1.5})`;
  if (v < 0.66) return `rgba(242, 169, 0, ${0.15 + (v - 0.33) * 2})`;
  return `rgba(255, 122, 0, ${0.25 + (v - 0.66) * 2})`;
};

const ACTION_ITEMS = [
  {
    tag: '매입 전략',
    icon: ShoppingCart,
    color: 'primary' as const,
    title: '마늘 선구매 권장',
    desc: '다음 4주간 +12% 상승 예측. 이번 주 내 2주치 재고 확보 시 ₩38만원 절약.',
  },
  {
    tag: '메뉴 조정',
    icon: Zap,
    color: 'warning' as const,
    title: '국밥 마진 재검토',
    desc: '돼지 사골 가격이 계속 상승 중. 판매가 500원 조정 또는 양 조절을 권장합니다.',
  },
  {
    tag: '공급처 변경',
    icon: RefreshCw,
    color: 'success' as const,
    title: '농협 하나로로 전환',
    desc: '양파·대파 최저가 계약 가능. 월 ₩124,000 절약이 예상됩니다.',
  },
];

const COLOR_BAR: Record<'primary' | 'warning' | 'success', string> = {
  primary: 'border-l-primary',
  warning: 'border-l-warning',
  success: 'border-l-success',
};
const COLOR_TEXT: Record<'primary' | 'warning' | 'success', string> = {
  primary: 'text-primary-600',
  warning: 'text-warning',
  success: 'text-success',
};
const COLOR_BG: Record<'primary' | 'warning' | 'success', string> = {
  primary: 'bg-primary-50 text-primary-700',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-success/10 text-success',
};

const PERIODS = ['1개월', '3개월', '26주', '1년'] as const;
type Period = typeof PERIODS[number];

export default function ReportsPageRoute() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('26주');

  // ── 데이터 계산 (기존 로직 유지) ────────────────────────
  const totalIngredients = mockIngredients.length;
  const totalRecipes = mockRecipes.length;
  const totalSuppliers = mockSuppliers.length;

  const averageIngredientCost =
    mockIngredients.reduce((sum, ing) => sum + ing.current_price, 0) / totalIngredients;
  const totalInventoryValue = mockIngredients.reduce(
    (sum, ing) => sum + ing.current_price * 10,
    0
  );

  const trendData = useMemo(() => generateTrendSeries(), []);
  const lastTrend = trendData[trendData.length - 1];

  const priceChanges = mockIngredients
    .filter((ing) => ing.price_history.length >= 2)
    .map((ing) => {
      const current = ing.price_history[ing.price_history.length - 1].price;
      const previous = ing.price_history[ing.price_history.length - 2].price;
      const change = (current - previous) / previous;
      return { name: ing.name, change, current, previous, category: ing.category };
    })
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  const upMovers = priceChanges.filter((p) => p.change > 0).slice(0, 5);
  const downMovers = priceChanges.filter((p) => p.change < 0).slice(0, 5);

  const downloadReport = (format: 'csv' | 'pdf') => {
    alert(`${format.toUpperCase()} 리포트를 다운로드합니다.`);
  };

  return (
    <div className="space-y-6">
      {/* ── 헤더 ─────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary-600">
            리포트
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
            시장 인사이트
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            당신의 메뉴 · 원가 · 시장 데이터를 교차 분석합니다
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-0.5 rounded-lg bg-ink-50 p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPeriod(p)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-bold transition-all',
                  selectedPeriod === p
                    ? 'bg-white text-ink-900 shadow-soft-1'
                    : 'text-ink-500 hover:text-ink-800'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => downloadReport('pdf')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-bold text-ink-700 hover:bg-ink-50"
          >
            <Download size={14} /> PDF
          </button>
          <button
            onClick={() => downloadReport('csv')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white shadow-brand hover:bg-primary-600"
          >
            <Download size={14} /> CSV
          </button>
        </div>
      </div>

      {/* ── 요약 카드 ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="총 재고 가치"
          value={formatNumberToKorean(totalInventoryValue)}
          accent="primary"
        />
        <SummaryCard
          label="평균 식자재 단가"
          value={formatPrice(averageIngredientCost)}
          accent="success"
        />
        <SummaryCard label="등록된 레시피" value={`${totalRecipes}개`} accent="violet" />
        <SummaryCard label="활성 공급업체" value={`${totalSuppliers}개`} accent="warning" />
      </div>

      {/* ── 26주 트렌드 차트 ─────────────────────── */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft-1">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary-600">
              26주 트렌드 · 카테고리별
            </div>
            <h2 className="mt-1 text-xl font-extrabold text-ink-900">
              시장 지수는 어떻게 움직이고 있나요?
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              2024 W27 기준(=100) 상대 가격 지수
            </p>
          </div>
          <div className="flex gap-5">
            <IndexBadge label="채소 지수" value={lastTrend.채소} color={chartSeriesColors[2]} />
            <IndexBadge label="육류 지수" value={lastTrend.육류} color={chartSeriesColors[5]} />
            <IndexBadge label="곡물 지수" value={lastTrend.곡물} color={chartSeriesColors[3]} />
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 8, right: 24, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: chartTextColor }}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartTextColor }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${chartGridColor}`,
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
              />
              <Line
                type="monotone"
                dataKey="채소"
                stroke={chartSeriesColors[2]}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="육류"
                stroke={chartSeriesColors[5]}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="곡물"
                stroke={chartSeriesColors[3]}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Movers (2 컬럼) ──────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MoversCard title="가격 급등 품목" subtitle="지난 4주" up items={upMovers} />
        <MoversCard title="가격 하락 품목" subtitle="지난 4주" up={false} items={downMovers} />
      </div>

      {/* ── 계절성 히트맵 ────────────────────────── */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft-1">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary-600">
              계절성 히트맵
            </div>
            <h2 className="mt-1 text-xl font-extrabold text-ink-900">
              언제 무엇이 비싸고, 언제 쌀까요?
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              최근 3년 평균 기준 — 메뉴 기획과 매입 타이밍 힌트
            </p>
          </div>
          <div className="max-w-xs rounded-xl bg-primary-50 px-4 py-3">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold text-primary-700">
              <Sparkles size={13} /> 인사이트
            </div>
            <p className="text-xs leading-relaxed text-primary-700">
              생선은 <b>7~8월</b>에 가장 비싸요. 여름 메뉴를 기획한다면{' '}
              <b>채소·곡물 중심</b>이 유리합니다.
            </p>
          </div>
        </div>

        <Heatmap />

        {/* 범례 */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-500">
          <span>낮음</span>
          <div className="flex gap-0.5">
            {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 0.95].map((v, i) => (
              <div
                key={i}
                className="h-3 w-7 rounded-sm"
                style={{ background: cellColor(v) }}
              />
            ))}
          </div>
          <span>높음</span>
        </div>
      </div>

      {/* ── 액션 아이템 3카드 ────────────────────── */}
      <div>
        <h3 className="mb-3 text-lg font-extrabold text-ink-900">이번 주 액션 아이템</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {ACTION_ITEMS.map((a, i) => {
            const IconCmp = a.icon;
            return (
              <div
                key={i}
                className={cn(
                  'rounded-2xl border border-l-4 bg-card p-5 shadow-soft-1',
                  COLOR_BAR[a.color]
                )}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl',
                      COLOR_BG[a.color]
                    )}
                  >
                    <IconCmp size={16} />
                  </div>
                  <span
                    className={cn(
                      'text-[11px] font-bold uppercase tracking-[0.12em]',
                      COLOR_TEXT[a.color]
                    )}
                  >
                    {a.tag}
                  </span>
                </div>
                <div className="text-base font-extrabold text-ink-900">{a.title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{a.desc}</p>
                <button
                  type="button"
                  className={cn(
                    'mt-3 inline-flex items-center text-xs font-bold hover:underline',
                    COLOR_TEXT[a.color]
                  )}
                >
                  자세히 보기 →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/* Sub components                              */
/* ─────────────────────────────────────────── */

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'primary' | 'success' | 'warning' | 'violet';
}) {
  const colors: Record<typeof accent, string> = {
    primary: 'text-primary-600',
    success: 'text-success',
    warning: 'text-warning',
    violet: 'text-[#8B5CF6]',
  };
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft-1">
      <div className="text-xs font-semibold text-ink-500">{label}</div>
      <div
        className={cn(
          'mt-2 text-2xl font-extrabold tracking-tight tabular-nums',
          colors[accent]
        )}
      >
        {value}
      </div>
    </div>
  );
}

function IndexBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-ink-500">{label}</div>
      <div
        className="text-2xl font-extrabold tabular-nums leading-tight"
        style={{ color }}
      >
        {value.toFixed(1)}
      </div>
    </div>
  );
}

function MoversCard({
  title,
  subtitle,
  up,
  items,
}: {
  title: string;
  subtitle: string;
  up: boolean;
  items: Array<{ name: string; change: number; current: number; category: string }>;
}) {
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft-1">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Icon
              size={16}
              className={up ? 'text-[#E8412D]' : 'text-[#1F9D55]'}
              strokeWidth={2.5}
            />
            <h3 className="text-base font-bold text-ink-900">{title}</h3>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[11px] font-bold',
            up ? 'bg-[#FDE5E1] text-[#E8412D]' : 'bg-[#DEF4E6] text-[#1F9D55]'
          )}
        >
          {items.length}개 품목
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((it, i) => (
          <div
            key={it.name}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
              i === 0 && (up ? 'bg-[#FDE5E1]/40' : 'bg-[#DEF4E6]/40')
            )}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-ink-100 text-[11px] font-bold text-ink-700">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-ink-900">{it.name}</div>
              <div className="text-[11px] text-ink-500 tabular-nums">
                {it.category} · {formatPrice(it.current)}
              </div>
            </div>
            <PriceChange change={it.change} chip size="sm" />
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-6 text-center text-xs text-ink-500">
            해당 기간에 변동 품목이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

function Heatmap() {
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: '70px repeat(12, minmax(0, 1fr))' }}
    >
      {/* Header row */}
      <div />
      {HEATMAP_MONTHS.map((m) => (
        <div
          key={m}
          className="text-center text-[11px] font-semibold text-ink-500"
        >
          {m}
        </div>
      ))}
      {/* Body */}
      {HEATMAP_CATEGORIES.map((cat, ci) => (
        <ContentRow key={cat} cat={cat} ci={ci} />
      ))}
    </div>
  );
}

function ContentRow({ cat, ci }: { cat: string; ci: number }) {
  return (
    <>
      <div className="flex items-center text-xs font-bold text-ink-700">{cat}</div>
      {HEATMAP_DATA[ci].map((v, mi) => (
        <div
          key={mi}
          title={`${cat} ${HEATMAP_MONTHS[mi]}: ${v > 0.66 ? '+' : v < 0.33 ? '−' : ''}${(v * 30).toFixed(1)}%`}
          className="flex h-10 cursor-pointer items-center justify-center rounded-md text-[11px] font-bold transition-transform hover:scale-110"
          style={{
            background: cellColor(v),
            color: v > 0.5 ? '#fff' : 'hsl(var(--foreground))',
          }}
        >
          {v > 0.7 ? '↑' : v < 0.3 ? '↓' : ''}
        </div>
      ))}
    </>
  );
}
