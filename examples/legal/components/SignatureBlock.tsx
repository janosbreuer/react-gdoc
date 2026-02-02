import React from 'react';
import { GParagraph, GTextRun } from '@react-gdoc/primitives';

export interface SignatureBlockProps {
  partyName: string;
  role?: string;
}

/**
 * Aláírási blokk komponens.
 * A primitívek felhasználásával épül fel.
 */
export const SignatureBlock: React.FC<SignatureBlockProps> = ({ partyName, role }) => {
  return (
    <GParagraph style={{ 
      spaceAbove: { magnitude: 36, unit: 'PT' },
      alignment: 'START'
    }}>
      <GTextRun content="_________________________" />
      <GTextRun content="\n" />
      <GTextRun content={partyName} />
      {role && (
        <>
          <GTextRun content="\n" />
          <GTextRun content={role} style={{ italic: true }} />
        </>
      )}
    </GParagraph>
  );
};

