/* What the overview shows: every page and every sketch we have made, the photographs and the inspiration images.
   - SECTIONS group by page type, SUBS are the sub-headings inside a section (newest first).
   - ITEMS are whole pages. EXPAND lists the older files that hold several sketches ("section.concept" blocks):
     each block becomes its own card, with title and text read from the page itself (see oversikt-thumbs.cjs).
   - HISTORY lists the earlier versions of the site pages (pulled out of git by oversikt-historikk.mjs).
   `file` is relative to analytika/. `group` decides how links inside a page are resolved (see oversikt.mjs).
   Status: valgt (chosen), alternativ (an option from the latest rounds), tidligere (earlier), avvist (rejected). */
import { SNAPSHOTS } from './oversikt-historikk.mjs';

export const SECTIONS = [
  { id: 'forsider', title: 'Forsider' },
  { id: 'people', title: 'People' },
  { id: 'insights', title: 'Insights' },
  { id: 'products', title: 'Products' },
  { id: 'about', title: 'About us' },
  { id: 'bibliotek', title: 'Biblioteksideen' },
  { id: 'avvist', title: 'Avvist' },
];

/* sub-headings, in the order they appear; `page` adds an "open the whole page" button */
export const SUBS = {
  r3: { title: 'Runde 3: forsiden med bildet over hele skjermen', note: 'Samme oppbygning med tre ulike bilder.' },
  r2: { title: 'Runde 2: de fem tavlene som områder', note: 'Minimal topp, gradient ned i bildet, klikkbare tavler.' },
  r1: { title: 'Runde 1: fire nye retninger', note: 'Hentet fra Analytika selv: Oslo, matematikken, folkene.' },
  photo: { title: 'Fotokonsepter for variant D', note: 'To av de fem bildene ble tegnet. Resten står i fotobriefen på siden.', page: 'concepts/photo-concepts.html' },
  variants: { title: 'Seks designtyper på samme innhold', note: 'Samme forside i seks utseender. D er den som ble valgt den gang.', page: 'concepts/variants.html' },
  siteIndex: { title: 'Forsiden gjennom versjonene', note: 'Fra første utkast til dagens retning (D). Eldst først.' },
  landing: { title: 'Forside-skisse, hele siden', note: 'Én lang skisse med fjellbilde og fire ord langs en linje.' },
  vision: { title: 'Visjonen, struktur først', note: 'Skisser av forsiden etter din beskrivelse.', page: 'concepts/vision.html' },
  index5: { title: 'Fem designretninger', note: 'Første runde: fem helt ulike forsider.', page: 'concepts/index.html' },
  peopleR1: { title: 'People, runde 1 av de nye retningene', note: 'Samme ankomstrekke i fire verdener.' },
  people2: { title: 'People, ny runde (eldre)', note: 'Tre nye strukturer.', page: 'concepts/people-concepts-2.html' },
  people1: { title: 'People, fire strukturer (eldre)', note: 'Ingen titler, ingen rangering.', page: 'concepts/people-concepts.html' },
  siteHist: { title: 'Gjennom versjonene', note: 'Eldst først, og dagens retning (D) til slutt.' },
  insightsSub: { title: 'Underområder under Actuary (siste versjon)', note: 'Plassholdertekst.' },
  about2: { title: 'About us som tekstside (eldre)', note: 'Tre tekststrukturer.', page: 'concepts/about-concepts-2.html' },
  about1: { title: 'About us, tre strukturer (eldre)', note: 'Tre første skisser.', page: 'concepts/about-concepts.html' },
  lib: { title: 'Biblioteksvegg', note: 'Tegnet plassholder for et foto som aldri ble tatt; ideen ble til rommet med tavler.' },
  taste: { title: 'Laget med en skill du avviste som generisk', note: 'Bygg ikke videre på dem.' },
};

const E = (name, extra = {}) => ({ group: 'explore', file: `concepts/explore/${name}.html`, id: name, ...extra });
const S = (name, extra = {}) => ({ group: 'site', file: `concepts/site/${name}.html`, id: 'site-' + name, ...extra });

export const ITEMS = [
  /* ---------------------------------------------------------------- forsider, nyeste først */
  { section: 'forsider', sub: 'r3', status: 'valgt', title: 'Forside med rommet', text: 'Rommet fyller hele skjermen uten ramme. «Analytika» nede til høyre. Scroll tones bildet til hvitt, og fire grå rader tar over. De fem tavlene er klikkbare.', round: 'Runde 3', ...E('forside-rom') },
  { section: 'forsider', sub: 'r3', status: 'alternativ', title: 'Forside med det virkelige kontoret', text: 'Kontoret deres, ryddet av ChatGPT, over hele skjermen. Tavlene fyller bare 28–37 % av bredden, og den hvite tittelen står nede til venstre. Ny kandidat.', round: 'Runde 3', ...E('forside-ekte') },
  { section: 'forsider', sub: 'r3', status: 'alternativ', title: 'Forside med kontoret, 1,3× nærmere', text: 'Samme bilde beskåret 1,3× rundt tavlene (en simulering, ingen ny generering). Tavlene fyller 40 % av bredden, klikkflaten er 108 px, og de to maleriene faller stort sett utenfor.', round: 'Runde 3', ...E('forside-ekte-naer') },
  { section: 'forsider', sub: 'r3', status: 'alternativ', title: 'Forside med første tavlebilde', text: 'Samme oppbygning, men tavlene fyller nesten hele bredden, og bildet må dimmes for at tittelen skal synes.', round: 'Runde 3', ...E('forside') },
  { section: 'forsider', sub: 'r3', status: 'avvist', title: 'Forside med kontoret', text: 'Åpent kontorlandskap. Tavlene fyller 85–94 % av bredden, bildet må dimmes, og det er skrivefeil på tavlene.', round: 'Runde 3', ...E('forside-kontor') },
  { section: 'forsider', sub: 'r2', status: 'alternativ', title: 'Vegg, hvit', text: 'Hvit bunn, bildet toner opp fra hvitt. Tavlene dimmer hverandre ved hover, og områdenavnet står under.', round: 'Runde 2', ...E('vegg-hvit') },
  { section: 'forsider', sub: 'r2', status: 'alternativ', title: 'Vegg, marine', text: 'Bildet toner i logoens marine. Et klikk på en tavle åpner underområdene under bildet. Fire flate felt bærer sidene.', round: 'Runde 2', ...E('vegg-marine') },
  { section: 'forsider', sub: 'r2', status: 'alternativ', title: 'Vegg, zoom', text: 'D-looken med det nye bildet. Et klikk på en tavle zoomer inn og viser underområdene ved siden av.', round: 'Runde 2', ...E('vegg-zoom') },
  { section: 'forsider', sub: 'r1', status: 'alternativ', title: 'Oslo-lys', text: 'Siden lyses av himmelen over Oslo akkurat nå. Bildet er årets dagslyskurve; sidene ligger på jevndøgn og solverv.', round: 'Runde 1', thumbSuffix: '?at=2026-06-21T11:00Z', ...E('oslo') },
  { section: 'forsider', sub: 'r1', status: 'alternativ', title: 'Tabell', text: 'Siden er en trykt aktuartabell, satt som en statistisk årbok. Scroll er å bli eldre.', round: 'Runde 1', ...E('tabell') },
  { section: 'forsider', sub: 'r1', status: 'alternativ', title: 'Trekanten', text: 'Galton-gitteret som firmaet: seks rader er nøyaktig 21 prikker, én per person. En kule faller gjennom.', round: 'Runde 1', waitMs: 6500, ...E('trekant') },
  { section: 'forsider', sub: 'r1', status: 'alternativ', title: 'Tetthet', text: 'Svart og hvitt. Linjer ved kvantilene til en fordeling, så de trenger seg sammen der sannsynligheten er høy.', round: 'Runde 1', ...E('tetthet') },
  { section: 'forsider', sub: 'landing', status: 'tidligere', title: 'Forside-skisse med fjell', text: 'Fjellbilde som toner til hvitt, fire ord langs en linje, med de andre sidene koblet på.', round: 'Første økter', group: 'old', file: 'concepts/landing.html', id: 'old-landing' },

  /* ---------------------------------------------------------------- people */
  { section: 'people', sub: 'peopleR1', status: 'alternativ', title: 'People i Oslo-lys', text: 'Ankomstrekken som prikker på en linje, med navn i tre kolonner.', round: 'Runde 1', ...E('oslo-people', { thumbSuffix: '?at=2026-12-15T11:00Z' }) },
  { section: 'people', sub: 'peopleR1', status: 'alternativ', title: 'People i Tabell', text: 'Ankomstrekken som tabell: nummer, navn og år. Åpne rader er ledige roller.', round: 'Runde 1', ...E('tabell-people') },
  { section: 'people', sub: 'peopleR1', status: 'alternativ', title: 'People i Trekanten', text: 'Samme trekant med navn ved siden av. Peker du på et navn, lyser prikken.', round: 'Runde 1', waitMs: 1500, ...E('trekant-people') },
  { section: 'people', sub: 'peopleR1', status: 'alternativ', title: 'People i Tetthet', text: 'Én linje per person, stiplede linjer for ledige plasser.', round: 'Runde 1', ...E('tetthet-people') },

  /* ---------------------------------------------------------------- insights: the four sub-pages of the latest version */
  ...['risk', 'compliance', 'reserving', 'life-pension'].map((n) => S('insights-actuary-' + n, { section: 'insights', sub: 'insightsSub', status: 'tidligere', title: { risk: 'Risk actuary', compliance: 'Compliance', reserving: 'Reserving', 'life-pension': 'Life and pension' }[n], text: 'Detaljside for et underområde under Actuary. Plassholdertekst.', round: 'Siste versjon' })),

  /* ---------------------------------------------------------------- bibliotek, avvist */
  { section: 'bibliotek', sub: 'lib', status: 'tidligere', title: 'Biblioteksvegg med fem tavler', text: 'Fem tavler på en bibliotekvegg, tegnet i kode. Hver tavle har sin egen matematikk.', round: 'Første økter', group: 'lib', file: 'concepts/library/index.html', id: 'lib-index' },
  { section: 'avvist', sub: 'taste', status: 'avvist', title: 'Taste 1, det stille instrumentet', text: 'En landingsside bygget med den avviste skillen.', round: 'Første økter', group: 'taste', file: 'concepts/taste/1-instrument.html', id: 'taste-1' },
  { section: 'avvist', sub: 'taste', status: 'avvist', title: 'Taste 2, biblioteksveggen', text: 'Samme side som biblioteksveggen over.', round: 'Første økter', group: 'taste', file: 'concepts/taste/2-library-wall.html', id: 'taste-2', same: 'lib-index' },
  { section: 'avvist', sub: 'taste', status: 'avvist', title: 'Taste 3, det trykte årsskriftet', text: 'En landingsside bygget med den avviste skillen.', round: 'Første økter', group: 'taste', file: 'concepts/taste/3-annual.html', id: 'taste-3' },
];

/* files that hold several sketches; each `section.concept` block becomes a card */
export const EXPAND = [
  { file: 'concepts/photo-concepts.html', id: 'photo', section: 'forsider', sub: 'photo', status: 'tidligere', round: 'Første økter' },
  { file: 'concepts/variants.html', id: 'variants', section: 'forsider', sub: 'variants', status: 'tidligere', round: 'Første økter' },
  { file: 'concepts/vision.html', id: 'vision', section: 'forsider', sub: 'vision', status: 'tidligere', round: 'Første økter' },
  { file: 'concepts/index.html', id: 'index5', section: 'forsider', sub: 'index5', status: 'tidligere', round: 'Første økter' },
  { file: 'concepts/people-concepts-2.html', id: 'people2', section: 'people', sub: 'people2', status: 'tidligere', round: 'Første økter' },
  { file: 'concepts/people-concepts.html', id: 'people1', section: 'people', sub: 'people1', status: 'tidligere', round: 'Første økter' },
  { file: 'concepts/about-concepts-2.html', id: 'about2', section: 'about', sub: 'about2', status: 'tidligere', round: 'Første økter' },
  { file: 'concepts/about-concepts.html', id: 'about1', section: 'about', sub: 'about1', status: 'tidligere', round: 'Første økter' },
].map((e) => ({ group: 'old', ...e }));

/* the earlier versions of the five main site pages, then the latest (D) */
const PAGES = [
  ['index', 'forsider', 'siteIndex', 'Forside'],
  ['people', 'people', 'siteHist', 'People'],
  ['insights', 'insights', 'siteHist', 'Insights'],
  ['products', 'products', 'siteHist', 'Products'],
  ['about', 'about', 'siteHist', 'About us'],
];
const LATEST_TEXT = { index: 'Mørk bunn, serif-tittel og Galton-brettet som bilde. Dagens retning (D).', people: 'Ankomstlinjen: en prikk per person, åpne prikker for ledige roller.', insights: 'Fem områdesymboler, hver tegnet fra en ekte kurve. Et klikk åpner underområdene.', products: 'Fire produkter (Indie, N Models, Triangles, AI) som toner inn i bildet.', about: 'Museumsskilt: hvem vi er, hvordan vi jobber, hvem vi jobber for.' };
export const HISTORY = PAGES.flatMap(([name, section, sub, label]) => [
  ...SNAPSHOTS.map((s) => ({ section, sub, status: 'tidligere', title: `${label}, versjon ${s.n}`, text: s.label, round: `Versjon ${s.n}`, group: `hist-${s.n}`, file: `concepts/historikk/${s.n}-${s.hash}/${name}.html`, id: `h${s.n}-${name}` })),
  S(name, { section, sub, status: 'tidligere', title: `${label}, siste versjon`, text: LATEST_TEXT[name], round: 'Siste versjon' }),
]);

/* photographs: `full` = embedded at full size so the card can open it */
export const PHOTOS = [
  { id: 'rom-v2-neutral', file: 'assets/photo/rom-v2-neutral.jpg', title: 'Rommet, nøytral gråtone, lett korn', text: 'Valgt. Generert i ChatGPT, tone og korn lagt på her.', status: 'valgt', full: true },
  { id: 'rom-v2-neutral-korn', file: 'assets/photo/rom-v2-neutral-korn.jpg', title: 'Rommet, tydeligere korn', text: 'Samme bilde med mer korn.', status: 'alternativ' },
  { id: 'rom-v2-chatgpt', file: 'assets/photo/rom-v2-chatgpt.webp', title: 'Rommet, slik ChatGPT leverte det', text: 'Gylden tone.', status: 'tidligere' },
  { id: 'rom-v1-chatgpt', file: 'assets/photo/rom-v1-chatgpt.webp', title: 'Rommet, første forsøk', text: 'Færre ting på bordet og ingen skillevegg.', status: 'tidligere' },
  { id: 'ekte-kontor-v4-neutral', file: 'assets/photo/ekte-kontor-v4-neutral.jpg', title: 'Det virkelige kontoret, nøytral og med korn', text: 'Ny kandidat. Kontoret deres ryddet av ChatGPT; tone og korn lagt på her.', status: 'alternativ', full: true },
  { id: 'ekte-kontor-v4-chatgpt', file: 'assets/photo/ekte-kontor-v4-chatgpt.webp', title: 'Det virkelige kontoret, slik ChatGPT leverte det', text: 'Svakt varm tone.', status: 'tidligere' },
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

/* documents: shown as text (or the logo as a picture) */
export const DOCS = [
  { id: 'product', title: 'Designkonteksten', text: 'PRODUCT.md: brukere, formål, valg som er tatt (forsiden med rommet) og det som er åpent.', file: 'PRODUCT.md', kind: 'md' },
  { id: 'photo-readme', title: 'Bildene: opphav og prompter', text: 'Hva hvert bilde er, hvordan det er behandlet, og promptene til ChatGPT.', file: 'assets/photo/README.md', kind: 'md' },
  { id: 'logo', title: 'Logoen', text: 'Prikktriangelet og ordmerket. Marine #1E3363, blå #1B92D0, dyp blå #036194.', file: 'assets/logo/logo.svg', kind: 'svg' },
  { id: 'bildebrief', title: 'Bildebrief: biblioteket med fem tavler', text: 'Den første bildebriefen, til biblioteksideen.', file: 'concepts/bildebrief-bibliotek.md', kind: 'md' },
  { id: 'inspo-readme', title: 'Inspirasjon: hva som er samlet', text: 'README for inspirasjonsmappen.', file: 'inspiration/README.md', kind: 'md' },
  { id: 'tools-readme', title: 'Verktøyene', text: 'Hvordan sidene og oversikten bygges, og i hvilken rekkefølge.', file: 'tools/README.md', kind: 'md' },
];
