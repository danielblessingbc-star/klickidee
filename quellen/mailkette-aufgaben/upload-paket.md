# Upload-Paket Short 1: „Wer macht was bis wann?“

**Stand:** 27.11.2026 (Rev. 8, [MED-48](/MED/issues/MED-48); Titelbild neu, [MED-51](/MED/issues/MED-51); Anleitung korrigiert, [MED-53](/MED/issues/MED-53)) · **Kanal:** @KlicKIdee · **Upload-Weg:** B (der Nutzer lädt selbst in YouTube Studio hoch, kein API-Upload) · **Autor:** Post-Production & Upload
**Grundlagen:** [produktionsprotokoll](/MED/issues/MED-19#document-produktionsprotokoll), [lizenznachweis](/MED/issues/MED-19#document-lizenznachweis), [prompt-test](/MED/issues/MED-16#document-prompt-test), [Compliance-Prüfung](/MED/issues/MED-28#document-compliance-pruefung), [Kanal-Einrichtung](/MED/issues/MED-8#document-kanal-einrichtung), Rezept Abschnitt 7 und 9.

## 0. Status: Nutzer-Abnahme liegt vor, Upload noch nicht erfolgt

**Nutzer-Abnahme von Short 1 (Rev. 8): 27.11.2026.** Der Nutzer hat bestätigt: Stimme angehört, Hinweis A5 (OpenAI-Zusatz für geschäftliche Nutzung) gelesen, Kanal-Verifizierung vorhanden. Titel A und „Neues Titelbild ohne kleines Logo“ hat der Nutzer gewählt.

Noch offen vor dem Upload:
- [ ] **Quality Gate** prüft die Titelbild-Änderung aus [MED-51](/MED/issues/MED-51) (nur diese).
- [ ] Der Upload selbst und jede Sichtbarkeit brauchen eine eigene Freigabe (F1). Bis dahin gilt: Sichtbarkeit **Privat**.

Ich habe nichts hochgeladen und nichts in Studio verändert. Kosten: 0 €.

## 1. Dateien (alle im Arbeitsbereich unter `produktion/short1/out/`, Kopien an dieser Aufgabe)

| Zweck | Datei | Angaben |
|---|---|---|
| Video | `short1-rev8.mp4` (hängt an [MED-49](/MED/issues/MED-49)) | 46,27 s (mit ffprobe nachgemessen: 46,267 s), 1080 × 1920, 30 fps, H.264/AAC, ca. −14 LUFS (Angabe der Produktion), SHA-256 `fa22164dc6a889e55198d1caa507db6e3f4acc4ef1a4bac3c350fe36c589d06f` |
| Titelbild | `short1-rev8-titelbild.png` (an dieser Aufgabe MED-20 und an [MED-51](/MED/issues/MED-51), einziges Titelbild; `short1-rev4-titelbild.png` ist entfernt) | 1080 × 1920, PNG, Text „Wer macht was?“ (3 Wörter), **ohne Logo**, SHA-256 `35a4e3224d78a4d6742de13ebf3eebab3c4e67929c1f2d056aac836c5796be18` |
| Untertitel | `short1-rev4.de.srt` (an dieser Aufgabe, SHA-256 `11b561732af9326b0af1ef9b9899699456b24e17c206ed2e9a052c27626bb871`) | Deutsch, 11 Einträge, Wortlaut und Zeiten von Rev. 4 (neuer Einstieg) |

Prüfen Sie vor dem Hochladen: SHA-256 der MP4 gleich dem Wert oben (`sha256sum short1-rev8.mp4`). Stimmt er nicht, ist es eine andere Fassung. Dann nicht hochladen.

## 2. Titel (Rezept: höchstens 60 Zeichen, kein Clickbait)

| | Titel | Zeichen | Bemerkung |
|---|---|---|---|
| **A (Empfehlung)** | **Wer macht was bis wann? Der Prompt für Mailketten** | 49 | Nennt die Aufgabe konkret, genau das zeigt das Video. Kein Versprechen, keine Zahl. |
| B | 14 Mails: So findest du deine Aufgabe | 37 | Passt zum Hook, die 14 Mails sind aber Testmaterial. Etwas „klickiger“. |
| C | Mailkette auswerten: Entscheidungen, Fristen, Aufgaben | 54 | Sachlich, aber lang. |

**Prüfpunkt „Titel und Titelbild halten, was das Video zeigt“ (⛔):** Ja. Der Titel verspricht den Prompt für „Wer macht was bis wann?“. Das Video zeigt genau diesen Prompt, einen echten Test und seine Grenze. Der neue Einstieg (Rev. 4: „KI-Prompt: Mailkette → Aufgabenliste“, Hook „Dieser KI-Prompt macht aus vierzehn Mails eine Aufgabenliste.“) passt dazu; der Titel bleibt A (vom Nutzer gewählt). Kein Zeit-, Prozent- oder Qualitätsversprechen. Kein Werkzeugname im Titel (nicht nötig).

## 3. Titelbild

- Datei: `short1-rev8-titelbild.png`, **ohne Logo**. Es ist das Rev.-4-Titelbild, neu gerechnet ohne das kleine Logo oben mittig (Raster an der Stelle). Motiv, Text und Größe sind gleich. Das Bild ist sichtbar gleich bis auf die Logo-Stelle, aber **nicht pixelgleich**: Fast alle Pixel weichen um 1 bis 2 Farbstufen ab, an Kanten auch mehr (Nachprüfung [MED-52](/MED/issues/MED-52#document-nachpruefung-titelbild)). Mit bloßem Auge sieht man keinen Unterschied.
- Bild: Der Mailfächer aus den ersten Sekunden des Videos. Es bleibt nur **„Wer macht was?“** (Inter Bold, tintenblau auf Gelb). Das Bild hält, was das Video zeigt: dasselbe Motiv und die Frage aus Titel A.
- ⛔ Höchstens 4 Wörter: **3 Wörter** („Wer macht was?“, am neuen Bild nachgezählt). Kein Logo, kein Werkzeugname, keine Person, kein Schock-Element. Text liegt bei ca. y = 1130–1260 von 1920 (mittleres Drittel frei von Rändern).
- Wo man es setzt: siehe Abschnitt „Wo setze ich das Titelbild?“ direkt unten.

### Wo setze ich das Titelbild?

**Kurz:** Ein eigenes Bild für ein Short setzen Sie **nach dem Hochladen**, und zwar entweder in **YouTube Studio am Computer** oder in der **YouTube Studio App** (Android und iPhone/iPad). Beide Wege stehen in der YouTube-Hilfe.

**Weg 1: YouTube Studio am Computer**
1. **studio.youtube.com** öffnen, als Kanal @KlicKIdee angemeldet.
2. Links **Inhalte** wählen, oben auf **Shorts** klicken.
3. Das Short suchen und auf **Bearbeiten** (Stift-Symbol) klicken.
4. Unter **Thumbnail** auf **Datei hochladen** klicken und `short1-rev8-titelbild.png` auswählen.
5. **Speichern** nicht vergessen.

**Weg 2: YouTube Studio App (Android und iPhone/iPad)**
1. Die **YouTube Studio App** öffnen (nicht die normale YouTube-App), als Kanal @KlicKIdee angemeldet.
2. Im Menü unten **Inhalte** tippen und das Short auswählen.
3. **Bearbeiten** tippen, dann **Thumbnail bearbeiten**.
4. **Hochladen** tippen, dann **Auswählen** und `short1-rev8-titelbild.png` wählen. Die Datei muss dafür auf dem Handy liegen.
5. **Aktualisieren** tippen.

Was die YouTube-Hilfe dazu sagt (Reiter Computer, Android, iPhone & iPad; geprüft am 27.11.2026, Nachprüfung [MED-52](/MED/issues/MED-52#document-nachpruefung-titelbild)):
- Das Konto muss **verifiziert** sein. Der Nutzer hat das bestätigt.
- Empfohlen: Seitenverhältnis **9:16**, Auflösung **2160 × 3840**. Als **Mindesthöhe** nennt die Hilfe **640 px**. Mein Bild hat 1080 × 1920: gleiches Seitenverhältnis 9:16, Höhe deutlich über dem Minimum, aber kleiner als die empfohlene Auflösung. Ob Studio es ohne Hinweis annimmt, habe ich nicht getestet. Lehnt Studio es ab, sage ich Bescheid, dann baue ich eine größere Fassung.
- Formate wie JPG oder PNG sind erlaubt. Die Grenze am Computer ist 50 MB. Mein PNG hat 365.564 Byte.
- Für Shorts nennt die Hilfe nur „Datei hochladen“. Dass Studio die Stelle im Upload-Dialog nicht anzeigt, ist **meine Vermutung**, nicht belegt. Deshalb setzen Sie das Bild nach dem Hochladen über „Inhalte“.

**Ersatzweg, falls „Hochladen“ bei Ihnen nicht erscheint:** Für Shorts nennt die Hilfe keinen Weg, ein Bild aus dem Video zu wählen. Allgemein sagt sie, man kann von YouTube automatisch erzeugte Bilder auswählen. Bietet Ihre Oberfläche das an, passt der Anfangs-Frame (ca. 0,5 s) am besten: Dort steht der Mailfächer wie im Titelbild. Ob die Auswahl bei Ihnen erscheint, habe ich nicht gesehen (kein Zugang zu Studio).

Hinweis: Eigene Thumbnails erscheinen laut Berichten von Dritten (z. B. [vidIQ](https://vidiq.com/blog/post/youtube-shorts-custom-thumbnails/)) vor allem auf der Kanalseite und in der Suche, nicht im Shorts-Feed. Das ist keine Aussage der YouTube-Hilfe, nur ein Hinweis.

**Quelle:** [YouTube-Hilfe: Eigene Thumbnails hinzufügen](https://support.google.com/youtube/answer/72431?hl=de) mit den Reitern Computer, [Android](https://support.google.com/youtube/answer/72431?hl=de&co=GENIE.Platform%3DAndroid) und [iPhone & iPad](https://support.google.com/youtube/answer/72431?hl=de&co=GENIE.Platform%3DiOS) (englisch: [hl=en](https://support.google.com/youtube/answer/72431?hl=en)).

## 4. Beschreibung (zum Kopieren, genau ab der Linie bis zur Linie)

Zeichen: 1.307 (Grenze 5.000).

--- ab hier kopieren ---
Du hast eine lange Mailkette und weißt nicht, was an dir hängt? Mit einem Prompt zeigt dir die KI, was entschieden und was noch offen ist, mit Verantwortlichen und Frist.

Der Prompt zum Kopieren:
Unten steht eine Mailkette zu unserem Messeauftritt. Ich bin [dein Name].
Gib mir nur, was entschieden wurde und was noch offen ist – jeweils mit Verantwortlichen und Frist.
Als Tabelle: Punkt | entschieden/offen | Wer | Bis wann | Quelle (Absender, Datum).
Widersprechen sich Mails, nenne beide Stellen.

[deine Mails]

Getestet mit ChatGPT am 26.11.2026. Ergebnisse können abweichen, prüfe sie immer selbst.

Grenze: In beiden Testläufen stand bei einem Punkt eine Frist, die keine Mail nennt (es war nur der Messestart). Prüfe Fristen immer in der Original-Mail.

Die Erzählstimme ist eine KI-Stimme (Thorsten-Voice, CC0, mit Piper). Prompt und Ergebnis sind ein echter Test mit ChatGPT (OpenAI) vom 26.11.2026. Wir haben die KI-Ausgabe geprüft und gekürzt. Für den Inhalt ist KlicKIdee verantwortlich. Testmaterial frei erfunden. KI-Ergebnisse können Fehler enthalten. Bitte prüfe sie immer selbst.

Allgemeine Tipps, keine Rechts-, Steuer- oder Datenschutzberatung. Welche Daten du in welches KI-Werkzeug eingeben darfst, legt dein Arbeitgeber fest. Frag im Zweifel deine IT.

#KIimBüro #Prompt #Mailkette
--- bis hier kopieren ---

**Begründung und Prüfung der Beschreibung:**
- **Prompt im Wortlaut:** identisch mit der Prompt-Karte aus `prompt-test` („Was ins Video kommt“), nur [dein Name] und [deine Mails] als Einfügestellen, so wie im Video.
- **Getestet-Satz:** Rezept-Wortlaut. Werkzeug und Datum aus dem Testprotokoll (ChatGPT, 26.11.2026). **Kein Modell genannt**, weil das Werkzeug ohne Anmeldung keines anzeigte.
- **Grenze:** der echte Befund aus dem Test (Exponate: „Zur Messe, 16.03.2027“, keine Mail nennt eine Frist). Es ist dieselbe Grenze wie im Short (S5a/S5b).
- **Offenlegung (Rezept 9):** nur zutreffende Teile. **KI-Stimme: ja, mit Herkunft (Thorsten-Voice, CC0, mit Piper; Nacharbeit M1).** Der Zusatz „Grafiken teilweise mit KI erstellt“ **fehlt bewusst**: Die Grafiken sind im Code gezeichnet. Die beiden Logos hat der Nutzer geliefert, ihre Entstehung ist offen ([lizenznachweis](/MED/issues/MED-19#document-lizenznachweis)). Es gibt keinen Beleg für KI-Erzeugung, daher keine Behauptung dazu. Bestätigt der Nutzer, dass ein Logo KI-generiert ist, ist die Offenlegung neu zu prüfen.
- **Auflage A1 (Compliance):** Der Satz „Wir haben die KI-Ausgabe geprüft und gekürzt. Für den Inhalt ist KlicKIdee verantwortlich.“ steht wörtlich drin, dazu „Testmaterial frei erfunden …“ aus der Auflage. **Erfüllt.**
- **Auflage A2:** „kostenlose Version“ steht **nicht** drin. Der Nutzer hat den Tarif nicht bestätigt. Nur „ChatGPT (OpenAI)“. **Erfüllt.** Bestätigt der Nutzer später den kostenlosen Tarif, kann der Zusatz ergänzt werden, aber das ändert die Beschreibung und braucht neue Prüfung.
- **Quellen (Rezept 9):** Das Short nennt keine Funktionen von Werkzeugen mit Stand. Deshalb keine Quellenzeile. Ein Satz zu ChatGPT als Testwerkzeug ist keine Funktionsaussage.
- **Musik-Nachweis:** nicht nötig, es gibt keine Musik. Geräusche und Schrift sind laut Lizenznachweis eigene Werke bzw. SIL OFL, dort steht keine Namensnennungspflicht in der Beschreibung (Inter wird nicht weitergegeben, nur ins Bild gebrannt).
- **Datenschutz-Satz:** Das Short ist kein Datenschutz-Thema, aber es lädt zum Einfügen von Mails ein. Ich habe die Kurzfassung der Rezept-Regel aufgenommen, **ohne** Aussagen zu einem Werkzeug (keine Rechtsbewertung, kein „sicher“). Gefällt dem Quality Gate das nicht, kann der Satz entfallen.
- **Hashtags:** 3, themenbezogen (Rezept: 3–5; Kanal-Einrichtung: höchstens 2–3). Kein `#Shorts`. Nur das getestete Werkzeug darf als Markenname vorkommen: ✓.
- **Ohne:** keine Links, keine Werbung, keine Affiliate-Hinweise, kein Aufruf, der etwas verspricht, das wir nicht tun.

## 5. Tags (Studio → Weitere Optionen → Tags)

`ChatGPT`, `Prompt`, `Mailkette`, `KI im Büro`, `Büroalltag`

5 Tags, ehrlich und zum Inhalt passend. Nur das getestete Werkzeug als Markenname, keine Fremdkanäle, kein Tag-Spam.

## 6. KI-Kennzeichnung (Pflichtkriterium)

**Entscheidung (Nacharbeit M1, nach Quality Gate): „Verändert oder synthetisch“ → Ja.** Zusätzlich steht die KI-Stimme mit Herkunft in der Beschreibung.

**Begründung nach Szenenkatalog „KI-Markierung (Y3)“, [produktionsprotokoll](/MED/issues/MED-19#document-produktionsprotokoll) und [Abnahme Quality Gate](/MED/issues/MED-21#document-abnahme-quality-gate) Abschnitt 2:**
| Prüfpunkt | Befund |
|---|---|
| Realistisch wirkende Bilder oder Videos mit KI | **Nein.** 9 Motive, alle erkennbare Grafik, im Code gezeichnet, die beiden Logos vom Nutzer geliefert (Entstehung offen). Keine realen Personen. |
| Veränderte reale Aufnahmen | **Nein.** Keine Aufnahmen, keine Bildschirmaufnahmen. |
| KI-Musik | **Nein.** Es gibt keine Musik. |
| Stimme | **Ja, kennzeichnungspflichtig.** KI-Stimme (Piper, Modell `de_DE-thorsten-medium`, CC0). Das Modell ist aus Aufnahmen einer realen Person gebaut (Thorsten Müller, [MED-17](/MED/issues/MED-17#document-werkzeug-lizenzpruefung)). YouTube nennt das synthetische Erzeugen der Stimme einer Person für die Erzählung als Beispiel für kennzeichnungspflichtige Inhalte. Die Einwilligung (CC0) klärt die Rechte, nicht die Kennzeichnung. Kein Klon gegen den Willen, niemand wird benannt oder nachgeahmt. |
| Realistisch wirkendes Ereignis oder reale Person vorgetäuscht | **Nein.** Mails und Namen sind frei erfunden und offengelegt („Testmaterial frei erfunden“). |
| ChatGPT-Antwort | Echte Antwort, gekürzt, mit Stempel „Getestet · ChatGPT · 26.11.2026“ und „gekürzt“ im Bild (A3). Keine Täuschung über Herkunft. |

**Hinweise:**
- Die frühere Empfehlung „Nein“ ist zurückgezogen. Sie galt unter der Bedingung „KI-Stimme ohne Bezug zu einer realen Person“, die mit Thorsten-Voice nicht erfüllt ist.
- „Ja“ schränkt Reichweite und Monetarisierung laut YouTube-Hilfe nicht ein (Zitat in der Compliance-Prüfung, MED-28).
- Für den Kanal klärt der CEO mit Compliance, ob das für jedes Short mit dieser Stimme gilt (Vorschlag V1 im QG-Bericht). Das ist nicht Teil dieser Nacharbeit.
- Sagt YouTube zusätzlich ein Label in der erweiterten Beschreibung ein, ist das unkritisch. C2PA und Tool-Metadaten sind nicht entfernt (es gab keine).

## 7. Checkliste für den Nutzer: Hochladen in YouTube Studio (Weg B)

*Die Namen der Menüs ändern sich gelegentlich. Ich habe die Oberfläche nicht selbst bedient (kein Zugang). Weicht ein Wort ab, nach dem Sinn gehen und mir schreiben.*

Vorab:
- [ ] Beide Abnahmen liegen vor (Abschnitt 0).
- [ ] Angemeldet als Kanal **@KlicKIdee** (nicht als privates Konto).

Hochladen:
1. [ ] studio.youtube.com öffnen → **Erstellen** (Kamera-Symbol) → **Video hochladen** → `short1-rev8.mp4` wählen.
2. [ ] **Titel:** Variante **A** einfügen (oder die vom Quality Gate genannte).
3. [ ] **Beschreibung:** Text aus Abschnitt 4 einfügen (zwischen den Linien). Prüfen, dass `[dein Name]` und `[deine Mails]` stehen geblieben sind.
4. [ ] **Titelbild:** erst **nach** dem Hochladen setzen, am Computer in Studio oder in der YouTube Studio App (Abschnitt 3, „Wo setze ich das Titelbild?“): Inhalte → Short → Bearbeiten → Thumbnail (Computer: Datei hochladen; App: Thumbnail bearbeiten → Hochladen → Auswählen → Aktualisieren) → `short1-rev8-titelbild.png`.
5. [ ] **Playlist:** keine.
6. [ ] **Zielgruppe:** „Nein, dieses Video ist nicht speziell für Kinder“.
7. [ ] **Altersbeschränkung:** nein.
8. [ ] **Bezahlte Werbung** (Bezahlte Werbepartnerschaften): **Nicht** setzen (keine Werbung, keine Gegenleistung).
9. [ ] **Weitere Optionen / Mehr anzeigen:**
   - [ ] **Tags:** `ChatGPT, Prompt, Mailkette, KI im Büro, Büroalltag`
   - [ ] **Sprache:** Deutsch · **Kategorie:** Bildung
   - [ ] **Lizenz:** Standard-YouTube-Lizenz · **Einbetten:** erlaubt
   - [ ] **Shorts-Remix:** nicht erlauben
   - [ ] **Kommentare:** „Vor der Veröffentlichung prüfen“
   - [ ] **Untertitel:** Datei `short1-rev4.de.srt`, Sprache Deutsch, hochladen
   - [ ] **„Verändert oder synthetisch“ (KI-Kennzeichnung):** **Ja** (laut Abschnitt 6, Entscheidung nach Quality Gate).
10. [ ] **Prüfungen von YouTube** abwarten (Urheberrecht, Werbefreundlichkeit). Ergebnis notieren. Es gibt keine fremden Inhalte, also ist keine Beanstandung zu erwarten. Kommt eine, **nicht** bestreiten, sondern mir die Meldung melden.
11. [ ] **Sichtbarkeit: Privat.** Speichern. **Nicht** auf Öffentlich oder Planen stellen.
12. [ ] **Link zum privaten Video** und Screenshot der Detailseite (ohne Zugangsdaten, ohne Adresse) als Kommentar an den CEO schicken.

Nach der Abnahme (Quality Gate **und** Nutzer):
13. [ ] Sichtbarkeit auf **Öffentlich** stellen (oder den von der Abnahme genannten Zeitpunkt). Das ist eine eigene Freigabe, kein Teil dieses Pakets.

## 8. Prüfung nach dem Upload (Q2, durch mich, sobald der Link da ist)

- [ ] Link öffnet, Titel stimmt mit Abschnitt 2 überein
- [ ] Beschreibung vollständig und wortgleich mit Abschnitt 4 (Prompt, Getestet-Satz, Grenze, Offenlegung mit A1)
- [ ] Tags, Sprache Deutsch, Kategorie, nicht für Kinder
- [ ] KI-Kennzeichnung wie in Abschnitt 6 entschieden
- [ ] Sichtbarkeit wie freigegeben, Untertitel vorhanden, Titelbild wie vorgesehen
- [ ] Länge 46 s (46,27 s), Ton hörbar (das prüft der Nutzer, ich kann nicht hören)
- [ ] Ergebnis der YouTube-Prüfungen dokumentiert

Das Dokument wird danach um Link, Datum und Ergebnis ergänzt.

## 9. Richtlinien-Prüfung (Y1–Y6, Q7)

| Kriterium | Ergebnis |
|---|---|
| Titel/Titelbild halten, was das Video zeigt (⛔) | ✅ Abschnitte 2 und 3 (Titelbild 3 Wörter), gegen Rev. 8 geprüft (Bild 0–2 s unverändert) |
| Beschreibung vollständig, nennt Test und Grenze | ✅ Abschnitt 4 |
| KI-Kennzeichnung entschieden und begründet (Y3) | ✅ **Ja** (KI-Stimme einer realen Person, Abschnitt 6, nach Quality Gate M1) |
| Offenlegung wahr (nur zutreffende Teile) | ✅ KI-Stimme ja mit Herkunft, Grafik-Zusatz bewusst weggelassen |
| Keine irreführenden Metadaten, kein Tag-Spam | ✅ 5 Tags, 3 Hashtags, nur ChatGPT als Marke |
| Titelbild ohne Logo, keine Werbung, kein Affiliate | ✅ |
| Auflagen A1, A2 (Compliance) | ✅ erfüllt. A3, A4: laut Produktionsprotokoll bzw. Lizenznachweis erfüllt (von mir nicht erneut geprüft). A5: Hinweis an den Nutzer in Abschnitt 0. |
| Kosten | **0 €** |
| Hochgeladen | **Nein** |

## 10. Offen / nicht geprüft

- **Rev. 7 (MED-41, MED-47):** Gegenüber Rev. 4 sind Bilder bei 31,1–37,5 s (Mail-Karte „Exponate“) und im Schlussbild (Umschlag-Klappe) geändert, das kleine Logo/Wasserzeichen ist entfernt; nur das Logo im Schlussbild bleibt (Code, 0 €). Untertitel-Datei bleibt die von Rev. 4 (ich habe sie nicht neu gegen Rev. 7 abgeglichen, nur die Angabe der Produktion übernommen). Das Titelbild ist seit MED-51 `short1-rev8-titelbild.png` (ohne Logo). SHA-256 der MP4 habe ich nachgerechnet, Länge 46,27 s mit ffprobe. Faktencheck/Compliance haben Rev. 7 noch nicht geprüft.
- **Rev. 8 (MED-49, MED-48):** Gegenüber Rev. 7 ist nur die Szene „Prompt in der Beschreibung“ (42,4–45,1 s) geändert: Die Prompt-Karte kommt jetzt aus dem Umschlag (Ebenen Rückseite, Klappe, Karte, Vordertasche). Länge unverändert 46,27 s (ffprobe 46,267 s), 1080 × 1920, 30 fps. SHA-256 der MP4 habe ich nachgerechnet. Titel, Beschreibung, Untertitel (Zeiten unverändert) und KI-Kennzeichnung „Ja“ unverändert. Nicht neu geprüft: Faktencheck/Compliance für Rev. 8, Ton (nicht bitgleich zu Rev. 7, ich kann nicht hören).
- **Rev. 4 (MED-39):** Faktencheck und Compliance haben laut MED-38 den neuen Hook-Satz und das Logo noch nicht geprüft. Die Länge 46,27 s und die Videodaten habe ich mit ffprobe nachgemessen; die Lautheit nicht (Angabe der Produktion). Das fertige MP4 habe ich nicht abgespielt, nur Standbilder gesehen. Die Aussprache „KI“ als „Ka-I“ ist ungehört.
- **Beschreibung unverändert:** Prompt, Test, Grenze, Offenlegung und Hashtags stimmen mit dem neuen Video überein (Prompt-Wortlaut, Testdatum, Frist-Grenze sind gleich). Mit Logo im Schlussbild bleibt „Grafiken teilweise mit KI“ weggelassen: Das Logo ist eine vom Nutzer gelieferte Originaldatei; wie es entstanden ist, weiß ich nicht. Der Nutzer bestätigt bitte, falls das Logo KI-generiert ist (dann Offenlegung neu prüfen).
- Die **Stimme** habe ich nicht gehört (siehe Abschnitt 0).
- Die **Untertitel-Zeiten** (Rev. 4, unverändert für Rev. 8) stammen aus den Sprechabschnitten der Produktion (`zeiten.json`), nicht aus Wortmarken. Je Eintrag steht ein ganzer Sprechabschnitt (bis 8 s, bis 140 Zeichen), weil die Datei nur der Zugänglichkeit dient. Im Video sind die Untertitel eingebrannt und kürzer geschnitten.
- Die **Studio-Oberfläche** habe ich nicht bedient. Die Schritte folgen der Kanal-Einrichtung und der YouTube-Hilfe aus dem Wissen der Kanal-Einrichtung (MED-8) und müssen gegen den aktuellen Wortlaut geprüft werden.
- **Playlist** und **Abspann/Endkarte:** nicht vorgesehen.


