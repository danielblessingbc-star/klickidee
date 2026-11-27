// Prüfschritt für ein eingepflegtes Video (Schritt 3 von 3). Erwartet: node build.mjs ist gelaufen.
// Aufruf: node nachpflegen/pruefen-daten.mjs <slug> [--online]
// Ohne --online: alles, was ohne Netz geht. Mit --online: dazu Erreichbarkeit aller Links und
// Öffentlichkeit des YouTube-Videos. Das Browser-Skript pruefung/pruefen.mjs bleibt die Abnahme am Handy.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const slug = process.argv[2]; const online = process.argv.includes('--online');
if (!slug || slug.startsWith('--')) { console.error('Aufruf: node nachpflegen/pruefen-daten.mjs <slug> [--online]'); process.exit(2); }
const res = []; const ok = (n, b, d = '') => { res.push(b); console.log(`${b ? 'OK    ' : 'FEHLER'} ${n}${d ? '  ' + d : ''}`); };
const lies = (p) => readFileSync(join(ROOT, p), 'utf8');
const entities = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const site = JSON.parse(lies('site.json'));

// 1. Dateien und Pflichtfelder
const pf = `daten/prompts/${slug}.json`, vf = `daten/videos/${slug}.json`;
if (!existsSync(join(ROOT, pf)) || !existsSync(join(ROOT, vf))) { ok('Datendateien vorhanden', false, `${pf}, ${vf}`); process.exit(1); }
const p = JSON.parse(lies(pf)), v = JSON.parse(lies(vf));
const leer = (o, ks) => ks.filter((k) => o[k] === undefined || o[k] === null || o[k] === '' || (Array.isArray(o[k]) && o[k].length === 0));
ok('Prompt-Datei vollständig', !leer(p, ['titel', 'seoTitel', 'beschreibung', 'datum', 'thema', 'aufgabe', 'prompt', 'warum', 'ergebnis', 'grenze', 'video']).length, leer(p, ['titel', 'seoTitel', 'beschreibung', 'datum', 'thema', 'aufgabe', 'prompt', 'warum', 'ergebnis', 'grenze', 'video']).join(','));
ok('Ergebnis mit Werkzeug, Datum, Tabelle', !!(p.ergebnis && p.ergebnis.werkzeug && /^\d\d\.\d\d\.\d{4}$/.test(p.ergebnis.datum) && p.ergebnis.zeilen?.length));
ok('Video-Datei vollständig', !leer(v, ['titel', 'datum', 'youtube', 'vorschau', 'vorschauAlt', 'prompt', 'beschreibung', 'kiHinweis']).length, leer(v, ['titel', 'datum', 'youtube', 'vorschau', 'vorschauAlt', 'prompt', 'beschreibung', 'kiHinweis']).join(','));
ok('Prompt und Video verweisen aufeinander', p.video === v.slug && v.prompt === p.slug);
ok('Vorschaubild lokal vorhanden (WebP)', /\.webp$/.test(v.vorschau) && existsSync(join(ROOT, 'src/assets', v.vorschau)));

// 2. Prompt Zeichen für Zeichen gleich wie getestet
const test = existsSync(join(ROOT, 'quellen', slug, 'prompt-test.md')) ? lies(`quellen/${slug}/prompt-test.md`) : '';
const quelle = (((test.split(/^## Was ins Video kommt.*$/m)[1] || '').split(/^---$/m)[0]).match(/^```\n([\s\S]*?)\n```$/m) || [])[1];
ok('Quelle Prompt-Test vorhanden', !!quelle);
ok('Prompt gleich Prompt-Test (Zeichen für Zeichen)', !!quelle && p.prompt === quelle);
const up = existsSync(join(ROOT, 'quellen', slug, 'upload-paket.md')) ? lies(`quellen/${slug}/upload-paket.md`) : '';
const upPrompt = (up.split('--- ab hier kopieren ---')[1] || '').match(/Der Prompt zum Kopieren:\n([\s\S]*?)\n\nGetestet mit/);
ok('Prompt gleich Prompt in der YouTube-Beschreibung', !!upPrompt && upPrompt[1] === p.prompt);
const html = (pfad) => existsSync(join(ROOT, 'docs', pfad, 'index.html')) ? lies(`docs/${pfad}/index.html`) : null;
const pH = html(`inhalte/prompts/${slug}`), vH = html(`videos/${slug}`);
ok('Seiten gebaut (node build.mjs)', !!pH && !!vH);
if (pH && vH) {
  const imHtml = [...pH.matchAll(/<(?:pre|code|div|p)[^>]*class="[^"]*prompt-text[^"]*"[^>]*>([\s\S]*?)<\/(?:pre|code|div|p)>/g)].map((m) => entities(m[1].replace(/<[^>]+>/g, '')));
  ok('Prompt auf der Seite gleich Datei', imHtml.some((t) => t.trim() === p.prompt.trim()), imHtml.length ? '' : 'Element .prompt-text nicht gefunden');
  ok('Stempel „Getestet · Werkzeug · Datum“ auf der Seite', pH.includes(`Getestet · ${p.ergebnis.werkzeug} · ${p.ergebnis.datum}`));

  // 3. Verbotene Wörter (Konzept Abschnitt 6, Richtlinien-Checkliste, Prüfskript)
  const verboten = /krass|gamechanger|das musst du wissen|niemand sagt dir|DSGVO-konform|\bsicher\b|KI ersetzt|10x|nur heute|spart\s+\d+|\d+\s?%\s+(schneller|weniger|mehr)/i;
  for (const [n, h] of [['Prompt-Seite', pH], ['Video-Seite', vH]]) {
    const text = entities(h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')); const m = text.match(verboten);
    ok(`keine verbotenen Wörter: ${n}`, !m, m ? m[0] : '');
  }
  const daten = JSON.stringify([p, v]); const m2 = daten.match(verboten); ok('keine verbotenen Wörter: Datendateien', !m2, m2 ? m2[0] : '');

  // 4. Zwei-Klick und keine Fremdinhalte (statisch)
  ok('Video-Seite: kein iframe vor dem Klick', !/<iframe/i.test(vH));
  ok('Video-Seite: Hinweis „Daten an YouTube übertragen“', vH.includes('Beim Abspielen werden Daten an YouTube übertragen'));
  ok('Video-Seite: Player trägt die YouTube-ID', vH.includes(`data-youtube="${v.youtube}"`));
  for (const [n, h] of [['Prompt-Seite', pH], ['Video-Seite', vH]]) {
    const fremd = [...h.matchAll(/<(?:img|script|link|source|video|audio|iframe|embed)\b[^>]*\b(?:src|href|srcset)="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]).filter((u) => !u.startsWith(site.baseUrl));
    ok(`${n}: nichts Fremdes im Quelltext geladen`, fremd.length === 0, fremd.join(', '));
    ok(`${n}: Inhalts-Richtlinie erlaubt nur eigene Quellen und youtube-nocookie`, /default-src 'none'/.test(h) && /frame-src https:\/\/www\.youtube-nocookie\.com;/.test(h) && !/(script|img|style|font)-src[^;]*https?:/.test(h));
  }
  const js = lies('src/assets/seite.js');
  const urls = [...js.matchAll(/https?:\/\/[^'"\s)]+/g)].map((m) => m[0]);
  ok('seite.js: einziges Fremdziel youtube-nocookie.com', urls.length > 0 && urls.every((u) => u.startsWith('https://www.youtube-nocookie.com/')), urls.join(', '));

  // 5. Links
  const intern = [...new Set([...pH.matchAll(/href="([^"#]+)/g), ...vH.matchAll(/href="([^"#]+)/g)].map((m) => m[1]))];
  const zielOk = (h, von) => { if (/^(https?:|mailto:)/.test(h)) return true; const t = join(ROOT, 'docs', von, h); return existsSync(t) && (!statSync(t).isDirectory() || existsSync(join(t, 'index.html'))); };
  ok('interne Links der beiden Seiten haben ein Ziel', intern.every((h) => (zielOk(h, `inhalte/prompts/${slug}`) || zielOk(h, `videos/${slug}`))), intern.filter((h) => !(zielOk(h, `inhalte/prompts/${slug}`) || zielOk(h, `videos/${slug}`))).join(', '));
  ok('interne Links sind relativ', ![...pH.matchAll(/href="(\/[^"]*)"/g), ...vH.matchAll(/href="(\/[^"]*)"/g)].length);
  const platt = Object.entries(v.plattformen || {});
  const aufSeite = [...vH.matchAll(/class="plattform" href="([^"]+)"/g)].map((m) => entities(m[1]));
  ok('„Dieses Video auch auf“ zeigt genau die Plattformen aus der Datei', aufSeite.length === platt.length && platt.every(([, u]) => aufSeite.includes(u)));
  ok('Plattform-Links sind Video-Links, keine Profil-Links', platt.every(([k, u]) => /^https:\/\//.test(u) && !/\/@klickidee\/?$/.test(u) && /(\/video\/|\/reel\/|\/p\/|\/videos\/|\/watch|\/posts\/|reel)/.test(u)), platt.map(([k]) => k).join(','));

  if (online) {
    const holt = async (u, m = 'GET') => { try { const r = await fetch(u, { method: m, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 klickidee-pruefung' } }); return r.status; } catch (e) { return 'Fehler ' + e.message; } };
    const oe = await holt(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/shorts/' + v.youtube)}`);
    ok('YouTube-Video ist öffentlich (oEmbed 200)', oe === 200, String(oe));
    for (const [k, u] of platt) { const s = await holt(u); ok(`Plattform-Link ${k} erreichbar`, s === 200, `${u} → ${s}`); }
    const ext = [...new Set([...pH.matchAll(/href="(https?:[^"]+)"/g), ...vH.matchAll(/href="(https?:[^"]+)"/g)].map((m) => entities(m[1])))].filter((u) => !u.startsWith(site.baseUrl) && !platt.some(([, x]) => x === u));
    for (const u of ext) { const s = await holt(u); ok(`externer Link erreichbar: ${u}`, s === 200, String(s)); }
    for (const [pfad, n] of [[`inhalte/prompts/${slug}/`, 'Prompt-Seite'], [`videos/${slug}/`, 'Video-Seite'], ['', 'Startseite']]) { const s = await holt(site.baseUrl + pfad); ok(`${n} unter der Vorschau-Adresse erreichbar`, s === 200, `${site.baseUrl + pfad} → ${s}`); }
  } else console.log('HINWEIS  Erreichbarkeit der Links und Öffentlichkeit des Videos nicht geprüft (--online fehlt).');

  // 6. „Neuestes“ zeigt das jüngste Video
  const alle = readdirSync(join(ROOT, 'daten/videos')).map((f) => JSON.parse(lies(`daten/videos/${f}`))).sort((a, b) => b.datum.localeCompare(a.datum) || a.slug.localeCompare(b.slug));
  const start = html('') || lies('docs/index.html');
  ok('Startseite „Neuestes“ zeigt das jüngste Video', start.includes(`href="videos/${alle[0].slug}/"`), alle[0].slug);
}
const bad = res.filter((x) => !x).length;
console.log(`\n${res.length - bad}/${res.length} Prüfpunkte erfüllt${bad ? `, ${bad} FEHLER` : ''}`);
process.exit(bad ? 1 : 0);
