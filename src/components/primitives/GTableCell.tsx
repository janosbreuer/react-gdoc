import React from 'react';
import type { TableCellStyle } from './types';

export interface GTableCellProps {
  rowSpan?: number;
  columnSpan?: number;
  // Table cell style (borders, alignment, padding, etc.)
  tableCellStyle?: TableCellStyle;
  // Optional className that can be used to style the cell content
  className?: string;
  children?: React.ReactNode;
}

export const GTableCell: React.FC<GTableCellProps> = ({
  rowSpan,
  columnSpan,
  tableCellStyle,
  className,
  children,
}) => {
  return null;
};

