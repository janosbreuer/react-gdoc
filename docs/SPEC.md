# React-GDoc Specifikáció

## Parametrizálható elemek

Eddig 3 (vagy 4) féle dolgot lehet parametrizálni:

- **GTextRun** - `TextStyle`
- **GParagraph** - `ParagraphStyle`
- **GTableCell** - `TableCellStyle`
- **(GSection)** - `SectionStyle` (ez következő verzióban lehetne)

## Stílus típusok

- `TextStyle` - szöveg formázás (betűtípus, szín, vastagság, méret, stb.)
- `ParagraphStyle` - bekezdés formázás (igazítás, margók, indentálás, stb.)
- `TableCellStyle` - táblázat cella formázás (padding, border, háttérszín, stb.)
- `SectionStyle` - szakasz formázás (margók, oszlopok, header/footer) - következő verzióban

## VirtualNode típusok

A lehetséges gyerek típusokkal:

**Levelek** (nincs gyerekük):
- `GTextRun`
- `GImage`

**Szöveges konténerek**:
- `GParagraph` - bekezdés
- `GHeading1` - `GHeading6` - címsorok
- `GList` - lista

**Táblázat elemek**:
- `GTable` - táblázat
- `GTableRow` - táblázat sor
- `GTableCell` - táblázat cella

**Speciális elemek**:
- `GPageBreak` - oldaltörés
- `GColumnBreak` - oszloptörés
- `GHorizontalRule` - vízszintes vonal
- `GSectionBreak` - szakasztörés
- `GFootnoteReference` - lábjegyzet hivatkozás
- `GEquation` - matematikai egyenlet
- `GInlineObject` - soron belüli objektum
- `Fragment` - wrapper (nincs API megfelelője)

## VirtualNode típusok és lehetséges gyerekek

| VirtualNode típus | Lehetséges gyerek típusok | Stílus típus | Megjegyzés |
|-------------------|-------------------------|--------------|------------|
| `GTextRun` | *(nincs gyerek)* | `TextStyle` | Szöveg futtatás |
| `GImage` | *(nincs gyerek)* | - | Kép |
| `GParagraph` | `GTextRun`, `GImage`, `GFootnoteReference`, `GEquation`, `GInlineObject` | `ParagraphStyle` | Bekezdés |
| `GHeading1` - `GHeading6` | `GTextRun`, `GImage`, `GFootnoteReference`, `GEquation`, `GInlineObject` | `ParagraphStyle` | Címsorok (olyan mint a bekezdés, csak más a namedStyleType|
| `GList` | `GParagraph` (általában `Li` komponenseken keresztül) | - | Lista (bullet/ordered) |
| `GTable` | `GTableRow` | - | Táblázat |
| `GTableRow` | `GTableCell` | `TableRowStyle` | Táblázat sor |
| `GTableCell` | `GParagraph`, `GHeading1-6`, `GList` | `TableCellStyle` | Táblázat cella |
| `GPageBreak` | *(nincs gyerek)* | - | Oldaltörés |
| `GColumnBreak` | *(nincs gyerek)* | - | Oszloptörés |
| `GHorizontalRule` | *(nincs gyerek)* | - | Vízszintes vonal |
| `GSectionBreak` | *(nincs gyerek)* | - | Szakasztörés |
| `GFootnoteReference` | *(nincs gyerek)* | `TextStyle` | Lábjegyzet hivatkozás |
| `GEquation` | *(nincs gyerek)* | - | Matematikai egyenlet |
| `GInlineObject` | *(nincs gyerek)* | - | Soron belüli objektum |
| `Fragment` | Bármi | - | Wrapper (nincs API megfelelője) |
