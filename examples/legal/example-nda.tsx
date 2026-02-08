import React from 'react';
import { Br, P, S, Ol, Li } from '@react-gdoc/shortcuts';
import { Heading1, Heading2 } from '@react-gdoc/headings';
import { GList } from '@react-gdoc/primitives';

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
  const currentYear = new Date().getFullYear();
  const defaultDate = `${currentYear}`;
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

  const formatParty = (party: PartyData, name: string, address: string, isCompany: boolean, regNumber?: string, regCountry?: string) => {
    if (isCompany && regNumber && regCountry) {
      return `${name}, a company registered in ${regCountry} under company number ${regNumber} whose registered office is at ${address}`;
    }
    return `${name} of ${address}`;
  };

  const party1Text = formatParty(DEFAULT_PARTY_1, party1Name, party1Address, party1IsCompany, party1RegNumber, party1RegCountry);
  const party2Text = formatParty(DEFAULT_PARTY_2, party2Name, party2Address, party2IsCompany, party2RegNumber, party2RegCountry);

  const durationText = durationType === 'indefinitely' 
    ? 'indefinitely' 
    : `for ${durationYears} years from the date of this Agreement`;

  return (
    <>
      <Heading1 className="text-center mb-4">
        An Example of a <Br /><S className="font-bold">Mutual Non-Disclosure Agreement</S>
      </Heading1>

      <P className="text-center mb-6">
        <S className="font-bold">Date:</S> {date}
      </P>

      <P className="mb-3">
        <S className="font-bold">Parties:</S>
      </P>

      <P className="mb-4">
        {party1Text}
      </P>

      <P className="mb-4">
        and
      </P>

      <P className="mb-6">
        {party2Text}
      </P>

      <P className="text-justify mb-4">
        1. Each of the parties to this Agreement intends to disclose information (the <S className="font-bold italic">Confidential Information</S>) to the other party for the purpose of {purpose} (the <S className="font-bold italic">Purpose</S>).
      </P>

      <P className="text-justify mb-4">
        2. Each party to this Agreement is referred to as 'the <S className="font-bold italic">Recipient</S>' when it receives or uses the Confidential Information disclosed by the other party.
      </P>

      <P className="text-justify mb-4">
        3. The Recipient undertakes not to use the Confidential Information disclosed by the other party for any purpose except the Purpose, without first obtaining the written agreement of the other party.
      </P>

      <P className="text-justify mb-4">
        4. The Recipient undertakes to keep the Confidential Information disclosed by the other party secure and not to disclose it to any third party except to its employees and professional advisers who need to know the same for the Purpose, who know they owe a duty of confidence to the other party and who are bound by obligations equivalent to those in clause 3 above and this clause 4.
      </P>

      <P className="text-justify mb-3">
        5. The undertakings in clauses 3 and 4 above apply to all of the information disclosed by each of the parties to the other, regardless of the way or form in which it is disclosed or recorded but they do not apply to:
      </P>

      <GList bulletPreset="NUMBERED_UPPERALPHA_ALPHA_ROMAN">
        <Li className="text-justify mb-4">
          any information which is or in future comes into the public domain (unless as a result of the breach of this Agreement); or
        </Li>

        <Li className='text-justify mb-4'>
          any information which is already known to the Recipient and which was not subject to any obligation of confidence before it was disclosed to the Recipient by the other party.
        </Li>
      </GList>

      <P className="text-justify mb-4">
        6. Nothing in this Agreement will prevent the Recipient from making any disclosure of the Confidential Information required by law or by any competent authority.
      </P>

      <P className="text-justify mb-4">
        7. The Recipient will, on request from the other party, return all copies and records of the Confidential Information disclosed by the other party to the Recipient and will not retain any copies or records of the Confidential Information disclosed by the other party.
      </P>

      <P className="text-justify mb-4">
        8. Neither this Agreement nor the supply of any information grants the Recipient any licence, interest or right in respect of any intellectual property rights of the other party except the right to copy the Confidential Information disclosed by the other party solely for the Purpose.
      </P>

      <P className="text-justify mb-4">
        9. The undertakings in clauses 3 and 4 will continue in force {durationText}.
      </P>

      <P className="text-justify mb-6">
        10. This Agreement is governed by, and is to be construed in accordance with, English law. The English Courts will have non-exclusive jurisdiction to deal with any dispute which has arisen or may arise out of, or in connection with, this Agreement.
      </P>

      <P className="mb-3 mt-6">
        Signed on behalf of {party1Name} by its duly authorised representative:
      </P>

      <P className="mb-2">
        _____________________________<Br />
        Signature
      </P>

      <P className="mb-2">
        _____________________________<Br />
        Name
      </P>

      <P className="mb-6">
        _____________________________<Br />
        Position
      </P>

      <P className="mb-3">
        Signed on behalf of {party2Name} by its duly authorised representative:
      </P>

      <P className="mb-2">
        _____________________________<Br />
        Signature
      </P>

      <P className="mb-2">
        _____________________________<Br />
        Name
      </P>

      <P className="mb-4">
        _____________________________<Br />
        Position
      </P>
    </>
  );
}

