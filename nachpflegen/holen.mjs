// Holt die Quelldokumente eines Videos aus Paperclip nach quellen/<slug>/ (Schritt 1 von 3).
// Aufruf: node nachpflegen/holen.mjs <slug>   (braucht PAPERCLIP_API_URL, PAPERCLIP_API_KEY)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const slug = process.argv[2];
if (!slug) { console.error('FEHLER: Aufruf: node nachpflegen/holen.mjs <slug>'); process.exit(2); }
const { PAPERCLIP_API_URL, PAPERCLIP_API_KEY } = process.env;
if (!PAPERCLIP_API_URL || !PAPERCLIP_API_KEY) { console.error('FEHLER: PAPERCLIP_API_URL und PAPERCLIP_API_KEY fehlen.'); process.exit(2); }
const basis = PAPERCLIP_API_URL.replace(/\/+$/, '').replace(/\/api$/, '');
const dir = join(ROOT, 'quellen', slug);
const liste = JSON.parse(readFileSync(join(dir, 'quellen.json'), 'utf8'));
for (const d of liste.dokumente) {
  const r = await fetch(`${basis}/api/issues/${d.aufgabe}/documents/${d.schluessel}`, { headers: { authorization: `Bearer ${PAPERCLIP_API_KEY}` } });
  if (!r.ok) { console.error(`FEHLER: ${d.aufgabe}/${d.schluessel}: HTTP ${r.status}`); process.exit(1); }
  const j = await r.json();
  if (!j.body) { console.error(`FEHLER: ${d.aufgabe}/${d.schluessel}: leeres Dokument`); process.exit(1); }
  writeFileSync(join(dir, d.datei), j.body);
  const neu = j.latestRevisionNumber;
  console.log(`geholt ${d.datei} (${d.aufgabe}/${d.schluessel}, Revision ${neu}${neu !== d.revision ? `, vorher ${d.revision}` : ''})`);
  d.revision = neu;
}
writeFileSync(join(dir, 'quellen.json'), JSON.stringify(liste, null, 2) + '\n');
