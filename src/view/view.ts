// src/view/view.ts – die View: aus dem Model wird die Oberfläche
import type { Dispatch, Model } from "../types";
import { el } from "./dom";
import { fortschritt } from "./fortschritt";
import { seite1 } from "./seite1";

export function view(model: Model, dispatch: Dispatch): HTMLElement {
  return el(
    "main",
    { class: "formular" },
    kopf(),
    fortschritt(model, dispatch),
    inhalt(model, dispatch),
    navigation(model, dispatch),
  );
}

function kopf(): HTMLElement {
  return el(
    "header",
    { class: "kopf" },
    el(
      "p",
      { class: "marke" },
      "DigiLearn GmbH · Lernen. Verstehen. Anwenden.",
    ),
    el("h1", {}, "Anmeldung zur IT-Weiterbildung"),
  );
}

// wählt die passende Seite aus
function inhalt(model: Model, dispatch: Dispatch): HTMLElement {
  switch (model.seite) {
    case 1:
      return seite1(model, dispatch);
    default:
      return el("section", { class: "seite" }, `Seite ${model.seite} folgt.`);
  }
}

function navigation(model: Model, dispatch: Dispatch): HTMLElement {
  return el(
    "nav",
    { class: "navigation" },
    el(
      "button",
      {
        type: "button",
        class: "knopf",
        disabled: model.seite === 1,
        click: () => dispatch({ typ: "Zurueck" }),
      },
      "Zurück",
    ),
    el(
      "button",
      {
        type: "button",
        class: "knopf",
        click: () => dispatch({ typ: "Rueckgaengig" }),
      },
      "Rückgängig",
    ),
    model.seite < 4
      ? el(
          "button",
          {
            type: "button",
            class: "knopf knopf--primaer",
            click: () => dispatch({ typ: "Weiter" }),
          },
          "Weiter",
        )
      : el("span"), // Seite 4 bekommt eigene Schaltflächen
  );
}
