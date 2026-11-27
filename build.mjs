// KlicKIdee – statischer Seitenbau. Keine Abhängigkeiten. Aufruf: node build.mjs
// Daten: daten/prompts/*.json, daten/videos/*.json, inhalt/*.md. Ausgabe: docs/
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = dirname(new URL(import.meta.url).pathname);
const OUT = join(ROOT, 'docs');
const site = JSON.parse(readFileSync(join(ROOT, 'site.json'), 'utf8'));

// ---------- Daten ----------
const lies = (dir) => readdirSync(join(ROOT, 'daten', dir)).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(ROOT, 'daten', dir, f), 'utf8')));
const prompts = lies('prompts').sort((a, b) => b.datum.localeCompare(a.datum) || a.slug.localeCompare(b.slug));
const videos = lies('videos').sort((a, b) => b.datum.localeCompare(a.datum) || a.slug.localeCompare(b.slug));
const promptBy = Object.fromEntries(prompts.map((p) => [p.slug, p]));
const videoBy = Object.fromEntries(videos.map((v) => [v.slug, v]));

const THEMEN = {
  praxis: ['Prompt für die Praxis', 'Eine Büroaufgabe, ein fertiger Prompt.'],
  funktion: ['Versteckte Funktion', 'Ein wenig bekannter Kniff in gängigen Werkzeugen.'],
  'vorher-nachher': ['Vorher/Nachher', 'Ein Arbeitsablauf mit ehrlich selbst gemessenem Vergleich.'],
  'ki-richtig': ['KI richtig nutzen', 'Fehler erkennen, Fakten prüfen, Datenschutz-Grundregeln.'],
};
const AUFGABEN = ['E-Mail', 'Protokoll', 'Excel', 'Präsentation', 'Angebot', 'Feedback'];

const PLATTFORMEN = {
  youtube: { name: 'YouTube', url: 'https://www.youtube.com/@klickidee', icon: '<path d="M3 7.5C3 6 4 5 5.5 5h13C20 5 21 6 21 7.5v9c0 1.5-1 2.5-2.500 2.500h-13C4 19 3 18 3 16.500z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>' },
  tiktok: { name: 'TikTok', url: 'https://www.tiktok.com/@klickidee', icon: '<path d="M14 4v10.500a3.500 3.500 0 1 1-3.500-3.500" fill="none" stroke="currentColor" stroke-width="2.500" stroke-linecap="round"/><path d="M14 4c.5 2.500 2 4 4.500 4.200" fill="none" stroke="currentColor" stroke-width="2.500" stroke-linecap="round"/>' },
  instagram: { name: 'Instagram', url: 'https://www.instagram.com/klickidee', icon: '<rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.500" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16.800" cy="7.200" r="1.200" fill="currentColor"/>' },
  threads: { name: 'Threads', url: 'https://www.threads.net/@klickidee', icon: '<path d="M16.500 9.500C15.800 6.500 12 6 10 8c-2 2-1.500 7 2 7.500 3 .4 4.500-2 3.500-4-1-1.800-4-1.700-4.500 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  facebook: { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61596710262328', icon: '<path d="M13.500 20v-7h2.500l.5-3h-3V8.500c0-1 .5-1.500 1.500-1.500H16.500V4.300C16 4.200 15 4 14 4c-2.200 0-3.500 1.300-3.500 3.500V10H8v3h2.500v7z" fill="currentColor"/>' },
};
const icon = (k) => `<svg class="ico" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">${PLATTFORMEN[k].icon}</svg>`;

// ---------- Helfer ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const datumDe = (iso) => { const [y, m, d] = iso.split('-'); return `${d}.${m}.${y}`; };
// Relativer Pfad von der Seite (Tiefe) zur Wurzel: tiefe 0 -> "", 1 -> "../"
const rel = (tiefe) => '../'.repeat(tiefe);

function mdZuHtml(md) {
  const inline = (t) => esc(t)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, a, u) => `<a href="${u.replace(/&amp;/g, '&amp;')}"${/^https?:/.test(u) ? ' rel="noopener noreferrer"' : ''}>${a}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  const out = []; let liste = false; let absatz = [];
  const flush = () => { if (absatz.length) { out.push(`<p>${absatz.map(inline).join('<br>')}</p>`); absatz = []; } };
  const zu = () => { if (liste) { out.push('</ul>'); liste = false; } };
  for (const z of md.split('\n')) {
    if (/^## /.test(z)) { flush(); zu(); continue; } // H1 der Seite kommt aus der Vorlage
    if (/^### /.test(z)) { flush(); zu(); out.push(`<h2>${inline(z.slice(4))}</h2>`); continue; }
    if (/^- /.test(z)) { flush(); if (!liste) { out.push('<ul>'); liste = true; } out.push(`<li>${inline(z.slice(2))}</li>`); continue; }
    if (z.trim() === '') { flush(); zu(); continue; }
    zu(); absatz.push(z.trim());
  }
  flush(); zu();
  return out.join('\n');
}

// ---------- Bausteine ----------
const NAV = (tiefe, aktiv) => {
  const r = rel(tiefe);
  const a = (k, href, text) => `<a href="${r}${href}"${aktiv === k ? ' aria-current="page"' : ''}>${text}</a>`;
  return `<header class="kopf"><div class="breit kopf-innen">
<a class="marke" href="${r}"><img src="${r}assets/symbol-192.webp" width="48" height="48" alt=""><span class="wortmarke">Klic<span class="ki">KI</span>dee</span></a>
<nav aria-label="Hauptmenü" class="menue">
<details class="inhalte"${aktiv === 'inhalte' ? ' data-aktiv' : ''}><summary>Inhalte</summary><div class="untermenue">
${a('inhalte-start', 'inhalte/', 'Alle Inhalte')}${a('prompts', 'inhalte/prompts/', 'Prompts')}${a('skills', 'inhalte/skills/', 'Skills')}</div></details>
${a('videos', 'videos/', 'Videos')}${a('about', 'so-arbeiten-wir/', 'So arbeiten wir')}${a('kontakt', 'kontakt/', 'Kontakt')}
</nav></div></header>`;
};

const FUSS = (tiefe) => {
  const r = rel(tiefe);
  return `<footer class="fuss"><div class="breit">
<p class="fuss-marke"><span class="wortmarke">Klic<span class="ki">KI</span>dee</span> · Klick dich schlau</p>
<p class="fuss-links"><a href="${r}impressum/">Impressum</a> <a href="${r}datenschutz/">Datenschutz</a> <a href="${r}kontakt/">Kontakt</a></p>
<p class="fuss-hinweis">Allgemeine Tipps, keine Rechts-, Steuer- oder Datenschutzberatung.</p>
</div></footer>`;
};

const CSP = "default-src 'none'; img-src 'self'; font-src 'self'; style-src 'self'; script-src 'self'; frame-src https://www.youtube-nocookie.com; base-uri 'self'; form-action 'none'";

function seite({ pfad, tiefe, aktiv, titel, beschreibung, inhalt, bodyKlasse = '', og = true }) {
  const r = rel(tiefe);
  const t = pfad === '' ? `KlicKIdee: Klick dich schlau` : `${titel} | KlicKIdee`;
  const kanon = site.baseUrl ? `<link rel="canonical" href="${site.baseUrl}${pfad}">` : '';
  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<title>${esc(t)}</title>
<meta name="description" content="${esc(beschreibung)}">
${site.noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
${kanon}
<meta name="theme-color" content="#07162B">
${og && site.baseUrl ? `<meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(beschreibung)}"><meta property="og:image" content="${site.baseUrl}assets/og-bild.webp"><meta property="og:locale" content="de_DE">` : ''}
<link rel="icon" href="${r}assets/favicon-64.png" type="image/png">
<link rel="preload" href="${r}assets/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}assets/style.css">
<script src="${r}assets/seite.js" defer></script>
</head>
<body class="${bodyKlasse}">
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
${NAV(tiefe, aktiv)}
<main id="inhalt">
${inhalt}
</main>
${FUSS(tiefe)}
</body>
</html>
`;
  schreibe(join(pfad, 'index.html'), html);
}

const schreibe = (rp, text) => { const f = join(OUT, rp); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, text); };

const kartePrompt = (p, r) => `<article class="karte" data-thema="${p.thema}" data-aufgabe="${esc(p.schlagworte.join('|'))}" data-text="${esc((p.titel + ' ' + p.aufgabe + ' ' + p.schlagworte.join(' ')).toLowerCase())}">
<p class="karte-thema">${esc(THEMEN[p.thema][0])}</p>
<h3><a href="${r}inhalte/prompts/${p.slug}/">${esc(p.titel)}</a></h3>
<p>${esc(p.aufgabe)}</p>
<a class="knopf knopf-hell" href="${r}inhalte/prompts/${p.slug}/">Zum Prompt</a></article>`;

const karteVideo = (v, r) => `<article class="karte karte-video">
<a class="vorschau" href="${r}videos/${v.slug}/"><img src="${r}assets/${v.vorschau}" width="540" height="960" loading="lazy" alt="${esc(v.vorschauAlt)}"></a>
<p class="karte-thema">${datumDe(v.datum)}</p>
<h3><a href="${r}videos/${v.slug}/">${esc(v.titel)}</a></h3></article>`;

const platzhalter = (t) => esc(t).replace(/\[([^\]]+)\]/g, '<mark class="platzhalter">[$1]</mark>');

const plattformLinks = (r) => `<ul class="plattformen">${Object.entries(PLATTFORMEN).map(([k, p]) => `<li><a class="plattform" href="${p.url}" rel="noopener noreferrer">${icon(k)}<span>${p.name}</span></a></li>`).join('')}</ul>`;

// ---------- Seiten ----------
function start() {
  const r = '';
  const v = videos[0];
  const neu = prompts.slice(0, 6);
  const vp = v && promptBy[v.prompt];
  const neuestes = v ? `<section class="neuestes" aria-labelledby="h-neu"><div class="breit"><h2 id="h-neu">Neuestes</h2>
<div class="neuestes-raster"><article class="gross-video">
<a class="vorschau" href="videos/${v.slug}/"><img src="assets/${v.vorschau}" width="540" height="960" alt="${esc(v.vorschauAlt)}"></a>
<div><p class="karte-thema">Neuestes Video · ${datumDe(v.datum)}</p><h3><a href="videos/${v.slug}/">${esc(v.titel)}</a></h3><p>${esc(v.beschreibung)}</p>
<p class="knoepfe"><a class="knopf" href="videos/${v.slug}/">Zum Video</a>${vp ? `<a class="knopf knopf-hell" href="inhalte/prompts/${vp.slug}/">Zum Prompt</a>` : ''}</p></div></article>
<div><h3 class="klein">Neueste Prompts</h3><div class="karten">${neu.map((p) => kartePrompt(p, r)).join('')}</div></div></div></div></section>` : '';
  const inhalt = `<section class="held"><div class="breit">
<img class="held-logo" src="assets/logo-rund-480.webp" width="240" height="240" alt="KlicKIdee: Glühbirne mit Kopf und goldenem Cursorfunken">
<div><h1>Klick dich schlau</h1>
<p class="held-zeile">Ein Prompt, eine Büroaufgabe. Echt getestet.</p>
<p class="held-text">KI-Tipps für deinen Arbeitsalltag in unter einer Minute. Jeder Prompt ist ausprobiert, mit echtem Ergebnis und ehrlichem Hinweis, wo die KI an ihre Grenzen kommt.</p>
<p class="knoepfe"><a class="knopf" href="inhalte/prompts/">Prompts ansehen</a><a class="knopf knopf-dunkel" href="videos/">Videos ansehen</a></p></div></div></section>
${neuestes}
<section class="abschnitt"><div class="breit"><h2>So funktioniert’s</h2><div class="drei">
<div class="kachel"><p class="nr">1</p><h3>Die Aufgabe</h3><p>Eine echte Büroaufgabe, zum Beispiel eine lange Mailkette.</p></div>
<div class="kachel"><p class="nr">2</p><h3>Der Prompt</h3><p>Fertig zum Kopieren, jeder Baustein erklärt.</p></div>
<div class="kachel"><p class="nr">3</p><h3>Das Ergebnis und die Grenze</h3><p>Echt getestet, mit Datum. Und was du selbst prüfen musst.</p></div></div></div></section>
<section class="abschnitt abschnitt-dunkel"><div class="breit"><h2>Mehr entdecken</h2><div class="zwei">
<a class="kachel kachel-link" href="inhalte/"><h3>Inhalte</h3><p>Prompts zum Kopieren und bald auch Skills.</p></a>
<a class="kachel kachel-link" href="videos/"><h3>Videos</h3><p>Alle Shorts, neueste zuerst.</p></a></div></div></section>
<section class="abschnitt"><div class="breit"><h2>Warum KlicKIdee</h2><div class="drei">
<div class="kachel"><h3>Nützlich</h3><p>Jede Seite löst eine Aufgabe, die du diese Woche wirklich hast.</p></div>
<div class="kachel"><h3>Ehrlich</h3><p>Nur echte Ergebnisse. Die Grenzen nennen wir offen.</p></div>
<div class="kachel"><h3>Ruhig</h3><p>Kein Hype, keine Angstmache. Wie eine Kollegin, die kurz etwas zeigt.</p></div></div></div></section>
<section class="abschnitt"><div class="breit"><h2>Themen</h2><div class="zwei">${Object.entries(THEMEN).map(([k, [n, b]]) => `<a class="kachel kachel-link" href="inhalte/prompts/?thema=${k}"><h3>${esc(n)}</h3><p>${esc(b)}</p></a>`).join('')}</div></div></section>
<section class="abschnitt"><div class="breit"><h2>Folge uns</h2><p>Neue Videos: Montag, Mittwoch und Freitag um 12 Uhr.</p>${plattformLinks('')}</div></section>`;
  seite({ pfad: '', tiefe: 0, aktiv: 'start', titel: 'Start', beschreibung: 'KlicKIdee: Klick dich schlau. Getestete KI-Prompts für Büroaufgaben, mit echtem Ergebnis und ehrlicher Grenze. Zum Kopieren.', inhalt, bodyKlasse: 'seite-start' });
}

function inhalteStart() {
  const inhalt = `<section class="seitenkopf"><div class="breit"><h1>Inhalte</h1><p>Hier findest du, was wir getestet haben.</p></div></section>
<section class="abschnitt"><div class="breit"><div class="zwei">
<a class="kachel kachel-link" href="prompts/"><h3>Prompts</h3><p>Fertige Arbeitsaufträge an die KI. Mit Ergebnis, Erklärung und Grenze.</p></a>
<a class="kachel kachel-link" href="skills/"><h3>Skills</h3><p>Fertige KI-Fähigkeiten für wiederkehrende Aufgaben.</p></a></div></div></section>`;
  seite({ pfad: 'inhalte/', tiefe: 1, aktiv: 'inhalte-start', titel: 'Inhalte', beschreibung: 'Getestete KI-Prompts und Skills für den Büroalltag von KlicKIdee.', inhalt });
}

function promptBibliothek() {
  const r = '../../';
  const inhalt = `<section class="seitenkopf"><div class="breit"><h1>Prompts</h1><p>Getestete Prompts zum Kopieren. Such nach deiner Aufgabe oder wähl ein Thema.</p></div></section>
<section class="abschnitt"><div class="breit">
<div class="filter" data-filter hidden>
<label class="suche" for="suche">Suche</label><input id="suche" type="search" placeholder="Zum Beispiel: Mail, Protokoll" autocomplete="off">
<fieldset><legend>Thema</legend><div class="chips" data-gruppe="thema"><button type="button" class="chip" data-wert="" aria-pressed="true">Alle</button>${Object.entries(THEMEN).map(([k, [n]]) => `<button type="button" class="chip" data-wert="${k}" aria-pressed="false">${esc(n)}</button>`).join('')}</div></fieldset>
<fieldset><legend>Aufgabe</legend><div class="chips" data-gruppe="aufgabe"><button type="button" class="chip" data-wert="" aria-pressed="true">Alle</button>${AUFGABEN.map((a) => `<button type="button" class="chip" data-wert="${esc(a)}" aria-pressed="false">${esc(a)}</button>`).join('')}</div></fieldset>
</div>
<p class="leer" data-leer hidden>Dazu gibt es noch keinen Prompt. Probier ein anderes Thema oder Stichwort.</p>
<div class="karten" data-karten>${prompts.map((p) => kartePrompt(p, r)).join('')}</div>
</div></section>`;
  seite({ pfad: 'inhalte/prompts/', tiefe: 2, aktiv: 'prompts', titel: 'Prompts', beschreibung: 'Prompt-Bibliothek von KlicKIdee: getestete Prompts für Büroaufgaben, mit Ergebnis und Grenze. Zum Kopieren.', inhalt });
}

function skills() {
  const inhalt = `<section class="seitenkopf"><div class="breit"><h1>Skills</h1><p>Hier sammeln wir bald fertige KI-Fähigkeiten für wiederkehrende Büroaufgaben. Bis dahin findest du alles bei den Prompts.</p>
<p class="knoepfe"><a class="knopf" href="../prompts/">Zu den Prompts</a></p></div></section>
<section class="abschnitt"><div class="breit"><div class="karten" data-karten></div></div></section>`;
  seite({ pfad: 'inhalte/skills/', tiefe: 2, aktiv: 'skills', titel: 'Skills', beschreibung: 'Skills von KlicKIdee: fertige KI-Fähigkeiten für wiederkehrende Büroaufgaben.', inhalt });
}

function promptSeite(p) {
  const r = '../../../';
  const v = videoBy[p.video];
  const mehr = prompts.filter((x) => x.slug !== p.slug && (x.thema === p.thema || x.schlagworte.some((s) => p.schlagworte.includes(s)))).slice(0, 3);
  const e = p.ergebnis;
  const inhalt = `<article>
<section class="seitenkopf"><div class="breit"><p class="karte-thema karte-thema-hell">${esc(THEMEN[p.thema][0])}</p><h1>${esc(p.titel)}</h1></div></section>
<div class="breit schmal">
<section class="block"><h2>Die Aufgabe</h2><p>${esc(p.aufgabe)}</p></section>
<section class="block"><h2>Der Prompt</h2>
<div class="prompt-karte"><div class="prompt-kopf"><span class="etikett">Prompt</span>
<button type="button" class="knopf kopieren" data-kopieren="prompt-text">Kopieren</button></div>
<pre id="prompt-text" class="prompt-text">${platzhalter(p.prompt)}</pre>
<p class="kopiert" role="status" aria-live="polite"></p></div>
<p class="klein-text">Setz bei den gelb markierten Stellen deine eigenen Angaben ein. Der Prompt ist genau der, den wir getestet haben.</p>
${p.datenschutz ? '<p class="datenschutz-hinweis"><strong>Datenschutz:</strong> Keine Namen, Kunden- oder Gesundheitsdaten eingeben. Arbeite mit Platzhaltern.</p>' : ''}
</section>
<section class="block"><h2>Warum er funktioniert</h2><ul class="warum">${p.warum.map((w) => `<li><strong>${platzhalter(w.baustein)}</strong><br>${esc(w.text)}</li>`).join('')}</ul></section>
<section class="block"><h2>Getestetes Ergebnis</h2>
<div class="ergebnis"><div class="ergebnis-kopf"><span class="stempel">Getestet · ${esc(e.werkzeug)} · ${esc(e.datum)}</span>${e.gekuerzt ? '<span class="gekuerzt">gekürzt</span>' : ''}</div>
<div class="tabelle-rahmen" tabindex="0" role="region" aria-label="Ergebnis-Tabelle, seitlich scrollbar"><table><thead><tr>${e.spalten.map((s) => `<th scope="col">${esc(s)}</th>`).join('')}</tr></thead><tbody>${e.zeilen.map((z) => `<tr>${z.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
<p class="klein-text">${esc(e.hinweis)}</p></section>
<section class="block"><div class="grenze"><h2>Die Grenze</h2><p>${esc(p.grenze)}</p></div></section>
${v ? `<section class="block"><h2>Das Video dazu</h2><article class="karte karte-video karte-quer"><a class="vorschau" href="${r}videos/${v.slug}/"><img src="${r}assets/${v.vorschau}" width="540" height="960" loading="lazy" alt="${esc(v.vorschauAlt)}"></a><div><p class="karte-thema">${datumDe(v.datum)}</p><h3><a href="${r}videos/${v.slug}/">${esc(v.titel)}</a></h3><a class="knopf knopf-hell" href="${r}videos/${v.slug}/">Zum Video</a></div></article></section>` : ''}
${mehr.length ? `<section class="block"><h2>Passende Prompts</h2><div class="karten">${mehr.map((x) => kartePrompt(x, r)).join('')}</div></section>` : ''}
</div></article>`;
  seite({ pfad: `inhalte/prompts/${p.slug}/`, tiefe: 3, aktiv: 'prompts', titel: p.seoTitel, beschreibung: p.beschreibung, inhalt });
}

function videoUebersicht() {
  const r = '../';
  const inhalt = `<section class="seitenkopf"><div class="breit"><h1>Videos</h1><p>Alle Shorts, neueste zuerst.</p></div></section>
<section class="abschnitt"><div class="breit"><div class="karten karten-video">${videos.map((v) => karteVideo(v, r)).join('')}</div></div></section>`;
  seite({ pfad: 'videos/', tiefe: 1, aktiv: 'videos', titel: 'Videos', beschreibung: 'Alle KlicKIdee-Shorts: KI-Tipps für den Büroalltag in unter einer Minute.', inhalt });
}

function videoSeite(v) {
  const r = '../../';
  const p = promptBy[v.prompt];
  const andere = Object.entries(v.plattformen || {}).filter(([k, u]) => u && PLATTFORMEN[k]);
  const mehr = videos.filter((x) => x.slug !== v.slug).slice(0, 3);
  const inhalt = `<article>
<section class="seitenkopf"><div class="breit"><p class="karte-thema karte-thema-hell">${datumDe(v.datum)}</p><h1>${esc(v.titel)}</h1></div></section>
<div class="breit schmal">
<section class="block"><div class="player" data-youtube="${esc(v.youtube)}" data-titel="${esc(v.titel)}">
<button type="button" class="player-start" aria-label="Video abspielen: ${esc(v.titel)}"><img src="${r}assets/${v.vorschau}" width="540" height="960" alt="${esc(v.vorschauAlt)}"><span class="abspielen"><svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor"/></svg> Abspielen</span></button>
<p class="player-hinweis">Beim Abspielen werden Daten an YouTube übertragen. <a href="https://www.youtube.com/shorts/${esc(v.youtube)}" rel="noopener noreferrer">Direkt auf YouTube ansehen</a></p></div></section>
${andere.length ? `<section class="block"><h2>Dieses Video auch auf</h2><ul class="plattformen">${andere.map(([k, u]) => `<li><a class="plattform" href="${esc(u)}" rel="noopener noreferrer">${icon(k)}<span>${PLATTFORMEN[k].name}</span></a></li>`).join('')}</ul></section>` : ''}
${p ? `<section class="block"><h2>Zum Prompt aus dem Video</h2>${kartePrompt(p, r)}</section>` : ''}
<section class="block"><h2>Kurz erklärt</h2><p>${esc(v.beschreibung)}</p><p class="klein-text">${esc(v.kiHinweis)}</p></section>
${mehr.length ? `<section class="block"><h2>Weitere Videos</h2><div class="karten karten-video">${mehr.map((x) => karteVideo(x, r)).join('')}</div></section>` : ''}
</div></article>`;
  seite({ pfad: `videos/${v.slug}/`, tiefe: 2, aktiv: 'videos', titel: v.titel, beschreibung: v.beschreibung, inhalt });
}

function ueber() {
  const inhalt = `<section class="seitenkopf"><div class="breit"><h1>So arbeiten wir</h1><p>Du sollst wissen, wer hinter KlicKIdee steckt und wie wir testen.</p></div></section>
<div class="breit schmal text">
<h2>Wer dahintersteckt</h2><p>Daniel Blessing, Medienschmiede, Biberach.</p>
<h2>Wie wir testen</h2><p>Wir schreiben unser Testmaterial selbst, mit erfundenen Daten. Dann lassen wir die KI die Aufgabe lösen. Du siehst das echte Ergebnis, mit Werkzeug und Datum. Und wir nennen eine ehrliche Grenze.</p>
<h2>Wo wir KI nutzen</h2><p>Die Erzählstimme in unseren Videos ist eine KI-Stimme. Logo und Grafiken sind teilweise mit KI erstellt. Unsere Inhalte entstehen mit Unterstützung von KI-Werkzeugen. Prompt und Ergebnis stammen immer aus einem echten Test. Alles wird vor der Veröffentlichung von einem Menschen geprüft und freigegeben.</p>
<h2>Was wir nicht tun</h2><ul><li>Wir geben keine Rechts-, Steuer-, Finanz- oder Gesundheitsberatung.</li><li>Wir machen keine Werbung für Werkzeuge ohne Kennzeichnung.</li><li>Wir versprechen keine Zeitersparnis, die wir nicht selbst gemessen haben.</li></ul>
<h2>Werkzeug-neutral</h2><p>Unsere Prompts funktionieren in mehreren KI-Werkzeugen. Wir nennen nur das Werkzeug, mit dem wir wirklich getestet haben.</p>
</div>`;
  seite({ pfad: 'so-arbeiten-wir/', tiefe: 1, aktiv: 'about', titel: 'So arbeiten wir', beschreibung: 'Wer hinter KlicKIdee steckt, wie wir Prompts testen und wo wir KI nutzen.', inhalt });
}

function kontakt() {
  const inhalt = `<section class="seitenkopf"><div class="breit"><h1>Kontakt</h1><p>Schreib uns eine Mail.</p></div></section>
<div class="breit schmal text"><p><a class="knopf" href="mailto:klickidee@gmail.com">klickidee@gmail.com</a></p>
<p>Ein Klick öffnet dein E-Mail-Programm. Auf dieser Seite gibt es kein Formular.</p>
<p>Du findest uns auch hier:</p>${plattformLinks('../')}</div>`;
  seite({ pfad: 'kontakt/', tiefe: 1, aktiv: 'kontakt', titel: 'Kontakt', beschreibung: 'Kontakt zu KlicKIdee per E-Mail.', inhalt });
}

function recht(name, titel, beschr) {
  const md = readFileSync(join(ROOT, 'inhalt', `${name}.md`), 'utf8');
  const inhalt = `<section class="seitenkopf"><div class="breit"><h1>${titel}</h1></div></section><div class="breit schmal text recht">${mdZuHtml(md)}</div>`;
  seite({ pfad: `${name}/`, tiefe: 1, aktiv: name, titel, beschreibung: beschr, inhalt });
}

function fehler() {
  const b = site.basePath || '/';
  const f = join(OUT, '404.html');
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${CSP}"><meta name="robots" content="noindex"><title>Seite nicht gefunden | KlicKIdee</title><link rel="stylesheet" href="${b}assets/style.css"></head><body><main class="breit schmal text"><h1>Diese Seite gibt es nicht</h1><p><a class="knopf" href="${b}">Zur Startseite</a></p></main></body></html>`;
  writeFileSync(f, html);
}

// ---------- Lauf ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'src', 'assets'), join(OUT, 'assets'), { recursive: true });
writeFileSync(join(OUT, '.nojekyll'), '');
start(); inhalteStart(); promptBibliothek(); skills(); prompts.forEach(promptSeite);
videoUebersicht(); videos.forEach(videoSeite); ueber(); kontakt();
recht('impressum', 'Impressum', 'Impressum von KlicKIdee, Medienschmiede, Biberach.');
recht('datenschutz', 'Datenschutzerklärung', 'Datenschutzerklärung von KlicKIdee.');
fehler();
if (!site.noindex) {
  const urls = ['', 'inhalte/', 'inhalte/prompts/', 'inhalte/skills/', ...prompts.map((p) => `inhalte/prompts/${p.slug}/`), 'videos/', ...videos.map((v) => `videos/${v.slug}/`), 'so-arbeiten-wir/', 'kontakt/', 'impressum/', 'datenschutz/'];
  writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${site.baseUrl}${u}</loc></url>`).join('\n')}\n</urlset>\n`.replace('sitemap.org', 'sitemaps.org'));
}
writeFileSync(join(OUT, 'robots.txt'), site.noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n${site.baseUrl ? `Sitemap: ${site.baseUrl}sitemap.xml\n` : ''}`);
console.log(`Gebaut: ${prompts.length} Prompt(s), ${videos.length} Video(s) -> docs/`);
