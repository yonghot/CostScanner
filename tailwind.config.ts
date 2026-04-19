import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Helvetica Neue"',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF7A00",
          foreground: "#ffffff",
          light: "#FFB366",
          dark: "#CC5500",
          50: "#FFF7EE",
          100: "#FFEAD1",
          500: "#FF7A00",
          600: "#E56800",
          700: "#B85200",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "#1F9D55",
          foreground: "#ffffff",
          light: "#66BB6A",
          dark: "#1B5E20",
        },
        warning: {
          DEFAULT: "#F2A900",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        error: {
          DEFAULT: "#D32F2F",
          foreground: "#ffffff",
        },
        // 한국형 금융 UX — 가격 상승 = 빨강, 하락 = 초록
        "price-up": {
          DEFAULT: "#E8412D",
          bg: "#FDE5E1",
        },
        "price-down": {
          DEFAULT: "#1F9D55",
          bg: "#DEF4E6",
        },
        // 워밍 뉴트럴 — JNF 브랜드 톤
        ink: {
          50: "#F9F6EF",
          100: "#F2EEE6",
          200: "#E8E3D9",
          300: "#D6CFC4",
          400: "#B8AFA2",
          500: "#94897A",
          600: "#6B5E4D",
          700: "#43392C",
          800: "#2A241C",
          900: "#15110C",
        },
        cream: "#FBF8F1",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 차트 6색 — design-gap G7 + 이번 리디자인
        chart: {
          1: "#FF7A00",
          2: "#F2A900",
          3: "#1F9D55",
          4: "#2B6CB0",
          5: "#8B5CF6",
          6: "#E8412D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        "soft-1": "0 1px 2px rgba(21, 17, 12, 0.04), 0 0 0 1px rgba(21, 17, 12, 0.04)",
        "soft-2": "0 2px 8px rgba(21, 17, 12, 0.06), 0 0 0 1px rgba(21, 17, 12, 0.04)",
        "soft-3": "0 8px 28px rgba(21, 17, 12, 0.08), 0 0 0 1px rgba(21, 17, 12, 0.04)",
        brand: "0 8px 24px rgba(255, 122, 0, 0.22)",
      },
      fontSize: {
        // Major Third (1.250) 스케일 — G2
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        xxxl: "64px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".tabular-nums": {
          "font-variant-numeric": "tabular-nums",
          "font-feature-settings": '"tnum" 1',
        },
      });
    },
  ],
}

export default config
