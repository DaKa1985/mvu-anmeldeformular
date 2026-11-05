MVU-Anmeldeformular
Projektaufgabe FIAE, bfw Lübeck: vierseitiges Anmeldeformular für die DigiLearn GmbH nach dem Muster Model-View-Update (MVU). TypeScript ohne Framework, Vite als Entwicklungsserver, Vitest für Tests.

Starten
Voraussetzung: Node.js in der LTS-Version.

npm install
npm run dev

Dann im Browser http://localhost:5173 öffnen.

Weitere Befehle
Befehl Wirkung
npm test Tests im Beobachtungsmodus
npm test -- --run Tests einmal ausführen
npm run coverage Testabdeckung anzeigen
npm run build Typen prüfen und fertige Seite in dist/ bauen
npm run format Code einheitlich formatieren
Funktionen
Vier Seiten mit Weiter, Zurück und Fortschrittsanzeige zum direkten Rücksprung
Prüfung der Eingaben mit Fehlermeldung am Feld
Rückgängig über eine Historie aller Zustände
Speichern als JSON, Laden mit Prüfung, Download beim Absenden
Aufbau
Datei Aufgabe Zuständig
src/types.ts Model, Messages, Effekte: der Vertrag beide
src/main.ts Runtime: Historie, Effekte ausführen, neu zeichnen beide
src/update.ts Neues Model aus altem Model und Msg, ohne Seiteneffekte David
src/validierung.ts Prüfregeln je Seite David
src/historie.ts Historie und Rückgängig David
src/datei.ts JSON erzeugen und geladene Dateien prüfen David
src/view/ Oberfläche: alle Seiten, Fortschritt, Felder Danara
src/style.css Aussehen Danara
Dokumentation
[Kurzdokumentation](docs/kurzdokumentation.md)
[Model und Messages](docs/model-und-messages.md)
[Entscheidungen](docs/entscheidungen.md)
[Skizzen](docs/skizzen/)
Team
Danara – Oberfläche (View, CSS, Skizzen)
David – Logik (Model, Update, Tests), Repository
