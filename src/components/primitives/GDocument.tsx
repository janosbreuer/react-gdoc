import React from 'react';
import type { ParagraphStyle, TextStyle } from './types';

export interface NamedStyle {
  namedStyleType: ParagraphStyle['namedStyleType'];
  paragraphStyle?: ParagraphStyle;
  textStyle?: TextStyle;
}

export interface GDocumentProps {
  namedStyles?: NamedStyle[];
  children?: React.ReactNode;
}

export const GDocument: React.FC<GDocumentProps> = ({ namedStyles, children }) => {
  return null;
};

