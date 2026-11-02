# Model und Messages

## Das Model

| Feld          | Typ            | Bedeutung                                                  |
| ------------- | -------------- | ---------------------------------------------------------- |
| seite         | 1 bis 4        | Seite, die gerade angezeigt wird                           |
| hoechsteSeite | 1 bis 4        | bis hierhin darf man über die Fortschrittsanzeige springen |
| daten         | Formulardaten  | alle Eingaben aller Seiten                                 |
| fehler        | Fehler         | höchstens eine Meldung pro Feld                            |
| ladeFehler    | Text oder null | Meldung, wenn eine geladene Datei ungültig war             |
| abgeschickt   | ja/nein        | wurde die Anmeldung abgesendet?                            |

## Die Messages

| Msg                  | Wer schickt sie                                    | Was update tut                                                                                                              |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| FeldGeaendert        | View, beim Tippen oder Auswählen                   | übernimmt den Wert, prüft live, wenn schon Fehler sichtbar sind; bei einem anderen Kurs wird der Starttermin geleert        |
| DatenschutzGeaendert | View, Klick auf das Datenschutz-Häkchen            | übernimmt das Häkchen                                                                                                       |     |
| Weiter               | View, Klick auf Weiter                             | prüft die Seite, blättert nur ohne Fehler weiter                                                                            |
| Zurueck              | View, Klick auf Zurück                             | geht eine Seite zurück, ohne Prüfung, Fehler werden ausgeblendet                                                            |
| GeheZuSeite          | View, Klick in der Fortschrittsanzeige             | springt zu einer besuchten Seite; vorwärts nur, wenn die aktuelle Seite gültig ist                                          |
| DateiAusgewaehlt     | View, Datei im Dialog auf Seite 1 gewählt          | folgt                                                                                                                       |
| DateiGeladen         | main.ts, nachdem die Datei gelesen wurde           | folgt                                                                                                                       |
| SpeichernGeklickt    | View, Klick auf „Als Datei speichern“              | folgt                                                                                                                       |
| Absenden             | View, Klick auf Absenden                           | prüft alle vier Seiten; bei Fehlern Sprung zur ersten Seite mit Fehlern, sonst abgeschickt = true (Download folgt an Tag 5) |     |
| NeueAnmeldung        | View, Klick auf „Neue Anmeldung“ nach dem Absenden | setzt alles auf den Startzustand zurück (init)                                                                              |
| Rueckgaengig         | View, Klick auf Rückgängig                         | nicht in update: main.ts nimmt den vorigen Zustand aus der Historie                                                         |

## Effekte

| Effekt             | Ausgelöst durch     | Ausgeführt in |
| ------------------ | ------------------- | ------------- |
| DateiHerunterladen | Speichern, Absenden | main.ts       |
| DateiLesen         | Datei ausgewählt    | main.ts       |

## Historie

main.ts merkt sich jeden neuen Zustand in einer Liste. Weil update das alte Model nie verändert, ist jeder Eintrag ein vollständiger, unveränderter Zustand. Rückgängig heißt: den vorherigen Eintrag wieder anzeigen.
