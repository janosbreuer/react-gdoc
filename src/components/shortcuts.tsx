import React from 'react';
import { GParagraph, GTextRun } from './primitives';
import type { ParagraphStyle, TextStyle } from './primitives/types';
import { parseTextClasses, parseParagraphClasses } from '../utils/parseClasses';

/**
 * HTML-szerű shortcut komponensek az egyszerűbb szintaxisért.
 * Ezek a komponensek a primitívek wrapper-jei.
 */

export interface PProps {
  className?: string;
  style?: ParagraphStyle;
  children?: React.ReactNode;
}

/**
 * Egyszerű bekezdés komponens - HTML-szerű szintaxis.
 * A GParagraph primitívet használja.
 */
export const P: React.FC<PProps> = ({ className, style, children, ...props }) => {
  const classStyle = className ? parseParagraphClasses(className) : {};
  
  const mergedStyle: ParagraphStyle = {
    ...classStyle,
    ...style,
  };
  
  const processedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return <GTextRun content={child} />;
    }
    return child;
  });

  return (
    <GParagraph {...props} style={mergedStyle}>
      {processedChildren}
    </GParagraph>
  );
};

export interface SProps {
  className?: string;
  style?: TextStyle;
  children?: React.ReactNode;
}

export const S: React.FC<SProps> = ({ className, style, children }) => {
  const classStyle = className ? parseTextClasses(className) : {};
  
  const mergedStyle: TextStyle = {
    ...classStyle,
    ...style,
  };
  
  if (typeof children === 'string') {
    return <GTextRun content={children} style={mergedStyle} />;
  }
  
  return <>{children}</>;
};

