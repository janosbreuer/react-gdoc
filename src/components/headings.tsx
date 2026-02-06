import React from 'react';
import { GParagraphProps } from './primitives/GParagraph';
import type { ParagraphStyle } from './primitives/types';
import { P } from './shortcuts';

export interface GHeadingProps extends Omit<GParagraphProps, 'style'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingStyles: Record<1 | 2 | 3 | 4 | 5 | 6, ParagraphStyle['namedStyleType']> = {
  1: 'HEADING_1',
  2: 'HEADING_2',
  3: 'HEADING_3',
  4: 'HEADING_4',
  5: 'HEADING_5',
  6: 'HEADING_6',
};

export const Heading1: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <P {...props} style={{ namedStyleType: headingStyles[1] }} />;
};

export const Heading2: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <P {...props} style={{ namedStyleType: headingStyles[2] }} />;
};

export const Heading3: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <P {...props} style={{ namedStyleType: headingStyles[3] }} />;
};

export const Heading4: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <P {...props} style={{ namedStyleType: headingStyles[4] }} />;
};

export const Heading5: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <P {...props} style={{ namedStyleType: headingStyles[5] }} />;
};

export const Heading6: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <P {...props} style={{ namedStyleType: headingStyles[6] }} />;
};
