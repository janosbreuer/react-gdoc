import React from 'react';
import { GTable, GTableRow, GTableCell } from '@react-gdoc/primitives';
import type { TableCellStyle, TableRowStyle } from '@react-gdoc/primitives/types';
import { parseTableCellClasses } from '../utils/parseClasses';

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
  const parsedStyle = className ? parseTableCellClasses(className) : undefined;
  const baseTableCellStyle: TableCellStyle | undefined = parsedStyle
    ? { ...parsedStyle, ...(tableCellStyle || {}) }
    : tableCellStyle;

  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps: any = child.props || {};

      const mergedClassName = className
        ? mergeClassName(className, childProps.className)
        : childProps.className;

      const mergedTableCellStyle: TableCellStyle | undefined = baseTableCellStyle
        ? { ...baseTableCellStyle, ...(childProps.tableCellStyle || {}) }
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
  const parsedStyle = className ? parseTableCellClasses(className) : undefined;
  const baseTableCellStyle: TableCellStyle | undefined = parsedStyle
    ? { ...parsedStyle, ...(tableCellStyle || {}) }
    : tableCellStyle;

  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps: any = child.props || {};

      const mergedClassName = className
        ? mergeClassName(className, childProps.className)
        : childProps.className;

      const mergedTableCellStyle: TableCellStyle | undefined = baseTableCellStyle
        ? { ...baseTableCellStyle, ...(childProps.tableCellStyle || {}) }
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

const deepMergeTableCellStyle = (base: TableCellStyle, override: TableCellStyle): TableCellStyle => {
  const merged = { ...base };
  
  if (override.paddingTop !== undefined) merged.paddingTop = override.paddingTop;
  if (override.paddingBottom !== undefined) merged.paddingBottom = override.paddingBottom;
  if (override.paddingLeft !== undefined) merged.paddingLeft = override.paddingLeft;
  if (override.paddingRight !== undefined) merged.paddingRight = override.paddingRight;
  if (override.borderTop !== undefined) merged.borderTop = override.borderTop;
  if (override.borderBottom !== undefined) merged.borderBottom = override.borderBottom;
  if (override.borderLeft !== undefined) merged.borderLeft = override.borderLeft;
  if (override.borderRight !== undefined) merged.borderRight = override.borderRight;
  if (override.backgroundColor !== undefined) merged.backgroundColor = override.backgroundColor;
  if (override.contentAlignment !== undefined) merged.contentAlignment = override.contentAlignment;
  
  return merged;
};

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

  const parsedStyle = className ? parseTableCellClasses(className) : undefined;
  const mergedStyle: TableCellStyle | undefined = parsedStyle && tableCellStyle
    ? deepMergeTableCellStyle(parsedStyle, tableCellStyle)
    : parsedStyle || tableCellStyle;

  return (
    <GTableCell {...props} tableCellStyle={mergedStyle} className={className}>
      {processedChildren}
    </GTableCell>
  );
};

