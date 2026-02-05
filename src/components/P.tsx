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
 * Automatikusan beszúr szóközt string és nem-string children között, ha szükséges.
 */
export const P: React.FC<PProps> = ({ style, children }) => {
  const childrenArray = React.Children.toArray(children);
  const processedChildren: React.ReactNode[] = [];

  for (let i = 0; i < childrenArray.length; i++) {
    const current = childrenArray[i];
    const next = childrenArray[i + 1];
    const prev = childrenArray[i - 1];

    if (typeof current === 'string') {
      let content = current;
      
      if (prev && typeof prev !== 'string' && !content.match(/^\s/)) {
        content = ' ' + content;
      }
      
      if (next && typeof next !== 'string' && !content.match(/\s$/)) {
        content = content + ' ';
      }
      
      processedChildren.push(<GTextRun key={i} content={content} />);
    } else if (React.isValidElement(current)) {
      processedChildren.push(React.cloneElement(current, { key: i }));
    } else {
      processedChildren.push(current);
    }
  }

  return (
    <GParagraph style={style}>
      {processedChildren}
    </GParagraph>
  );
};

