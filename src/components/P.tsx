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
  const processedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return <GTextRun content={child} />;
    }
    return child;
  });

  return (
    <GParagraph style={style}>
      {processedChildren}
    </GParagraph>
  );
};

