// src/view/fortschritt.ts – Anzeige 1 – 2 – 3 – 4
import type { Dispatch, Model, Seite } from "../types";
import { el } from "./dom";

const TITEL = ["Persönliche Daten", "Kurswahl", "Rechnung", "Zusammenfassung"]; // holt den Titel. Listen zählen ab 0, Seiten ab 1.
const SEITEN: Seite[] = [1, 2, 3, 4];

export function fortschritt(model: Model, dispatch: Dispatch): HTMLElement {
  const schritte = SEITEN.map((nr) => {
    // SEITEN.map ((nr) => …) macht aus jeder Seitennummer ein <li> -Element. Das Ergebnis ist eine Liste von vier Elementen.
    const aktuell = nr === model.seite;
    const besucht = nr <= model.hoechsteSeite;
    const klasse = aktuell
      ? "schritt schritt--aktuell"
      : besucht
        ? "schritt schritt--besucht"
        : "schritt";
    return el(
      "li",
      { class: klasse },
      el(
        "button",
        {
          type: "button",
          disabled: aktuell || !besucht, // nur besuchte, andere Seiten sind klickbar
          "aria-current": aktuell ? "step" : "false",
          click: () => dispatch({ typ: "GeheZuSeite", seite: nr }),
        },
        el("span", { class: "schritt-nr" }, String(nr)),
        el("span", { class: "schritt-titel" }, TITEL[nr - 1]),
      ),
    );
  });

  return el("ol", { class: "fortschritt" }, ...schritte);
}
