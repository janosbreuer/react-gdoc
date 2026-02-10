import React from 'react';
import type { GParagraphProps } from '../../src/components/primitives/GParagraph';
import type { ParagraphStyle } from '../../src/components/primitives/types';

const PT_TO_PX = 4 / 3;

const paragraphStyleToCss = (style?: ParagraphStyle): React.CSSProperties | undefined => {
  if (!style) return undefined;

  const css: React.CSSProperties = {};

  if (style.alignment) {
    if (style.alignment === 'CENTER') css.textAlign = 'center';
    if (style.alignment === 'END') css.textAlign = 'right';
    if (style.alignment === 'JUSTIFIED') css.textAlign = 'justify';
  }

  const toPx = (v?: { magnitude?: number | null } | null): string | undefined => {
    if (!v || v.magnitude == null) return undefined;
    return `${v.magnitude * PT_TO_PX}px`;
  };

  if (style.spaceAbove) {
    const mt = toPx(style.spaceAbove);
    if (mt) css.marginTop = mt;
  }
  if (style.spaceBelow) {
    const mb = toPx(style.spaceBelow);
    if (mb) css.marginBottom = mb;
  }
  if (style.indentStart) {
    const ml = toPx(style.indentStart);
    if (ml) css.marginLeft = ml;
  }

  if (style.namedStyleType) {
    switch (style.namedStyleType) {
      case 'HEADING_1':
        css.fontSize = '2rem';
        css.fontWeight = '700';
        break;
      case 'HEADING_2':
        css.fontSize = '1.5rem';
        css.fontWeight = '700';
        break;
      case 'HEADING_3':
        css.fontSize = '1.25rem';
        css.fontWeight = '600';
        break;
      default:
        break;
    }
  }

  return css;
};

export const GParagraph: React.FC<GParagraphProps> = ({ paragraphStyle, children }) => {
  const css = paragraphStyleToCss(paragraphStyle);
  return <p style={css}>{children}</p>;
};

