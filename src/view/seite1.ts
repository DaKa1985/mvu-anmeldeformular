// src/view/seite1.ts – Persönliche Daten
import type { Dispatch, Model } from "../types";
import { el } from "./dom";
import { textfeld } from "./felder";

export function seite1(model: Model, dispatch: Dispatch): HTMLElement {
  return el(
    "section",
    { class: "seite" },
    el("h2", {}, "1. Persönliche Daten"),
    laden(model, dispatch),
    el(
      "div",
      { class: "reihe" },
      textfeld(model, dispatch, "vorname", "Vorname", true, {
        autocomplete: "given-name",
      }),
      textfeld(model, dispatch, "nachname", "Nachname", true, {
        autocomplete: "family-name",
      }),
    ),
    el(
      "div",
      { class: "reihe" },
      textfeld(model, dispatch, "email", "E-Mail", true, {
        inputmode: "email",
        autocomplete: "email",
      }),
      textfeld(model, dispatch, "telefon", "Telefon (optional)", false, {
        inputmode: "tel",
        autocomplete: "tel",
      }),
    ),
  );
}

// Schaltfläche "Gespeicherte Anmeldung laden" mit Fehlermeldung
function laden(model: Model, dispatch: Dispatch): HTMLElement {
  return el(
    "div",
    { class: "laden" },
    el("input", {
      id: "datei-laden",
      type: "file",
      accept: ".json,application/json",
      class: "versteckt",
      change: (ereignis) => {
        const datei = (ereignis.target as HTMLInputElement).files?.[0];
        if (datei) dispatch({ typ: "DateiAusgewaehlt", datei });
      },
    }),
    el(
      "label",
      { for: "datei-laden", class: "knopf" },
      "Gespeicherte Anmeldung laden",
    ),
    model.ladeFehler
      ? el("p", { class: "fehlertext", role: "alert" }, model.ladeFehler)
      : "",
  );
}
