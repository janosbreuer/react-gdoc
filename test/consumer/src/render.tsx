import {
  GDocument,
  Heading1,
  P,
  S,
  Table,
  TCell,
  TRow,
  renderDocument,
  type DocsClient,
  type GoogleDocsAuth,
  type NamedStyle,
} from 'react-gdoc';

const namedStyles: NamedStyle[] = [
  {
    namedStyleType: 'NORMAL_TEXT',
    textStyle: { weightedFontFamily: { fontFamily: 'Calibri', weight: 400 } },
  },
  {
    namedStyleType: 'HEADING_1',
    textStyle: { weightedFontFamily: { fontFamily: 'Calibri', weight: 400 } },
  },
];

export const statusReport = {
  clientName: 'Northwind Studio',
  reviewDate: '16 October 2026',
  rows: [
    ['Discovery', 'Complete'],
    ['Design', 'In progress'],
    ['Handoff', 'Scheduled'],
  ],
} as const;

export function createStatusReport() {
  const { clientName, reviewDate, rows } = statusReport;
  return (
    <GDocument namedStyles={namedStyles}>
      <Heading1 className="mb-2">Project status</Heading1>
      <P className="mb-4 text-slate-600">
        Prepared for <S className="font-bold">{clientName}</S>. Next review{' '}
        <S className="text-blue-800">{reviewDate}</S>.
      </P>
      <Table>
        <TRow>
          <TCell className="bg-slate-200"><P><S className="font-bold">Work</S></P></TCell>
          <TCell className="bg-slate-200"><P><S className="font-bold">Status</S></P></TCell>
        </TRow>
        {rows.map(([work, status]) => (
          <TRow key={work}>
            <TCell><P>{work}</P></TCell>
            <TCell><P>{status}</P></TCell>
          </TRow>
        ))}
      </Table>
    </GDocument>
  );
}

export async function renderStatusReport(host: { client?: DocsClient; auth?: GoogleDocsAuth }) {
  return renderDocument(createStatusReport(), {
    client: host.client,
    auth: host.auth,
    title: `Project status — ${statusReport.clientName}`,
  });
}
