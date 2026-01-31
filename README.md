# React-GDoc (RGD) Framework

A React-GDoc egy absztrakciós réteg a Google Docs REST API felett. A React mentális modelljét (komponens-alapú építkezés, props-vezérelt logika) használja dokumentumok generálására.

## Telepítés

```bash
npm install
```

## Google API Beállítás

A projekt használatához szükséged lesz Google API hitelesítő adatokra:

1. Menj a [Google Cloud Console](https://console.cloud.google.com/) oldalra
2. Hozz létre egy új projektet vagy válassz egy meglévőt
3. Engedélyezd a **Google Docs API** és **Google Drive API** szolgáltatásokat
4. Menj az **API-k és szolgáltatások > Hitelesítő adatok** menüpontra
5. Kattints a **Hitelesítő adatok létrehozása > OAuth ügyfél azonosító** gombra
6. Válaszd az **Asztali alkalmazás** típust
7. **Fontos:** A **Authorized redirect URIs** mezőben add hozzá: `urn:ietf:wg:oauth:2.0:oob`
8. Töltsd le a JSON fájlt és nevezd át `credentials.json`-ra
9. Helyezd a `credentials.json` fájlt a projekt gyökerébe

A `credentials.json` fájlnak így kell kinéznie:

```json
{
  "installed": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "your-client-secret",
    "redirect_uris": ["http://localhost"]
  }
}
```

vagy web alkalmazáshoz:

```json
{
  "web": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "your-client-secret",
    "redirect_uris": ["http://localhost:3000/oauth2callback"]
  }
}
```

## Használat

```bash
npm run render docsrc/example.tsx
```

vagy egyedi címmel:

```bash
npm run render docsrc/example.tsx "My Document Title"
```

Ez létrehoz egy Google Docs dokumentumot a megadott TSX fájlból a Google Drive fiókodban.

**Első futtatáskor:**
1. A böngésző automatikusan megnyílik az OAuth2 bejelentkezéshez
2. Engedélyezd a hozzáférést az alkalmazáshoz
3. Másold ki az engedélyezési kódot
4. Illeszd be a terminálba
5. A token el lesz mentve `token.json` fájlba a következő futtatásokhoz

## Projekt Struktúra

- `src/primitives/` - Google Docs API primitív komponensek
- `src/renderer/` - JSX to Google Docs batchUpdate konverter
- `src/google/` - Google API integráció
- `src/cli/` - CLI tool dokumentum generáláshoz
- `docsrc/` - TSX dokumentum példák

## Elérhető Komponensek

### Szöveg komponensek
- `<GTextRun>` - Szöveg futtatás formázással
- `<GParagraph>` - Bekezdés

### Strukturális komponensek
- `<GTable>`, `<GTableRow>`, `<GTableCell>` - Táblázatok
- `<GPageBreak>` - Oldaltörés
- `<GColumnBreak>` - Oszloptörés
- `<GHorizontalRule>` - Vízszintes vonal
- `<GSectionBreak>` - Szakasztörés

### Lista és címsor komponensek
- `<GListItem>` - Lista elem
- `<GHeading1>` - `<GHeading6>` - Címsorok

### Egyéb komponensek
- `<GImage>` - Kép beszúrása
- `<GEquation>` - Matematikai egyenlet
- `<GFootnoteReference>` - Lábjegyzet hivatkozás
- `<GInlineObject>` - Soron belüli objektum

## Példa

Lásd: `docsrc/example.tsx`
