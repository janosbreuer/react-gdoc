import type { TextStyle, ParagraphStyle, TableCellStyle } from '../components/primitives/types';
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
    
    const fontFamilyMatch = className.match(/^font-(.+)$/);
    if (fontFamilyMatch) {
      const fontKey = fontFamilyMatch[1];
      const fontFamilyMap: Record<string, string> = {
        'times': 'Times New Roman',
        'times-new-roman': 'Times New Roman',
        'arial': 'Arial',
        'calibri': 'Calibri',
        'courier': 'Courier New',
        'georgia': 'Georgia',
        'verdana': 'Verdana',
      };
      const fontFamily = fontFamilyMap[fontKey];
      if (fontFamily) {
        style.weightedFontFamily = {
          fontFamily,
          weight: 400,
        };
      }
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
  if (className.match(/^font-(.+)$/)) return true;
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

const PADDING_MAP: Record<string, number> = {
  'p-0': 0, 'px-0': 0, 'py-0': 0,
  'pt-0': 0, 'pb-0': 0, 'pl-0': 0, 'pr-0': 0,
  'p-1': 4, 'px-1': 4, 'py-1': 4,
  'pt-1': 4, 'pb-1': 4, 'pl-1': 4, 'pr-1': 4,
  'p-2': 8, 'px-2': 8, 'py-2': 8,
  'pt-2': 8, 'pb-2': 8, 'pl-2': 8, 'pr-2': 8,
  'p-3': 12, 'px-3': 12, 'py-3': 12,
  'pt-3': 12, 'pb-3': 12, 'pl-3': 12, 'pr-3': 12,
  'p-4': 16, 'px-4': 16, 'py-4': 16,
  'pt-4': 16, 'pb-4': 16, 'pl-4': 16, 'pr-4': 16,
  'p-5': 20, 'px-5': 20, 'py-5': 20,
  'pt-5': 20, 'pb-5': 20, 'pl-5': 20, 'pr-5': 20,
  'p-6': 24, 'px-6': 24, 'py-6': 24,
  'pt-6': 24, 'pb-6': 24, 'pl-6': 24, 'pr-6': 24,
};

export function parseTableCellClasses(classNames: string): TableCellStyle {
  const classes = classNames.split(/\s+/).filter(Boolean);
  const style: TableCellStyle = {};
  
  const createBorder = (width: number) => ({
    width: { magnitude: width, unit: 'PT' as const },
    dashStyle: 'SOLID' as const,
    color: { color: { rgbColor: { red: 0, green: 0, blue: 0 } } },
  });
  
  classes.forEach(className => {
    if (className === 'border-0') {
      const border = createBorder(0);
      style.borderTop = border;
      style.borderBottom = border;
      style.borderLeft = border;
      style.borderRight = border;
    } else if (className === 'border-t-0') {
      style.borderTop = createBorder(0);
    } else if (className === 'border-b-0') {
      style.borderBottom = createBorder(0);
    } else if (className === 'border-l-0') {
      style.borderLeft = createBorder(0);
    } else if (className === 'border-r-0') {
      style.borderRight = createBorder(0);
    } else if (PADDING_MAP[className] !== undefined) {
      const magnitude = PADDING_MAP[className];
      if (className.startsWith('pl-')) {
        style.paddingLeft = { magnitude, unit: 'PT' as const };
      } else if (className.startsWith('pr-')) {
        style.paddingRight = { magnitude, unit: 'PT' as const };
      } else if (className.startsWith('pt-')) {
        style.paddingTop = { magnitude, unit: 'PT' as const };
      } else if (className.startsWith('pb-')) {
        style.paddingBottom = { magnitude, unit: 'PT' as const };
      } else if (className === 'px-0' || className.startsWith('px-')) {
        const padding = { magnitude, unit: 'PT' as const };
        style.paddingLeft = padding;
        style.paddingRight = padding;
      } else if (className === 'py-0' || className.startsWith('py-')) {
        const padding = { magnitude, unit: 'PT' as const };
        style.paddingTop = padding;
        style.paddingBottom = padding;
      } else if (className === 'p-0' || className.startsWith('p-')) {
        const padding = { magnitude, unit: 'PT' as const };
        style.paddingTop = padding;
        style.paddingBottom = padding;
        style.paddingLeft = padding;
        style.paddingRight = padding;
      }
    } else if (className === 'align-left' || className === 'text-left') {
      style.contentAlignment = 'CONTENT_ALIGNMENT_LEFT';
    } else if (className === 'align-center' || className === 'text-center') {
      style.contentAlignment = 'CONTENT_ALIGNMENT_CENTER';
    } else if (className === 'align-right' || className === 'text-right') {
      style.contentAlignment = 'CONTENT_ALIGNMENT_RIGHT';
    } else if (className === 'align-top') {
      style.contentAlignment = 'CONTENT_ALIGNMENT_TOP';
    } else if (className === 'align-middle') {
      style.contentAlignment = 'CONTENT_ALIGNMENT_MIDDLE';
    } else if (className === 'align-bottom') {
      style.contentAlignment = 'CONTENT_ALIGNMENT_BOTTOM';
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
  });
  
  return style;
}

