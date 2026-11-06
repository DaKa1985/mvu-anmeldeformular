// src/view/view.ts – die View: aus dem Model wird die Oberfläche
import type { Dispatch, Model } from "../types";
import { el } from "./dom";
import { fortschritt } from "./fortschritt";
import { seite1 } from "./seite1";
import { seite2 } from "./seite2";
import { seite3 } from "./seite3";
import { seite4 } from "./seite4";
import { bestaetigung } from "./bestaetigung";

export function view(model: Model, dispatch: Dispatch): HTMLElement {
  // Nach dem Absenden: nur Kopf und Bestätigung, keine Fortschrittsanzeige, keine Navigation
  if (model.abgeschickt) {
    return el(
      "main",
      { class: "formular" },
      kopf(),
      bestaetigung(model, dispatch),
    );
  }

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
    case 2:
      return seite2(model, dispatch);
    case 3:
      return seite3(model, dispatch);
    case 4:
      return seite4(model, dispatch);
    default:
      return el("section", { class: "seite" }, `Seite ${model.seite} folgt.`);
  }
}

function navigation(model: Model, dispatch: Dispatch): HTMLElement {
  return el(
    "nav",
    { class: "navigation" },
    // Zurück
    el(
      "button",
      {
        type: "button",
        id: "knopf-zurueck",
        class: "knopf",
        disabled: model.seite === 1,
        click: () => dispatch({ typ: "Zurueck" }),
      },
      "Zurück",
    ),

    //Rückgängig
    el(
      "button",
      {
        type: "button",
        id: "knopf-rueckgaengig",
        class: "knopf",
        click: () => dispatch({ typ: "Rueckgaengig" }),
      },
      "Rückgängig",
    ),
    // Weiter (nur auf Seite 1-3)
    model.seite < 4
      ? el(
          "button",
          {
            type: "button",
            id: "knopf-weiter",
            class: "knopf knopf--primaer",
            click: () => dispatch({ typ: "Weiter" }),
          },
          "Weiter",
        )
      : el("span"), // Seite 4 bekommt eigene Schaltflächen
  );
}
