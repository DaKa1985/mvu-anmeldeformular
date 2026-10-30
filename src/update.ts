// src/update.ts
import type { Model, Msg, Seite, UpdateErgebnis } from "./types";
import { hatFehler, pruefeSeite } from "./validierung";

// Hilfsfunktion: neues Model ohne Effekte
function nur(model: Model): UpdateErgebnis {
  return { model, effekte: [] };
}

export function update(model: Model, msg: Msg): UpdateErgebnis {
  switch (msg.typ) {
    case "FeldGeaendert":
      const daten = { ...model.daten, [msg.feld]: msg.wert };
      // Sind schon Fehler sichtbar, wird bei jeder Änderung geprüft, ob der Fehler noch besteht
      // So verschwindet eine Meldung, sobald der Fehler behoben ist
      const fehler = hatFehler(model.fehler)
        ? pruefeSeite(model.seite, daten)
        : {};
      return nur({ ...model, daten, fehler });

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
