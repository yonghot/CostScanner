/**
 * 차트 색상 팔레트 (Recharts / 커스텀 SVG 공통)
 * design-gap G7 + 2026 리디자인
 *
 * 사용 예:
 *   import { chartSeriesColors } from '@/lib/chart-colors';
 *   <Line stroke={chartSeriesColors[0]} />
 */

export const chartSeriesColors = [
  '#FF7A00', // 1. primary (JNF orange)
  '#F2A900', // 2. gold
  '#1F9D55', // 3. green
  '#2B6CB0', // 4. blue
  '#8B5CF6', // 5. violet
  '#E8412D', // 6. red
] as const;

export const chartGridColor = 'hsl(42 30% 91%)';
export const chartTextColor = 'hsl(30 12% 53%)';

/**
 * 한국형 금융 UX — 가격 변동 색상
 * 상승 = 빨강, 하락 = 초록 (절약)
 */
export const priceColors = {
  up: '#E8412D',
  upBg: '#FDE5E1',
  down: '#1F9D55',
  downBg: '#DEF4E6',
  neutral: '#94897A',
  neutralBg: '#F2EEE6',
  warning: '#F2A900',
  warningBg: '#FEF3D4',
} as const;

export const ingredientCategoryColors: Record<string, string> = {
  vegetables: '#1F9D55',
  fruits: '#FF7A00',
  meat: '#E8412D',
  seafood: '#2B6CB0',
  dairy: '#F2A900',
  grains: '#8D6E63',
  seasonings: '#8B5CF6',
  beverages: '#7E57C2',
  processed: '#FF9333',
  other: '#94897A',
};
