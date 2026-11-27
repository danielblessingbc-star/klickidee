// Vergleicht neu erzeugte Datendateien mit dem bisherigen Stand, Feld für Feld (Formatierung egal).
// Aufruf: node nachpflegen/vergleichen.mjs <slug> <ordner-neu> [ordner-alt, Standard: daten]
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const [slug, neu, alt = join(ROOT, 'daten')] = process.argv.slice(2);
if (!slug || !neu) { console.error('Aufruf: node nachpflegen/vergleichen.mjs <slug> <ordner-neu> [ordner-alt]'); process.exit(2); }
let abw = 0;
const flach = (o, p = '') => (o && typeof o === 'object') ? Object.entries(o).flatMap(([k, v]) => flach(v, p ? `${p}.${k}` : k)) : [[p, o]];
for (const unter of ['prompts', 'videos']) {
  const a = Object.fromEntries(flach(JSON.parse(readFileSync(join(alt, unter, `${slug}.json`), 'utf8'))));
  const n = Object.fromEntries(flach(JSON.parse(readFileSync(join(neu, unter, `${slug}.json`), 'utf8'))));
  for (const k of new Set([...Object.keys(a), ...Object.keys(n)])) {
    if (a[k] === n[k]) continue;
    abw++; console.log(`ABWEICHUNG ${unter}/${slug}.json  ${k}\n  bisher: ${JSON.stringify(a[k])}\n  neu:    ${JSON.stringify(n[k])}`);
  }
}
console.log(abw ? `${abw} Abweichung(en)` : 'keine Abweichung');
process.exit(abw ? 1 : 0);
