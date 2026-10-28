// src/view/felder.ts – wiederverwendbare Eingabefelder
import type { Dispatch, Model, TextFeld } from "../types";
import { el } from "./dom";

export function textfeld(
  model: Model,
  dispatch: Dispatch,
  feld: TextFeld,
  beschriftung: string,
  pflicht: boolean,
  extra: Record<string, string> = {},
): HTMLElement {
  const fehler = model.fehler[feld];

  return el(
    "div",
    { class: fehler ? "feld feld--fehler" : "feld" },
    el("label", { for: feld }, pflicht ? beschriftung + " *" : beschriftung),
    el("input", {
      id: feld,
      type: "text",
      value: model.daten[feld],
      "aria-invalid": fehler ? "true" : "false",
      ...extra,

      // bei jedem Tastendruck eine Msg losschicken
      input: (ereignis) =>
        dispatch({
          typ: "FeldGeaendert",
          feld,
          wert: (ereignis.target as HTMLInputElement).value,
        }),
    }),
    fehler ? el("p", { class: "fehlertext" }, fehler) : "",
  );
}
