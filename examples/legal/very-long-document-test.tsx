import React from 'react';
import { Br, P, S } from '@react-gdoc/shortcuts';
import { Heading1, Heading3 } from '@react-gdoc/headings';
import { GDocument } from '@react-gdoc/primitives';
import { Table, TRow, TCell } from '@react-gdoc/tables';
import { NamedStyleConfig1 } from './namedStyles';

export default function VeryLongDocumentTest() {
  const currentDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const purpose = 'discussing the possibility of the parties entering into a joint venture';

  const Clause: React.FC<{ number: number; children: React.ReactNode }> = ({ number, children }) => {
    return (
      <P className="mb-4">
        <S className="font-bold text-lg text-blue-600">{number}.</S> {children}
      </P>
    );
  };

  const clauses = [];
  for (let i = 0; i < 100; i++) {
    const baseNumber = i * 4;
    clauses.push(
      <Clause key={`${i}-1`} number={baseNumber + 1}>
        Each of the parties to this Agreement intends to disclose information (the <S className="font-bold italic">Confidential Information</S>) to the other party for the purpose of {purpose} (the <S className="font-bold italic">Purpose</S>).
      </Clause>
    );
    clauses.push(
      <Clause key={`${i}-2`} number={baseNumber + 2}>
        Each party to this Agreement is referred to as 'the <S className="font-bold italic">Recipient</S>' when it receives or uses the Confidential Information disclosed by the other party.
      </Clause>
    );
    clauses.push(
      <Clause key={`${i}-3`} number={baseNumber + 3}>
        The Recipient undertakes not to use the Confidential Information disclosed by the other party for any purpose except the Purpose, without first obtaining the written agreement of the other party.
      </Clause>
    );
    clauses.push(
      <Clause key={`${i}-4`} number={baseNumber + 4}>
        The Recipient undertakes to keep the Confidential Information disclosed by the other party secure and not to disclose it to any third party except to its employees and professional advisers who need to know the same for the Purpose, who know they owe a duty of confidence to the other party and who are bound by obligations equivalent to those in clause {baseNumber + 3} above and this clause {baseNumber + 4}.
      </Clause>
    );
  }

  return (
    <GDocument namedStyles={NamedStyleConfig1}>
      <Heading1 className="text-center mb-4">
        Very Long Document Test <Br />
        <S className="font-bold text-blue-600">Performance Testing</S>
      </Heading1>

      <Heading3 className="text-center mb-6">
        <S className="font-bold">Date:</S> {currentDate}
      </Heading3>

      <P className="mb-6">
        This document contains 400 clauses (4 clauses repeated 100 times) for performance testing purposes.
      </P>

      {clauses}

      <Table className="mt-6 mb-4 border-0">
        <TRow>
          <TCell className="pl-0 pr-6">
            <P className="mb-3">
              Signed on behalf of <S className="font-bold">Party 1</S> by its duly authorised representative:
            </P>
          </TCell>
          <TCell className="pl-6 pr-0">
            <P className="mb-3">
              Signed on behalf of <S className="font-bold">Party 2</S> by its duly authorised representative:
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

