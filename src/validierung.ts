// src/validierung.ts - Prüfregeln je Seite, Reine Funktionen, keine Seiteneffekte
import { findeKurs } from "./kurse";
import type { Fehler, Formulardaten, Seite } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //etwas @ etwas . etwas, ohne Leerzeichen
const TELEFON = /^[0-9+ ]*$/; // nur Ziffern, + und Leerzeichen erlaubt
const PLZ = /^[0-9]{5}$/; // genau 5 Ziffern

function leer(wert: string): boolean {
  return wert.trim() === "";
}

export function pruefeSeite(seite: Seite, d: Formulardaten): Fehler {
  const fehler: Fehler = {};

  if (seite === 1) {
    if (leer(d.vorname)) fehler.vorname = "Bitte geben Sie Ihren Vornamen ein";
    if (leer(d.nachname))
      fehler.nachname = "Bitte geben Sie Ihren Nachnamen ein";
    if (leer(d.email)) fehler.email = "Bitte geben Sie Ihre E-Mail ein";
    else if (!EMAIL.test(d.email.trim()))
      fehler.email = "Bitte geben Sie eine gültige E-Mail ein";
    if (d.telefon && !TELEFON.test(d.telefon))
      fehler.telefon = "Bitte nur Ziffern, + und Leerzeichen eingeben";
  }

  if (seite === 2) {
    const kurs = findeKurs(d.kurs);
    if (!kurs) fehler.kurs = "Bitte wählen Sie einen gültigen Kurs aus";
    if (!kurs || !kurs.termine.includes(d.starttermin)) {
      fehler.starttermin = "Bitte wählen Sie einen gültigen Starttermin aus";
    }
    if (d.format !== "praesenz" && d.format !== "online") {
      fehler.format = "Bitte wählen Sie Präsenz oder Online";
    }
  }

  if (seite === 3) {
    if (
      d.rechnungsempfaenger !== "selbst" &&
      d.rechnungsempfaenger !== "arbeitgeber"
    ) {
      fehler.rechnungsempfaenger = "Bitte wählen Sie, wer die Rechnung erhält";
    }
    if (d.rechnungsempfaenger === "arbeitgeber" && leer(d.firma)) {
      fehler.firma = "Bitte geben Sie den namen der Firma ein";
    }
    if (leer(d.strasse)) fehler.strasse = "Bitte geben Sie Ihre Straße ein";
    if (leer(d.plz)) fehler.plz = "Bitte geben Sie Ihre Postleitzahl ein";
    if (!PLZ.test(d.plz.trim()))
      fehler.plz = "Bitte geben Sie eine gültige Postleitzahl ein";
    if (leer(d.ort)) fehler.ort = "Bitte geben Sie Ihren Ort ein";
  }

  if (seite === 4) {
    if (!d.datenschutz)
      fehler.datenschutz = "Bitte akzeptieren Sie die Datenschutzbestimmungen";
  }
  return fehler;
}

export function hatFehler(fehler: Fehler): boolean {
  return Object.keys(fehler).length > 0;
}
