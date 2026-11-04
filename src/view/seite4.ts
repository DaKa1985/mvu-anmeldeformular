// src/view/seite4.ts – Zusammenfassung, Datenschutz, Speichern, Absenden
import { findeKurs } from "../kurse";
import type { Dispatch, Model, Seite } from "../types";
import { el } from "./dom";
import { datumDeutsch } from "./felder";

export function seite4(model: Model, dispatch: Dispatch): HTMLElement {
  const d = model.daten;
  const kurs = findeKurs(d.kurs);
  const fehler = model.fehler.datenschutz;

  return el(
    "section",
    { class: "seite" },
    el("h2", {}, "4. Zusammenfassung"),
    el(
      "p",
      {},
      "Bitte prüfen Sie Ihre Angaben. Mit „Ändern“ gelangen Sie direkt zur passenden Seite.",
    ),

    gruppe(dispatch, 1, "Persönliche Daten", [
      ["Name", `${d.vorname} ${d.nachname}`],
      ["E-Mail", d.email],
      ["Telefon", d.telefon || "–"],
    ]),

    gruppe(dispatch, 2, "Kurswahl", [
      ["Kurs", kurs ? kurs.name : "–"],
      ["Starttermin", d.starttermin ? datumDeutsch(d.starttermin) : "–"],
      [
        "Format",
        d.format === "präsenz"
          ? "Präsenz in Lübeck"
          : d.format === "online"
            ? "Online"
            : "–",
      ],
    ]),

    gruppe(dispatch, 3, "Rechnung", [
      [
        "Empfänger",
        d.rechnungsempfaenger === "arbeitgeber"
          ? `Arbeitgeber: ${d.firma}`
          : "Ich selbst",
      ],
      ["Anschrift", `${d.strasse}, ${d.plz} ${d.ort}`],
    ]),
    // Datenschutz-Häkchen
    el(
      "div",
      { class: fehler ? "feld feld--fehler" : "feld" },
      el(
        "label",
        { class: "option" },
        el("input", {
          type: "checkbox",
          id: "datenschutz",
          checked: d.datenschutz,
          change: (ereignis) =>
            dispatch({
              typ: "DatenschutzGeaendert",
              wert: (ereignis.target as HTMLInputElement).checked,
            }),
        }),
        "Ich habe die Datenschutzhinweise gelesen und bin mit der Verarbeitung meiner Daten einverstanden. *",
      ),
      fehler ? el("p", { class: "fehlertext" }, fehler) : "",
    ),

    el(
      "div",
      { class: "aktionen" },
      el(
        "button",
        {
          type: "button",
          class: "knopf",
          click: () => dispatch({ typ: "SpeichernGeklickt" }),
        },
        "Als Datei speichern",
      ),
      el(
        "button",
        {
          type: "button",
          class: "knopf knopf--primaer",
          click: () => dispatch({ typ: "Absenden" }),
        },
        "Absenden",
      ),
    ),
  );
}

// Eine Gruppe der Zusammenfassung mit Überschrift, Ändern-Link und Zeilen
function gruppe(
  dispatch: Dispatch,
  seite: Seite,
  titel: string,
  zeilen: [string, string][],
): HTMLElement {
  return el(
    "div",
    { class: "zusammenfassung" },
    el(
      "div",
      { class: "zusammenfassung-kopf" },
      el("h3", {}, titel),
      el(
        "button",
        {
          type: "button",
          class: "link",
          click: () => dispatch({ typ: "GeheZuSeite", seite }),
        },
        "Ändern",
      ),
    ),
    el(
      "dl",
      {},
      ...zeilen.flatMap(([name, wert]) => [
        el("dt", {}, name),
        el("dd", {}, wert),
      ]),
    ),
  );
}
