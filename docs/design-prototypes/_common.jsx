// Shared React components — loaded by every prototype page.
// Exposes: Sidebar, TopBar, Sparkline, AreaMini, BarMini, Donut, RadarChart, StackedBar, Scatter,
// Icon, Logo, fmtKRW, fmtPct, cn, ingredientSeed

const { useState, useEffect, useMemo, useRef } = React;

// ── Utilities ─────────────────────────────────────────────
window.cn = (...a) => a.filter(Boolean).join(' ');
window.fmtKRW = (n, { short = false } = {}) => {
  if (n == null || isNaN(n)) return '—';
  if (short && Math.abs(n) >= 1e8) return (n / 1e8).toFixed(1).replace(/\.0$/, '') + '억';
  if (short && Math.abs(n) >= 1e4) return (n / 1e4).toFixed(1).replace(/\.0$/, '') + '만';
  return '₩' + Math.round(n).toLocaleString('ko-KR');
};
window.fmtPct = (n, { sign = true, digits = 1 } = {}) => {
  if (n == null || isNaN(n)) return '—';
  const s = (n * 100).toFixed(digits).replace(/\.0$/, '');
  return (sign && n > 0 ? '+' : '') + s + '%';
};
window.fmtInt = (n) => (n ?? 0).toLocaleString('ko-KR');

// ── Icon (lucide-style inline SVG) ────────────────────────
const iconPaths = {
  home: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10',
  package: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v10',
  building: 'M3 21V7a2 2 0 012-2h4V3h6v2h4a2 2 0 012 2v14M9 21V9M15 21V9M7 21h10M7 13h2M7 17h2M15 13h2M15 17h2',
  chef: 'M6 14h12v7H6zM17 10a3 3 0 00-1.5-5.2A3 3 0 0012 3a3 3 0 00-3.5 1.8A3 3 0 007 10v4h10v-4z',
  chart: 'M3 21h18M5 21V11m4 10V7m4 14v-6m4 6V5m4 16v-9',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.65 1.65 0 00-1.8-.3 1.65 1.65 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.65 1.65 0 00-1-1.5 1.65 1.65 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.65 1.65 0 00.3-1.8 1.65 1.65 0 00-1.5-1H3a2 2 0 110-4h.1a1.65 1.65 0 001.5-1 1.65 1.65 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.65 1.65 0 001.8.3H9a1.65 1.65 0 001-1.5V3a2 2 0 114 0v.1a1.65 1.65 0 001 1.5 1.65 1.65 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.65 1.65 0 00-.3 1.8V9a1.65 1.65 0 001.5 1H21a2 2 0 110 4h-.1a1.65 1.65 0 00-1.5 1z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  up: 'M7 17l10-10M7 7h10v10',
  down: 'M7 7l10 10M17 7v10H7',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  arrowDown: 'M12 5v14M5 12l7 7 7-7',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  filter: 'M3 4h18M6 12h12M10 20h4',
  calendar: 'M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6zM3 10h18M8 2v4M16 2v4',
  dot: 'M12 12m-4 0a4 4 0 108 0 4 4 0 10-8 0',
  menu: 'M3 6h18M3 12h18M3 18h18',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 15a3 3 0 100-6 3 3 0 000 6z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  radar: 'M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07 M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0 M12 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  info: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01',
  sparkle: 'M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM5 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z',
  refresh: 'M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  external: 'M14 3h7v7M10 14L21 3M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5',
  trending: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  scale: 'M6 20v-8M6 8V4M6 20h12M18 20v-8M18 8V4M2 12h8M14 12h8M6 4v0M18 4v0',
  cart: 'M3 3h2l2.4 12.3a2 2 0 002 1.7h9.8a2 2 0 002-1.6L23 6H6 M9 21a1 1 0 100-2 1 1 0 000 2zM20 21a1 1 0 100-2 1 1 0 000 2z',
  coin: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v12M9 9h4.5a2.5 2.5 0 010 5H9M9 14h5.5a2.5 2.5 0 010 5H9',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6',
};

window.Icon = function Icon({ name, size = 18, className = '', strokeWidth = 1.8, fill = 'none' }) {
  const d = iconPaths[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {d.split(' M').map((p, i) => <path key={i} d={(i === 0 ? '' : 'M') + p} />)}
    </svg>
  );
};

window.Logo = function Logo({ size = 28, inverted = false }) {
  const bg = inverted ? '#fff' : 'var(--brand-500)';
  const fg = inverted ? 'var(--brand-500)' : '#fff';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <rect width="32" height="32" rx="8" fill={bg} />
        <path d="M8 20 L12 14 L16 18 L20 10 L24 16" stroke={fg} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="16" r="2" fill={fg} />
      </svg>
      <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: inverted ? '#fff' : 'var(--ink-900)' }}>
        코스트<span style={{ color: 'var(--brand-500)' }}>스캐너</span>
      </span>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────
const navItems = [
  { id: 'dashboard',   name: '대시보드',     icon: 'home',    href: 'dashboard.html' },
  { id: 'ingredients', name: '식자재 관리',   icon: 'package', href: 'ingredients.html' },
  { id: 'suppliers',   name: '공급업체 비교', icon: 'building',href: 'suppliers.html' },
  { id: 'recipes',     name: '레시피 원가',   icon: 'chef',    href: 'recipes.html' },
  { id: 'reports',     name: '리포트',       icon: 'chart',   href: 'reports.html' },
];
const bottomNav = [
  { id: 'settings', name: '설정', icon: 'settings', href: '#' },
];

window.Sidebar = function Sidebar({ active = 'dashboard' }) {
  return (
    <aside style={{
      width: 260, height: '100vh', flexShrink: 0,
      background: 'var(--white)', borderRight: '1px solid var(--ink-100)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '22px 20px', borderBottom: '1px solid var(--ink-100)' }}>
        <Logo size={30} />
      </div>
      <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="t-xs" style={{ padding: '8px 12px 4px' }}>메뉴</div>
        {navItems.map(it => (
          <a key={it.id} href={it.href} className={cn('sb-item', active === it.id && 'active')}>
            <Icon name={it.icon} size={18} />
            <span>{it.name}</span>
            {it.id === 'ingredients' && <span className="chip chip-brand" style={{ marginLeft: 'auto', padding: '2px 7px', fontSize: 10 }}>새로</span>}
          </a>
        ))}
        <div style={{ flex: 1 }} />
        {/* promo */}
        <div style={{
          background: 'linear-gradient(160deg, var(--brand-500), var(--brand-700))',
          color: '#fff', padding: 16, borderRadius: 'var(--r-md)',
          margin: '8px 4px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>프로 플랜 업그레이드</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 10, lineHeight: 1.5 }}>무제한 식자재, OCR 처리, 실시간 알림까지.</div>
          <button style={{ background: '#fff', color: 'var(--brand-700)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>14일 무료 체험</button>
        </div>
        {bottomNav.map(it => (
          <a key={it.id} href={it.href} className="sb-item">
            <Icon name={it.icon} size={18} />
            <span>{it.name}</span>
          </a>
        ))}
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: 'linear-gradient(135deg, #FFD09E, #FF7A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>박</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>박민준 사장님</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>동네국밥 본점</div>
        </div>
      </div>
    </aside>
  );
};

// ── TopBar ────────────────────────────────────────────────
window.TopBar = function TopBar({ title, subtitle, right, breadcrumb }) {
  return (
    <header style={{
      padding: '20px 32px',
      background: 'transparent',
      display: 'flex', alignItems: 'center', gap: 24,
      borderBottom: '1px solid var(--ink-100)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb && <div className="t-caps" style={{ marginBottom: 6 }}>{breadcrumb}</div>}
        <h1 className="t-h1" style={{ margin: 0 }}>{title}</h1>
        {subtitle && <div className="t-body" style={{ marginTop: 4, color: 'var(--ink-600)' }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {right}
      </div>
    </header>
  );
};

// ── Sparkline ─────────────────────────────────────────────
window.Sparkline = function Sparkline({ data, width = 80, height = 24, color = 'var(--brand-500)', fill = true, strokeWidth = 1.5 }) {
  const pts = useMemo(() => {
    const min = Math.min(...data), max = Math.max(...data);
    const rng = max - min || 1;
    return data.map((v, i) => [
      (i / (data.length - 1)) * width,
      height - ((v - min) / rng) * (height - 4) - 2,
    ]);
  }, [data, width, height]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const fillPath = d + ` L${width},${height} L0,${height} Z`;
  const gid = 'sp' + useMemo(() => Math.random().toString(36).slice(2, 8), []);
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={fillPath} fill={`url(#${gid})`} />}
      <path d={d} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── Area chart ────────────────────────────────────────────
window.AreaChart = function AreaChart({ series, labels, height = 240, colors = ['var(--c1)', 'var(--c4)'], yLabel, highlightIdx }) {
  const w = 720;
  const padL = 48, padR = 16, padT = 14, padB = 32;
  const cw = w - padL - padR, ch = height - padT - padB;
  const all = series.flatMap(s => s.data);
  const min = Math.min(...all, 0);
  const max = Math.max(...all);
  const rng = max - min || 1;
  const x = i => padL + (i / (labels.length - 1)) * cw;
  const y = v => padT + ch - ((v - min) / rng) * ch;

  const grids = 4;
  const gridLines = Array.from({ length: grids + 1 }, (_, i) => {
    const v = min + (rng / grids) * i;
    return { y: y(v), v };
  });

  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} style={{ display: 'block' }}>
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`ag${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity="0.32" />
            <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={padL} x2={w - padR} y1={g.y} y2={g.y} stroke="var(--ink-100)" strokeDasharray={i === gridLines.length - 1 ? '' : '3 3'} />
          <text x={padL - 8} y={g.y + 4} textAnchor="end" fontSize="10" fill="var(--ink-500)" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {g.v >= 1000 ? (g.v / 1000).toFixed(1) + 'k' : g.v.toFixed(0)}
          </text>
        </g>
      ))}
      {series.map((s, i) => {
        const pts = s.data.map((v, j) => [x(j), y(v)]);
        const d = pts.map((p, j) => (j === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
        const fill = d + ` L${x(s.data.length - 1)},${padT + ch} L${x(0)},${padT + ch} Z`;
        return (
          <g key={i}>
            <path d={fill} fill={`url(#ag${i})`} />
            <path d={d} stroke={colors[i % colors.length]} strokeWidth="2.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {highlightIdx != null && (
              <circle cx={x(highlightIdx)} cy={y(s.data[highlightIdx])} r="4.5" fill="#fff" stroke={colors[i % colors.length]} strokeWidth="2" />
            )}
          </g>
        );
      })}
      {labels.map((lb, i) => (
        <text key={i} x={x(i)} y={height - 10} textAnchor="middle" fontSize="10" fill="var(--ink-500)">{lb}</text>
      ))}
    </svg>
  );
};

// ── Bar chart ─────────────────────────────────────────────
window.BarChart = function BarChart({ data, labels, height = 200, color = 'var(--brand-500)', compareColor = 'var(--ink-300)', compareData }) {
  const w = 640;
  const padL = 40, padR = 8, padT = 12, padB = 30;
  const cw = w - padL - padR, ch = height - padT - padB;
  const all = [...data, ...(compareData || [])];
  const max = Math.max(...all) * 1.15;
  const bandW = cw / data.length;
  const barW = compareData ? bandW * 0.3 : bandW * 0.55;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={padL} x2={w - padR} y1={padT + ch * (1 - f)} y2={padT + ch * (1 - f)} stroke="var(--ink-100)" strokeDasharray={f === 0 ? '' : '3 3'} />
      ))}
      {data.map((v, i) => {
        const x = padL + bandW * i + bandW / 2;
        const h = (v / max) * ch;
        const cy = padT + ch - h;
        return (
          <g key={i}>
            {compareData && (
              <rect x={x - barW - 2} y={padT + ch - (compareData[i] / max) * ch} width={barW}
                height={(compareData[i] / max) * ch} rx="3" fill={compareColor} />
            )}
            <rect x={x - (compareData ? 2 : barW / 2)} y={cy} width={barW} height={h} rx="3" fill={color} />
            <text x={x - (compareData ? barW / 2 + 2 : 0)} y={cy - 5} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--ink-800)">
              {v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}
            </text>
          </g>
        );
      })}
      {labels.map((lb, i) => (
        <text key={i} x={padL + bandW * i + bandW / 2} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--ink-600)">{lb}</text>
      ))}
    </svg>
  );
};

// ── Donut ─────────────────────────────────────────────────
window.Donut = function Donut({ data, size = 180, thickness = 22, center }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - thickness / 2;
  const c = size / 2;
  let ang = -Math.PI / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--ink-100)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const a = (d.value / total) * Math.PI * 2;
          const x1 = c + r * Math.cos(ang);
          const y1 = c + r * Math.sin(ang);
          const x2 = c + r * Math.cos(ang + a);
          const y2 = c + r * Math.sin(ang + a);
          const large = a > Math.PI ? 1 : 0;
          const path = `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
          ang += a;
          return <path key={i} d={path} stroke={d.color} strokeWidth={thickness} fill="none" strokeLinecap="butt" />;
        })}
      </svg>
      {center && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {center}
        </div>
      )}
    </div>
  );
};

// ── Stacked horizontal bar (recipe DNA) ───────────────────
window.StackedBar = function StackedBar({ segments, height = 22, rounded = true }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let off = 0;
  return (
    <div style={{ width: '100%', height, display: 'flex', borderRadius: rounded ? 999 : 6, overflow: 'hidden', background: 'var(--ink-100)' }}>
      {segments.map((s, i) => {
        const w = (s.value / total) * 100;
        off += w;
        return <div key={i} title={`${s.label}: ${s.value}`} style={{ width: w + '%', background: s.color, transition: 'width 0.5s ease' }} />;
      })}
    </div>
  );
};

// ── Radar ─────────────────────────────────────────────────
window.Radar = function Radar({ axes, values, size = 200, color = 'var(--brand-500)', compareValues, compareColor = 'var(--ink-400)' }) {
  const n = axes.length, c = size / 2, r = c - 20;
  const pt = (i, v) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v];
  };
  const poly = vs => vs.map((v, i) => pt(i, v)).map(p => p.join(',')).join(' ');
  return (
    <svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={axes.map((_, i) => pt(i, f).join(',')).join(' ')}
          fill="none" stroke="var(--ink-100)" strokeWidth="1" />
      ))}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--ink-100)" />;
      })}
      {compareValues && <polygon points={poly(compareValues)} fill={compareColor} fillOpacity="0.15" stroke={compareColor} strokeWidth="1.5" strokeDasharray="3 3" />}
      <polygon points={poly(values)} fill={color} fillOpacity="0.22" stroke={color} strokeWidth="2" />
      {values.map((v, i) => {
        const [x, y] = pt(i, v);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 1.15);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="var(--ink-700)">{a}</text>;
      })}
    </svg>
  );
};

// ── Scatter (supplier quadrant) ───────────────────────────
window.ScatterQuadrant = function ScatterQuadrant({ points, size = 380, xLabel = 'X', yLabel = 'Y', xRev = false, yRev = false }) {
  const pad = 40;
  const inner = size - pad * 2;
  const midX = pad + inner / 2, midY = pad + inner / 2;
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect x={pad} y={pad} width={inner/2} height={inner/2} fill="var(--down-100)" opacity="0.35" />
      <rect x={pad + inner/2} y={pad + inner/2} width={inner/2} height={inner/2} fill="var(--up-100)" opacity="0.35" />
      <line x1={pad} y1={midY} x2={pad + inner} y2={midY} stroke="var(--ink-200)" />
      <line x1={midX} y1={pad} x2={midX} y2={pad + inner} stroke="var(--ink-200)" />
      <rect x={pad} y={pad} width={inner} height={inner} fill="none" stroke="var(--ink-200)" />
      <text x={pad + 8} y={pad + 18} fontSize="10" fontWeight="600" fill="var(--down-500)">↖ 이상적</text>
      <text x={pad + inner - 8} y={pad + inner - 8} fontSize="10" fontWeight="600" fill="var(--up-500)" textAnchor="end">피하기 ↘</text>
      <text x={pad + inner / 2} y={size - 8} fontSize="11" fontWeight="600" fill="var(--ink-600)" textAnchor="middle">{xLabel}</text>
      <text x={12} y={pad + inner / 2} fontSize="11" fontWeight="600" fill="var(--ink-600)" textAnchor="middle" transform={`rotate(-90 12 ${pad + inner/2})`}>{yLabel}</text>
      {points.map((p, i) => {
        const px = pad + (xRev ? 1 - p.x : p.x) * inner;
        const py = pad + (yRev ? 1 - p.y : p.y) * inner;
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={p.r || 10} fill={p.color || 'var(--brand-500)'} fillOpacity="0.8" stroke="#fff" strokeWidth="2" />
            <text x={px} y={py - (p.r || 10) - 6} fontSize="11" fontWeight="700" fill="var(--ink-900)" textAnchor="middle">{p.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Candle / price-change row ─────────────────────────────
window.Candle = function Candle({ low, high, open, close, range }) {
  const w = 100, h = 30;
  const toX = v => ((v - range[0]) / (range[1] - range[0])) * w;
  const oX = toX(open), cX = toX(close), lX = toX(low), hX = toX(high);
  const up = close > open;
  const bodyX = Math.min(oX, cX), bodyW = Math.abs(cX - oX) || 2;
  return (
    <svg width={w} height={h}>
      <line x1={lX} x2={hX} y1={h/2} y2={h/2} stroke={up ? 'var(--up-500)' : 'var(--down-500)'} strokeWidth="1.5" />
      <rect x={bodyX} y={h/2 - 6} width={bodyW} height={12} rx="2" fill={up ? 'var(--up-500)' : 'var(--down-500)'} />
    </svg>
  );
};

// ── Price radar clock (novel metaphor) ────────────────────
window.PriceClock = function PriceClock({ hours = 24, data, size = 220, color = 'var(--brand-500)' }) {
  const c = size / 2, rOut = c - 12, rIn = 30;
  const max = Math.max(...data);
  return (
    <svg width={size} height={size}>
      <circle cx={c} cy={c} r={rOut} fill="var(--ink-50)" />
      <circle cx={c} cy={c} r={rIn} fill="var(--white)" stroke="var(--ink-100)" />
      {data.map((v, i) => {
        const a0 = (i / hours) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((i + 1) / hours) * Math.PI * 2 - Math.PI / 2;
        const r = rIn + ((rOut - rIn) * v) / max;
        const x0 = c + rIn * Math.cos(a0), y0 = c + rIn * Math.sin(a0);
        const x1 = c + r * Math.cos(a0),    y1 = c + r * Math.sin(a0);
        const x2 = c + r * Math.cos(a1),    y2 = c + r * Math.sin(a1);
        const x3 = c + rIn * Math.cos(a1),  y3 = c + rIn * Math.sin(a1);
        return <path key={i} d={`M${x0} ${y0} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${rIn} ${rIn} 0 0 0 ${x0} ${y0} Z`}
          fill={color} fillOpacity={0.25 + 0.5 * (v / max)} />;
      })}
      {[0, 6, 12, 18].map(h => {
        const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
        const x = c + (rOut + 6) * Math.cos(a), y = c + (rOut + 6) * Math.sin(a);
        return <text key={h} x={x} y={y} fontSize="10" fontWeight="700" fill="var(--ink-500)" textAnchor="middle" dominantBaseline="middle">{h}시</text>;
      })}
    </svg>
  );
};

// ── CountUp (rolling counter for big numbers) ─────────────
window.CountUp = function CountUp({ to, duration = 900, prefix = '', suffix = '', decimals = 0, className, style }) {
  const [val, setVal] = useState(to);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}</span>;
};

// Sample data seeds
window.ingredientSeed = [
  { name: '양파',   cat: '채소',   unit: 'kg',  price: 1850, prev: 1620, change: 0.142, spark: [1520,1580,1610,1645,1700,1730,1820,1850], volatility: 0.22 },
  { name: '대파',   cat: '채소',   unit: 'kg',  price: 2380, prev: 2620, change: -0.092, spark: [2620,2580,2540,2500,2470,2430,2400,2380], volatility: 0.18 },
  { name: '한우등심',cat: '육류',   unit: '100g',price: 12800,prev: 11900,change: 0.076, spark: [11900,12000,12200,12350,12500,12650,12750,12800], volatility: 0.12 },
  { name: '계란',   cat: '유제품', unit: '30구', price: 7200, prev: 7100, change: 0.014, spark: [7100,7100,7150,7140,7180,7200,7200,7200], volatility: 0.05 },
  { name: '감자',   cat: '채소',   unit: 'kg',  price: 1640, prev: 1480, change: 0.108, spark: [1480,1490,1510,1540,1580,1600,1620,1640], volatility: 0.16 },
  { name: '마늘',   cat: '채소',   unit: 'kg',  price: 9400, prev: 8450, change: 0.112, spark: [8450,8500,8650,8800,9000,9180,9320,9400], volatility: 0.21 },
  { name: '돼지 삼겹',cat: '육류',  unit: 'kg', price: 18500,prev: 18200,change: 0.016, spark: [18200,18250,18300,18280,18400,18450,18500,18500], volatility: 0.07 },
  { name: '오징어',  cat: '생선',  unit: '1마리',price: 5400,prev: 6200, change: -0.129,spark: [6200,6100,5950,5800,5700,5600,5480,5400], volatility: 0.24 },
  { name: '배추',   cat: '채소',   unit: '1포기',price: 4800,prev: 3900, change: 0.231, spark: [3900,4000,4150,4300,4500,4650,4750,4800], volatility: 0.33 },
  { name: '고춧가루',cat: '조미료', unit: 'kg', price: 28000,prev: 28000,change: 0, spark: [28000,28000,28000,28000,28000,28000,28000,28000], volatility: 0.02 },
];

window.supplierSeed = [
  { name: '마켓컬리 B2B',      price: 0.22, reliability: 0.85, speed: 0.92, quality: 0.88, total: 0.81, color: 'var(--c1)' },
  { name: '가락시장 직배송',    price: 0.12, reliability: 0.68, speed: 0.55, quality: 0.72, total: 0.62, color: 'var(--c3)' },
  { name: '농협 하나로',        price: 0.35, reliability: 0.91, speed: 0.78, quality: 0.90, total: 0.84, color: 'var(--c4)' },
  { name: '이마트 트레이더스',  price: 0.48, reliability: 0.75, speed: 0.82, quality: 0.80, total: 0.75, color: 'var(--c5)' },
  { name: '지역 도매상',        price: 0.18, reliability: 0.45, speed: 0.65, quality: 0.60, total: 0.50, color: 'var(--c6)' },
  { name: '푸디스트',           price: 0.55, reliability: 0.88, speed: 0.85, quality: 0.85, total: 0.82, color: 'var(--c2)' },
];

Object.assign(window, { Sidebar, TopBar, Sparkline, AreaChart, BarChart, Donut, StackedBar, Radar, ScatterQuadrant, Candle, PriceClock, CountUp, Icon, Logo, fmtKRW, fmtPct, fmtInt, cn });
