// Abnahme-Prüfung: node pruefung/pruefen.mjs  (braucht playwright, siehe README)
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/tmp/pw/');
const { chromium } = require('playwright');
const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const DOCS = join(ROOT, 'docs');
const SHOTS = join(ROOT, 'pruefung', 'screenshots'); mkdirSync(SHOTS, { recursive: true });
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]); let f = join(DOCS, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { s.writeHead(404); s.end('nf'); return; }
  s.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); s.end(readFileSync(f));
}).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const res = []; const ok = (n, b, d = '') => { res.push({ n, b, d }); console.log(`${b ? 'OK  ' : 'FEHLER'} ${n} ${d}`); };

// alle HTML-Seiten
const seiten = []; (function walk(d, rel = '') { for (const e of readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) walk(join(d, e.name), rel + e.name + '/'); else if (e.name === 'index.html') seiten.push('/' + rel); } })(DOCS);
const br = await chromium.launch();
const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, permissions: ['clipboard-read', 'clipboard-write'], locale: 'de-DE' });
const extern = new Set(); const fehler = [];
ctx.on('request', (r) => { if (!r.url().startsWith(base)) extern.add(r.url()); });
const seite = await ctx.newPage();
seite.on('pageerror', (e) => fehler.push(String(e))); seite.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });

// 1. Jede Seite laden, interne Links prüfen, Seitenaufbau
const linkSet = new Set(); const extLinks = new Set();
for (const p of seiten) {
  const r = await seite.goto(base + p); ok(`lädt ${p}`, r.status() === 200);
  const links = await seite.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const h of links) { if (/^(https?:|mailto:)/.test(h)) { if (h.startsWith('http')) extLinks.add(h); } else if (h.startsWith('/')) ok(`kein absoluter Pfad ${p} ${h}`, false); else linkSet.add(new URL(h, base + p).pathname + new URL(h, base + p).hash); }
  const h1 = await seite.$$eval('h1', (x) => x.length); ok(`genau eine H1 ${p}`, h1 === 1);
  const lang = await seite.getAttribute('html', 'lang'); ok(`lang=de ${p}`, lang === 'de');
  const ohneAlt = await seite.$$eval('img', (x) => x.filter((i) => !i.hasAttribute('alt')).length); ok(`alle Bilder mit alt ${p}`, ohneAlt === 0);
  const breite = await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth); ok(`kein Seitwärts-Scrollen am Handy ${p}`, breite);
  const fuss = await seite.$$eval('.fuss a', (a) => a.map((x) => x.getAttribute('href'))); ok(`Impressum+Datenschutz im Fuß ${p}`, fuss.some((h) => h.includes('impressum')) && fuss.some((h) => h.includes('datenschutz')));
}
for (const l of linkSet) { const pth = l.split('#')[0]; const f = join(DOCS, pth); ok(`Link-Ziel ${l}`, existsSync(f) && (!statSync(f).isDirectory() || existsSync(join(f, 'index.html')))); }

// 2. Kein Fremdkontakt ohne Klick, keine Cookies, keine Fehler
ok('keine fremden Anfragen vor dem Klick', extern.size === 0, [...extern].join(','));
ok('keine Cookies', (await ctx.cookies()).length === 0);
ok('kein localStorage/sessionStorage', await seite.evaluate(() => localStorage.length + sessionStorage.length === 0));
ok('keine Konsolenfehler', fehler.length === 0, fehler.join(' | '));

// 3. Startseite: Gewicht, Neuestes, Screenshots
const bytes = {}; seite.on('response', async (r) => { try { bytes[r.url()] = (await r.body()).length; } catch {} });
await seite.goto(base + '/', { waitUntil: 'networkidle' });
const summe = Object.values(bytes).reduce((a, b) => a + b, 0); ok('Startseite unter 1 MB', summe < 1e6, `${Math.round(summe / 1024)} KB`);
const t0 = Date.now(); await seite.reload({ waitUntil: 'load' }); ok('Start lädt (lokal, Richtwert)', Date.now() - t0 < 2000, `${Date.now() - t0} ms`);
ok('Neuestes zeigt neuestes Video + Prompts', (await seite.locator('#h-neu').count()) === 1 && (await seite.locator('.gross-video a[href^="videos/"]').count()) > 0 && (await seite.locator('.neuestes .karte').count()) > 0);
await seite.screenshot({ path: join(SHOTS, 'handy-start.png') });
await seite.screenshot({ path: join(SHOTS, 'handy-start-voll.png'), fullPage: true });

// 4. Prompt-Seite: Kopieren, Stempel, Grenze, Video-Link
const ps = readdirSync(join(DOCS, 'inhalte/prompts')).filter((x) => existsSync(join(DOCS, 'inhalte/prompts', x, 'index.html')));
for (const slug of ps) {
  await seite.goto(`${base}/inhalte/prompts/${slug}/`);
  const erwartet = JSON.parse(readFileSync(join(ROOT, 'daten/prompts', slug + '.json'), 'utf8')).prompt;
  await seite.click('[data-kopieren]'); await seite.waitForTimeout(150);
  const zw = await seite.evaluate(() => navigator.clipboard.readText()); ok(`Kopieren liefert Prompt wörtlich ${slug}`, zw === erwartet);
  ok('Knopf zeigt „Kopiert ✓“', (await seite.textContent('[data-kopieren]')).includes('Kopiert'));
  ok('Stempel Getestet · Werkzeug · Datum', /Getestet · .+ · \d\d\.\d\d\.\d{4}/.test(await seite.textContent('.stempel')));
  ok('Grenze vorhanden', (await seite.locator('.grenze p').textContent()).length > 10);
  ok('Warum vorhanden', (await seite.locator('.warum li').count()) > 0);
  ok('Link zum Video', (await seite.locator('a[href*="videos/"]').count()) > 0);
  const box = await seite.locator('[data-kopieren]').boundingBox(); ok('Kopieren-Knopf ≥ 44 px hoch', box.height >= 44, `${Math.round(box.height)} px`);
  const fs = await seite.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.prompt-text')).fontSize)); ok('Prompt-Schrift ≥ 16 px', fs >= 16);
  await seite.screenshot({ path: join(SHOTS, `handy-prompt-${slug}.png`), fullPage: true });
}

// 5. Video-Seite: Zwei-Klick
const vs = readdirSync(join(DOCS, 'videos')).filter((x) => existsSync(join(DOCS, 'videos', x, 'index.html')));
for (const slug of vs) {
  extern.clear();
  await seite.goto(`${base}/videos/${slug}/`);
  ok('vor Klick: kein iframe', (await seite.locator('iframe').count()) === 0);
  ok('vor Klick: keine fremde Anfrage', extern.size === 0);
  ok('Hinweis „Daten an YouTube“ sichtbar', (await seite.textContent('.player-hinweis')).includes('Daten an YouTube übertragen'));
  ok('Link zum Prompt', (await seite.locator('a[href*="inhalte/prompts/"]').count()) > 0);
  await seite.screenshot({ path: join(SHOTS, `handy-video-${slug}-vorher.png`), fullPage: true });
  await seite.route('https://www.youtube-nocookie.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<p>Testplayer</p>' }));
  await seite.click('.player-start'); await seite.waitForSelector('iframe');
  const src = await seite.getAttribute('iframe', 'src'); ok('nach Klick: Player von youtube-nocookie.com', src.startsWith('https://www.youtube-nocookie.com/embed/'), src);
  ok('nach Klick: nur youtube-nocookie.com als Fremdziel', [...extern].every((u) => u.startsWith('https://www.youtube-nocookie.com/')));
}

// 6. Bibliothek: Filter, Suche
await seite.goto(`${base}/inhalte/prompts/?thema=praxis`);
ok('Filter per Adresse (?thema=praxis)', (await seite.locator('[data-karten] .karte:visible').count()) === ps.length);
await seite.goto(`${base}/inhalte/prompts/?thema=funktion`);
ok('Filter „Versteckte Funktion“ zeigt Leer-Hinweis', await seite.locator('[data-leer]').isVisible());
await seite.goto(`${base}/inhalte/prompts/`); await seite.fill('#suche', 'Protokoll');
ok('Suche findet Prompt', (await seite.locator('[data-karten] .karte:visible').count()) === 1);
await seite.screenshot({ path: join(SHOTS, 'handy-bibliothek.png') });
await seite.goto(`${base}/inhalte/skills/`); ok('Skills-Seite leer, ohne Datum', (await seite.locator('.karte').count()) === 0 && !/\d{4}|demnächst|bald am/i.test((await seite.textContent('main')).replace(/Hier sammeln wir bald/, '')));

// 7. Menü am Handy
await seite.goto(base + '/'); await seite.click('.inhalte summary');
ok('Menü „Inhalte“ klappt auf: Prompts + Skills', (await seite.locator('.untermenue a:visible').count()) === 3);
await seite.screenshot({ path: join(SHOTS, 'handy-menue.png') });

// 8. Textregeln
const verboten = /krass|gamechanger|das musst du wissen|niemand sagt dir|DSGVO-konform|\bsicher\b|KI ersetzt|10x|nur heute/i;
for (const p of seiten) { const t = readFileSync(join(DOCS, p, 'index.html'), 'utf8').replace(/<script[\s\S]*?<\/script>/g, ''); const text = t.replace(/<[^>]+>/g, ' '); const m = text.match(verboten); ok(`keine verbotenen Wörter ${p}`, !m, m ? m[0] : ''); }
// Datenschutz/Impressum: nur Adresse ersetzt
for (const n of ['datenschutz', 'impressum']) { const t = readFileSync(join(ROOT, 'inhalt', n + '.md'), 'utf8'); ok(`${n}: kein Platzhalter mehr`, !t.includes('[WEBSITE-ADRESSE]')); }

// 9. Externe Links (nur Liste, Prüfung separat per curl)
console.log('EXTERN:', [...extLinks].join('\n'));
await br.close(); srv.close();
const bad = res.filter((x) => !x.b); console.log(`\n${res.length - bad.length}/${res.length} Prüfpunkte erfüllt`); process.exit(bad.length ? 1 : 0);
