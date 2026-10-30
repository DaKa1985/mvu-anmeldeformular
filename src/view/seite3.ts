// src/view/seite3.ts – Rechnungsdaten
import type { Dispatch, Model } from "../types";
import { el } from "./dom";
import { optionsfelder, textfeld } from "./felder";

export function seite3(model: Model, dispatch: Dispatch): HTMLElement {
  const arbeitgeber = model.daten.rechnungsempfaenger === "arbeitgeber";
  return el(
    "section",
    { class: "seite" },
    el("h2", {}, "3. Rechnungsdaten"),
    optionsfelder(
      model,
      dispatch,
      "rechnungsempfaenger",
      "Wer erhält die Rechnung?",
      [
        { wert: "selbst", text: "Ich selbst" },
        { wert: "arbeitgeber", text: "Mein Arbeitgeber" },
      ],
    ),
    // Das Feld Firma gibt es nur beim Arbeitgeber
    arbeitgeber
      ? textfeld(model, dispatch, "firma", "Firma", true, {
          autocomplete: "organization",
        })
      : "",
    textfeld(model, dispatch, "strasse", "Straße und Hausnummer", true, {
      autocomplete: "street-address",
    }),
    el(
      "div",
      { class: "reihe reihe--plz" },
      textfeld(model, dispatch, "plz", "PLZ", true, {
        inputmode: "numeric",
        maxlength: "5",
        autocomplete: "postal-code",
      }),
      textfeld(model, dispatch, "ort", "Ort", true, {
        autocomplete: "address-level2",
      }),
    ),
  );
}
