// src/testdaten.ts - gültige Beispieldaten für Tests. Nur erfundene Daten!
import type { Formulardaten } from "./types";

export function gueltigeDaten(): Formulardaten {
  return {
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
    datenschutz: true,
  };
}
