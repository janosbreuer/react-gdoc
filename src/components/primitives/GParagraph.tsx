import React from 'react';
import type { ParagraphStyle } from './types';

export interface ListItemStyle {
  ordered?: boolean;
  nestingLevel?: number;
  listId?: string;
}

export interface GParagraphProps {
  style?: ParagraphStyle;
  listItemStyle?: ListItemStyle;
  children?: React.ReactNode;
}

export const GParagraph: React.FC<GParagraphProps> = ({ style, listItemStyle, children }) => {
  return null;
};

