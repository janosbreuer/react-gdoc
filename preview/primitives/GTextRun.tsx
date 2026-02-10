import React from 'react';
import type { GTextRunProps } from '../../src/components/primitives/GTextRun';
import type { TextStyle } from '../../src/components/primitives/types';

const textStyleToCss = (style?: TextStyle): React.CSSProperties | undefined => {
  if (!style) return undefined;

  const css: React.CSSProperties = {};

  if (style.bold) {
    css.fontWeight = 'bold';
  }
  if (style.italic) {
    css.fontStyle = 'italic';
  }

  if (style.underline || style.strikethrough) {
    const parts: string[] = [];
    if (style.underline) parts.push('underline');
    if (style.strikethrough) parts.push('line-through');
    css.textDecoration = parts.join(' ');
  }

  if (style.fontSize && style.fontSize.magnitude) {
    css.fontSize = `${style.fontSize.magnitude}pt`;
  }

  if (style.weightedFontFamily && style.weightedFontFamily.fontFamily) {
    css.fontFamily = style.weightedFontFamily.fontFamily;
  }

  const fg = style.foregroundColor?.color?.rgbColor;
  if (fg) {
    const r = Math.round((fg.red ?? 0) * 255);
    const g = Math.round((fg.green ?? 0) * 255);
    const b = Math.round((fg.blue ?? 0) * 255);
    css.color = `rgb(${r}, ${g}, ${b})`;
  }

  const bg = style.backgroundColor?.color?.rgbColor;
  if (bg) {
    const r = Math.round((bg.red ?? 0) * 255);
    const g = Math.round((bg.green ?? 0) * 255);
    const b = Math.round((bg.blue ?? 0) * 255);
    css.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }

  return css;
};

export const GTextRun: React.FC<GTextRunProps> = ({ content, style }) => {
  if (content === '\u000b') {
    return <br />;
  }

  const css = textStyleToCss(style);
  return <span style={css}>{content}</span>;
};

