import React from 'react';
import { GTextRun } from '../../primitives';

export interface IProps {
  children?: React.ReactNode;
}

/**
 * Italic szöveg komponens - HTML-szerű szintaxis.
 * A GTextRun primitívet használja italic stílussal.
 */
export const I: React.FC<IProps> = ({ children }) => {
  if (typeof children === 'string') {
    return <GTextRun content={children} style={{ italic: true }} />;
  }
  // Ha nem string, akkor a children-eket rendereljük (pl. <I><B>text</B></I>)
  return <>{children}</>;
};

