// src/update.ts
import type { Model, Msg, Seite, UpdateErgebnis } from "./types";
import { hatFehler, pruefeSeite } from "./validierung";
import { init } from "./init";

// Hilfsfunktion: neues Model ohne Effekte
function nur(model: Model): UpdateErgebnis {
  return { model, effekte: [] };
}

export function update(model: Model, msg: Msg): UpdateErgebnis {
  switch (msg.typ) {
    case "FeldGeaendert": {
      let daten = { ...model.daten, [msg.feld]: msg.wert };
      // Neuer Kurs: Der alte Termin gehört zu einem anderen Kurs und passt nicht mehr.
      if (msg.feld === "kurs" && msg.wert !== model.daten.kurs) {
        daten = { ...daten, starttermin: "" };
      }
      const fehler = hatFehler(model.fehler)
        ? pruefeSeite(model.seite, daten)
        : {};
      return nur({ ...model, daten, fehler });
    }

    case "Weiter": {
      if (model.seite === 4) return nur(model);
      const fehler = pruefeSeite(model.seite, model.daten);
      if (hatFehler(fehler)) return nur({ ...model, fehler }); //stehen bleiben und fehler zeigen
      const naechste = (model.seite + 1) as Seite;
      const hoechste = Math.max(model.hoechsteSeite, naechste) as Seite;
      return nur({
        ...model,
        seite: naechste,
        hoechsteSeite: hoechste,
        fehler: {},
      });
    }

    case "DatenschutzGeaendert": {
      const daten = { ...model.daten, datenschutz: msg.wert };
      const fehler = hatFehler(model.fehler)
        ? pruefeSeite(model.seite, daten)
        : {};
      return nur({ ...model, daten, fehler });
    }

    case "Absenden": {
      if (model.abgeschickt) return nur(model);
      // Alle Seiten prüfen. Bei Fehlern zur ersten fehlerhaften Seite springen.
      for (const seite of [1, 2, 3, 4] as const) {
        const fehler = pruefeSeite(seite, model.daten);
        if (hatFehler(fehler)) return nur({ ...model, seite, fehler });
      }
      // Der Download der JSON-Datei kommt an Tag 5 als Effekt dazu.
      return nur({ ...model, abgeschickt: true, fehler: {} });
    }

    case "NeueAnmeldung":
      return nur(init());

    case "Zurueck":
      if (model.seite === 1) return nur(model);
      return nur({ ...model, seite: (model.seite - 1) as Seite, fehler: {} });

    case "GeheZuSeite":
      if (msg.seite > model.hoechsteSeite) return nur(model);
      //vorwärts springen nur, wenn die aktuelle Seite stimmt
      //die Seiten dazwischen waren beim verlassen gültig und wurden seitdem nicht verändert
      if (msg.seite > model.seite) {
        const fehler = pruefeSeite(model.seite, model.daten);
        if (hatFehler(fehler)) return nur({ ...model, fehler });
      }
      return nur({ ...model, seite: msg.seite as Seite, fehler: {} });

    default:
      return nur(model);
  }
}
