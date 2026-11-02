// src/view/fixtures.ts - Beispiel-Models zum Testen der Oberfläche. Nur erfundene Daten!
import { init, leereDaten } from "../init"; // init und leereDaten kommen aus src/init.ts
import type { Formulardaten, Model } from "../types";

// ein komplett ausgefülltes Formular als Vorlage
const ausgefuellt: Formulardaten = {
  vorname: "Max",
  nachname: "Mustermann",
  email: "max.mustermann@example.com",
  telefon: "0451 123456",
  kurs: "ts-grundlagen",
  starttermin: "2027-01-11",
  format: "online",
  rechnungsempfaenger: "selbst",
  firma: "",
  strasse: "Musterstraße",
  hausnr: "1",
  plz: "23552",
  ort: "Lübeck",
  datenschutz: false,
};

// so startet die App
export const leer: Model = init();

// seite 1, nachdem jemand mit Lücken auf "Weiter" geklickt hat
export const seite1MITFehlern: Model = {
  ...init(),
  daten: { ...leereDaten(), vorname: "Max", email: "max@" },
  fehler: {
    nachname: "Bitte geben Sie Ihren Nachnamen ein.",
    email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  },
};

// 3. Zurück auf Seite 1, schon alle Seiten besucht
export const zurueckAufSeite1: Model = {
  ...init(),
  hoechsteSeite: 4,
  daten: ausgefuellt,
};
// init(), hoechsteSeite: 4 ist Baustein aus dem Crashkurs: Kopie des Startzustands mit einem geänderten Feld
// : Model sorgt dafür, dass VS Code meckert, sobald ein Beispiel nicht zu types.ts passt

// 4. Seite 2, noch nicts gewählt
export const seite2: Model = {
  ...init(),
  seite: 2,
  hoechsteSeite: 2,
  daten: { ...ausgefuellt, kurs: "", starttermin: "", format: "" },
};

// 5. Seite 3 mit Arbeitgeber als Rechnungsempfänger
export const seite3Arbeitgeber: Model = {
  ...init(),
  seite: 3,
  hoechsteSeite: 3,
  daten: {
    ...ausgefuellt,
    rechnungsempfaenger: "arbeitgeber",
    firma: "Beispiel GmbH",
  },
};

// 6. Zusammenfassung, alles ausgefüllt
export const zusammenfassung: Model = {
  ...init(),
  seite: 4,
  hoechsteSeite: 4,
  daten: ausgefuellt,
};

// 7. Absenden ohne Häkchen versucht
export const zusammenfassungMitFehler: Model = {
  ...zusammenfassung,
  fehler: { datenschutz: "Bitte stimmen Sie der Datenschutzerklärung zu." },
};

// 8. Erfolgreich abgeschickt
export const abgeschickt: Model = {
  ...zusammenfassung,
  daten: { ...ausgefuellt, datenschutz: true },
  abgeschickt: true,
};

// 9. Laden einer kaputten Datei versucht
export const mitLadeFehler: Model = {
  ...init(),
  ladeFehler:
    "Die Datei konnte nicht geladen werden. Sie enthält kein gültiges JSON.",
};
