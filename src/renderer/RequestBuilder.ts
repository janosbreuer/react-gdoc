import type { Request, TextStyle, ParagraphStyle, TableCellStyle } from '../components/primitives/types';
import type { FormatInfo } from './VirtualNode';
import { docs_v1 } from 'googleapis';

export class RequestBuilder {
  private requests: Request[] = [];

  constructor() {
  }

  addInsertText(text: string, startIndex: number): void {
    this.requests.push({
      insertText: {
        location: {
          index: startIndex,
        },
        text: text,
      },
    });
  }

  addInsertPageBreak(startIndex: number): void {
    this.requests.push({
      insertPageBreak: {
        location: {
          index: startIndex,
        },
      },
    });
  }

  addInsertColumnBreak(startIndex: number): void {
    this.requests.push({
      insertColumnBreak: {
        location: {
          index: startIndex,
        },
      },
    } as any);
  }


  addInsertHorizontalRule(startIndex: number): void {
    this.requests.push({
      insertHorizontalRule: {
        location: {
          index: startIndex,
        },
      },
    } as any);
  }

  addInsertSectionBreak(startIndex: number, sectionType?: string): void {
    this.requests.push({
      insertSectionBreak: {
        location: {
          index: startIndex,
        },
        sectionType: sectionType,
      },
    } as any);
  }

  addInsertTable(rows: number, columns: number, startIndex: number): void {
    this.requests.push({
      insertTable: {
        location: {
          index: startIndex,
        },
        rows: rows,
        columns: columns,
      },
    });
  }

  addInsertInlineImage(uri: string, startIndex: number, width?: number, height?: number): void {
    const objectSize: docs_v1.Schema$Size = {};
    if (width !== undefined) {
      objectSize.width = { magnitude: width, unit: 'PT' };
    }
    if (height !== undefined) {
      objectSize.height = { magnitude: height, unit: 'PT' };
    }

    this.requests.push({
      insertInlineImage: {
        location: {
          index: startIndex,
        },
        uri: uri,
        objectSize: Object.keys(objectSize).length > 0 ? objectSize : undefined,
      },
    });
  }

  addUpdateTextStyle(startIndex: number, endIndex: number, style: TextStyle): void {
    this.requests.push({
      updateTextStyle: {
        range: {
          startIndex: startIndex,
          endIndex: endIndex,
        },
        textStyle: style,
        fields: this.getTextStyleFields(style),
      },
    });
  }

  addUpdateParagraphStyle(startIndex: number, endIndex: number, style: ParagraphStyle): void {
    this.requests.push({
      updateParagraphStyle: {
        range: {
          startIndex: startIndex,
          endIndex: endIndex,
        },
        paragraphStyle: style,
        fields: this.getParagraphStyleFields(style),
      },
    });
  }

  addCreateParagraphBullets(startIndex: number, endIndex: number, bulletPreset: string = 'BULLET_DISC_CIRCLE_SQUARE'): void {
    this.requests.push({
      createParagraphBullets: {
        range: {
          startIndex: startIndex,
          endIndex: endIndex,
        },
        bulletPreset: bulletPreset,
      } as any,
    });
  }

  addDeleteParagraphBullets(startIndex: number, endIndex: number): void {
    this.requests.push({
      deleteParagraphBullets: {
        range: {
          startIndex: startIndex,
          endIndex: endIndex,
        },
      },
    });
  }


  addUpdateTableCellStyle(tableCellLocation: docs_v1.Schema$TableCellLocation, style: TableCellStyle): void {
    this.requests.push({
      updateTableCellStyle: {
        tableRange: {
          tableCellLocation: tableCellLocation,
          rowSpan: 1,
          columnSpan: 1,
        },
        tableCellStyle: style,
        fields: this.getTableCellStyleFields(style),
      },
    } as any);
  }

  addMergeTableCells(tableStart: docs_v1.Schema$TableRange, tableEnd: docs_v1.Schema$TableRange): void {
    this.requests.push({
      mergeTableCells: {
        tableRange: {
          tableCellLocation: tableStart.tableCellLocation,
          rowSpan: tableEnd.rowSpan,
          columnSpan: tableEnd.columnSpan,
        },
      },
    });
  }

  getAllRequests(): Request[] {
    return this.requests;
  }

  private getTextStyleFields(style: TextStyle): string {
    const fields: string[] = [];
    if (style.bold !== undefined) fields.push('bold');
    if (style.italic !== undefined) fields.push('italic');
    if (style.underline !== undefined) fields.push('underline');
    if (style.strikethrough !== undefined) fields.push('strikethrough');
    if (style.foregroundColor !== undefined) fields.push('foregroundColor');
    if (style.backgroundColor !== undefined) fields.push('backgroundColor');
    if (style.fontSize !== undefined) fields.push('fontSize');
    if (style.weightedFontFamily !== undefined) fields.push('weightedFontFamily');
    if (style.link !== undefined) fields.push('link');
    return fields.join(',');
  }

  private getParagraphStyleFields(style: ParagraphStyle): string {
    const fields: string[] = [];
    if (style.namedStyleType !== undefined) fields.push('namedStyleType');
    if (style.alignment !== undefined) fields.push('alignment');
    if (style.lineSpacing !== undefined) fields.push('lineSpacing');
    if (style.spaceAbove !== undefined) fields.push('spaceAbove');
    if (style.spaceBelow !== undefined) fields.push('spaceBelow');
    if (style.keepWithNext !== undefined) fields.push('keepWithNext');
    if (style.keepLinesTogether !== undefined) fields.push('keepLinesTogether');
    if (style.avoidWidowAndOrphan !== undefined) fields.push('avoidWidowAndOrphan');
    if (style.direction !== undefined) fields.push('direction');
    if (style.indentFirstLine !== undefined) fields.push('indentFirstLine');
    if (style.indentStart !== undefined) fields.push('indentStart');
    if (style.indentEnd !== undefined) fields.push('indentEnd');
    return fields.join(',');
  }

  private getTableCellStyleFields(style: TableCellStyle): string {
    const fields: string[] = [];
    if (style.backgroundColor !== undefined) fields.push('backgroundColor');
    if (style.borderBottom !== undefined) fields.push('borderBottom');
    if (style.borderLeft !== undefined) fields.push('borderLeft');
    if (style.borderRight !== undefined) fields.push('borderRight');
    if (style.borderTop !== undefined) fields.push('borderTop');
    if (style.paddingBottom !== undefined) fields.push('paddingBottom');
    if (style.paddingLeft !== undefined) fields.push('paddingLeft');
    if (style.paddingRight !== undefined) fields.push('paddingRight');
    if (style.paddingTop !== undefined) fields.push('paddingTop');
    if (style.contentAlignment !== undefined) fields.push('contentAlignment');
    return fields.join(',');
  }
}

