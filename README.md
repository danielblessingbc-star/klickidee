# KlicKIdee Homepage

Statische Seite, gebaut mit `node build.mjs` (keine Abhängigkeiten). Ausgabe: `docs/` (GitHub Pages: Branch main, Ordner /docs).

- `daten/prompts/<name>.json` und `daten/videos/<name>.json`: eine Datei je Prompt und je Video. Neue Datei anlegen, bauen, fertig. „Neuestes“ auf der Startseite folgt dem Datum.
- `inhalt/impressum.md`, `inhalt/datenschutz.md`: freigegebene Texte v1.1 (MED-107). Nur die Website-Adresse wurde ersetzt.
- `site.json`: Adresse und `noindex` (Vorschau: true. Zum Livegang auf false setzen, nach Freigabe).
- `pruefung/pruefen.mjs`: Abnahme-Prüfung (Links, Handy, Kopieren, Zwei-Klick, keine Fremdanfragen, Cookies). Braucht Playwright.
- Schrift: Inter (SIL OFL), lokal. Keine Cookies, kein Tracking, keine Fremdinhalte vor dem Klick auf den Player.

## Nach jedem Video nachpflegen (Konzept 8a, MED-110)

Ablauf und Zuständigkeit: Dokument `ablauf-nachpflegen` an MED-110. Kurzfassung:

1. `quellen/<slug>/` anlegen: `quellen.json` (welche Paperclip-Dokumente), `ergaenzung.json` (Felder, die in keiner Quelle stehen: YouTube-ID, Plattform-Links, Schlagworte, „Warum“ …). Vorlage: `quellen/mailkette-aufgaben/`.
2. `node nachpflegen/holen.mjs <slug>` holt Prompt-Test, Skript und Upload-Paket.
3. `node nachpflegen/einpflegen.mjs <slug>` schreibt `daten/prompts/<slug>.json` und `daten/videos/<slug>.json`. Der Prompt kommt wörtlich aus dem Prompt-Test. Fehlt etwas oder widersprechen sich Quellen, Abbruch ohne Schreiben.
4. `node build.mjs`, dann `node nachpflegen/pruefen-daten.mjs <slug> --online`.
5. Auf einem Zweig committen. Nach `main` nur nach Freigabe des Nutzers je Video.

`node nachpflegen/vergleichen.mjs <slug> <ordner>` vergleicht neu erzeugte Dateien mit dem Stand in `daten/`.
