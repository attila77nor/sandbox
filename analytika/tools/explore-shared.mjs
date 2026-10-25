/* Shared pieces for the exploration rounds (concepts/explore/). */
import { writeFileSync, mkdirSync } from 'node:fs';
import { logoDefs } from './lib.mjs';
export { logoDefs };
export { S, q, ex, GB, GA, fig, FIG_CSS, figure } from './figures.mjs';

export const OUT = new URL('../concepts/explore/', import.meta.url);
export const write = (name, html) => { mkdirSync(OUT, { recursive: true }); writeFileSync(new URL(name, OUT), html); console.log('wrote', name, html.length); };

/* The 21 names are the ones already used in the sketches (concepts/site/people.html).
   Order of arrival is illustrative: only two arrival years are known. */
export const PEOPLE = ['Are Flataker Viken', 'Arturas Mecuta', 'Atle Melve', 'Bendik Bull', 'Bård Støve', 'Eigminas Dagys', 'Eivind Borg', 'Ellen Skrimstad', 'Fredrik Bergflødt', 'Harald Hasner', 'Håvard Vilming', 'Kjell Andreas Solberg', 'Lars Aga Reisæter', 'Laura Dage', 'Martin Osvik', 'Pernille Kiil', 'Sandra Brännstam', 'Sindre Ones', 'Tom Milenin', 'Vytautas Audzijonis', 'Thuvaragi Saravani'];

export const LOGO = '<svg class="logo" role="img" aria-label="Analytika"><use href="#lg-full"/></svg>';
export const MARK = '<svg class="mark" aria-hidden="true"><use href="#lg-mark"/></svg>';

export const NAV = [['People', 'people'], ['Insights', 'insights'], ['Products', 'products'], ['About us', 'about']];
export const AREA_NAMES = ['Actuary', 'Pricing', 'Data platforms', 'Consulting', 'Business development'];

export const fonts = (...fams) => `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${fams.map((f) => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${f}&display=swap">`).join('')}`;

/* every sketch page says it is a sketch, in one quiet line at the very bottom */
export const SKETCH = (txt) => `<p class="sketch">${txt}</p>`;
