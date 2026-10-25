/* The Galton board stand-in (illustration of the photograph), shared by the site pages. */
export function galton(prefix = 'gb') {
  const cx = 790, rows = 10, sx = 32, sy = 29, y0 = 84;
  let pegs = '', balls = '', bins = '', heap = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c <= r; c++) {
    const x = cx + (c - r / 2) * sx, y = y0 + r * sy;
    pegs += `<circle cx="${x.toFixed(1)}" cy="${y}" r="2.3" fill="#D6E0F0" opacity=".62"/>`;
  }
  const nb = 11, bw = 32, by0 = y0 + rows * sy + 16, floor = 566;
  const N = 78, C = (n, k) => { let v = 1; for (let i = 1; i <= k; i++) v = (v * (n - k + i)) / i; return v; };
  const rad = 5.4, step = 10.2;
  for (let k = 0; k < nb; k++) {
    const x = cx + (k - (nb - 1) / 2) * bw;
    const cnt = Math.round((N * C(nb - 1, k)) / 2 ** (nb - 1));
    for (let j = 0; j < cnt; j++) heap += `<circle cx="${(x + (j % 2 ? 1.2 : -1.2)).toFixed(1)}" cy="${(floor - rad - j * step).toFixed(1)}" r="${rad}" fill="url(#${prefix}-steel)"/>`;
    if (k > 0) bins += `<line x1="${x - bw / 2}" y1="${by0}" x2="${x - bw / 2}" y2="${floor}" stroke="#DCE6F5" stroke-opacity=".22" stroke-width="1"/>`;
  }
  bins += `<line x1="${cx - (nb * bw) / 2}" y1="${floor}" x2="${cx + (nb * bw) / 2}" y2="${floor}" stroke="#DCE6F5" stroke-opacity=".5" stroke-width="1.2"/>`;
  const falling = [[cx - 18, 112, 46], [cx + 32, 180, 38], [cx - 60, 262, 52], [cx + 6, 326, 40], [cx + 96, 392, 52]];
  for (const [x, y, t] of falling) balls += `<rect x="${x - 1.4}" y="${y - t}" width="2.8" height="${t}" fill="url(#${prefix}-trail)"/><circle cx="${x}" cy="${y}" r="5.8" fill="url(#${prefix}-steel)"/>`;
  return `<svg viewBox="0 0 1000 625" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>
<radialGradient id="${prefix}-bg" cx="78%" cy="26%" r="72%"><stop offset="0" stop-color="#26334B"/><stop offset=".55" stop-color="#0D121C"/><stop offset="1" stop-color="#05070B"/></radialGradient>
<radialGradient id="${prefix}-steel" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#B9C6DB"/><stop offset="1" stop-color="#4C5C78"/></radialGradient>
<linearGradient id="${prefix}-trail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7EEF9" stop-opacity="0"/><stop offset="1" stop-color="#E7EEF9" stop-opacity=".7"/></linearGradient>
<filter id="${prefix}-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<rect width="1000" height="625" fill="url(#${prefix}-bg)"/>
<g filter="url(#${prefix}-glow)" opacity=".55">${pegs}</g><g>${pegs}</g>${bins}${heap}${balls}
</svg>`;
}
