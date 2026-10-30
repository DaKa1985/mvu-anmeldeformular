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

| Msg                  | Wer schickt sie                           | Was update tut                                                                     |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| FeldGeaendert        | View, beim Tippen oder Auswählen          | übernimmt den Wert, prüft live, wenn schon Fehler sichtbar sind                    |
| DatenschutzGeaendert | View, Klick auf das Datenschutz-Häkchen   | folgt                                                                              |
| Weiter               | View, Klick auf Weiter                    | prüft die Seite, blättert nur ohne Fehler weiter                                   |
| Zurueck              | View, Klick auf Zurück                    | geht eine Seite zurück, ohne Prüfung, Fehler werden ausgeblendet                   |
| GeheZuSeite          | View, Klick in der Fortschrittsanzeige    | springt zu einer besuchten Seite; vorwärts nur, wenn die aktuelle Seite gültig ist |
| DateiAusgewaehlt     | View, Datei im Dialog auf Seite 1 gewählt | folgt                                                                              |
| DateiGeladen         | main.ts, nachdem die Datei gelesen wurde  | folgt                                                                              |
| SpeichernGeklickt    | View, Klick auf „Als Datei speichern“     | folgt                                                                              |
| Absenden             | View, Klick auf Absenden                  | folgt                                                                              |
| Rueckgaengig         | View, Klick auf Rückgängig                | wird nicht in update behandelt, main.ts holt den vorigen Zustand aus der Historie  |

## Effekte

| Effekt             | Ausgelöst durch     | Ausgeführt in |
| ------------------ | ------------------- | ------------- |
| DateiHerunterladen | Speichern, Absenden | main.ts       |
| DateiLesen         | Datei ausgewählt    | main.ts       |
