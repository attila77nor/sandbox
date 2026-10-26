/* What the overview shows: every page we have made, the photographs and the inspiration images.
   `file` is relative to analytika/. `group` decides how links inside the page are resolved (see oversikt.mjs).
   Status: valgt (chosen), alternativ (an option from this round), tidligere (earlier direction), avvist (rejected). */

export const SECTIONS = [
  { id: 'forsider', title: 'Forsider' },
  { id: 'people', title: 'People' },
  { id: 'insights', title: 'Insights' },
  { id: 'products', title: 'Products' },
  { id: 'about', title: 'About us' },
  { id: 'bibliotek', title: 'Biblioteksideen' },
  { id: 'avvist', title: 'Avvist' },
];

const E = (name, extra = {}) => ({ group: 'explore', file: `concepts/explore/${name}.html`, id: name, ...extra });
const S = (name, extra = {}) => ({ group: 'site', file: `concepts/site/${name}.html`, id: 'site-' + name, ...extra });
const O = (name, extra = {}) => ({ group: 'old', file: `concepts/${name}.html`, id: 'old-' + name, ...extra });

export const ITEMS = [
  /* ---------------------------------------------------------------- forsider */
  { section: 'forsider', status: 'valgt', title: 'Forside med rommet', text: 'Rommet fyller hele skjermen uten ramme. «Analytika» nede til høyre. Scroll tones bildet til hvitt, og fire grå rader tar over. De fem tavlene er klikkbare.', round: 'Runde 3', ...E('forside-rom') },
  { section: 'forsider', status: 'alternativ', title: 'Forside med første tavlebilde', text: 'Samme oppbygning, men tavlene fyller nesten hele bredden, og bildet må dimmes for at tittelen skal synes.', round: 'Runde 3', ...E('forside') },
  { section: 'forsider', status: 'avvist', title: 'Forside med kontoret', text: 'Åpent kontorlandskap. Tavlene fyller 85–94 % av bredden, bildet må dimmes, og det er skrivefeil på tavlene.', round: 'Runde 3', ...E('forside-kontor') },
  { section: 'forsider', status: 'alternativ', title: 'Vegg, hvit', text: 'Hvit bunn, bildet toner opp fra hvitt. Tavlene dimmer hverandre ved hover, og områdenavnet står under.', round: 'Runde 2', ...E('vegg-hvit') },
  { section: 'forsider', status: 'alternativ', title: 'Vegg, marine', text: 'Bildet toner i logoens marine. Et klikk på en tavle åpner underområdene under bildet. Fire flate felt bærer sidene.', round: 'Runde 2', ...E('vegg-marine') },
  { section: 'forsider', status: 'alternativ', title: 'Vegg, zoom', text: 'D-looken med det nye bildet. Et klikk på en tavle zoomer inn og viser underområdene ved siden av.', round: 'Runde 2', ...E('vegg-zoom') },
  { section: 'forsider', status: 'alternativ', title: 'Oslo-lys', text: 'Siden lyses av himmelen over Oslo akkurat nå. Bildet er årets dagslyskurve; sidene ligger på jevndøgn og solverv.', round: 'Runde 1', thumbSuffix: '?at=2026-06-21T11:00Z', ...E('oslo') },
  { section: 'forsider', status: 'alternativ', title: 'Tabell', text: 'Siden er en trykt aktuartabell, satt som en statistisk årbok. Scroll er å bli eldre.', round: 'Runde 1', ...E('tabell') },
  { section: 'forsider', status: 'alternativ', title: 'Trekanten', text: 'Galton-gitteret som firmaet: seks rader er nøyaktig 21 prikker, én per person. En kule faller gjennom.', round: 'Runde 1', waitMs: 6500, ...E('trekant') },
  { section: 'forsider', status: 'alternativ', title: 'Tetthet', text: 'Svart og hvitt. Linjer ved kvantilene til en fordeling, så de trenger seg sammen der sannsynligheten er høy.', round: 'Runde 1', ...E('tetthet') },
  { section: 'forsider', status: 'tidligere', title: 'Dagens retning (D)', text: 'Mørk bunn, serif-tittel og Galton-brettet som bilde, med fire ord langs en sikksakklinje.', round: 'Første økter', ...S('index') },
  { section: 'forsider', status: 'tidligere', title: 'Seks designtyper A–F', text: 'Seks utseender på samme innhold: natt, dyp blå, brun, fotoserif (D), fargeblokker og lys kaskade.', round: 'Første økter', ...O('variants') },
  { section: 'forsider', status: 'tidligere', title: 'Fem designretninger', text: 'Første runde: fem skisser av forsiden.', round: 'Første økter', ...O('index') },
  { section: 'forsider', status: 'tidligere', title: 'Forside-skisse med fjell', text: 'Fjellbilde som toner til hvitt, fire ord langs en linje.', round: 'Første økter', ...O('landing') },
  { section: 'forsider', status: 'tidligere', title: 'Visjonen, struktur først', text: 'Skisser av forsiden som én sammenhengende side.', round: 'Første økter', ...O('vision') },
  { section: 'forsider', status: 'tidligere', title: 'Fotokonsepter for D', text: 'Ulike bilder til variant D.', round: 'Første økter', ...O('photo-concepts') },

  /* ---------------------------------------------------------------- people */
  { section: 'people', status: 'alternativ', title: 'People i Oslo-lys', text: 'Ankomstrekken som prikker på en linje, med navn i tre kolonner.', round: 'Runde 1', ...E('oslo-people', { thumbSuffix: '?at=2026-12-15T11:00Z' }) },
  { section: 'people', status: 'alternativ', title: 'People i Tabell', text: 'Ankomstrekken som tabell: nummer, navn og år. Åpne rader er ledige roller.', round: 'Runde 1', ...E('tabell-people') },
  { section: 'people', status: 'alternativ', title: 'People i Trekanten', text: 'Samme trekant med navn ved siden av. Peker du på et navn, lyser prikken.', round: 'Runde 1', waitMs: 1500, ...E('trekant-people') },
  { section: 'people', status: 'alternativ', title: 'People i Tetthet', text: 'Én linje per person, stiplede linjer for ledige plasser.', round: 'Runde 1', ...E('tetthet-people') },
  { section: 'people', status: 'tidligere', title: 'People, ankomstlinjen', text: 'En prikk per person i rekkefølge, åpne prikker for ledige roller. Mørk stil.', round: 'Første økter', ...S('people') },
  { section: 'people', status: 'tidligere', title: 'People, fire strukturer', text: 'Fire skisser av hvordan People kan se ut.', round: 'Første økter', ...O('people-concepts') },
  { section: 'people', status: 'tidligere', title: 'People, ny runde', text: 'Andre runde med strukturer for People.', round: 'Første økter', ...O('people-concepts-2') },

  /* ---------------------------------------------------------------- insights */
  { section: 'insights', status: 'tidligere', title: 'Insights', text: 'Fem områdesymboler, hver tegnet fra en ekte kurve. Et klikk åpner underområdene. Plassholdertekst.', round: 'Første økter', ...S('insights') },
  { section: 'insights', status: 'tidligere', title: 'Insights, risk actuary', text: 'Detaljside for et underområde under Actuary. Plassholdertekst.', round: 'Første økter', ...S('insights-actuary-risk') },
  { section: 'insights', status: 'tidligere', title: 'Insights, compliance', text: 'Detaljside for et underområde under Actuary. Plassholdertekst.', round: 'Første økter', ...S('insights-actuary-compliance') },
  { section: 'insights', status: 'tidligere', title: 'Insights, reserving', text: 'Detaljside for et underområde under Actuary. Plassholdertekst.', round: 'Første økter', ...S('insights-actuary-reserving') },
  { section: 'insights', status: 'tidligere', title: 'Insights, life and pension', text: 'Detaljside for et underområde under Actuary. Plassholdertekst.', round: 'Første økter', ...S('insights-actuary-life-pension') },

  /* ---------------------------------------------------------------- products, about */
  { section: 'products', status: 'tidligere', title: 'Products', text: 'Fire produkter (Indie, N Models, Triangles, AI) på hvit bunn som toner inn i bildet. Plassholdertekst.', round: 'Første økter', ...S('products') },
  { section: 'about', status: 'tidligere', title: 'About us, museumsskilt', text: 'Hvem vi er, hvordan vi jobber og hvem vi jobber for, som skilt på en tom vegg.', round: 'Første økter', ...S('about') },
  { section: 'about', status: 'tidligere', title: 'About us, tre strukturer', text: 'Tre skisser av About us.', round: 'Første økter', ...O('about-concepts') },
  { section: 'about', status: 'tidligere', title: 'About us som tekstside', text: 'Tre tekststrukturer for About us.', round: 'Første økter', ...O('about-concepts-2') },

  /* ---------------------------------------------------------------- bibliotek, avvist */
  { section: 'bibliotek', status: 'tidligere', title: 'Biblioteksvegg med fem tavler', text: 'Tegnet plassholder for et foto av et bibliotek. Ideen ble til rommet med tavler.', round: 'Første økter', group: 'lib', file: 'concepts/library/index.html', id: 'lib-index' },
  { section: 'avvist', status: 'avvist', title: 'Taste 1, det stille instrumentet', text: 'Laget med en skill du avviste som generisk.', round: 'Første økter', group: 'taste', file: 'concepts/taste/1-instrument.html', id: 'taste-1' },
  { section: 'avvist', status: 'avvist', title: 'Taste 2, biblioteksveggen', text: 'Samme side som biblioteksveggen over. Avvist sammen med resten.', round: 'Første økter', group: 'taste', file: 'concepts/taste/2-library-wall.html', id: 'taste-2', same: 'lib-index' },
  { section: 'avvist', status: 'avvist', title: 'Taste 3, det trykte årsskriftet', text: 'Laget med en skill du avviste som generisk.', round: 'Første økter', group: 'taste', file: 'concepts/taste/3-annual.html', id: 'taste-3' },
];

/* photographs: `full` = embedded at full size so the card can open it */
export const PHOTOS = [
  { id: 'rom-v2-neutral', file: 'assets/photo/rom-v2-neutral.jpg', title: 'Rommet, nøytral gråtone, lett korn', text: 'Valgt. Generert i ChatGPT, tone og korn lagt på her.', status: 'valgt', full: true },
  { id: 'rom-v2-neutral-korn', file: 'assets/photo/rom-v2-neutral-korn.jpg', title: 'Rommet, tydeligere korn', text: 'Samme bilde med mer korn.', status: 'alternativ' },
  { id: 'rom-v2-chatgpt', file: 'assets/photo/rom-v2-chatgpt.webp', title: 'Rommet, slik ChatGPT leverte det', text: 'Gylden tone.', status: 'tidligere' },
  { id: 'rom-v1-chatgpt', file: 'assets/photo/rom-v1-chatgpt.webp', title: 'Rommet, første forsøk', text: 'Færre ting på bordet og ingen skillevegg.', status: 'tidligere' },
  { id: 'tavler', file: 'assets/photo/tavler.jpg', title: 'Det første tavlebildet', text: 'Tavlene fyller 86 % av bredden.', status: 'alternativ', full: true },
  { id: 'kontor-v3-neutral', file: 'assets/photo/kontor-v3-neutral.jpg', title: 'Kontoret, nøytral og med korn', text: 'Avvist.', status: 'avvist', full: true },
];

/* inspiration: from analytika/inspiration/README.md */
export const INSPIRATION = [
  { title: 'Dagens nettside', dir: '1-dagens-nettside' },
  { title: 'Referanser, runde 1', note: 'Den brune (nr. 5) falt best i smak.', dir: '2-referanser-runde-1' },
  { title: 'Referanser, runde 2', dir: '3-referanser-runde-2' },
  { title: 'Referanser, runde 3', dir: '4-referanser-runde-3' },
];
