import React from 'react';
import { Br, P, S, Ol, Li } from '@react-gdoc/shortcuts';
import { Heading1, Heading2, Heading3 } from '@react-gdoc/headings';
import { GList, GDocument } from '@react-gdoc/primitives';
import { Table, TRow, TCell } from '@react-gdoc/tables';
import { NamedStyleConfig1 } from './namedStyles';

interface PartyData {
  name: string;
  address: string;
  isCompany?: boolean;
  registrationNumber?: string;
  registrationCountry?: string;
}

interface NDAProps {
  args?: string[];
}

const DEFAULT_PARTY_1: PartyData = {
  name: 'Tech Solutions Ltd.',
  address: '123 Business Street, London, SW1A 1AA, United Kingdom',
  isCompany: true,
  registrationNumber: '12345678',
  registrationCountry: 'England'
};

const DEFAULT_PARTY_2: PartyData = {
  name: 'Innovation Corp.',
  address: '456 Innovation Avenue, London, EC1A 1BB, United Kingdom',
  isCompany: true,
  registrationNumber: '87654321',
  registrationCountry: 'England'
};

export default function ExampleNDA({ args = [] }: NDAProps = {}) {
  const currentDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const defaultDate = `${currentDate}`;
  const defaultPurpose = 'discussing the possibility of the parties entering into a joint venture';
  const defaultDuration = 'indefinitely';
  const defaultDurationYears = 5;

  const party1Name = args[0] || DEFAULT_PARTY_1.name;
  const party1Address = args[1] || DEFAULT_PARTY_1.address;
  const party1IsCompany = args[2] === 'false' ? false : (args[2] === 'true' ? true : DEFAULT_PARTY_1.isCompany);
  const party1RegNumber = args[3] || DEFAULT_PARTY_1.registrationNumber;
  const party1RegCountry = args[4] || DEFAULT_PARTY_1.registrationCountry;

  const party2Name = args[5] || DEFAULT_PARTY_2.name;
  const party2Address = args[6] || DEFAULT_PARTY_2.address;
  const party2IsCompany = args[7] === 'false' ? false : (args[7] === 'true' ? true : DEFAULT_PARTY_2.isCompany);
  const party2RegNumber = args[8] || DEFAULT_PARTY_2.registrationNumber;
  const party2RegCountry = args[9] || DEFAULT_PARTY_2.registrationCountry;

  const date = args[10] || defaultDate;
  const purpose = args[11] || defaultPurpose;
  const durationType = args[12] || defaultDuration;
  const durationYears = args[13] ? parseInt(args[13], 10) : defaultDurationYears;
  const durationText = durationType === 'indefinitely'
    ? 'indefinitely'
    : `for ${durationYears} years from the date of this Agreement`;

  const Party: React.FC<{
    name: string;
    address: string;
    isCompany?: boolean;
    regNumber?: string;
    regCountry?: string;
    className?: string;
  }> = ({ name, address, isCompany, regNumber, regCountry, className }) => {
    const combinedClassName = className ? `text-justify ${className}` : 'text-justify';
    if (isCompany && regNumber && regCountry) {
      return (
        <P className={combinedClassName}>
          <S className="font-bold">{name}</S>, a company registered in {regCountry} under company number <S className="font-bold">{regNumber}</S> whose registered office is at {address}
        </P>
      );
    }
    return (
      <P className={combinedClassName}>
        <S className="font-bold">{name}</S> of {address}
      </P>
    );
  };


  const Clause: React.FC<{ className?: string; children: React.ReactNode }> = (() => {
    let clauseNumber = 0;
    return ({ className, children }) => {
      clauseNumber += 1;
      const currentClauseNumber = clauseNumber;

      return (
        <P className={className || 'text-justify mb-4'}>
          <S className="font-bold text-lg text-blue-600">{currentClauseNumber}.</S> {children}
        </P>
      );
    }
  })();

  return (
    <GDocument namedStyles={NamedStyleConfig1}>
      <Heading1 className="text-center mb-4">
        An Example of a <Br />
        <S className="font-bold text-2xl text-blue-600">Mutual Non-Disclosure Agreement</S>
      </Heading1>

      <Heading3 className="text-center mb-6">
        <S className="font-bold">Date:</S> {date}
      </Heading3>

      <P className="mb-3">
        Parties:
      </P>

      <Party
        name={party1Name}
        address={party1Address}
        isCompany={party1IsCompany}
        regNumber={party1RegNumber}
        regCountry={party1RegCountry}
        className="mb-4"
      />

      <P className="mb-4">
        and
      </P>

      <Party
        name={party2Name}
        address={party2Address}
        isCompany={party2IsCompany}
        regNumber={party2RegNumber}
        regCountry={party2RegCountry}
        className="mb-6"
      />

      <Clause>
        Each of the parties to this Agreement intends to disclose information (the <S className="font-bold italic">Confidential Information</S>) to the other party for the purpose of {purpose} (the <S className="font-bold italic">Purpose</S>).
      </Clause>

      <Clause>
        Each party to this Agreement is referred to as 'the <S className="font-bold italic">Recipient</S>' when it receives or uses the Confidential Information disclosed by the other party.
      </Clause>

      <Clause>
        The Recipient undertakes not to use the Confidential Information disclosed by the other party for any purpose except the Purpose, without first obtaining the written agreement of the other party.
      </Clause>

      <Clause>
        The Recipient undertakes to keep the Confidential Information disclosed by the other party secure and not to disclose it to any third party except to its employees and professional advisers who need to know the same for the Purpose, who know they owe a duty of confidence to the other party and who are bound by obligations equivalent to those in clause 3 above and this clause 4.
      </Clause>

      <Clause>
        The undertakings in clauses 3 and 4 above apply to all of the information disclosed by each of the parties to the other, regardless of the way or form in which it is disclosed or recorded but they do not apply to:
      </Clause>

      <GList bulletPreset="NUMBERED_UPPERALPHA_ALPHA_ROMAN">
        <Li className="text-justify mb-4">
          any information which is or in future comes into the public domain (unless as a result of the breach of this Agreement); or
        </Li>

        <Li className='text-justify mb-4'>
          any information which is already known to the Recipient and which was not subject to any obligation of confidence before it was disclosed to the Recipient by the other party.
        </Li>
      </GList>

      <Clause>
        Nothing in this Agreement will prevent the Recipient from making any disclosure of the Confidential Information required by law or by any competent authority.
      </Clause>

      <Clause>
        The Recipient will, on request from the other party, return all copies and records of the Confidential Information disclosed by the other party to the Recipient and will not retain any copies or records of the Confidential Information disclosed by the other party.
      </Clause>

      <Clause>
        Neither this Agreement nor the supply of any information grants the Recipient any licence, interest or right in respect of any intellectual property rights of the other party except the right to copy the Confidential Information disclosed by the other party solely for the Purpose.
      </Clause>

      <Clause>
        The undertakings in clauses 3 and 4 will continue in force {durationText}.
      </Clause>

      <Clause>
        This Agreement is governed by, and is to be construed in accordance with, English law. The English Courts will have non-exclusive jurisdiction to deal with any dispute which has arisen or may arise out of, or in connection with, this Agreement.
      </Clause>

      <Table className="mt-6 mb-4 border-0">
        <TRow>
          <TCell className="pl-0 pr-6">
            <P className="mb-3">
              Signed on behalf of <S className="font-bold">{party1Name}</S> by its duly authorised representative:
            </P>
          </TCell>
          <TCell className="pl-6 pr-0">
            <P className="mb-3">
              Signed on behalf of <S className="font-bold">{party2Name}</S> by its duly authorised representative:
            </P>
          </TCell>
        </TRow>

        <TRow>
          <TCell className="pl-0 pr-6">
            <P className="mb-2">
              _____________________________<Br />
              Signature
            </P>
          </TCell>
          <TCell className="pl-6 pr-0">
            <P className="mb-2">
              _____________________________<Br />
              Signature
            </P>
          </TCell>
        </TRow>

        <TRow>
          <TCell className="pl-0 pr-6">
            <P className="mb-2">
              _____________________________<Br />
              Name
            </P>
          </TCell>
          <TCell className="pl-6 pr-0">
            <P className="mb-2">
              _____________________________<Br />
              Name
            </P>
          </TCell>
        </TRow>

        <TRow>
          <TCell className="pl-0 pr-6">
            <P className="mb-2">
              _____________________________<Br />
              Position
            </P>
          </TCell>
          <TCell className="pl-6 pr-0">
            <P className="mb-2">
              _____________________________<Br />
              Position
            </P>
          </TCell>
        </TRow>
      </Table>
    </GDocument>
  );
}

