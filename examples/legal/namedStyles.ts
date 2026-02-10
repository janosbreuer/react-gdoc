import type { NamedStyle } from '@react-gdoc/primitives';

const timesNewRoman = { textStyle: { weightedFontFamily: { fontFamily: 'Times New Roman', weight: 400 } } };
const font2 = { textStyle: { weightedFontFamily: { fontFamily: 'Courier New', weight: 400 } } };

export const NamedStyleConfig1: NamedStyle[] = [
  {
    namedStyleType: 'NORMAL_TEXT',
    paragraphStyle: {
      alignment: 'JUSTIFIED'
    },
    ...timesNewRoman
  },
  {
    namedStyleType: 'HEADING_1',
    ...timesNewRoman
  },
  {
    namedStyleType: 'HEADING_3',
    ...timesNewRoman
  }
];

export const NamedStyleConfig2: NamedStyle[] = [
  {
    namedStyleType: 'NORMAL_TEXT',
    paragraphStyle: {
      alignment: 'JUSTIFIED'
    },
    ...font2
  },
  {
    namedStyleType: 'HEADING_1',
    ...font2
  },
  {
    namedStyleType: 'HEADING_3',
    ...font2
  }
];





