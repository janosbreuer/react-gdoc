import React from 'react';
import { Cursor } from './Cursor';
import { RequestBuilder } from './RequestBuilder';
import type { VirtualNode, FormatInfo, VirtualNodeType } from './VirtualNode';
import type { Request, Document } from '../components/primitives/types';
import { docs_v1 } from 'googleapis';

type BatchUpdateFn = (requests: Request[]) => Promise<void>;
type GetDocumentFn = () => Promise<Document>;

interface QueuedTable {
  id: string;
  node: VirtualNode;
  startIndex: number;
}

const KNOWN_VIRTUAL_NODE_TYPES: VirtualNodeType[] = [
  'GTextRun', 'GParagraph', 'GPageBreak', 'GColumnBreak', 'GHorizontalRule',
  'GFootnoteReference', 'GEquation', 'GInlineObject', 'GTable', 'GTableRow',
  'GTableCell', 'GSectionBreak', 'GListItem', 'GImage'
];

export class GDocRenderer {
  private cursor: Cursor;
  private requestBuilder: RequestBuilder;
  private formatInfos: FormatInfo[] = [];
  private tableQueue: QueuedTable[] = [];
  
  constructor(
    private batchUpdate: BatchUpdateFn,
    private getDocument: GetDocumentFn
  ) {
    this.cursor = new Cursor(1);
    this.requestBuilder = new RequestBuilder(this.cursor);
  }

  async render(element: React.ReactElement): Promise<void> {
    this.cursor.reset();
    this.formatInfos = [];
    this.tableQueue = [];
    
    const virtualNode = this.jsxToVirtualNode(element);
    if (!virtualNode) return;

    console.log("--- Fázis 1: Táblázatokon kívüli tartalom beszúrása ---");
    this.renderInsertPhase(virtualNode);
    
    const beforeTableFormatInfos = this.formatInfos.filter(fi => {
      return this.tableQueue.every(tq => fi.endIndex <= tq.startIndex);
    });
    
    const afterTableFormatInfos = this.formatInfos.filter(fi => {
      return this.tableQueue.some(tq => fi.startIndex > tq.startIndex);
    });
    
    const initialRequests = this.requestBuilder.getAllRequests();
    if (initialRequests.length > 0) {
      await this.batchUpdate(initialRequests);
    }

    if (this.tableQueue.length === 0) {
      this.renderFormatPhase();
      const formatRequests = this.requestBuilder.getAllRequests();
      if (formatRequests.length > 0) {
        await this.batchUpdate(formatRequests);
      }
      return;
    }

    console.log("--- Fázis 2: Táblázatok ELŐTTI formázás alkalmazása ---");
    const beforeTableFormatBuilder = new RequestBuilder(new Cursor(0));
    this.formatInfos = beforeTableFormatInfos;
    this.requestBuilder = beforeTableFormatBuilder;
    this.renderFormatPhase();
    const beforeTableFormatRequests = beforeTableFormatBuilder.getAllRequests();
    if (beforeTableFormatRequests.length > 0) {
      await this.batchUpdate(beforeTableFormatRequests);
    }

    console.log("--- Fázis 3: Táblázatok beszúrása visszafelé sorrendben ---");
    const tableInsertRequests = this.generateTableInsertRequests();
    if (tableInsertRequests.length > 0) {
      await this.batchUpdate(tableInsertRequests);
    }

    console.log("--- Fázis 4: Dokumentum struktúra lekérése ---");
    const updatedDoc = await this.getDocument();
    
    console.log("--- Fázis 5: Táblázatok UTÁNI formázás alkalmazása (indexek frissítése után) ---");
    this.formatInfos = afterTableFormatInfos;
    this.updateFormatIndexes(updatedDoc);
    const afterTableFormatBuilder = new RequestBuilder(new Cursor(0));
    this.requestBuilder = afterTableFormatBuilder;
    this.renderFormatPhase();
    const afterTableFormatRequests = afterTableFormatBuilder.getAllRequests();
    if (afterTableFormatRequests.length > 0) {
      await this.batchUpdate(afterTableFormatRequests);
    }
    
    console.log("--- Fázis 6: Táblázat cellák formázása ---");
    const cellFormatRequests = this.applyCellFormatting(updatedDoc);
    if (cellFormatRequests.length > 0) {
      await this.batchUpdate(cellFormatRequests);
    }
    
    console.log("--- Fázis 7: Táblázat tartalom feltöltése ---");
    const secondPhaseRequests = this.generateSecondPhaseRequests(updatedDoc);
    
    if (secondPhaseRequests.length > 0) {
      await this.batchUpdate(secondPhaseRequests);
    }
  }

  private jsxToVirtualNode(element: React.ReactElement | React.ReactNode): VirtualNode | null {
    if (element === null || element === undefined || typeof element === 'boolean') {
      return null;
    }

    if (typeof element === 'string' || typeof element === 'number') {
      return {
        type: 'GTextRun',
        props: { content: String(element) },
        children: [],
      };
    }

    if (Array.isArray(element)) {
      return {
        type: 'Fragment',
        props: {},
        children: element.map(child => this.jsxToVirtualNode(child)).filter((node): node is VirtualNode => node !== null),
      };
    }

    if (React.isValidElement(element)) {
      const type = element.type as any;
      
      if (type === React.Fragment || (type && type.$$typeof && type.$$typeof.toString().includes('Fragment'))) {
        const props = element.props || {};
        const children = React.Children.toArray(props.children || []);
        return {
          type: 'Fragment',
          props: {},
          children: children.map(child => this.jsxToVirtualNode(child)).filter((node): node is VirtualNode => node !== null),
        };
      }
      
      const typeName = this.getComponentTypeName(type);
      
      if (typeof type === 'function' && typeName === 'Fragment') {
        const props = element.props || {};
        try {
          const result = type(props);
          if (React.isValidElement(result) || Array.isArray(result)) {
            return this.jsxToVirtualNode(result);
          }
          if (result === null || result === undefined) {
            return null;
          }
        } catch (e) {
          console.warn(`Warning: Component ${type.name || 'Unknown'} threw an error, treating as Fragment:`, e);
        }
      }
      
      const props = element.props || {};
      const children = React.Children.toArray(props.children || []);

      return {
        type: typeName,
        props: { ...props, children: undefined },
        children: children.map(child => this.jsxToVirtualNode(child)).filter((node): node is VirtualNode => node !== null),
      };
    }

    return null;
  }

  private getComponentTypeName(type: any): VirtualNodeType {
    if (typeof type === 'string') {
      return type as VirtualNodeType;
    }

    if (type && type.name) {
      const name = type.name as VirtualNodeType;
      if (KNOWN_VIRTUAL_NODE_TYPES.includes(name)) {
        return name;
      }
    }

    if (type && type.displayName) {
      const displayName = type.displayName as VirtualNodeType;
      if (KNOWN_VIRTUAL_NODE_TYPES.includes(displayName)) {
        return displayName;
      }
    }

    return 'Fragment';
  }

  private renderInsertPhase(node: VirtualNode | null): void {
    if (!node) return;

    const startIndex = this.cursor.getPosition();

    switch (node.type) {
      case 'GTextRun':
        this.handleTextRun(node, startIndex);
        break;
      case 'GParagraph':
        this.handleParagraph(node, startIndex);
        break;
      case 'GPageBreak':
        this.handlePageBreak(startIndex);
        break;
      case 'GColumnBreak':
        this.handleColumnBreak(startIndex);
        break;
      case 'GHorizontalRule':
        this.handleHorizontalRule(startIndex);
        break;
      case 'GEquation':
        this.handleEquation(node, startIndex);
        break;
      case 'GImage':
        this.handleImage(node, startIndex);
        break;
      case 'GTable':
        this.handleTableSkeleton(node, startIndex);
        break;
      case 'GTableRow':
        break;
      case 'GTableCell':
        break;
      case 'GSectionBreak':
        this.handleSectionBreak(node, startIndex);
        break;
      case 'GListItem':
        this.handleListItem(node, startIndex);
        break;
      case 'Fragment':
        node.children?.forEach(child => this.renderInsertPhase(child));
        break;
      default:
        node.children?.forEach(child => this.renderInsertPhase(child));
        break;
    }

    const endIndex = this.cursor.getPosition();
    node.startIndex = startIndex;
    node.endIndex = endIndex;

    if (node.type === 'GTextRun' && (node.props.style || node.props.textStyle)) {
      this.formatInfos.push({
        node,
        startIndex,
        endIndex,
        textStyle: node.props.style || node.props.textStyle,
      });
    } else if (node.type === 'GParagraph' && (node.props.style || node.props.paragraphStyle)) {
      this.formatInfos.push({
        node,
        startIndex,
        endIndex,
        paragraphStyle: node.props.style || node.props.paragraphStyle,
      });
    }
  }

  private handleTextRun(node: VirtualNode, startIndex: number): void {
    const content = node.props.content || '';
    if (content) {
      this.requestBuilder.addInsertText(content, startIndex);
      this.cursor.advance(content.length);
    }
  }

  private handleParagraph(node: VirtualNode, startIndex: number): void {
    const paragraphStartIndex = this.cursor.getPosition();
    this.requestBuilder.addInsertText('\n', paragraphStartIndex);
    this.cursor.advance(1);
    
    node.children?.forEach(child => this.renderInsertPhase(child));
    this.requestBuilder.addInsertText('\n', this.cursor.getPosition());
    this.cursor.advance(1);
  }

  private handlePageBreak(startIndex: number): void {
    this.requestBuilder.addInsertPageBreak(startIndex);
    this.cursor.advance(1);
  }

  private handleColumnBreak(startIndex: number): void {
    this.requestBuilder.addInsertColumnBreak(startIndex);
    this.cursor.advance(1);
  }

  private handleHorizontalRule(startIndex: number): void {
    this.requestBuilder.addInsertHorizontalRule(startIndex);
    this.cursor.advance(1);
  }

  private handleEquation(node: VirtualNode, startIndex: number): void {
    const equation = node.props.equation || '';
    if (equation) {
      this.requestBuilder.addInsertText(equation, startIndex);
      this.cursor.advance(equation.length);
    }
  }

  private handleImage(node: VirtualNode, startIndex: number): void {
    const url = node.props.url;
    const base64 = node.props.base64;
    const width = node.props.width;
    const height = node.props.height;

    if (url) {
      this.requestBuilder.addInsertInlineImage(url, startIndex, width, height);
      this.cursor.advance(1);
    } else if (base64) {
      const dataUri = `data:image/png;base64,${base64}`;
      this.requestBuilder.addInsertInlineImage(dataUri, startIndex, width, height);
      this.cursor.advance(1);
    }
  }

  private handleTableSkeleton(node: VirtualNode, startIndex: number): void {
    const rows = node.children?.length || 1;
    const cols = node.children?.[0]?.children?.length || 1;

    console.log(`[Skeleton] Táblázat pozíció elmentve: ${rows}x${cols} itt: ${startIndex}`);
    
    this.tableQueue.push({
      id: `table_${this.tableQueue.length}`,
      node: node,
      startIndex: startIndex
    });
  }

  private handleSectionBreak(node: VirtualNode, startIndex: number): void {
    this.cursor.advance(1);
  }

  private handleListItem(node: VirtualNode, startIndex: number): void {
    node.children?.forEach(child => this.renderInsertPhase(child));
    const endIndex = this.cursor.getPosition();
    
    const nestingLevel = node.props.nestingLevel || 0;
    const listId = node.props.listId;
    const ordered = node.props.ordered || false;
    
    this.formatInfos.push({
      node,
      startIndex,
      endIndex,
      paragraphStyle: {
        bullet: {
          listId: listId,
          nestingLevel: nestingLevel,
          ordered: ordered,
        } as any,
      } as any,
    });
  }

  private renderFormatPhase(): void {
    for (const formatInfo of this.formatInfos) {
      if (formatInfo.textStyle) {
        this.requestBuilder.addUpdateTextStyle(
          formatInfo.startIndex,
          formatInfo.endIndex,
          formatInfo.textStyle
        );
      }
      if (formatInfo.paragraphStyle) {
        const styleCopy = { ...formatInfo.paragraphStyle };
        const bullet = (styleCopy as any).bullet;
        delete (styleCopy as any).bullet;

        if (Object.keys(styleCopy).length > 0) {
          this.requestBuilder.addUpdateParagraphStyle(
            formatInfo.startIndex,
            formatInfo.endIndex,
            styleCopy
          );
        }

        if (bullet) {
          const nestingLevel = bullet.nestingLevel || 0;
          const ordered = bullet.ordered || false;
          this.requestBuilder.addCreateParagraphBullets(
            formatInfo.startIndex,
            formatInfo.endIndex,
            nestingLevel,
            ordered
          );
        }
      }
    }
  }

  private generateTableInsertRequests(): Request[] {
    const tableRequestBuilder = new RequestBuilder(new Cursor(0));
    
    for (let i = this.tableQueue.length - 1; i >= 0; i--) {
      const queuedTable = this.tableQueue[i];
      const rows = queuedTable.node.children?.length || 1;
      const cols = queuedTable.node.children?.[0]?.children?.length || 1;
      
      console.log(`[Fázis 2] Táblázat beszúrása visszafelé: ${rows}x${cols} index ${queuedTable.startIndex}`);
      tableRequestBuilder.addInsertTable(rows, cols, queuedTable.startIndex);
    }
    
    return tableRequestBuilder.getAllRequests();
  }

  private generateSecondPhaseRequests(doc: Document): Request[] {
    const secondPhaseRequestBuilder = new RequestBuilder(new Cursor(0));
    const tablesInDoc = this.findAllTablesInDoc(doc);

    console.log(`[Fázis 4] Táblázatok száma: queue=${this.tableQueue.length}, doc=${tablesInDoc.length}`);

    for (let tableIndex = this.tableQueue.length - 1; tableIndex >= 0; tableIndex--) {
      const queuedTable = this.tableQueue[tableIndex];
      const realTable = tablesInDoc[tableIndex];
      if (!realTable) {
        console.warn(`[Fázis 4] Táblázat ${tableIndex} nem található a dokumentumban`);
        continue;
      }

      console.log(`[Fázis 4] Táblázat ${tableIndex} feldolgozása visszafelé: ${queuedTable.node.children?.length || 0} sor`);

      const rows = queuedTable.node.children || [];
      for (let rowIdx = rows.length - 1; rowIdx >= 0; rowIdx--) {
        const row = rows[rowIdx];
        const cells = row.children || [];
        for (let colIdx = cells.length - 1; colIdx >= 0; colIdx--) {
          const cell = cells[colIdx];
          const cellData = realTable.tableRows?.[rowIdx]?.tableCells?.[colIdx];
          if (!cellData || !cellData.content || cellData.content.length === 0) {
            console.warn(`[Fázis 4] Táblázat ${tableIndex}, Cella [${rowIdx}, ${colIdx}] nem található vagy üres`);
            continue;
          }
          
          const firstParagraph = cellData.content.find((elem: any) => elem.paragraph);
          const cellStartIndex = firstParagraph?.startIndex || 'unknown';
          console.log(`[Fázis 4] Táblázat ${tableIndex}, Cella [${rowIdx}, ${colIdx}] feldolgozása visszafelé, startIndex=${cellStartIndex}`);
          this.renderCellContent(cell, cellData, secondPhaseRequestBuilder);
        }
      }
    }

    return secondPhaseRequestBuilder.getAllRequests();
  }

  private renderCellContent(cellNode: VirtualNode, cellData: any, rb: RequestBuilder): void {
    console.log(`[renderCellContent] cellNode children count=${cellNode.children?.length || 0}, cellData content count=${cellData.content?.length || 0}`);
    
    const paragraphs = cellData.content?.filter((elem: any) => elem.paragraph) || [];
    
    cellNode.children?.forEach((pNode, pIdx) => {
      if (pNode.type === 'GParagraph') {
        const paragraphData = paragraphs[pIdx];
        if (!paragraphData || !paragraphData.paragraph) {
          console.warn(`[renderCellContent] Bekezdés ${pIdx} nem található a cellában`);
          return;
        }
        
        const paragraphStartIndex = paragraphData.startIndex;
        let textOffset = 0;
        
        pNode.children?.forEach((textNode, textIdx) => {
          if (textNode.type === 'GTextRun') {
            const text = textNode.props.content || '';
            if (text) {
              const insertIndex = paragraphStartIndex + textOffset;
              console.log(`[renderCellContent] Beszúrás: "${text}" index ${insertIndex} (paragraphStartIndex=${paragraphStartIndex}, textOffset=${textOffset})`);
              rb.addInsertText(text, insertIndex);
              textOffset += text.length;
            }
          }
        });
      }
    });
  }

  private updateFormatIndexes(doc: Document): void {
    const tablesInDoc = this.findAllTablesInDoc(doc);
    
    for (const formatInfo of this.formatInfos) {
      let offset = 0;
      
      for (let i = 0; i < this.tableQueue.length; i++) {
        const queuedTable = this.tableQueue[i];
        if (queuedTable.startIndex < formatInfo.startIndex) {
          const realTable = tablesInDoc[i];
          if (realTable && realTable.startIndex !== undefined && realTable.endIndex !== undefined) {
            const tableSize = realTable.endIndex - realTable.startIndex;
            offset += tableSize;
          }
        }
      }
      
      if (offset > 0) {
        formatInfo.startIndex += offset;
        formatInfo.endIndex += offset;
      }
    }
  }

  private findAllTablesInDoc(doc: Document): any[] {
    const tables: any[] = [];
    doc.body?.content?.forEach((element: any) => {
      if (element.table) {
        tables.push({
          ...element.table,
          startIndex: element.startIndex,
          endIndex: element.endIndex
        });
      }
    });
    return tables;
  }

  private applyCellFormatting(doc: Document): Request[] {
    const formatRequestBuilder = new RequestBuilder(new Cursor(0));
    const tablesInDoc = this.findAllTablesInDoc(doc);

    let tableElementIndex = 0;
    doc.body?.content?.forEach((element: any, elementIndex: number) => {
      if (element.table) {
        const tableIndex = tableElementIndex;
        const queuedTable = this.tableQueue[tableIndex];
        if (!queuedTable) {
          tableElementIndex++;
          return;
        }

        const rows = queuedTable.node.children || [];
        rows.forEach((row: VirtualNode, rowIdx: number) => {
          const cells = row.children || [];
          cells.forEach((cell: VirtualNode, colIdx: number) => {
            if (cell.props.style) {
              const styleCopy = { ...cell.props.style };
              const tableCellLocation: any = {
                tableStartLocation: {
                  index: element.startIndex
                },
                rowIndex: rowIdx,
                columnIndex: colIdx
              };
              formatRequestBuilder.addUpdateTableCellStyle(tableCellLocation, styleCopy);
            }
          });
        });

        tableElementIndex++;
      }
    });

    return formatRequestBuilder.getAllRequests();
  }
}
