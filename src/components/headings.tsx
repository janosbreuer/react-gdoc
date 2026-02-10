import React from 'react';
import { GParagraphProps } from '@react-gdoc/primitives/GParagraph';
import type { ParagraphStyle } from '@react-gdoc/primitives/types';
import { P, PProps } from './shortcuts';

export interface GHeadingProps extends Omit<GParagraphProps, 'paragraphStyle'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  paragraphStyle?: ParagraphStyle;
}

const headingStyles: Record<1 | 2 | 3 | 4 | 5 | 6, ParagraphStyle['namedStyleType']> = {
  1: 'HEADING_1',
  2: 'HEADING_2',
  3: 'HEADING_3',
  4: 'HEADING_4',
  5: 'HEADING_5',
  6: 'HEADING_6',
};

export const Heading1: React.FC<Omit<GHeadingProps, 'level'>> = ({ className, paragraphStyle, ...props }) => {
  return <P className={className} paragraphStyle={{ namedStyleType: headingStyles[1], ...paragraphStyle }} {...props} />;
};

export const Heading2: React.FC<Omit<GHeadingProps, 'level'>> = ({ className, paragraphStyle, ...props }) => {
  return <P className={className} paragraphStyle={{ namedStyleType: headingStyles[2], ...paragraphStyle }} {...props} />;
};

export const Heading3: React.FC<Omit<GHeadingProps, 'level'>> = ({ className, paragraphStyle, ...props }) => {
  return <P className={className} paragraphStyle={{ namedStyleType: headingStyles[3], ...paragraphStyle }} {...props} />;
};

export const Heading4: React.FC<Omit<GHeadingProps, 'level'>> = ({ className, paragraphStyle, ...props }) => {
  return <P className={className} paragraphStyle={{ namedStyleType: headingStyles[4], ...paragraphStyle }} {...props} />;
};

export const Heading5: React.FC<Omit<GHeadingProps, 'level'>> = ({ className, paragraphStyle, ...props }) => {
  return <P className={className} paragraphStyle={{ namedStyleType: headingStyles[5], ...paragraphStyle }} {...props} />;
};

export const Heading6: React.FC<Omit<GHeadingProps, 'level'>> = ({ className, paragraphStyle, ...props }) => {
  return <P className={className} paragraphStyle={{ namedStyleType: headingStyles[6], ...paragraphStyle }} {...props} />;
};
