# Kurzdokumentation – MVU-Anmeldeformular

Projektaufgabe FIAE, bfw Lübeck · Team: Danara (Oberfläche), David (Logik)

## 1. Überblick

_folgt (David)_

## 2. Model

_folgt (David)_

## 3. Messages und Effekte

_folgt (David)_

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

- **Tag 1:** Git eingerichtet und geübt, offene Punkte mit der Lehrkraft
  geklärt ([Entscheidungen](entscheidungen.md)).
- **Tag 2:** Skizzen der vier Seiten, Model und Messages gemeinsam als
  `types.ts` festgelegt.
- **Tag 3 bis 5:** Parallele Umsetzung. Die View entstand gegen Beispiel-
  Models, die Logik gegen Tests. Zusammengeführt an Tag 4 in `main.ts`.
- **Tag 6 bis 8:** Abnahmetest gegen jede Anforderung, Fehlerbehebung,
  Barrierefreiheit, Dokumentation.
  Arbeitsweise: Keine Änderung direkt auf `main`, jede über Branch, Pull
  Request und Review der anderen Person. Aufgaben als Issues auf einem GitHub-
  Projekt-Board, täglich ein kurzes Stand-up. Die [Skizzen](skizzen/) liegen in
  zwei Versionen vor: aus der Planung und nach der Umsetzung.
