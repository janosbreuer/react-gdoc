import React from 'react';
import { GContract, GSection, GClause, GSubClause, P, S } from './components';

/**
 * Példa szerződés dokumentum dinamikus bemenettel.
 * Demonstrálja a legal komponensek használatát:
 * - GContract (legmagasabb absztrakciós szint)
 * - GSection (közép szint)
 * - GClause és GSubClause (alacsonyabb szint)
 * - HTML-szerű shortcut komponensek (P, S) - egyszerűbb szintaxis
 * - Dinamikus bemenet, függvények, ciklusok, feltételek
 */

interface PartyData {
  name: string;
  address: string;
  registrationNumber: string;
  taxNumber: string;
}

/**
 * Visszaadja az előre definiált megbízó adatokat
 */
const PREDEFINED_PARTIES: PartyData[] = [
  {
    name: 'ABC Kft.',
    address: '1011 Budapest, Fő utca 1.',
    registrationNumber: '01-23-456789',
    taxNumber: '12345678-1-23'
  },
  {
    name: 'XYZ Zrt.',
    address: '1051 Budapest, Kossuth Lajos tér 1.',
    registrationNumber: '01-98-765432',
    taxNumber: '98765432-2-10'
  },
  {
    name: 'Tech Solutions Kft.',
    address: '1117 Budapest, Irinyi József utca 42.',
    registrationNumber: '01-45-123456',
    taxNumber: '11223344-3-45'
  },
  {
    name: 'Innovation Group Zrt.',
    address: '1138 Budapest, Váci út 1-3.',
    registrationNumber: '01-67-789012',
    taxNumber: '55667788-4-67'
  },
  {
    name: 'Digital Services Kft.',
    address: '1024 Budapest, Margit körút 1.',
    registrationNumber: '01-89-345678',
    taxNumber: '99887766-5-89'
  }
];

interface ExampleContractProps {
  args?: string[];
}

export default function ExampleContract({ args = [] }: ExampleContractProps = {}) {
  // Bemenet: hány megbízó legyen (1-5 között)
  // Lehet command line argumentként is átadni, vagy default 3
  const firstArg = args.length > 0 ? args[0] : undefined;
  const parsedNumber = firstArg !== undefined ? parseInt(firstArg, 10) : undefined;
  const propNumberOfParties = !isNaN(parsedNumber as number) ? parsedNumber : undefined;
  
  console.log(`ExampleContract received args: ${JSON.stringify(args)}`);
  console.log(`ExampleContract parsed numberOfParties: ${propNumberOfParties}`);
  
  const numberOfParties: number = propNumberOfParties !== undefined 
    ? Math.max(1, Math.min(5, propNumberOfParties)) // Clamp between 1-5
    : 3;
  console.log(`ExampleContract using numberOfParties: ${numberOfParties}`);
  
  // Visszaadjuk az első n megbízót sorrendben
  const parties: PartyData[] = PREDEFINED_PARTIES.slice(0, numberOfParties);
  
  // Egyes/többes szám kezelése
  const partyText = numberOfParties === 1 ? 'megbízó' : 'megbízók';
  const partyVerb = numberOfParties === 1 ? 'kötelezi' : 'kötelezik';
  const partyPossessive = numberOfParties === 1 ? 'megbízó' : 'megbízók';
  
  return (
    <GContract
      title="Megbízási Szerződés"
      parties={[
        "ABC Kft. (a továbbiakban: megbízott)",
        ...parties.map((p, idx) => `${p.name} (a továbbiakban: ${idx === 0 ? 'megbízó' : `megbízó ${idx + 1}`})`)
      ]}
      date="2026. január 30."
      location="Budapest"
      preamble={`A felek az alábbiakban megállapodnak a megbízási szerződésről.`}
      signatures={[
        { name: "Kovács János", role: "Ügyvezető igazgató, ABC Kft." },
        ...parties.map((p, idx) => ({
          name: `Név${idx + 1} Péter`,
          role: `Ügyvezető igazgató, ${p.name}`
        }))
      ]}
    >
      <GSection title="1. Általános rendelkezések">
        <GClause number={1} title="Hatály">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            Ez a szerződés a megkötésétől hatályos, és a szerződésben meghatározott időtartamig érvényes. A szerződés módosítása vagy megszüntetése csak írásos formában, a felek kölcsönös egyetértésével lehetséges.
          </P>
        </GClause>

        <GClause number={2} title="Fogalmak">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A szerződésben használt fogalmak az alábbiak szerint értendők:
          </P>
          <GSubClause letter="a" title="Megbízó">
            {numberOfParties === 1 ? (
              <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
                A <S style={['bold', 'italic']}>megbízó</S> a {parties[0].name} (székhely: {parties[0].address}, cégjegyzékszám: {parties[0].registrationNumber}, adószám: {parties[0].taxNumber}), amely a szolgáltatásokat igénybe veszi. A <S style={['bold', 'italic']}>megbízó</S> köteles biztosítani a szolgáltatások nyújtásához szükséges feltételeket és információkat, valamint időben teljesíteni a fizetési kötelezettségeit.
              </P>
            ) : (
              <>
                <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
                  A <S style={['bold', 'italic']}>megbízók</S> a következők:
                </P>
                {parties.map((party, idx) => (
                  <P key={idx} style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
                    {party.name} (székhely: {party.address}, cégjegyzékszám: {party.registrationNumber}, adószám: {party.taxNumber}).
                  </P>
                ))}
                <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
                  A <S style={['bold', 'italic']}>megbízók</S> kötelesek biztosítani a szolgáltatások nyújtásához szükséges feltételeket és információkat, valamint időben teljesíteni a fizetési kötelezettségeiket.
                </P>
              </>
            )}
          </GSubClause>
          <GSubClause letter="b" title="Megbízott">
            <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
              A <S style={['bold', 'italic']}>megbízott</S> az ABC Kft. (székhely: 1011 Budapest, Fő utca 1., cégjegyzékszám: 01-23-456789, adószám: 12345678-1-23), amely a szerződésben meghatározott szolgáltatásokat nyújtja. A <S style={['bold', 'italic']}>megbízott</S> felelős a szolgáltatások minőségéért és időben történő teljesítéséért.
            </P>
          </GSubClause>
        </GClause>
      </GSection>

      <GSection title="2. Szolgáltatások">
        <GClause number={3} title="Szolgáltatás tartalma">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A <S style={['bold', 'italic']}>megbízott</S> a következő szolgáltatásokat nyújtja a <S style={['bold', 'italic']}>{partyPossessive}</S> részére:
          </P>
          <P style={{ 
            alignment: 'JUSTIFIED',
            indentStart: { magnitude: 18, unit: 'PT' },
            spaceBelow: { magnitude: 12, unit: 'PT' }
          }}>
            <S style={['bold']}>a)</S> Tanácsadási szolgáltatások: stratégiai, működési és technológiai tanácsadás, üzleti folyamatok elemzése és optimalizálási javaslatok kidolgozása.
          </P>
          <P style={{ 
            alignment: 'JUSTIFIED',
            indentStart: { magnitude: 18, unit: 'PT' },
            spaceBelow: { magnitude: 12, unit: 'PT' }
          }}>
            <S style={['bold']}>b)</S> Projektmenedzsment: projektek tervezése, koordinálása, monitoringja és lezárása, projektcsapatok vezetése, határidők és költségvetések kezelése.
          </P>
          <P style={{ 
            alignment: 'JUSTIFIED',
            indentStart: { magnitude: 18, unit: 'PT' },
            spaceBelow: { magnitude: 12, unit: 'PT' }
          }}>
            <S style={['bold']}>c)</S> Technikai támogatás: rendszerek telepítése, konfigurálása, karbantartása és hibaelhárítása.
          </P>
        </GClause>

        <GClause number={4} title="Szolgáltatás időtartama">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A szolgáltatások nyújtása <S style={['bold']}>2026. február 1.</S>-től <S style={['bold']}>2026. december 31.</S>-ig tart. A <S style={['bold', 'italic']}>megbízott</S> köteles folyamatosan nyújtani a szolgáltatásokat, kivéve, ha a szerződésben másként rendelkeznek.
          </P>
        </GClause>

        <GClause number={5} title="Szolgáltatás minősége">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A <S style={['bold', 'italic']}>megbízott</S> köteles a szolgáltatásokat professzionális minőségben, a szakmai szabályoknak megfelelően nyújtani. A <S style={['bold', 'italic']}>{partyPossessive}</S> {partyVerb} a szolgáltatások minőségének ellenőrzésére.
          </P>
        </GClause>
      </GSection>

      <GSection title="3. Pénzügyi rendelkezések">
        <GClause number={6} title="Díjszabás">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A szolgáltatások díja: <S style={['bold']}>5.000.000 Ft</S> (áfával együtt). Az ár tartalmazza az összes olyan költséget, amely a szolgáltatások nyújtásához szükséges.
          </P>
        </GClause>

        <GClause number={7} title="Fizetési feltételek">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A <S style={['bold', 'italic']}>{partyPossessive}</S> köteles <S style={['bold']}>30 napos</S> határidővel teljesíteni a fizetési kötelezettségét a számla kiállítását követően. A fizetés banki átutalással történik. Késedelmes fizetés esetén a <S style={['bold', 'italic']}>{partyPossessive}</S> köteles késedelmi kamatot fizetni.
          </P>
        </GClause>
      </GSection>

      <GSection title="4. Felelősség és kártérítés">
        <GClause number={8} title="Felelősség">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A <S style={['bold', 'italic']}>megbízott</S> felelős a szolgáltatások hibás vagy hiányos teljesítéséért. A <S style={['bold', 'italic']}>megbízott</S> felelőssége nem terjed ki olyan károkra, amelyek a <S style={['bold', 'italic']}>{partyPossessive}</S> hibájából erednek. A felelősség összesen nem haladhatja meg a szerződésben meghatározott szolgáltatási díj összegét.
          </P>
        </GClause>

        <GClause number={9} title="Kártérítés">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            Amennyiben a <S style={['bold', 'italic']}>megbízott</S> a szerződésben meghatározott kötelezettségeit megszegi, és ebből kár keletkezik a <S style={['bold', 'italic']}>{partyPossessive}</S> számára, a <S style={['bold', 'italic']}>megbízott</S> köteles kártérítést fizetni.
          </P>
        </GClause>
      </GSection>

      <GSection title="5. Adatvédelem és titoktartás">
        <GClause number={10} title="Adatvédelem">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A felek kötelesek betartani az adatvédelmi jogszabályokat. A <S style={['bold', 'italic']}>megbízott</S> köteles biztosítani, hogy a <S style={['bold', 'italic']}>{partyPossessive}</S>tól kapott személyes adatokat csak a szerződésben meghatározott célokra használja fel.
          </P>
        </GClause>

        <GClause number={11} title="Titoktartás">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A felek kötelesek titokban tartani minden olyan információt, adatot vagy üzleti titkot, amelyet a szerződés teljesítése során megismernek. A titoktartási kötelezettség a szerződés megszűnése után is fennmarad.
          </P>
        </GClause>
      </GSection>

      <GSection title="6. Külföldi harmadik felekre vonatkozó rendelkezések">
        <GClause number={12} title="Harmadik felek bevonása">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A <S style={['bold', 'italic']}>megbízott</S> csak a <S style={['bold', 'italic']}>{partyPossessive}</S> előzetes írásos hozzájárulásával vonhat be harmadik feleket a szolgáltatások nyújtásába. A <S style={['bold', 'italic']}>megbízott</S> köteles biztosítani, hogy a bevont harmadik felek ugyanazokat a kötelezettségeket vállalják, mint amelyeket a <S style={['bold', 'italic']}>megbízott</S> a szerződésben vállalt.
          </P>
        </GClause>

        <GClause number={13} title="Külföldi szolgáltatók">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            Amennyiben a <S style={['bold', 'italic']}>megbízott</S> külföldi szolgáltatókat kíván bevonni, köteles a <S style={['bold', 'italic']}>{partyPossessive}</S> előzetes írásos hozzájárulását kérni. A külföldi szolgáltatók bevonása esetén a <S style={['bold', 'italic']}>megbízott</S> köteles biztosítani, hogy a külföldi szolgáltatók megfeleljenek az adatvédelmi és biztonsági követelményeknek, valamint a vonatkozó európai uniós és magyar jogszabályoknak.
          </P>
        </GClause>

        <GClause number={14} title="Adatkezelés külföldi harmadik feleknél">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            Amennyiben a <S style={['bold', 'italic']}>megbízott</S> külföldi harmadik feleket von be az adatkezelésbe, köteles biztosítani, hogy az adatkezelés megfeleljen a GDPR rendelkezéseinek. A <S style={['bold', 'italic']}>megbízott</S> köteles a <S style={['bold', 'italic']}>{partyPossessive}</S> részére tájékoztatást nyújtani a bevont külföldi harmadik felekről, az adatkezelés céljáról és az alkalmazott garanciákról.
          </P>
        </GClause>

        <GClause number={15} title="Felelősség külföldi harmadik felek esetén">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A <S style={['bold', 'italic']}>megbízott</S> teljes mértékben felelős a bevont külföldi harmadik felek tevékenységéért. A <S style={['bold', 'italic']}>megbízott</S> kötelezettségei nem szűnnek meg a harmadik felek bevonása miatt, és a <S style={['bold', 'italic']}>megbízott</S> köteles kártérítést fizetni, amennyiben a külföldi harmadik felek tevékenysége kárt okoz a <S style={['bold', 'italic']}>{partyPossessive}</S> számára.
          </P>
        </GClause>
      </GSection>

      <GSection title="7. Egyéb rendelkezések">
        <GClause number={16} title="Változtatás">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A szerződés csak írásos formában módosítható, a felek kölcsönös egyetértésével.
          </P>
        </GClause>

        <GClause number={17} title="Szerződés megszűnése">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A szerződés megszűnik az időtartam lejártával, vagy ha a felek kölcsönös egyetértéssel felmondják azt. A szerződés felmondható azonnali hatállyal, ha valamelyik fél lényeges szerződésszegést követ el.
          </P>
        </GClause>

        <GClause number={18} title="Végső rendelkezések">
          <P style={{ alignment: 'JUSTIFIED', spaceBelow: { magnitude: 12, unit: 'PT' } }}>
            A felek a szerződésben nem szabályozott kérdésekben a vonatkozó magyar jogszabályok rendelkezéseit alkalmazzák. A szerződésből eredő vitákat a felek először tárgyalás útján igyekeznek megoldani. A szerződés kettő példányban készült, mindkét fél egy-egy példányt kap.
          </P>
        </GClause>
      </GSection>
    </GContract>
  );
}
