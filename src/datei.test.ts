// src/datei.test.ts
import { describe, it, expect } from "vitest";
import { alsJson, ausJson, dateiname, type LadeErgebnis } from "./datei";
import { gueltigeDaten } from "./testdaten";

// Hilfsfunktion: holt die Fehlermeldung aus einem Ergebnis, das fehlschlagen sollte
function fehlerVon(ergebnis: LadeErgebnis): string {
  if (ergebnis.ok) throw new Error("Laden hätte fehlschlagen sollen");
  return ergebnis.fehler;
}

// Hilfsfunktion: gültige Datei als Objekt, damit man sie gezielt kaputt machen kann
function dateiObjekt() {
  return JSON.parse(alsJson(gueltigeDaten()));
}

describe("Speichern", () => {
  it("schreibt Version 1 und lässt das Datenschutz-Häkchen weg", () => {
    const datei = dateiObjekt();
    expect(datei.version).toBe(1);
    expect(datei.daten.vorname).toBe("Max");
    expect(datei.daten.datenschutz).toBeUndefined();
  });

  it("bildet den Dateinamen aus dem Nachnamen", () => {
    expect(
      dateiname({ ...gueltigeDaten(), nachname: "Müller-Lüdenscheidt" }),
    ).toBe("anmeldung-mueller-luedenscheidt.json");
    expect(dateiname({ ...gueltigeDaten(), nachname: "" })).toBe(
      "anmeldung-ohne-namen.json",
    );
  });
});

describe("Bereinigen beim Speichern", () => {
  it("entfernt Leerzeichen am Anfang und Ende", () => {
    const datei = JSON.parse(
      alsJson({
        ...gueltigeDaten(),
        email: "  max@example.com ",
        ort: " Lübeck",
      }),
    );
    expect(datei.daten.email).toBe("max@example.com");
    expect(datei.daten.ort).toBe("Lübeck");
  });
});

describe("Laden", () => {
  it("Speichern und Laden ergibt wieder dieselben Daten", () => {
    const ergebnis = ausJson(alsJson(gueltigeDaten()));
    expect(ergebnis).toEqual({
      ok: true,
      daten: { ...gueltigeDaten(), datenschutz: false },
    });
  });

  it("lehnt Text ab, der kein JSON ist", () => {
    expect(fehlerVon(ausJson("das ist kein json"))).toContain("JSON");
  });

  it("lehnt eine falsche Version ab", () => {
    const datei = { ...dateiObjekt(), version: 2 };
    expect(fehlerVon(ausJson(JSON.stringify(datei)))).toContain("Version");
  });

  it("lehnt eine Datei ab, in der ein Feld fehlt", () => {
    const datei = dateiObjekt();
    delete datei.daten.email;
    expect(fehlerVon(ausJson(JSON.stringify(datei)))).toContain("email");
  });

  it("lehnt ein Feld mit falschem Typ ab", () => {
    const datei = dateiObjekt();
    datei.daten.plz = 23552; // Zahl statt Text
    expect(fehlerVon(ausJson(JSON.stringify(datei)))).toContain("plz");
  });

  it("lehnt ungültige Inhalte ab", () => {
    const datei = dateiObjekt();
    datei.daten.kurs = "gibt-es-nicht";
    expect(fehlerVon(ausJson(JSON.stringify(datei)))).toContain("Seite 2");
  });
});
