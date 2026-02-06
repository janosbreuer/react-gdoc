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

const SPACING_MAP: Record<string, number> = {
  'mb-0': 0, 'mt-0': 0, 'pb-0': 0, 'pt-0': 0,
  'mb-1': 4, 'mt-1': 4, 'pb-1': 4, 'pt-1': 4,
  'mb-2': 8, 'mt-2': 8, 'pb-2': 8, 'pt-2': 8,
  'mb-3': 12, 'mt-3': 12, 'pb-3': 12, 'pt-3': 12,
  'mb-4': 16, 'mt-4': 16, 'pb-4': 16, 'pt-4': 16,
  'mb-5': 20, 'mt-5': 20, 'pb-5': 20, 'pt-5': 20,
  'mb-6': 24, 'mt-6': 24, 'pb-6': 24, 'pt-6': 24,
};

const INDENT_MAP: Record<string, number> = {
  'indent-0': 0,
  'indent-1': 4,
  'indent-2': 8,
  'indent-3': 12,
  'indent-4': 16,
  'indent-5': 20,
  'indent-6': 24,
  'indent-7': 28,
  'indent-8': 32,
  'indent-9': 36,
  'indent-10': 40,
};

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
    } else if (SPACING_MAP[className]) {
      const magnitude = SPACING_MAP[className];
      if (className.startsWith('mb-')) {
        style.spaceBelow = { magnitude, unit: 'PT' };
      } else if (className.startsWith('mt-')) {
        style.spaceAbove = { magnitude, unit: 'PT' };
      } else if (className.startsWith('pb-')) {
        style.spaceBelow = { magnitude, unit: 'PT' };
      } else if (className.startsWith('pt-')) {
        style.spaceAbove = { magnitude, unit: 'PT' };
      }
    } else if (INDENT_MAP[className]) {
      style.indentStart = { magnitude: INDENT_MAP[className], unit: 'PT' };
    }
  });
  
  return style;
}

const PARAGRAPH_ALIGNMENT_CLASSES = ['text-left', 'text-center', 'text-right', 'text-justify'];
const PARAGRAPH_SPACING_CLASSES = Object.keys(SPACING_MAP);
const PARAGRAPH_INDENT_CLASSES = Object.keys(INDENT_MAP);

const TEXT_CLASSES = [
  'font-bold', 'bold', 'italic', 'underline', 'line-through', 'strikethrough',
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
  'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'
];

const isTextClass = (className: string): boolean => {
  if (PARAGRAPH_ALIGNMENT_CLASSES.includes(className)) return false;
  if (PARAGRAPH_SPACING_CLASSES.includes(className)) return false;
  if (PARAGRAPH_INDENT_CLASSES.includes(className)) return false;
  if (TEXT_CLASSES.includes(className)) return true;
  if (className.match(/^text-(.+)$/)) return true;
  if (className.match(/^bg-(.+)$/)) return true;
  return false;
};

export function splitClasses(classNames: string): { paragraphClasses: string; textClasses: string } {
  const classes = classNames.split(/\s+/).filter(Boolean);
  const paragraphClasses: string[] = [];
  const textClasses: string[] = [];
  
  classes.forEach(className => {
    if (isTextClass(className)) {
      textClasses.push(className);
    } else {
      paragraphClasses.push(className);
    }
  });
  
  return {
    paragraphClasses: paragraphClasses.join(' '),
    textClasses: textClasses.join(' '),
  };
}

