export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const hexToRgb = (hex: string): RGBColor => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
};

const generateColorScale = (hex500: string): Record<number, RGBColor> => {
  const rgb500 = hexToRgb(hex500);
  
  const blend = (t: number): RGBColor => ({
    r: rgb500.r * t + (1 - t),
    g: rgb500.g * t + (1 - t),
    b: rgb500.b * t + (1 - t),
  });
  
  const darken = (t: number): RGBColor => ({
    r: rgb500.r * t,
    g: rgb500.g * t,
    b: rgb500.b * t,
  });
  
  return {
    50: blend(0.05),
    100: blend(0.1),
    200: blend(0.2),
    300: blend(0.3),
    400: blend(0.4),
    500: rgb500,
    600: darken(0.8),
    700: darken(0.6),
    800: darken(0.4),
    900: darken(0.2),
    950: darken(0.1),
  };
};

const TAILWIND_COLOR_BASES: Record<string, string> = {
  slate: '#64748b',
  gray: '#6b7280',
  zinc: '#71717a',
  neutral: '#737373',
  stone: '#78716c',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
};

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export const TAILWIND_COLORS: Record<string, RGBColor> = {};

Object.entries(TAILWIND_COLOR_BASES).forEach(([colorName, hex500]) => {
  const scale = generateColorScale(hex500);
  shades.forEach((shade) => {
    TAILWIND_COLORS[`${colorName}-${shade}`] = scale[shade];
  });
});

TAILWIND_COLORS['white'] = { r: 1, g: 1, b: 1 };
TAILWIND_COLORS['black'] = { r: 0, g: 0, b: 0 };
TAILWIND_COLORS['transparent'] = { r: 0, g: 0, b: 0 };

export function getTailwindColor(colorKey: string): RGBColor | undefined {
  return TAILWIND_COLORS[colorKey];
}

