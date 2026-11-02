// src/datei.ts – Anmeldung als JSON erzeugen und geladene Dateien prüfen.
// Reine Funktionen: Lesen und Herunterladen selbst passieren in main.ts.
import { leereDaten } from "./init";
import { hatFehler, pruefeSeite } from "./validierung";
import type { Formulardaten, TextFeld } from "./types";

export const DATEI_VERSION = 1;

const TEXT_FELDER: TextFeld[] = [
  "vorname",
  "nachname",
  "email",
  "telefon",
  "kurs",
  "starttermin",
  "format",
  "rechnungsempfaenger",
  "firma",
  "strasse",
  "hausnr",
  "plz",
  "ort",
];

// Das Datenschutz-Häkchen wird bewusst nicht gespeichert (Entscheidung B6).
// Felder mit undefined lässt JSON.stringify einfach weg.
export function alsJson(daten: Formulardaten): string {
  return JSON.stringify(
    { version: DATEI_VERSION, daten: { ...daten, datenschutz: undefined } },
    null,
    2,
  );
}

// "Müller-Lüdenscheidt" wird zu "anmeldung-mueller-luedenscheidt.json"
export function dateiname(daten: Formulardaten): string {
  const name = daten.nachname
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-") // alles andere wird zu einem Bindestrich
    .replace(/^-|-$/g, ""); // Bindestriche am Anfang und Ende weg
  return `anmeldung-${name || "ohne-namen"}.json`;
}

export type LadeErgebnis =
  { ok: true; daten: Formulardaten } | { ok: false; fehler: string };

export function ausJson(inhalt: string): LadeErgebnis {
  // 1. Ist es überhaupt JSON?
  let roh: unknown;
  try {
    roh = JSON.parse(inhalt);
  } catch {
    return abgelehnt("Sie enthält kein gültiges JSON.");
  }

  // 2. Hat die Datei unser Format?
  if (typeof roh !== "object" || roh === null)
    return abgelehnt("Sie hat nicht das erwartete Format.");
  const datei = roh as Record<string, unknown>;
  if (datei.version !== DATEI_VERSION)
    return abgelehnt("Unbekannte Version, erwartet wird Version 1.");
  if (typeof datei.daten !== "object" || datei.daten === null)
    return abgelehnt("Die Anmeldedaten fehlen.");
  const d = datei.daten as Record<string, unknown>;

  // 3. Ist jedes Feld vorhanden und ein Text?
  const werte: Record<string, string> = {};
  for (const feld of TEXT_FELDER) {
    const wert = d[feld];
    if (typeof wert !== "string")
      return abgelehnt(`Das Feld "${feld}" fehlt oder ist ungültig.`);
    werte[feld] = wert;
  }
  const daten: Formulardaten = Object.assign(leereDaten(), werte);

  // 4. Stimmen die Inhalte? Dieselben Regeln wie im Formular.
  for (const seite of [1, 2, 3] as const) {
    const fehler = pruefeSeite(seite, daten);
    if (hatFehler(fehler)) {
      return abgelehnt(
        `Ungültige Angaben auf Seite ${seite}: ${Object.values(fehler).join(" ")}`,
      );
    }
  }

  return { ok: true, daten };
}

function abgelehnt(grund: string): LadeErgebnis {
  return {
    ok: false,
    fehler: `Die Datei konnte nicht geladen werden. ${grund}`,
  };
}
