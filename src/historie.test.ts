// src/historie.test.ts
import { describe, it, expect } from "vitest";
import { init } from "./init";
import { aktuell, merke, neueHistorie, zurueck } from "./historie";
import type { Model, Msg } from "./types";

function tippe(feld: "vorname" | "nachname", wert: string): Msg {
  return { typ: "FeldGeaendert", feld, wert };
}

function mit(
  feld: "vorname" | "nachname",
  wert: string,
  basis: Model = init(),
): Model {
  return { ...basis, daten: { ...basis.daten, [feld]: wert } };
}

describe("Historie", () => {
  it("startet mit genau einem Eintrag", () => {
    expect(neueHistorie(init()).eintraege).toHaveLength(1);
  });

  it("hängt nach einem Klick einen Eintrag an", () => {
    const start = init();
    const neu: Model = { ...start, seite: 2 };
    const h = merke(neueHistorie(start), { typ: "Weiter" }, neu);
    expect(h.eintraege).toHaveLength(2);
    expect(aktuell(h)).toBe(neu);
  });

  it("legt keinen Eintrag an, wenn sich nichts geändert hat", () => {
    const start = init();
    const h = merke(neueHistorie(start), { typ: "Zurueck" }, start);
    expect(h.eintraege).toHaveLength(1);
  });

  it("fasst Tippen im selben Feld zu einem Schritt zusammen", () => {
    let h = neueHistorie(init());
    h = merke(h, tippe("vorname", "M"), mit("vorname", "M"));
    h = merke(h, tippe("vorname", "Ma"), mit("vorname", "Ma"));
    h = merke(h, tippe("vorname", "Max"), mit("vorname", "Max"));
    expect(h.eintraege).toHaveLength(2);
    expect(aktuell(h).daten.vorname).toBe("Max");
  });

  it("ein anderes Feld beginnt einen neuen Schritt", () => {
    let h = neueHistorie(init());
    h = merke(h, tippe("vorname", "Max"), mit("vorname", "Max"));
    h = merke(h, tippe("nachname", "M"), mit("nachname", "M", aktuell(h)));
    expect(h.eintraege).toHaveLength(3);
  });

  it("Rückgängig stellt den Zustand vor dem Feld wieder her", () => {
    let h = neueHistorie(init());
    h = merke(h, tippe("vorname", "M"), mit("vorname", "M"));
    h = merke(h, tippe("vorname", "Max"), mit("vorname", "Max"));
    h = zurueck(h);
    expect(aktuell(h).daten.vorname).toBe("");
  });

  it("nach Rückgängig beginnt Tippen einen neuen Schritt", () => {
    let h = neueHistorie(init());
    h = merke(h, tippe("vorname", "Max"), mit("vorname", "Max"));
    h = merke(h, tippe("nachname", "M"), mit("nachname", "M", aktuell(h)));
    h = zurueck(h);
    h = merke(h, tippe("vorname", "Moritz"), mit("vorname", "Moritz"));
    expect(h.eintraege).toHaveLength(3);
  });

  it("Rückgängig auf dem Startzustand ändert nichts", () => {
    const h = neueHistorie(init());
    expect(zurueck(h)).toBe(h);
  });
});
