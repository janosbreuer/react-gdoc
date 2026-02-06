import type { TextStyle, ParagraphStyle } from '../components/primitives/types';
import { getTailwindColor } from './tailwindColors';

const FONT_SIZES: Record<string, { magnitude: number; unit: 'PT' }> = {
  'text-xs': { magnitude: 10, unit: 'PT' },
  'text-sm': { magnitude: 12, unit: 'PT' },
  'text-base': { magnitude: 14, unit: 'PT' },
  'text-lg': { magnitude: 16, unit: 'PT' },
  'text-xl': { magnitude: 18, unit: 'PT' },
  'text-2xl': { magnitude: 20, unit: 'PT' },
  'text-3xl': { magnitude: 24, unit: 'PT' },
  'text-4xl': { magnitude: 30, unit: 'PT' },
  'text-5xl': { magnitude: 36, unit: 'PT' },
  'text-6xl': { magnitude: 48, unit: 'PT' },
  'text-7xl': { magnitude: 60, unit: 'PT' },
  'text-8xl': { magnitude: 72, unit: 'PT' },
  'text-9xl': { magnitude: 96, unit: 'PT' },
};

export function parseTextClasses(classNames: string): TextStyle {
  const classes = classNames.split(/\s+/).filter(Boolean);
  const style: TextStyle = {};
  
  classes.forEach(className => {
    if (className === 'font-bold' || className === 'bold') {
      style.bold = true;
    }
    
    if (className === 'italic') {
      style.italic = true;
    }
    
    if (className === 'underline') {
      style.underline = true;
    }
    
    if (className === 'line-through' || className === 'strikethrough') {
      style.strikethrough = true;
    }
    
    const textColorMatch = className.match(/^text-(.+)$/);
    if (textColorMatch) {
      const colorKey = textColorMatch[1];
      const color = getTailwindColor(colorKey);
      if (color) {
        style.foregroundColor = {
          color: {
            rgbColor: {
              red: color.r,
              green: color.g,
              blue: color.b,
            },
          },
        };
      }
    }
    
    const bgColorMatch = className.match(/^bg-(.+)$/);
    if (bgColorMatch) {
      const colorKey = bgColorMatch[1];
      const color = getTailwindColor(colorKey);
      if (color) {
        style.backgroundColor = {
          color: {
            rgbColor: {
              red: color.r,
              green: color.g,
              blue: color.b,
            },
          },
        };
      }
    }
    
    if (FONT_SIZES[className]) {
      style.fontSize = FONT_SIZES[className];
    }
  });
  
  return style;
}

export function parseParagraphClasses(classNames: string): ParagraphStyle {
  const classes = classNames.split(/\s+/).filter(Boolean);
  const style: ParagraphStyle = {};
  
  classes.forEach(className => {
    if (className === 'text-left') {
      style.alignment = 'START';
    } else if (className === 'text-center') {
      style.alignment = 'CENTER';
    } else if (className === 'text-right') {
      style.alignment = 'END';
    } else if (className === 'text-justify') {
      style.alignment = 'JUSTIFIED';
    }
  });
  
  return style;
}

