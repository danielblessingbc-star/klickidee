// Erzeugt daten/prompts/<slug>.json und daten/videos/<slug>.json aus den Quellen (Schritt 2 von 3).
// Aufruf: node nachpflegen/einpflegen.mjs <slug> [--out <ordner>]
// Der Prompt wird wörtlich aus dem Prompt-Test übernommen und nie umformuliert.
// Fehlt oder widerspricht sich etwas, bricht das Skript mit Meldung ab und schreibt nichts.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const slug = process.argv[2];
const oi = process.argv.indexOf('--out');
const OUT = oi > 0 ? process.argv[oi + 1] : join(ROOT, 'daten');
if (!slug || slug.startsWith('--')) { console.error('FEHLER: Aufruf: node nachpflegen/einpflegen.mjs <slug> [--out <ordner>]'); process.exit(2); }
const dir = join(ROOT, 'quellen', slug);
const probleme = [];
const fehlt = (m) => probleme.push(m);
const lies = (f) => { const p = join(dir, f); if (!existsSync(p)) { fehlt(`Quelle fehlt: quellen/${slug}/${f}`); return ''; } return readFileSync(p, 'utf8'); };

const test = lies('prompt-test.md'), upload = lies('upload-paket.md'), skript = lies('skript.md');
let erg = {};
try { erg = JSON.parse(lies('ergaenzung.json') || '{}'); } catch (e) { fehlt(`ergaenzung.json ist kein gültiges JSON: ${e.message}`); }
for (const k of ['slug', 'datum', 'youtube', 'plattformen', 'vorschau', 'vorschauAlt', 'thema', 'schlagworte', 'promptTitel', 'seoTitel', 'promptBeschreibung', 'aufgabe', 'warum', 'ergebnisZusatz', 'grenzeVorsatz', 'datenschutz', 'videoBeschreibung', 'kiHinweis']) {
  if (erg[k] === undefined || erg[k] === '' || (Array.isArray(erg[k]) && !erg[k].length && k !== 'schlagworte')) fehlt(`Feld fehlt in ergaenzung.json: ${k}`);
}
if (erg.slug && erg.slug !== slug) fehlt(`slug in ergaenzung.json (${erg.slug}) passt nicht zu ${slug}`);
if (erg.datum && !/^\d{4}-\d\d-\d\d$/.test(erg.datum)) fehlt(`datum muss JJJJ-MM-TT sein: ${erg.datum}`);
if (erg.youtube && !/^[\w-]{11}$/.test(erg.youtube)) fehlt(`youtube muss die 11-stellige Video-ID sein: ${erg.youtube}`);
if (erg.vorschau && !existsSync(join(ROOT, 'src/assets', erg.vorschau))) fehlt(`Vorschaubild fehlt: src/assets/${erg.vorschau}`);

// ---- Prompt-Test: Abschnitt „Was ins Video kommt“ ----
const abschnitt = (test.split(/^## Was ins Video kommt.*$/m)[1] || '').split(/^---$/m)[0];
if (test && !abschnitt) fehlt('prompt-test: Abschnitt „Was ins Video kommt“ nicht gefunden');
const promptM = abschnitt.match(/^```\n([\s\S]*?)\n```$/m);
const prompt = promptM ? promptM[1] : '';
if (abschnitt && !prompt) fehlt('prompt-test: Prompt-Karte (Codeblock) nicht gefunden');
const stempel = abschnitt.match(/Stempel: „Getestet · (.+?) · (\d\d\.\d\d\.\d{4})“/);
if (abschnitt && !stempel) fehlt('prompt-test: Stempel „Getestet · Werkzeug · Datum“ nicht gefunden');
const gekM = abschnitt.match(/\*\*gekürzt\*\*: ([^.]*\.)/);
const tab = abschnitt.split('\n').filter((z) => /^\|/.test(z));
const zellen = (z) => z.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const spalten = tab.length > 2 ? zellen(tab[0]) : [];
const zeilen = tab.slice(2).map(zellen);
if (abschnitt && (!spalten.length || !zeilen.length)) fehlt('prompt-test: Ergebnis-Tabelle nicht gefunden');
if (zeilen.some((z) => z.length !== spalten.length)) fehlt('prompt-test: Ergebnis-Tabelle hat ungleich lange Zeilen');
const grM = test.match(/^\*\*Grenze aus dem echten Befund:\*\* (.+)$/m);
if (test && !grM) fehlt('prompt-test: „Grenze aus dem echten Befund“ nicht gefunden');

// ---- Gegenprobe Upload-Paket: Beschreibung enthält denselben Prompt und denselben Test ----
const beschr = (upload.split('--- ab hier kopieren ---')[1] || '').split('--- bis hier kopieren ---')[0];
if (upload && !beschr) fehlt('upload-paket: Beschreibung (zwischen den Linien) nicht gefunden');
const upPrompt = (beschr.match(/Der Prompt zum Kopieren:\n([\s\S]*?)\n\nGetestet mit/) || [])[1];
if (beschr && upPrompt !== prompt) fehlt('Widerspruch: Prompt im Upload-Paket ist nicht Zeichen für Zeichen gleich dem Prompt im Prompt-Test');
const upT = beschr.match(/Getestet mit (.+?) am (\d\d\.\d\d\.\d{4})\./);
if (beschr && stempel && (!upT || upT[1] !== stempel[1] || upT[2] !== stempel[2])) fehlt('Widerspruch: „Getestet mit … am …“ im Upload-Paket passt nicht zum Stempel im Prompt-Test');

// ---- Skript: Titel der Einblendung ----
const titM = skript.match(/Titel ab Bild 1:\*\* „(.+?)“/);
if (skript && !titM) fehlt('skript: Titel-Einblendung („Titel ab Bild 1“) nicht gefunden');

if (probleme.length) { console.error(`ABBRUCH: ${probleme.length} Problem(e), es wurde nichts geschrieben:`); probleme.forEach((p) => console.error(` - ${p}`)); process.exit(1); }

const promptDaten = {
  slug, titel: erg.promptTitel, seoTitel: erg.seoTitel, beschreibung: erg.promptBeschreibung, datum: erg.datum,
  thema: erg.thema, schlagworte: erg.schlagworte, aufgabe: erg.aufgabe, prompt, warum: erg.warum,
  ergebnis: {
    werkzeug: stempel[1], datum: stempel[2], gekuerzt: !!gekM,
    hinweis: `${gekM ? `Gekürzt: ${gekM[1]} ` : ''}${erg.ergebnisZusatz}`,
    spalten, zeilen,
  },
  grenze: `${erg.grenzeVorsatz} ${grM[1].replace(/\*\*/g, '')}`,
  datenschutz: erg.datenschutz, video: slug,
};
const videoDaten = {
  slug, titel: titM[1], datum: erg.datum, youtube: erg.youtube, plattformen: erg.plattformen,
  vorschau: erg.vorschau, vorschauAlt: erg.vorschauAlt, prompt: slug,
  beschreibung: erg.videoBeschreibung, kiHinweis: erg.kiHinweis,
};
for (const [unter, d] of [['prompts', promptDaten], ['videos', videoDaten]]) {
  mkdirSync(join(OUT, unter), { recursive: true });
  writeFileSync(join(OUT, unter, `${slug}.json`), JSON.stringify(d, null, 2) + '\n');
  console.log(`geschrieben ${join(OUT, unter, slug + '.json')}`);
}
