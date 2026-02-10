import React from 'react';
import type { ParagraphStyle, TextStyle } from './types';

export interface ListItemStyle {
  ordered?: boolean;
  nestingLevel?: number;
  listId?: string;
}

export interface GParagraphProps {
  paragraphStyle?: ParagraphStyle;
  textStyle?: TextStyle;
  listItemStyle?: ListItemStyle;
  children?: React.ReactNode;
}

export const GParagraph: React.FC<GParagraphProps> = ({ paragraphStyle, listItemStyle, children }) => {
  return null;
};

