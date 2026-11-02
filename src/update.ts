// src/update.ts
import type { Effekt, Model, Msg, Seite, UpdateErgebnis } from "./types";
import { hatFehler, pruefeSeite } from "./validierung";
import { init } from "./init";
import { alsJson, ausJson, dateiname } from "./datei";

// Hilfsfunktion: neues Model ohne Effekte
function nur(model: Model): UpdateErgebnis {
  return { model, effekte: [] };
}

// Auftrag: aktuelle Anmeldung als Datei herunterladen
function download(model: Model): Effekt {
  return {
    typ: "DateiHerunterladen",
    dateiname: dateiname(model.daten),
    inhalt: alsJson(model.daten),
  };
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
      return {
        model: { ...model, abgeschickt: true, fehler: {} },
        effekte: [download(model)],
      };
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

    case "SpeichernGeklickt":
      // Das Model ändert sich nicht, es gibt nur einen Auftrag nach draußen.
      return { model, effekte: [download(model)] };

    case "DateiAusgewaehlt":
      // update liest die Datei nicht selbst, sondern beauftragt main.ts damit.
      return { model, effekte: [{ typ: "DateiLesen", datei: msg.datei }] };

    case "DateiGeladen": {
      const ergebnis = ausJson(msg.inhalt);
      // Ungültig: nur die Meldung setzen, die Eingaben bleiben unverändert.
      if (!ergebnis.ok) return nur({ ...model, ladeFehler: ergebnis.fehler });
      // Gültig: Daten übernehmen und direkt zur Zusammenfassung.
      return nur({
        ...model,
        daten: ergebnis.daten,
        seite: 4,
        hoechsteSeite: 4,
        fehler: {},
        ladeFehler: null,
        abgeschickt: false,
      });
    }

    default:
      return nur(model);
  }
}
