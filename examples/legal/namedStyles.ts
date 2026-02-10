import type { NamedStyle } from '@react-gdoc/primitives';

export const NamedStyleConfig1: NamedStyle[] = [
  {
    namedStyleType: 'NORMAL_TEXT',
    paragraphStyle: {
      alignment: 'JUSTIFIED'
    },
    textStyle: {
      weightedFontFamily: { fontFamily: 'Times New Roman', weight: 400 }
    }
  },
  {
    namedStyleType: 'HEADING_1',
    textStyle: {
      weightedFontFamily: { fontFamily: 'Times New Roman', weight: 400 }
    }
  },
  {
    namedStyleType: 'HEADING_3',
    textStyle: {
      weightedFontFamily: { fontFamily: 'Times New Roman', weight: 400 }
    }
  }
];

