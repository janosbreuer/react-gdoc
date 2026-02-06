import React from 'react';
import { GParagraph, GTextRun } from '@react-gdoc/primitives';
import { Heading3 } from '@react-gdoc/primitives';

export interface ClauseProps {
  number?: number;
  title?: string;
  children?: React.ReactNode;
}

/**
 * Egy szerződési záradék komponens.
 * A primitívek (GParagraph, GTextRun) felhasználásával épül fel.
 */
export const Clause: React.FC<ClauseProps> = ({ number, title, children }) => {
  return (
    <>
      <Heading3>
        {number ? `${number}. ` : ''}
        {title}
      </Heading3>
      {children}
    </>
  );
};

