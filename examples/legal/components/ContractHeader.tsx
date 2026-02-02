import React from 'react';
import { GParagraph, GTextRun, GHeading1 } from '../../../src/components/primitives';

export interface ContractHeaderProps {
  title: string;
  parties?: string[];
  date?: string;
  location?: string;
}

/**
 * Szerződés fejléc komponens.
 * A primitívek felhasználásával épül fel.
 */
export const ContractHeader: React.FC<ContractHeaderProps> = ({ 
  title, 
  parties, 
  date, 
  location 
}) => {
  return (
    <>
      <GParagraph style={{ 
        alignment: 'CENTER',
        spaceBelow: { magnitude: 24, unit: 'PT' }
      }}>
        <GTextRun content={title} style={{ 
          fontSize: { magnitude: 18, unit: 'PT' },
          bold: true 
        }} />
      </GParagraph>
      
      {parties && parties.length > 0 && (
        <GParagraph style={{ 
          spaceAbove: { magnitude: 24, unit: 'PT' },
          spaceBelow: { magnitude: 12, unit: 'PT' }
        }}>
          <GTextRun content="Felek: " style={{ bold: true }} />
          <GTextRun content={parties.join(', ')} />
        </GParagraph>
      )}
      
      {(date || location) && (
        <GParagraph style={{ spaceBelow: { magnitude: 24, unit: 'PT' } }}>
          {location && <GTextRun content={`Hely: ${location}`} />}
          {location && date && <GTextRun content=", " />}
          {date && <GTextRun content={`Dátum: ${date}`} />}
        </GParagraph>
      )}
    </>
  );
};

