Fonts that are embedded in the pages, so what we test is what is shown. All are SIL Open Font License 1.1 (license texts next to the files), latin subset, from the npm packages `@fontsource/*` 5.3.0.

- `cormorant-garamond-latin-500-normal.woff2`: Cormorant Garamond Medium. The display serif of the title variants in `tools/explore-r6-fokus.mjs`.

Instrument Serif was tried first and dropped: Impeccable's detector flags it as an overused "AI" face.

- `hanken-grotesk-latin-{300,400,500,700}-normal.woff2`: Hanken Grotesk (latin subset, `hanken-grotesk-OFL.txt`), the site's sans, embedded by the round 7 and 8 pages.
- `hanken-grotesk-latin-{600,800,900}-normal.woff2`: the heavier weights of Hanken Grotesk, used by the round 11 pages (600 for the studio page's headline and menu, 900 for the three-word card).
- `bodoni-moda-latin-500-italic.woff2`: Bodoni Moda Medium Italic (`bodoni-moda-OFL.txt`), the high-contrast italic of the middle word on the round 11 card page; from `@fontsource/bodoni-moda` 5.1.0.


- `archivo-variable-latin-wdth-normal.woff2`: Archivo as a variable font with weight and width axes (`@fontsource-variable/archivo` 5, `archivo-OFL.txt`), the condensed headings of the round 12 report page. Instrument Sans (the reference's face) was tried first and dropped: the detector flags it as overused.
- `space-mono-latin-400-normal.woff2`: Space Mono Regular (`space-mono-OFL.txt`), the small labels of the round 12 report page.
