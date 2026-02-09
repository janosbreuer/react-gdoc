import React from 'react';
import { GTable, GTableRow, GTableCell } from './primitives';
import type { TableCellStyle, TableRowStyle } from './primitives/types';

const mergeClassName = (parentClassName?: string, childClassName?: string): string | undefined => {
  if (!parentClassName && !childClassName) return undefined;
  if (!parentClassName) return childClassName;
  if (!childClassName) return parentClassName;
  return `${parentClassName} ${childClassName}`.trim();
};

export interface TableProps {
  className?: string;
  rows?: number;
  columns?: number;
  tableCellStyle?: TableCellStyle;
  children?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ className, tableCellStyle, children, ...props }) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps: any = child.props || {};

      const mergedClassName = className
        ? mergeClassName(className, childProps.className)
        : childProps.className;

      const mergedTableCellStyle: TableCellStyle | undefined = tableCellStyle
        ? { ...tableCellStyle, ...(childProps.tableCellStyle || {}) }
        : childProps.tableCellStyle;

      return React.cloneElement(child, {
        ...childProps,
        className: mergedClassName,
        tableCellStyle: mergedTableCellStyle,
      } as any);
    }
    return child;
  });

  return (
    <GTable {...props}>
      {processedChildren}
    </GTable>
  );
};

export interface TRowProps {
  className?: string;
  style?: TableRowStyle;
  tableCellStyle?: TableCellStyle;
  children?: React.ReactNode;
}

export const TRow: React.FC<TRowProps> = ({ className, style, tableCellStyle, children }) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps: any = child.props || {};

      const mergedClassName = className
        ? mergeClassName(className, childProps.className)
        : childProps.className;

      const mergedTableCellStyle: TableCellStyle | undefined = tableCellStyle
        ? { ...tableCellStyle, ...(childProps.tableCellStyle || {}) }
        : childProps.tableCellStyle;

      return React.cloneElement(child, {
        ...childProps,
        className: mergedClassName,
        tableCellStyle: mergedTableCellStyle,
      } as any);
    }
    return child;
  });

  return (
    <GTableRow style={style}>
      {processedChildren}
    </GTableRow>
  );
};

export interface TCellProps {
  className?: string;
  rowSpan?: number;
  columnSpan?: number;
  // Cell-level table style (borders, alignment, padding, etc.)
  tableCellStyle?: TableCellStyle;
  children?: React.ReactNode;
}

export const TCell: React.FC<TCellProps> = ({ className, tableCellStyle, children, ...props }) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && className) {
      return React.cloneElement(child, {
        ...child.props,
        className: mergeClassName(className, child.props.className),
      } as any);
    }
    return child;
  });

  return (
    <GTableCell {...props} tableCellStyle={tableCellStyle} className={className}>
      {processedChildren}
    </GTableCell>
  );
};

