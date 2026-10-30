// src/view/seite2.ts – Kurswahl
import { KURSE, findeKurs } from "../kurse";
import type { Dispatch, Model } from "../types";
import { el } from "./dom";
import { auswahl, datumDeutsch, optionsfelder } from "./felder";

export function seite2(model: Model, dispatch: Dispatch): HTMLElement {
  // Termine gibt es erst, wenn ein Kurs gewählt ist
  const kurs = findeKurs(model.daten.kurs);
  const termine = kurs ? kurs.termine : [];

  return el(
    "section",
    { class: "seite" },
    el("h2", {}, "2. Kurswahl"),
    auswahl(
      model,
      dispatch,
      "kurs",
      "Kurs",
      KURSE.map((k) => ({ wert: k.id, text: k.name })),
    ),
    auswahl(
      model,
      dispatch,
      "starttermin",
      "Starttermin",
      termine.map((t) => ({ wert: t, text: datumDeutsch(t) })),
    ),
    optionsfelder(model, dispatch, "format", "Format", [
      { wert: "praesenz", text: "Präsenz in Lübeck" },
      { wert: "online", text: "Online" },
    ]),
  );
}
