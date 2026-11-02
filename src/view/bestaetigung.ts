//src/view/bestaetigung.ts – Ansicht nach dem Absenden
import { findeKurs } from "../kurse";
import type { Dispatch, Model } from "../types";
import { el } from "./dom";
import { datumDeutsch } from "./felder";

export function bestaetigung(model: Model, dispatch: Dispatch): HTMLElement {
  const d = model.daten;
  const kurs = findeKurs(d.kurs);

  return el(
    "section",
    { class: "seite bestaetigung" },
    el("h2", {}, `Vielen Dank, ${d.vorname}!`),
    el(
      "p",
      {},
      `Ihre Anmeldung zum Kurs „${kurs ? kurs.name : d.kurs}“ ab ${datumDeutsch(d.starttermin)} ist eingegangen.`,
    ),
    el(
      "p",
      {},
      "Eine Kopie Ihrer Anmeldung wurde als JSON-Datei heruntergeladen. Sie können sie später auf Seite 1 wieder laden.",
    ),
    el(
      "button",
      {
        type: "button",
        class: "knopf knopf--primaer",
        click: () => dispatch({ typ: "NeueAnmeldung" }),
      },
      "Neue Anmeldung",
    ),
  );
}
