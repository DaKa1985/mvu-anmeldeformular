// src/update.ts
import type { Model, Msg, Seite, UpdateErgebnis } from "./types";

// Hilfsfunktion: neues Model ohne Effekte
function nur(model: Model): UpdateErgebnis {
  return { model, effekte: [] };
}

export function update(model: Model, msg: Msg): UpdateErgebnis {
  switch (msg.typ) {
    case "FeldGeaendert":
      return nur({ ...model, daten: { ...model.daten, [msg.feld]: msg.wert } });

    case "Weiter": {
      //Prüfregeln kommen noch
      if (model.seite === 4) return nur(model);
      const naechste = (model.seite + 1) as Seite;
      const hoechste = Math.max(model.hoechsteSeite, naechste) as Seite;
      return nur({
        ...model,
        seite: naechste,
        hoechsteSeite: hoechste,
        fehler: {},
      });
    }

    case "Zurueck":
      if (model.seite === 1) return nur(model);
      return nur({ ...model, seite: (model.seite - 1) as Seite, fehler: {} });

    case "GeheZuSeite":
      if (msg.seite > model.hoechsteSeite) return nur(model);
      return nur({ ...model, seite: msg.seite as Seite, fehler: {} });

    default:
      return nur(model);
  }
}
