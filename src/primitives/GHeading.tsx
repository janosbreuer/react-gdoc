import React from 'react';
import { GParagraph, GParagraphProps } from './GParagraph';
import type { ParagraphStyle } from '../google/types';

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

export const GHeading1: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <GParagraph {...props} style={{ namedStyleType: 'HEADING_1' }} />;
};

export const GHeading2: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <GParagraph {...props} style={{ namedStyleType: 'HEADING_2' }} />;
};

export const GHeading3: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <GParagraph {...props} style={{ namedStyleType: 'HEADING_3' }} />;
};

export const GHeading4: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <GParagraph {...props} style={{ namedStyleType: 'HEADING_4' }} />;
};

export const GHeading5: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <GParagraph {...props} style={{ namedStyleType: 'HEADING_5' }} />;
};

export const GHeading6: React.FC<Omit<GHeadingProps, 'level'>> = (props) => {
  return <GParagraph {...props} style={{ namedStyleType: 'HEADING_6' }} />;
};

