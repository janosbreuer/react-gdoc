import React from 'react';
import { GTextRun } from '../../primitives';

export interface BIProps {
  children?: React.ReactNode;
}

/**
 * Bold és Italic szöveg komponens - HTML-szerű szintaxis.
 * A GTextRun primitívet használja bold és italic stílussal.
 */
export const BI: React.FC<BIProps> = ({ children }) => {
  if (typeof children === 'string') {
    return <GTextRun content={children} style={{ bold: true, italic: true }} />;
  }
  return <>{children}</>;
};

