// src/update.test.ts
import { describe, it, expect } from "vitest";
import { init } from "./init";
import { update } from "./update";
import type { Model, Seite } from "./types";
import { gueltigeDaten } from "./testdaten";

//Hilfsfunktion: ein Model auf einer bestimmten Seite
function aufSeite(seite: Seite, hoechsteSeite: Seite = seite): Model {
  return { ...init(), seite, hoechsteSeite, daten: gueltigeDaten() };
}
describe("Navigation", () => {
  it("Weiter geht von Seite 1 auf Seite 2 und merkt sich Seite 2", () => {
    const { model } = update(aufSeite(1), { typ: "Weiter" });
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

describe("Prüfung beim Blättern", () => {
  it("weiter bleibt bei fehler stehen und zeigt sie an", () => {
    const { model } = update(init(), { typ: "Weiter" });
    expect(model.seite).toBe(1);
    expect(model.fehler.vorname).toBeDefined();
    expect(model.fehler.email).toBeDefined();
  });

  it("nach dem ersten Fehler verschwindet die Meldung, sobald das Feld stimmt", () => {
    const mitFehler = update(init(), { typ: "Weiter" }).model;
    const { model } = update(mitFehler, {
      typ: "FeldGeaendert",
      feld: "vorname",
      wert: "Max",
    });
    expect(model.fehler.vorname).toBeUndefined();
    expect(model.fehler.nachname).toBeDefined();
  });

  it("ohne vorherige Fehler erschienen beim Tippen keine Meldungen", () => {
    const { model } = update(init(), {
      typ: "FeldGeaendert",
      feld: "email",
      wert: "m",
    });
    expect(model.fehler).toEqual({});
  });

  it("Vorwärtsspringen prüft die aktuelle Seite", () => {
    const start: Model = {
      ...aufSeite(1, 3),
      daten: { ...gueltigeDaten(), email: "kaputt" },
    };
    const { model } = update(start, { typ: "GeheZuSeite", seite: 3 });
    expect(model.seite).toBe(1);
    expect(model.fehler.email).toBeDefined();
  });

  it("Zurückblättern behält alle Eingaben", () => {
    const { model } = update(aufSeite(3), { typ: "Zurueck" });
    expect(model.daten).toEqual(gueltigeDaten());
  });
});
describe("Kurswechsel und Datenschutz", () => {
  it("ein neuer Kurs setzt den Starttermin zurück", () => {
    const { model } = update(aufSeite(2), {
      typ: "FeldGeaendert",
      feld: "kurs",
      wert: "agil-scrum",
    });
    expect(model.daten.kurs).toBe("agil-scrum");
    expect(model.daten.starttermin).toBe("");
  });

  it("derselbe Kurs lässt den Termin stehen", () => {
    const { model } = update(aufSeite(2), {
      typ: "FeldGeaendert",
      feld: "kurs",
      wert: "ts-grundlagen",
    });
    expect(model.daten.starttermin).toBe("2027-01-11");
  });

  it("das Datenschutz-Häkchen wird übernommen", () => {
    const { model } = update(aufSeite(4), {
      typ: "DatenschutzGeaendert",
      wert: false,
    });
    expect(model.daten.datenschutz).toBe(false);
  });
});

describe("Absenden und Neue Anmeldung", () => {
  it("mit gültigen Daten wird abgeschickt", () => {
    const { model } = update(aufSeite(4), { typ: "Absenden" });
    expect(model.abgeschickt).toBe(true);
  });

  it("ohne Häkchen bleibt es auf Seite 4 mit Fehler", () => {
    const start: Model = {
      ...aufSeite(4),
      daten: { ...gueltigeDaten(), datenschutz: false },
    };
    const { model } = update(start, { typ: "Absenden" });
    expect(model.abgeschickt).toBe(false);
    expect(model.seite).toBe(4);
    expect(model.fehler.datenschutz).toBeDefined();
  });

  it("springt zur ersten Seite mit Fehlern", () => {
    const start: Model = {
      ...aufSeite(4),
      daten: { ...gueltigeDaten(), plz: "123" },
    };
    const { model } = update(start, { typ: "Absenden" });
    expect(model.seite).toBe(3);
    expect(model.fehler.plz).toBeDefined();
  });

  it("Neue Anmeldung setzt alles auf den Start zurück", () => {
    const abgeschickt: Model = { ...aufSeite(4), abgeschickt: true };
    const { model } = update(abgeschickt, { typ: "NeueAnmeldung" });
    expect(model).toEqual(init());
  });
});
