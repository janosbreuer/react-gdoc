import React from 'react';
import { GTextRun } from '../../primitives';

export interface BProps {
  children?: React.ReactNode;
}

/**
 * Bold szöveg komponens - HTML-szerű szintaxis.
 * A GTextRun primitívet használja bold stílussal.
 */
export const B: React.FC<BProps> = ({ children }) => {
  if (typeof children === 'string') {
    return <GTextRun content={children} style={{ bold: true }} />;
  }
  // Ha nem string, akkor a children-eket rendereljük (pl. <B><I>text</I></B>)
  return <>{children}</>;
};

