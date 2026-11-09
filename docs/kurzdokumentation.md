# Kurzdokumentation – MVU-Anmeldeformular

Projektaufgabe FIAE, bfw Lübeck · Team: Danara (Oberfläche), David (Logik)

## 1. Überblick

Vierseitiges Anmeldeformular für die DigiLearn GmbH in TypeScript ohne Framework, aufgebaut nach Model-View-Update (MVU). Die Anwendung hat genau einen Zustand, das Model. `update` berechnet aus altem Model und einer Message ein neues Model und verändert dabei nichts. Alles mit Außenwirkung, also Datei herunterladen und Datei lesen, gibt `update` als Effekt zurück. Ausgeführt wird es in `main.ts`.

Ablauf eines Klicks: View schickt Msg → `update` liefert neues Model und Effekte → `main.ts` speichert das Model in der Historie, führt die Effekte aus und zeichnet die View neu.

Die Historie ist eine Liste aller Models, Rückgängig entfernt den letzten Eintrag. Tippen im selben Feld zählt als ein Schritt. Die Logik ist mit 57 Tests abgesichert (Vitest).

## 2. Model

| Feld            | Typ              | Bedeutung                                              |
| --------------- | ---------------- | ------------------------------------------------------ |
| `seite`         | 1 bis 4          | angezeigte Seite                                       |
| `hoechsteSeite` | 1 bis 4          | bis hierhin erlaubt die Fortschrittsanzeige den Sprung |
| `daten`         | `Formulardaten`  | alle 13 Eingaben aller Seiten                          |
| `fehler`        | `Fehler`         | höchstens eine Meldung pro Feld                        |
| `ladeFehler`    | Text oder `null` | Meldung, wenn eine geladene Datei ungültig war         |
| `abgeschickt`   | ja/nein          | Anmeldung abgesendet, Bestätigung wird angezeigt       |

`Formulardaten`: Vorname, Nachname, E-Mail, Telefon, Kurs, Starttermin, Format, Rechnungsempfänger, Firma, Straße, PLZ, Ort, Datenschutz. Seitenwechsel ändern nur `seite`, nie `daten`. Deshalb gehen beim Blättern keine Eingaben verloren.

## 3. Messages und Effekte

| Message                | Ausgelöst durch               | Wirkung in `update`                                                       |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `FeldGeaendert`        | Eingabe, Auswahl              | Wert übernehmen, neuer Kurs leert den Termin, sichtbare Fehler neu prüfen |
| `DatenschutzGeaendert` | Häkchen auf Seite 4           | Wert übernehmen                                                           |
| `Weiter`               | Schaltfläche                  | Seite prüfen, nur ohne Fehler weiterblättern                              |
| `Zurueck`              | Schaltfläche                  | eine Seite zurück, Daten bleiben                                          |
| `GeheZuSeite`          | Fortschrittsanzeige, „Ändern“ | nur zu besuchten Seiten, vorwärts nur mit gültiger Seite                  |
| `SpeichernGeklickt`    | Seite 4                       | Effekt `DateiHerunterladen`                                               |
| `Absenden`             | Seite 4                       | alle Seiten prüfen, abschicken, Effekt `DateiHerunterladen`               |
| `NeueAnmeldung`        | Bestätigung                   | zurück zum Startzustand                                                   |
| `DateiAusgewaehlt`     | Seite 1                       | Effekt `DateiLesen`                                                       |
| `DateiGeladen`         | `main.ts` nach dem Lesen      | prüfen, dann übernehmen und zur Zusammenfassung, sonst nur Fehlermeldung  |
| `Rueckgaengig`         | Schaltfläche                  | wird in `main.ts` behandelt: letzten Historieneintrag entfernen           |

Effekte, ausgeführt in `main.ts`: `DateiHerunterladen` (Download über den Browser) und `DateiLesen` (Inhalt lesen, Ergebnis kommt als `DateiGeladen` zurück).

## 4. Aufgabenverteilung im Team

| Bereich                                                                    | Zuständig | Dateien                                       |
| -------------------------------------------------------------------------- | --------- | --------------------------------------------- |
| Oberfläche: vier Seiten, Fortschrittsanzeige, Felder, Aussehen,            |
| Barrierefreiheit                                                           | Danara    | `src/view/`, `src/style.css`                  |
| Logik: update, Prüfregeln, Historie, Speichern und Laden, Tests            | David     |
| `src/update.ts`, `validierung.ts`, `historie.ts`, `datei.ts`, Tests        |
| Vertrag und Runtime                                                        | beide     | `src/types.ts` (Tag 2), `src/main.ts` (Tag 4) |
|                                                                            |
| Planung und Doku                                                           | beide     | Skizzen: Danara, Model und Messages sowie     |
| README: David, Entscheidungen und Kurzdoku: beide                          |
| Repository und Board                                                       | David     | Einstellungen, Issues, Projekt-Board          |
| In Zahlen: 21 Commits von Danara, 25 von David, 23 gemergte Pull Requests, |
| jeder von der jeweils anderen Person geprüft.                              |

## 5. Planung und Zusammenarbeit

Arbeitsweise: Keine Änderung direkt auf `main`, jede über Branch, Pull
Request und Review der anderen Person. Täglich ein kurzes Stand-up.
