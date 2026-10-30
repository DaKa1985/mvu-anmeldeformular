// src/validierung.test.ts - Tests für die Validierung der Formulardaten
import { describe, it, expect } from "vitest";
import { pruefeSeite, hatFehler } from "./validierung";
import { gueltigeDaten } from "./testdaten";

describe("pruefeSeite", () => {
  it("findet bei gültigen Daten auf keiner Seite einen Fehler", () => {
    for (const seite of [1, 2, 3, 4] as const) {
      expect(pruefeSeite(seite, gueltigeDaten())).toEqual({});
    }
  });

  it("Seite 1: Vorname nur aus Leerzeichen gilt als leer", () => {
    const fehler = pruefeSeite(1, { ...gueltigeDaten(), vorname: "   " });
    expect(fehler.vorname).toBeDefined();
  });

  it.each(["max", "max@", "max@example", "@example.com", "max @example.com"])(
    "Seite 1: lehnt die E-Mail '%s' ab",
    (email) => {
      expect(pruefeSeite(1, { ...gueltigeDaten(), email }).email).toBeDefined();
    },
  );

  it("Seite 1: Telefon darf leer sein", () => {
    expect(pruefeSeite(1, { ...gueltigeDaten(), telefon: "" })).toEqual({});
  });

  it("Seite 1: telefon mit Buchstaben ist falsch", () => {
    expect(
      pruefeSeite(1, { ...gueltigeDaten(), telefon: "0451 abc" }).telefon,
    ).toBeDefined();
  });

  it("Seite 2: der Termin muss zum gewählten Kurs gehören", () => {
    const fehler = pruefeSeite(2, {
      ...gueltigeDaten(),
      starttermin: "2027-02-01",
    });
    expect(fehler.starttermin).toBeDefined();
  });

  it("Seite 2: ohne Format gibt es einen Fehler", () => {
    expect(
      pruefeSeite(2, { ...gueltigeDaten(), format: "" }).format,
    ).toBeDefined();
  });

  it("Seite 3: Firma ist nur beim Arbeitgeber Pflicht", () => {
    expect(
      pruefeSeite(3, {
        ...gueltigeDaten(),
        rechnungsempfaenger: "selbst",
        firma: "",
      }).firma,
    ).toBeUndefined();

    const fehler = pruefeSeite(3, {
      ...gueltigeDaten(),
      rechnungsempfaenger: "arbeitgeber",
      firma: "",
    });
    expect(fehler.firma).toBeDefined();
  });

  it.each(["2355", "235520", "23a52"])(
    "Seite 3: lehnt die PLZ '%s' ab",
    (plz) => {
      expect(pruefeSeite(3, { ...gueltigeDaten(), plz }).plz).toBeDefined();
    },
  );

  it("Seite 4: ohne Datenschutz-Häkchen gibt es einen Fehler", () => {
    expect(
      pruefeSeite(4, { ...gueltigeDaten(), datenschutz: false }).datenschutz,
    ).toBeDefined();
  });
});

describe("hatFehler", () => {
  it("erkennt ein leeres fehler-Objekt", () => {
    expect(hatFehler({})).toBe(false);
    expect(hatFehler({ email: "falsch" })).toBe(true);
  });
});
