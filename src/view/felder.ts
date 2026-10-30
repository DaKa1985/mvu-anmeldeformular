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

// Ein Eintrag für Auswahllisten und Optionsfelder
export type Wahl = { wert: string; text: string };

// Auswahlliste <select>, z. B. für Kurs und Termin
export function auswahl(
  model: Model,
  dispatch: Dispatch,
  feld: TextFeld,
  beschriftung: string,
  eintraege: Wahl[],
): HTMLElement {
  const fehler = model.fehler[feld];
  const gewaehlt = model.daten[feld];

  return el(
    "div",
    { class: fehler ? "feld feld--fehler" : "feld" },
    el("label", { for: feld }, beschriftung + " *"),
    el(
      "select",
      {
        id: feld,
        disabled: eintraege.length === 0, // z. B. Termin, solange kein Kurs gewählt ist
        "aria-invalid": fehler ? "true" : "false",
        change: (ereignis) =>
          dispatch({
            typ: "FeldGeaendert",
            feld,
            wert: (ereignis.target as HTMLSelectElement).value,
          }),
      },
      el("option", { value: "", selected: gewaehlt === "" }, "Bitte wählen"),
      ...eintraege.map((e) =>
        el("option", { value: e.wert, selected: e.wert === gewaehlt }, e.text),
      ),
    ),
    fehler ? el("p", { class: "fehlertext" }, fehler) : "",
  );
}

// Optionsfelder (Radio-Buttons): genau eine Wahl, z. B. Präsenz oder online
export function optionsfelder(
  model: Model,
  dispatch: Dispatch,
  feld: TextFeld,
  beschriftung: string,
  eintraege: Wahl[],
): HTMLElement {
  const fehler = model.fehler[feld];
  return el(
    "fieldset",
    { class: fehler ? "feld optionen feld--fehler" : "feld optionen" },
    el("legend", {}, beschriftung + " *"),
    ...eintraege.map((e) =>
      el(
        "label",
        { class: "option" },
        el("input", {
          type: "radio",
          name: feld, // gleicher Name = nur eins wählbar
          id: `${feld}-${e.wert}`,
          value: e.wert,
          checked: model.daten[feld] === e.wert,
          change: () => dispatch({ typ: "FeldGeaendert", feld, wert: e.wert }),
        }),
        e.text,
      ),
    ),
    fehler ? el("p", { class: "fehlertext" }, fehler) : "",
  );
}

// "2027-01-11" wird zu "11.01.2027"
export function datumDeutsch(iso: string): string {
  const [jahr, monat, tag] = iso.split("-");
  return `${tag}.${monat}.${jahr}`;
}
