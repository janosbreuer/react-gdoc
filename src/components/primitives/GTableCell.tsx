import React from 'react';
import type { TableCellStyle } from './types';

export interface GTableCellProps {
  rowSpan?: number;
  columnSpan?: number;
  style?: TableCellStyle;
  children?: React.ReactNode;
}

export const GTableCell: React.FC<GTableCellProps> = ({ rowSpan, columnSpan, style, children }) => {
  return null;
};

