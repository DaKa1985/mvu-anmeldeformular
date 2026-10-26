// src/update.test.ts
import { describe, it, expect } from "vitest";
import { init } from "./init";
import { update } from "./update";
import type { Model, Seite } from "./types";

//Hilfsfunktion: ein Model auf einer bestimmten Seite
function aufSeite(seite: Seite, hoechsteSeite: Seite = seite): Model {
  return { ...init(), seite, hoechsteSeite };
}
describe("Navigation", () => {
  it("Weiter geht von Seite 1 auf Seite 2 und merkt sich Seite 2", () => {
    const { model } = update(init(), { typ: "Weiter" });
    expect(model.seite).toBe(2);
    expect(model.hoechsteSeite).toBe(2);
  });

  it("Zurück geht von Seite 3 auf Seite 2, die höchste Seite bleibt 3", () => {
    const { model } = update(aufSeite(3, 3), { typ: "Zurueck" });
    expect(model.seite).toBe(2);
    expect(model.hoechsteSeite).toBe(3);
  });

  it("zurück auf Seite 1 ändert nichts", () => {
    const { model } = update(aufSeite(1), { typ: "Zurueck" });
    expect(model.seite).toBe(1);
  });

  it("GeheZuSeite springt zu einer besuchten Seite", () => {
    const { model } = update(aufSeite(1, 3), { typ: "GeheZuSeite", seite: 3 });
    expect(model.seite).toBe(3);
  });

  it("GeheZuSeite ignoriert noch nicht besuchte Seiten", () => {
    const { model } = update(aufSeite(1, 2), { typ: "GeheZuSeite", seite: 4 });
    expect(model.seite).toBe(1);
  });
});

describe("FeldGeaendert", () => {
  it("Übernimmt den neuen Wert und lässt andere Felder in Ruhe", () => {
    const { model } = update(init(), {
      typ: "FeldGeaendert",
      feld: "vorname",
      wert: "Max",
    });
    expect(model.daten.vorname).toBe("Max");
    expect(model.daten.nachname).toBe("");
  });
});

describe("Reinheit", () => {
  it("verändert das alte Model nicht", () => {
    const alt = init();
    const kopie = structuredClone(alt);
    update(alt, { typ: "FeldGeaendert", feld: "vorname", wert: "Max" });
    update(alt, { typ: "Weiter" });
    expect(alt).toEqual(kopie);
  });
});
