import React from 'react';
import { GParagraph, GTextRun } from './primitives';
import type { ParagraphStyle } from './primitives/types';

export interface PProps {
  style?: ParagraphStyle;
  children?: React.ReactNode;
}

/**
 * Egyszerű bekezdés komponens - HTML-szerű szintaxis.
 * A GParagraph primitívet használja.
 */
export const P: React.FC<PProps> = ({ style, children }) => {
  return (
    <GParagraph style={style}>
      {typeof children === 'string' ? <GTextRun content={children} /> : children}
    </GParagraph>
  );
};

