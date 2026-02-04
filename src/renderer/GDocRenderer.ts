import React from 'react';
import { RequestBuilder } from './RequestBuilder';
import type { VirtualNode, VirtualNodeType } from './VirtualNode';
import type { Request, Document } from '../components/primitives/types';
import { docs_v1 } from 'googleapis';

type TextStyle = docs_v1.Schema$TextStyle;
type BatchUpdateFn = (requests: Request[]) => Promise<void>;
type GetDocumentFn = () => Promise<Document>;

interface QueuedTable {
  node: VirtualNode;
  startIndex: number;
}


const KNOWN_VIRTUAL_NODE_TYPES: VirtualNodeType[] = [
  'GTextRun', 'GParagraph', 'GPageBreak', 'GColumnBreak', 'GHorizontalRule',
  'GFootnoteReference', 'GEquation', 'GInlineObject', 'GTable', 'GTableRow',
  'GTableCell', 'GSectionBreak', 'GListItem', 'GImage'
];

interface RenderContext {
  styleStack: StyleStack;
  requestBuilder: RequestBuilder;
  startIndex: number;
}

class StyleStack {
  private currentStyle: TextStyle;
  private rollbackStack: TextStyle[] = [];
  private defaultStyle: TextStyle = {
    bold: false, italic: false, underline: false, strikethrough: false,
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: { red: 0, green: 0, blue: 0 } } },
  };

  constructor(private requestBuilder: RequestBuilder, private startIndex: number) {
    this.currentStyle = this.defaultStyle;
  }

  withStyle(newStyle: TextStyle | null, block: () => number): number {
    const styleUpdate = newStyle || {};
    const currentStyle = this.currentStyle;
    console.log('[StyleStack.withStyle] START');
    console.log('[StyleStack.withStyle] styleUpdate:', JSON.stringify(styleUpdate, null, 2));
    console.log('[StyleStack.withStyle] currentStyle:', JSON.stringify(currentStyle, null, 2));
    console.log('[StyleStack.withStyle] rollbackStack size (before push):', this.rollbackStack.length);
    
    const rollbackStyle = Object.keys(styleUpdate).reduce((acc, key) => {
      const styleKey = key as keyof TextStyle;
      acc[styleKey] = this.currentStyle[styleKey] !== undefined ? this.currentStyle[styleKey] : (this.defaultStyle as any)[styleKey];
      return acc;
    }, {} as Partial<TextStyle>);
    console.log('[StyleStack.withStyle] rollbackStyle:', JSON.stringify(rollbackStyle, null, 2));
    
    const lastRollbackStyle = this.rollbackStack.length > 0 ? this.rollbackStack[this.rollbackStack.length - 1] : {};
    console.log('[StyleStack.withStyle] lastRollbackStyle:', JSON.stringify(lastRollbackStyle, null, 2));
    
    this.rollbackStack.push(rollbackStyle as TextStyle);
    console.log('[StyleStack.withStyle] rollbackStack size (after push):', this.rollbackStack.length);
    
    this.currentStyle = { ...this.currentStyle, ...styleUpdate };
    console.log('[StyleStack.withStyle] currentStyle (after merge):', JSON.stringify(this.currentStyle, null, 2));
    
    const length = block();
    console.log('[StyleStack.withStyle] block() returned length:', length);

    this.rollbackStack.pop();
    console.log('[StyleStack.withStyle] rollbackStack size (after pop):', this.rollbackStack.length);

    const combinedUpdate = { ...lastRollbackStyle, ...styleUpdate };
    console.log('[StyleStack.withStyle] combinedUpdate:', JSON.stringify(combinedUpdate, null, 2));
    console.log('[StyleStack.withStyle] startIndex:', this.startIndex, 'endIndex:', this.startIndex + length);
    
    if (Object.keys(combinedUpdate).length > 0) {
      this.requestBuilder.addUpdateTextStyle(this.startIndex, this.startIndex + length, combinedUpdate);
      console.log('[StyleStack.withStyle] Applied text style update');
    } else {
      console.log('[StyleStack.withStyle] No style update needed (empty combinedUpdate)');
    }
    
    this.currentStyle = currentStyle;
    console.log('[StyleStack.withStyle] currentStyle (restored):', JSON.stringify(this.currentStyle, null, 2));
    console.log('[StyleStack.withStyle] END');
    return length;
  }
}

export class GDocRenderer {

  private tableQueue: QueuedTable[] = [];
  constructor(
    private batchUpdate: BatchUpdateFn,
    private getDocument: GetDocumentFn
  ) {}

  // --- Renderelés ---
  async render(element: React.ReactElement, startIndex: number = 1): Promise<void> {
    
    const virtualNode = this.jsxToVirtualNode(element);
    if (!virtualNode) return;

    const requestBuilder = new RequestBuilder();
    const styleStack = new StyleStack(requestBuilder, startIndex);
    const renderContext: RenderContext = {
      styleStack,
      requestBuilder,
      startIndex
    };

    // 1. FÁZIS: Szövegek és üres táblázatok beszúrása
    this.renderInsertPhase(virtualNode, renderContext);
    const initialRequests = requestBuilder.getAllRequests();
    if (initialRequests.length > 0) {
      await this.batchUpdate(initialRequests);
    }

    if (this.tableQueue.length === 0) return;

    // 2. FÁZIS: Pontos indexek lekérése a dokumentumból
    const doc = await this.getDocument();
    const tableUpdateBuilder = new RequestBuilder();

    // A táblázatokat sorrendben szúrtuk be, de a tartalommal hátulról előre kell tölteni
    // a dokumentum indexstabilitása miatt.
    for (let i = this.tableQueue.length - 1; i >= 0; i--) {
      const queued = this.tableQueue[i];
      // Megkeressük a táblázatot a lekért dokumentumban a mentett startIndex alapján
      const table = this.findTableAt(doc, queued.startIndex);
      
      if (table && table.tableRows) {
        this.fillTableContent(queued.node, table, { ...renderContext, requestBuilder: tableUpdateBuilder });
      }
    }

    const finalRequests = tableUpdateBuilder.getAllRequests();
    if (finalRequests.length > 0) {
      await this.batchUpdate(finalRequests);
    }
  }

  private renderInsertPhase(node: VirtualNode, renderContext: RenderContext): number {
    let length = 0;
    switch (node.type) {
      case 'GTextRun':
        length = this.handleTextRun(node, renderContext);
        break;
      case 'GParagraph':
        length = this.handleParagraph(node, renderContext);
        break;
      case 'GTable':
        // Csak üres vázat szúrunk be, és elmentjük a pozíciót
        const rows = node.children?.length || 1;
        const cols = node.children?.[0]?.children?.length || 1;
        renderContext.requestBuilder.addInsertTable(rows, cols, renderContext.startIndex);
        this.tableQueue.push({ node, startIndex: renderContext.startIndex });
        length = 1;
        break;
      default:
        if (node.children) {
          [...node.children].reverse().forEach(child => {
            length += this.renderInsertPhase(child, renderContext);
          });
        }
        break;
    }
    return length;
  }

  private fillTableContent(node: VirtualNode, table: docs_v1.Schema$Table, renderContext: RenderContext) {
    const vRows = node.children || [];
    
    // Végigmegyünk a táblázat sorain és celláin
    vRows.forEach((vRow, rIndex) => {
      const vCells = vRow.children || [];
      const docRow = table.tableRows?.[rIndex];

      vCells.forEach((vCell, cIndex) => {
        const docCell = docRow?.tableCells?.[cIndex];
        if (docCell && docCell.content && vCell.children) {
          // A Google Docs minden cellába tesz egy alapértelmezett üres paragrafust.
          // Ennek az indexe a cella kezdete.
          const cellContentStart = docCell.startIndex! + 1;
          
          // A cella tartalmát hátulról előre szúrjuk be
          [...vCell.children].reverse().forEach(child => {
            this.renderInsertPhase(child, { ...renderContext, startIndex: cellContentStart });
          });
        }
      });
    });
  }

  private findTableAt(doc: Document, index: number): docs_v1.Schema$Table | null {
    // Megkeressük a StructuralElement-et a megadott indexen
    const element = doc.body?.content?.find(el => el.startIndex === index);
    return element?.table || null;
  }

  private handleTextRun(node: VirtualNode, renderContext: RenderContext): number {
    const content = node.props.content || '';
    if (!content) return 0;
    return renderContext.styleStack.withStyle(node.props.style || node.props.textStyle || {}, () => {
      console.log('[handleTextRun] addInsertText content:', content);
      renderContext.requestBuilder.addInsertText(content, renderContext.startIndex);
      return content.length;
    });
  }

  private handleParagraph(node: VirtualNode, renderContext: RenderContext): number {
    let internalLength = 0;
    renderContext.requestBuilder.addInsertText('\n', renderContext.startIndex);
    if (node.children) {
      [...node.children].reverse().forEach(child => {
        internalLength += this.renderInsertPhase(child, renderContext);
      });
    }
    const style = node.props.style || node.props.paragraphStyle;
    if (style) renderContext.requestBuilder.addUpdateParagraphStyle(renderContext.startIndex, renderContext.startIndex + internalLength, style);
    return internalLength + 1;
  }

  private jsxToVirtualNode(element: React.ReactElement | React.ReactNode): VirtualNode | null {
    if (!element || typeof element === 'boolean') return null;
    if (typeof element === 'string' || typeof element === 'number') {
      return { type: 'GTextRun', props: { content: String(element) }, children: [] };
    }
    if (Array.isArray(element)) {
      return { type: 'Fragment', props: {}, children: element.map(c => this.jsxToVirtualNode(c)).filter((n): n is VirtualNode => n !== null) };
    }
    if (React.isValidElement(element)) {
      const type = element.type as any;
      const typeName = this.getComponentTypeName(type);
      const props = element.props || {};
      if (typeof type === 'function' && typeName === 'Fragment') {
        try { return this.jsxToVirtualNode(type(props)); } catch (e) { return null; }
      }
      return {
        type: typeName,
        props: { ...props, children: undefined },
        children: React.Children.toArray(props.children).map(c => this.jsxToVirtualNode(c)).filter((n): n is VirtualNode => n !== null),
      };
    }
    return null;
  }

  private getComponentTypeName(type: any): VirtualNodeType {
    if (typeof type === 'string') return type as VirtualNodeType;
    const name = type.displayName || type.name;
    return KNOWN_VIRTUAL_NODE_TYPES.includes(name) ? name : 'Fragment';
  }
}
