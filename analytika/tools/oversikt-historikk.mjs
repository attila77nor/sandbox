/* Pulls the earlier versions of the site pages out of git into ../concepts/historikk/, one folder per round,
   so they can be shown in the overview. Run once; the files are committed. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

export const SNAPSHOTS = [
  { n: 1, hash: '4561efd', label: 'Første utkast: ord og sikksakklinje' },
  { n: 2, hash: 'b720a2b', label: 'Rett sikksakk, Products med tåke og fjell' },
  { n: 3, hash: '3c98714', label: 'Midtlinje med grener, områdesymboler, ankomstlinjen' },
  { n: 4, hash: '4e99654', label: 'About us som veggskilt' },
];
const repo = new URL('../../', import.meta.url).pathname;
const git = (...a) => execFileSync('git', a, { cwd: repo, maxBuffer: 64 << 20 });
if (process.argv[1] && process.argv[1].endsWith('oversikt-historikk.mjs')) {
  for (const s of SNAPSHOTS) {
    const dir = new URL(`../concepts/historikk/${s.n}-${s.hash}/`, import.meta.url);
    mkdirSync(dir, { recursive: true });
    const files = git('ls-tree', '--name-only', s.hash, 'analytika/concepts/site/').toString().trim().split('\n').filter((f) => /\.html$/.test(f) && !/preview\.html$/.test(f));
    for (const f of files) writeFileSync(new URL(f.split('/').pop(), dir), git('show', `${s.hash}:${f}`));
    console.log(s.n, s.hash, files.length, 'pages');
  }
}
