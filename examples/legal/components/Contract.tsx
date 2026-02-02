import React from 'react';
import { GParagraph, GTextRun, GPageBreak } from '../../../src/components/primitives';
import { ContractHeader } from './ContractHeader';
import { Section } from './Section';
import { SignatureBlock } from './SignatureBlock';

export interface ContractProps {
  title: string;
  parties?: string[];
  date?: string;
  location?: string;
  preamble?: string;
  sections?: React.ReactNode;
  signatures?: Array<{ name: string; role?: string }>;
  children?: React.ReactNode;
}

/**
 * Fő szerződés komponens - a legmagasabb absztrakciós szint.
 * A Section, ContractHeader, SignatureBlock komponensekből épül fel,
 * amelyek viszont a Clause komponensekből épülnek,
 * amelyek végül a primitívekből épülnek fel.
 */
export const Contract: React.FC<ContractProps> = ({
  title,
  parties,
  date,
  location,
  preamble,
  sections,
  signatures,
  children,
}) => {
  return (
    <>
      <ContractHeader 
        title={title}
        parties={parties}
        date={date}
        location={location}
      />
      
      {preamble && (
        <>
          <GParagraph style={{ 
            spaceAbove: { magnitude: 18, unit: 'PT' },
            spaceBelow: { magnitude: 24, unit: 'PT' }
          }}>
            <GTextRun content={preamble} />
          </GParagraph>
        </>
      )}
      
      {sections || children}
      
      {signatures && signatures.length > 0 && (
        <>
          <GPageBreak />
          <GParagraph style={{ spaceAbove: { magnitude: 36, unit: 'PT' } }}>
            <GTextRun content="Aláírások:" style={{ bold: true }} />
          </GParagraph>
          {signatures.map((sig, index) => (
            <SignatureBlock 
              key={index}
              partyName={sig.name}
              role={sig.role}
            />
          ))}
        </>
      )}
    </>
  );
};

