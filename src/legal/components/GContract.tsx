import React from 'react';
import { GParagraph, GTextRun, GPageBreak } from '../../primitives';
import { GContractHeader } from './GContractHeader';
import { GSection } from './GSection';
import { GSignatureBlock } from './GSignatureBlock';

export interface GContractProps {
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
 * A GSection, GContractHeader, GSignatureBlock komponensekből épül fel,
 * amelyek viszont a GClause komponensekből épülnek,
 * amelyek végül a primitívekből épülnek fel.
 */
export const GContract: React.FC<GContractProps> = ({
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
      <GContractHeader 
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
            <GSignatureBlock 
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

