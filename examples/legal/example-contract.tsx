import React from 'react';
import { P, S } from '@react-gdoc/shortcuts';
import { Heading1, Heading2, Heading3, Heading4 } from '@react-gdoc/headings';

interface PartyData {
  name: string;
  address: string;
  registrationNumber: string;
  taxNumber: string;
}

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
  const firstArg = args.length > 0 ? args[0] : undefined;
  const parsedNumber = firstArg !== undefined ? parseInt(firstArg, 10) : undefined;
  const propNumberOfParties = !isNaN(parsedNumber as number) ? parsedNumber : undefined;
  
  const numberOfParties: number = propNumberOfParties !== undefined 
    ? Math.max(1, Math.min(5, propNumberOfParties))
    : 3;
  
  const parties: PartyData[] = PREDEFINED_PARTIES.slice(0, numberOfParties);
  
  const partyText = numberOfParties === 1 ? 'megbízó' : 'megbízók';
  const partyVerb = numberOfParties === 1 ? 'kötelezi' : 'kötelezik';
  const partyPossessive = numberOfParties === 1 ? 'megbízó' : 'megbízók';
  
  return (
    <>
      <Heading1 className="text-center mb-4">Megbízási <S className="font-bold">Szerződés</S></Heading1>

      <P className="text-center mb-3">
        <S className="font-bold">Felek:</S>
      </P>
      <P className="text-center mb-2">
        ABC Kft. (a továbbiakban: megbízott)
      </P>
      {parties.map((p, idx) => (
        <P key={idx} className="text-center mb-2">
          {p.name} (a továbbiakban: {idx === 0 ? 'megbízó' : `megbízó ${idx + 1}`})
        </P>
      ))}

      <P className="text-center mb-3">
        <S className="font-bold">Dátum:</S> 2026. január 30.
      </P>
      <P className="text-center mb-6">
        <S className="font-bold">Hely:</S> Budapest
      </P>

      <P className="text-justify mb-6">
        A felek az alábbiakban megállapodnak a megbízási szerződésről.
      </P>

      <Heading2>1. Általános rendelkezések</Heading2>

      <Heading3>1. Hatály</Heading3>
      <P className="text-justify mb-4">
        Ez a szerződés a megkötésétől hatályos, és a szerződésben meghatározott időtartamig érvényes. A szerződés módosítása vagy megszüntetése csak írásos formában, a felek kölcsönös egyetértésével lehetséges.
      </P>

      <Heading3>2. Fogalmak</Heading3>
      <P className="text-justify mb-3">
        A szerződésben használt fogalmak az alábbiak szerint értendők:
      </P>

      <Heading4>a) Megbízó</Heading4>
      {numberOfParties === 1 ? (
        <P className="text-justify mb-4">
          A <S className="font-bold italic">megbízó</S> a {parties[0].name} (székhely: {parties[0].address}, cégjegyzékszám: {parties[0].registrationNumber}, adószám: {parties[0].taxNumber}), amely a szolgáltatásokat igénybe veszi. A <S className="font-bold italic">megbízó</S> köteles biztosítani a szolgáltatások nyújtásához szükséges feltételeket és információkat, valamint időben teljesíteni a fizetési kötelezettségeit.
        </P>
      ) : (
        <>
          <P className="text-justify mb-2">
            A <S className="font-bold italic">megbízók</S> a következők:
          </P>
          {parties.map((party, idx) => (
            <P key={idx} className="text-justify mb-2">
              {party.name} (székhely: {party.address}, cégjegyzékszám: {party.registrationNumber}, adószám: {party.taxNumber}).
            </P>
          ))}
          <P className="text-justify mb-4">
            A <S className="font-bold italic">megbízók</S> kötelesek biztosítani a szolgáltatások nyújtásához szükséges feltételeket és információkat, valamint időben teljesíteni a fizetési kötelezettségeiket.
          </P>
        </>
      )}

      <Heading4>b) Megbízott</Heading4>
      <P className="text-justify mb-6">
        A <S className="font-bold italic">megbízott</S> az ABC Kft. (székhely: 1011 Budapest, Fő utca 1., cégjegyzékszám: 01-23-456789, adószám: 12345678-1-23), amely a szerződésben meghatározott szolgáltatásokat nyújtja. A <S className="font-bold italic">megbízott</S> felelős a szolgáltatások minőségéért és időben történő teljesítéséért.
      </P>

      <Heading2>2. Szolgáltatások</Heading2>

      <Heading3>3. Szolgáltatás tartalma</Heading3>
      <P className="text-justify mb-3">
        A <S className="font-bold italic">megbízott</S> a következő szolgáltatásokat nyújtja a <S className="font-bold italic">{partyPossessive}</S> részére:
      </P>
      <P className="text-justify indent-5 mb-3">
        <S className="font-bold">a)</S> Tanácsadási szolgáltatások: stratégiai, működési és technológiai tanácsadás, üzleti folyamatok elemzése és optimalizálási javaslatok kidolgozása.
      </P>
      <P className="text-justify indent-5 mb-3">
        <S className="font-bold">b)</S> Projektmenedzsment: projektek tervezése, koordinálása, monitoringja és lezárása, projektcsapatok vezetése, határidők és költségvetések kezelése.
      </P>
      <P className="text-justify indent-5 mb-4">
        <S className="font-bold">c)</S> Technikai támogatás: rendszerek telepítése, konfigurálása, karbantartása és hibaelhárítása.
      </P>

      <Heading3>4. Szolgáltatás időtartama</Heading3>
      <P className="text-justify mb-4">
        A szolgáltatások nyújtása <S className="font-bold">2026. február 1.</S>-től <S className="font-bold">2026. december 31.</S>-ig tart. A <S className="font-bold italic">megbízott</S> köteles folyamatosan nyújtani a szolgáltatásokat, kivéve, ha a szerződésben másként rendelkeznek.
      </P>

      <Heading3>5. Szolgáltatás minősége</Heading3>
      <P className="text-justify mb-6">
        A <S className="font-bold italic">megbízott</S> köteles a szolgáltatásokat professzionális minőségben, a szakmai szabályoknak megfelelően nyújtani. A <S className="font-bold italic">{partyPossessive}</S> {partyVerb} a szolgáltatások minőségének ellenőrzésére.
      </P>

      <Heading2>3. Pénzügyi rendelkezések</Heading2>

      <Heading3>6. Díjszabás</Heading3>
      <P className="text-justify mb-4">
        A szolgáltatások díja: <S className="font-bold">5.000.000 Ft</S> (áfával együtt). Az ár tartalmazza az összes olyan költséget, amely a szolgáltatások nyújtásához szükséges.
      </P>

      <Heading3>7. Fizetési feltételek</Heading3>
      <P className="text-justify mb-6">
        A <S className="font-bold italic">{partyPossessive}</S> köteles <S className="font-bold">30 napos</S> határidővel teljesíteni a fizetési kötelezettségét a számla kiállítását követően. A fizetés banki átutalással történik. Késedelmes fizetés esetén a <S className="font-bold italic">{partyPossessive}</S> köteles késedelmi kamatot fizetni.
      </P>

      <Heading2>4. Felelősség és kártérítés</Heading2>

      <Heading3>8. Felelősség</Heading3>
      <P className="text-justify mb-4">
        A <S className="font-bold italic">megbízott</S> felelős a szolgáltatások hibás vagy hiányos teljesítéséért. A <S className="font-bold italic">megbízott</S> felelőssége nem terjed ki olyan károkra, amelyek a <S className="font-bold italic">{partyPossessive}</S> hibájából erednek. A felelősség összesen nem haladhatja meg a szerződésben meghatározott szolgáltatási díj összegét.
      </P>

      <Heading3>9. Kártérítés</Heading3>
      <P className="text-justify mb-6">
        Amennyiben a <S className="font-bold italic">megbízott</S> a szerződésben meghatározott kötelezettségeit megszegi, és ebből kár keletkezik a <S className="font-bold italic">{partyPossessive}</S> számára, a <S className="font-bold italic">megbízott</S> köteles kártérítést fizetni.
      </P>

      <Heading2>5. Adatvédelem és titoktartás</Heading2>

      <Heading3>10. Adatvédelem</Heading3>
      <P className="text-justify mb-4">
        A felek kötelesek betartani az adatvédelmi jogszabályokat. A <S className="font-bold italic">megbízott</S> köteles biztosítani, hogy a <S className="font-bold italic">{partyPossessive}</S>tól kapott személyes adatokat csak a szerződésben meghatározott célokra használja fel.
      </P>

      <Heading3>11. Titoktartás</Heading3>
      <P className="text-justify mb-6">
        A felek kötelesek titokban tartani minden olyan információt, adatot vagy üzleti titkot, amelyet a szerződés teljesítése során megismernek. A titoktartási kötelezettség a szerződés megszűnése után is fennmarad.
      </P>

      <Heading2>6. Külföldi harmadik felekre vonatkozó rendelkezések</Heading2>

      <Heading3>12. Harmadik felek bevonása</Heading3>
      <P className="text-justify mb-4">
        A <S className="font-bold italic">megbízott</S> csak a <S className="font-bold italic">{partyPossessive}</S> előzetes írásos hozzájárulásával vonhat be harmadik feleket a szolgáltatások nyújtásába. A <S className="font-bold italic">megbízott</S> köteles biztosítani, hogy a bevont harmadik felek ugyanazokat a kötelezettségeket vállalják, mint amelyeket a <S className="font-bold italic">megbízott</S> a szerződésben vállalt.
      </P>

      <Heading3>13. Külföldi szolgáltatók</Heading3>
      <P className="text-justify mb-4">
        Amennyiben a <S className="font-bold italic">megbízott</S> külföldi szolgáltatókat kíván bevonni, köteles a <S className="font-bold italic">{partyPossessive}</S> előzetes írásos hozzájárulását kérni. A külföldi szolgáltatók bevonása esetén a <S className="font-bold italic">megbízott</S> köteles biztosítani, hogy a külföldi szolgáltatók megfeleljenek az adatvédelmi és biztonsági követelményeknek, valamint a vonatkozó európai uniós és magyar jogszabályoknak.
      </P>

      <Heading3>14. Adatkezelés külföldi harmadik feleknél</Heading3>
      <P className="text-justify mb-4">
        Amennyiben a <S className="font-bold italic">megbízott</S> külföldi harmadik feleket von be az adatkezelésbe, köteles biztosítani, hogy az adatkezelés megfeleljen a GDPR rendelkezéseinek. A <S className="font-bold italic">megbízott</S> köteles a <S className="font-bold italic">{partyPossessive}</S> részére tájékoztatást nyújtani a bevont külföldi harmadik felekről, az adatkezelés céljáról és az alkalmazott garanciákról.
      </P>

      <Heading3>15. Felelősség külföldi harmadik felek esetén</Heading3>
      <P className="text-justify mb-6">
        A <S className="font-bold italic">megbízott</S> teljes mértékben felelős a bevont külföldi harmadik felek tevékenységéért. A <S className="font-bold italic">megbízott</S> kötelezettségei nem szűnnek meg a harmadik felek bevonása miatt, és a <S className="font-bold italic">megbízott</S> köteles kártérítést fizetni, amennyiben a külföldi harmadik felek tevékenysége kárt okoz a <S className="font-bold italic">{partyPossessive}</S> számára.
      </P>

      <Heading2>7. Egyéb rendelkezések</Heading2>

      <Heading3>16. Változtatás</Heading3>
      <P className="text-justify mb-4">
        A szerződés csak írásos formában módosítható, a felek kölcsönös egyetértésével.
      </P>

      <Heading3>17. Szerződés megszűnése</Heading3>
      <P className="text-justify mb-4">
        A szerződés megszűnik az időtartam lejártával, vagy ha a felek kölcsönös egyetértéssel felmondják azt. A szerződés felmondható azonnali hatállyal, ha valamelyik fél lényeges szerződésszegést követ el.
      </P>

      <Heading3>18. Végső rendelkezések</Heading3>
      <P className="text-justify mb-6">
        A felek a szerződésben nem szabályozott kérdésekben a vonatkozó magyar jogszabályok rendelkezéseit alkalmazzák. A szerződésből eredő vitákat a felek először tárgyalás útján igyekeznek megoldani. A szerződés kettő példányban készült, mindkét fél egy-egy példányt kap.
      </P>

      <P className="text-center mb-3 mt-6">
        <S className="font-bold">Aláírások:</S>
      </P>
      <P className="text-center mb-4">
        Kovács János<br />
        Ügyvezető igazgató, ABC Kft.
      </P>
      {parties.map((p, idx) => (
        <P key={idx} className="text-center mb-4">
          Név{idx + 1} Péter<br />
          Ügyvezető igazgató, {p.name}
        </P>
      ))}
    </>
  );
}
