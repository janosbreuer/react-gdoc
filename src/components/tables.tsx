import React from 'react';
import { GTable, GTableRow, GTableCell } from './primitives';
import type { TableCellStyle, TableRowStyle } from './primitives/types';

export interface TableProps {
  className?: string;
  rows?: number;
  columns?: number;
  children?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ className, children, ...props }) => {
  return (
    <GTable {...props}>
      {children}
    </GTable>
  );
};

export interface TRowProps {
  className?: string;
  style?: TableRowStyle;
  children?: React.ReactNode;
}

export const TRow: React.FC<TRowProps> = ({ className, style, children }) => {
  return (
    <GTableRow style={style}>
      {children}
    </GTableRow>
  );
};

export interface TCellProps {
  className?: string;
  rowSpan?: number;
  columnSpan?: number;
  style?: TableCellStyle;
  children?: React.ReactNode;
}

export const TCell: React.FC<TCellProps> = ({ className, style, children, ...props }) => {
  return (
    <GTableCell {...props} style={style}>
      {children}
    </GTableCell>
  );
};

