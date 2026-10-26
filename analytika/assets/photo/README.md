# Bildene: opphav, behandling og prompter

Alle bildene er laget i ChatGPT og levert av Atle. Tone og korn er lagt på her, med `tools/photo-neutral.py`. Ingen av dem er et ekte foto av kontoret. Rommet er en erstatning til et ekte foto eller en større versjon er på plass.

## Filene

| Fil | Hva det er |
|---|---|
| `tavler-original.png`, `tavler.jpg` | Det første tavlebildet, 1914 × 822. Svart-hvitt, fem hvite tavler med håndskrevet matematikk i et åpent kontor. Tavlene fyller 86 % av bredden. `tavler.jpg` er web-versjonen. |
| `kontor-v3-chatgpt.webp` | Det andre tavlebildet, 1672 × 941 (16:9). Samme motiv med kameraet trukket litt tilbake. Opphavet er antatt (justeringsprompten under), ikke bekreftet. Tavlene fyller 85–94 % av skjermbredden, og det er lesbare skrivefeil på dem. **Avvist.** |
| `kontor-v3-neutral.jpg` | Samme bilde, nøytral og med korn: `photo-neutral.py --grain 2.2 --lift 0.95`. |
| `ekte-kontor-v4-chatgpt.webp` | **Ny kandidat.** Kontoret deres, 1672 × 941. Atle ba ChatGPT rydde det opp; strukturene er ifølge Atle de samme som i virkeligheten. Promptene til oppryddingen er ikke lagret. De fem tavlene har de samme fem tegningene som det genererte rommet, så de er trolig lagt til av ChatGPT. Det er ikke bekreftet om tavlene henger der i virkeligheten, og bildet er uansett en bearbeidet fremstilling, ikke et dokumentarfoto. Svakt varm tone (rød minus blå = 8,5). |
| `ekte-kontor-v4-neutral.jpg` | Samme bilde, nøytral gråtone, lettet og med lett korn: `photo-neutral.py --grain 2.2 --lift 0.85`. Tavlene er målt til 567–1028 px i bredden og 380–469 i høyden. |
| `rom-v1-chatgpt.webp` | Rommet, første forsøk, 1672 × 941. Fra den nye prompten (A under). Gylden tone. |
| `rom-v2-chatgpt.webp` | Rommet, andre forsøk, 1672 × 941: flere ting på bordet, flere planter, lampe, jakke over en stol. Antatt fra justeringsprompten C. Gylden tone (rød minus blå = 12,6 mot 0,5 i det første tavlebildet). |
| `rom-v2-neutral.jpg` | **Valgt.** `rom-v2-chatgpt.webp` med det varme skjæret fjernet, litt mer klarhet og lett korn: `photo-neutral.py --grain 2.2`. Kornet er målt til samme nivå som det første tavlebildet (ca. 2,2 på en flat flate). |
| `rom-v2-neutral-korn.jpg` | Samme med tydeligere korn: `--grain 3.6`. |

De fem tavlene på hvert bilde er målt i piksler i `tools/explore-r3-forside.mjs` (`PHOTOS.rom`), og de må måles på nytt hvis bildet byttes.

## Promptene (engelsk, slik de ble gitt)

### A. Helt nytt bilde (ga `rom-v1`)

```
Create a wide 16:9 landscape black-and-white photograph, highest quality, as if shot on a medium-format film camera with a 35mm-equivalent lens at eye height. No colour at all. Fine film grain, soft natural window light, deep shadows, high dynamic range, calm and quiet mood.

Scene: a tall, high-ceilinged room in an old Oslo apartment building that is now a working space. Herringbone parquet floor, tall sash windows with soft daylight coming from the left, stucco ceiling mouldings, one plain pendant lamp, built-in bookshelves along the right wall. The camera stands at the end of a long wooden table and looks down the length of the room.

On the far wall hang exactly five whiteboards in a row, all the same size, evenly spaced, slightly right of centre. They are a modest part of the room, not the subject: together they take up only about one third of the image width and about one quarter of its height, with plenty of wall, ceiling, floor and furniture around them.

Each whiteboard carries loose marker drawings, small and unreadable at this distance, with no legible words, letters or numbers. Make the five drawings clearly different in shape: (1) a table of cells with a smooth curve, (2) a scatter of points with a fitted curve, (3) boxes joined by arrows, (4) a branching tree, (5) a grid of boxes.

Foreground: the edge of the long table at the bottom left, in deep shadow, with a few papers, a notebook and a coffee cup. Keep the bottom left dark, calm and uncluttered. Keep the top 12% of the image calm and low in detail. Keep everything important inside the central 70% of the width, so the sides can be cropped.

Style: understated documentary architectural photography. No people. Not an illustration, not a 3D render. No text, no logos, no watermark, no border, no vignette.
```

### B. Justering av det første tavlebildet: trekk kameraet tilbake (antatt opphav til `kontor-v3`)

```
Use the attached image as the reference. Keep it a black-and-white film photograph with the same look, grain and soft window light, the same room, and the same five whiteboards in the same order and arrangement, with the same kinds of drawings on them.

Change only this: pull the camera back and zoom out, so we see much more of the room around the boards. Extend the image on all sides with more wall, ceiling, floor and the long table in the foreground, in the same style and lighting. The five whiteboards should become about 40% smaller than they are now: together they should take up roughly half of the image width and about 40% of its height, and sit slightly right of centre, as one part of the room rather than the subject.

Output a wide 16:9 landscape image, highest quality. Keep the bottom-left corner dark, calm and uncluttered, and keep the top 12% calm and low in detail. No people, no text overlays, no logos, no borders, no vignette.
```

### C. Justering av rommet (ga `rom-v2`)

```
Use the attached image as the reference. Keep the room, the tall windows, the herringbone parquet, the stucco ceiling, the pendant lamp, the black-and-white film look and the soft window light. Keep the camera position unchanged. Keep the five small whiteboards on the far wall at exactly the same size and position, with the same five drawings, but make the marker lines look hand-drawn, slightly uneven, with a few faint smudges from erased marks and a marker tray with markers under each board.

Make the room feel smaller, more lived-in and more alive, without adding any people:
- Add a low, open room divider, waist-high, with books, plants and a few objects, set at an angle on the empty parquet on the right, so the room feels divided and less empty.
- Clutter the long table in its middle and far parts: two open laptops with dark screens, a second mug, a thermos, stacked notebooks, loose papers, a pen holder, a headphone set, some cables and a desk lamp. Move the mug and notebook that are now at the bottom left further up the table. Keep the nearest edge of the table, bottom left, clear, dark and calm.
- Add more plants: a large leafy plant in the right foreground, trailing plants on the shelves and the divider, plants on the windowsills.
- Add small traces of use: a jacket over one chair, a few chairs pulled out at different angles, a stack of books on the floor beside a chair.

Keep the lighting and the film grain. Output a wide 16:9 landscape image, highest quality. No people, no readable text, no logos, no watermark, no border, no vignette.
```

Skilleveggen ble ikke med i `rom-v2`.

### D. Nøytral gråtone (ble gjort lokalt i stedet)

Hvis det skal gjøres i ChatGPT:

```
Use the attached image as the reference. Convert it to a neutral black-and-white photograph with pure grey tones and no warm, golden or sepia tint at all. Make it crisp and very clear, with deep blacks and clean bright whites, and add fine silver-halide film grain, like a medium-format black-and-white film. Change nothing else: same composition, objects, plants and whiteboards.
```

## Hvis bildet byttes

1. Legg originalen her. Kjør `photo-neutral.py` på den i endelig størrelse (kornet må ligge på det endelige bildet).
2. Mål de fem tavlene i piksler og oppdater `PHOTOS.rom` i `tools/explore-r3-forside.mjs`.
3. Kjør `explore-r3-forside.mjs`, `explore-bundle.mjs`, `oversikt-thumbs.cjs` og `oversikt.mjs`.
