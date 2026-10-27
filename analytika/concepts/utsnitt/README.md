# Utsnittsanalysen: hvilket utsnitt av kontorbildet er best?

Spørsmålet (Atle): kan vi komme «up close», med noe i fokus (arbeidsbordet), og tavlene utydelige i bakgrunnen, men tydelige nok til at de som kjenner dem kjenner dem igjen?

Impeccable har ingen kommando som analyserer utsnitt. Det vi har brukt derfra er to prinsipper i `layout.md` (blur-testen: det viktigste skal fortsatt kunne skilles ut når bildet er uskarpt) og at en geometrisk maske som etterligner kanten på et motiv ikke er et godt grep. Resten er målt her, med `tools/crop-analysis.py` (Pillow og numpy), som kan kjøres om igjen. Alt under gjelder `assets/photo/ekte-kontor-v5-neutral.jpg` (1672 × 941).

## Slik er det regnet

Hvert tenkelig utsnitt (zoom 1,0–2,6 i steg på 0,1, midtpunkt hver 10. piksel, skjermformat 16:10) får en score fra ni enkle kriterier. Utsnitt der de fem tavlene ikke ligger helt inne, eller der forgrunnsmotivet er mer enn en fjerdedel utenfor, forkastes.

| Kriterium | Vekt | Hva som gir full score |
|---|---|---|
| Tavlenes størrelse | 0,20 | 30–46 % av bredden: «i bakgrunnen», men gjenkjennelig |
| Forgrunnens plassering | 0,18 | motivets tyngdepunkt nær et av tredjedelspunktene |
| Forgrunnens størrelse | 0,10 | 7–22 % av utsnittets flate |
| Avstand tavler–forgrunn | 0,10 | minst 15 % av høyden mellom tavlenes underkant og motivets overkant, så uskarpheten har plass å vokse |
| Oppløsning | 0,14 | høyst 1,35 skjermpiksler per bildepiksel (ved 1440 px bredde); null ved 2,1 |
| Tittel over tavlene | 0,10 | hvit tekst har minst 4,5:1 (null ved 2:1) mot veggen der skiltet står |
| Fri plass for tittel | 0,06 | et rolig sted utenfor tavler og forgrunn |
| Kanter | 0,04 | utsnittskanten skjærer ikke gjennom mye detalj |
| Liv | 0,08 | mange små ting: tegn på at noen jobber her |

Forgrunnsmotivene er målt med øyet i bildet: arbeidsbordet (x 130–720, y 606–824), pulten til høyre med skjerm og hjelm (x 1283–1672, y 498–786), spisebordet (x 835–1132, y 505–697) og «ingen forgrunn». Vektene er mine og kan diskuteres, så de er rystet: 400 trekninger der hver vekt ganges med et tilfeldig tall (lognormalt, σ 0,55) viser hvor ofte hvert vinnerutsnitt kommer først eller blant de tre beste.

## Resultatet

**1. «Nærmere» har et tak rundt 1,5×, og det kommer av geometrien, ikke av smaken.** Antall gyldige utsnitt med arbeidsbordet og alle fem tavler:

| Zoom | 1,0 | 1,2 | 1,4 | 1,6 | 1,8 | 2,0 |
|---|---|---|---|---|---|---|
| Gyldige utsnitt | 17 | 425 | 438 | 226 | 35 | 0 |
| Beste score | 0,82 | **0,86** | **0,86** | 0,77 | 0,56 | – |
| Tavlenes bredde | 31 % | 37 % | 43 % | 49 % | 55 % | – |

Arbeidsbordet og tavlene ligger 440 piksler fra hverandre i høyden og 900 i bredden. Går vi nærmere enn 1,8× faller det ene eller det andre ut av bildet. Platået er 1,2–1,4×.

**2. Vinnerne, med samme vekter og rystet:**

| Forgrunn | Zoom | Midtpunkt | Tavlene | Score | Vant / topp 3 |
|---|---|---|---|---|---|
| Arbeidsbordet | **1,2×** | 667, 542 | 36,7 % | 0,86 | 100 % / 100 % |
| Spisebordet | 1,4× | 787, 496 | 42,9 % | 0,80 | 100 % / 100 % |
| Pulten til høyre | 1,3× | 1089, 521 | 39,8 % | 0,68 | 100 % / 100 % |
| Ingen forgrunn | 1,4× | 787, 596 | 42,9 % | 0,81 | 76 % / 100 % |

«Vant» sier bare at vinneren slo de andre utsnittene innenfor samme motiv. Poengene kan ikke sammenlignes helt på tvers: pulten får lavere score fordi tavlene ligger langt til venstre og avstanden til forgrunnen er kort.

**3. Hvor mye uskarphet tåler tavlene?** (`utsnitt-uskarphet.jpg`, sigma i bildepiksler, ganges med ca. 1,2–1,4 for skjermpiksler.) Datamaskinen klarer å skille de fem tegningene fra hverandre helt til sigma 6 (5 av 5), og mellomrommene mellom tavlene beholder 63 % av kontrasten. Øyet gir opp tidligere: ved 2,5 kan man lese kurven, punktene, boksene, treet og rutenettet; ved 4,5 er det spøkelser, men de er fortsatt fem ulike tegninger; ved 7 er det fem hvite felt; ved 10 er det borte. **Sigma 2,5–4,5 er riktig bånd**, og 4,5 («middels») er grensen.

**4. Tittelen som skilt over tavlene** er det svakeste punktet i alle vinnerne: hvit tekst har 4,0:1 mot gjennomsnittet av veggen der, men bare 2,4:1 mot den solbelyste flekken. Uskarphet forandrer ingenting her, for veggen er jevn fra før. Skyggen bak bokstavene bærer den over kanten, og det er mulig å bruke den andre plasseringen (høyre vegg, 6,2:1) i stedet.

## De fire sidene

`concepts/explore/forside-utsnitt-*.html`, også som rutene i `oversikt.html` («Runde 5»). Bildet er v5 med simulert dybdeskarphet (`tools/photo-dof.py`), og knappene i visningen endrer zoom (sidens egen, 1,0–1,8) og uskarphet (ingen, lett, middels, sterk). Når man peker på en tavle, kommer den i fokus (den skarpe versjonen ligger i et lag over).

1. **Arbeidsbord 1,2×**: analysens vinner. Arbeidsbordet skarpt nede til venstre, tavlene 37 % av bredden og myke bak.
2. **Arbeidsbord 1,7×**: det nærmeste som fortsatt rommer både bordet og alle fem tavler. Tavlene er 52 % av bredden, og bildet strekkes 1,6×, så det er litt mykt også i forgrunnen.
3. **Spisebord 1,4×**: spisebordet med stolene skarpt rett under tavlene. Totalvinneren på score, og mest «rom».
4. **Pult 1,3×**: pulten med skjerm, hjelm og genser skarp til høyre, tavlene myke til venstre i bildet. Mest filmatisk, men tavlene havner i venstre tredjedel.

## Begrensninger

- Dybdeskarpheten er en rampe (`photo-dof.py`), ikke et ekte dybdekart: hyllen rett bak arbeidsbordet blir like skarp som bordet. Den skal bare brukes til å vurdere utsnitt. Et ekte bilde med grunn skarphetsdybde må lages på nytt (prompt G i `assets/photo/README.md`).
- Kildebildet er 1672 px bredt. Over ca. 1,5× er forgrunnen strukket mer enn 1,35 skjermpiksler per bildepiksel på 1440 px bredde.
- Skjermformat: utsnittene er målt på 16:10. Siden senker selv zoomen når tavlene eller skiltet ellers ville falt ut av bildet (bredere enn 16:9 eller smalere enn 4:3). På mobil (under 760 px bredde) er zoomen 1 og tavlene er ca. 6 % bredere enn skjermen. Ikke løst.
- Forgrunnsboksene og tavlene er målt med øyet. Vektene er mine.

## Filer

- `crop-analysis.json`: alle tall (vinnere, kriterier, zoomkurve, uskarphetstest). `crop-analysis.txt`: utskriften.
- `utsnitt-oversikt.jpg`: vinnerutsnittene tegnet inn på bildet, ett felt per forgrunn.
- `utsnitt-score-kart.jpg`: hvor midtpunktet kan ligge for arbeidsbordet, ved 1,2–2,2× (lyst = høy score, mørkt = ugyldig).
- `utsnitt-uskarphet.jpg`: tavlene ved sigma 0, 2,5, 4,5, 7 og 10.
- `utsnitt-fire-forsider.jpg`: de fire sidene ved 1440 × 900.
