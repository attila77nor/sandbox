# Build tools for the Analytika concepts

Plain Node scripts (Node 22, no dependencies; `site-shot.cjs` needs Playwright).
Run them from anywhere; paths resolve relative to this folder.

- `site-build.mjs` writes the nine clickable pages and `preview.html` to `../concepts/site/` (the dark serif look with the Galton-board stand-in). Running it again reproduces the committed files byte for byte.
- `library-wall.mjs` writes `../concepts/library/index.html`: a drawn library wall with five chalkboards. It is a stand-in for the photograph that will replace it. All formulas and curves on the boards are correct mathematics.
- `figures.mjs` holds the five maths figures (survival curve, Lorenz curve, star graph, decision tree, logistic curve), the illustrative Gompertz law and the area and page lists.
- `lib.mjs` splits `../assets/logo/logo.svg` (converted from the supplied PDF) into mark and wordmark symbols that can be recoloured with CSS variables.
- `art.mjs` draws the Galton board stand-in.
- `site-shot.cjs` takes screenshots and click-tests the site (`SHOTS=<folder> node site-shot.cjs`).
- `explore-r1-*.mjs` write round 1 of the exploration to `../concepts/explore/`: four new directions (`oslo`, `tabell`, `trekant`, `tetthet`), each a home page and a People page, plus `index.html` (`explore-r1-index.mjs`). `explore-shared.mjs` holds what they share. `explore-r1-shots.cjs` takes the screenshots into `concepts/explore/img/` (`MOBILE=1` also takes 390 px full-page shots).
- `explore-r2-vegg.mjs` writes the three home pages built on `../assets/photo/tavler.jpg` (`vegg-hvit`, `vegg-marine`, `vegg-zoom`); `explore-r2-shots.cjs` takes their screenshots. Board positions on the photograph are measured in pixels at the top of the script.
