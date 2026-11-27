# KlicKIdee Homepage

Statische Seite, gebaut mit `node build.mjs` (keine Abhängigkeiten). Ausgabe: `docs/` (GitHub Pages: Branch main, Ordner /docs).

- `daten/prompts/<name>.json` und `daten/videos/<name>.json`: eine Datei je Prompt und je Video. Neue Datei anlegen, bauen, fertig. „Neuestes“ auf der Startseite folgt dem Datum.
- `inhalt/impressum.md`, `inhalt/datenschutz.md`: freigegebene Texte v1.1 (MED-107). Nur die Website-Adresse wurde ersetzt.
- `site.json`: Adresse und `noindex` (Vorschau: true. Zum Livegang auf false setzen, nach Freigabe).
- `pruefung/pruefen.mjs`: Abnahme-Prüfung (Links, Handy, Kopieren, Zwei-Klick, keine Fremdanfragen, Cookies). Braucht Playwright.
- Schrift: Inter (SIL OFL), lokal. Keine Cookies, kein Tracking, keine Fremdinhalte vor dem Klick auf den Player.
