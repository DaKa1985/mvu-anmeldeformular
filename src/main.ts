// src/main.ts – die Runtime: verbindet Model, update, view und Historie.
// Gemeinsame Datei: Änderungen nur nach Absprache!
import "./style.css";
import { init } from "./init";
import { update } from "./update";
import { view } from "./view/view";
import { aktuell, merke, neueHistorie, zurueck } from "./historie";
import type { Effekt, Msg } from "./types";

const app = document.querySelector<HTMLDivElement>("#app")!;
let historie = neueHistorie(init());

// Jede Msg aus der View landet hier.
function dispatch(msg: Msg): void {
  let effekte: Effekt[] = [];

  if (msg.typ === "Rueckgaengig") {
    historie = zurueck(historie);
  } else {
    const ergebnis = update(aktuell(historie), msg);
    historie = merke(historie, msg, ergebnis.model);
    effekte = ergebnis.effekte;
  }

  zeichne();
  effekte.forEach(fuehreAus);
}

// Zeichnet die Oberfläche komplett neu aus dem aktuellen Model.
function zeichne(): void {
  // Fokus und Cursor merken, damit man beim Tippen im Feld bleibt
  const aktiv = document.activeElement;
  const fokusId = aktiv instanceof HTMLElement ? aktiv.id : "";
  const cursor =
    aktiv instanceof HTMLInputElement ? aktiv.selectionStart : null;

  app.replaceChildren(view(aktuell(historie), dispatch));

  if (fokusId) {
    const neu = document.getElementById(fokusId);
    neu?.focus();
    if (neu instanceof HTMLInputElement && cursor !== null) {
      try {
        neu.setSelectionRange(cursor, cursor);
      } catch {
        // bei Checkboxen und Optionsfeldern gibt es keinen Cursor
      }
    }
  }
}

// Führt Aufträge an die Außenwelt aus. Der einzige Ort mit Datei-Zugriff.
function fuehreAus(effekt: Effekt): void {
  switch (effekt.typ) {
    case "DateiHerunterladen": {
      // normaler Browser-Download über einen unsichtbaren Link
      const blob = new Blob([effekt.inhalt], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = effekt.dateiname;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); // Speicher wieder freigeben
      break;
    }

    case "DateiLesen":
      // Lesen dauert einen Moment. Das Ergebnis kommt als neue Msg zurück.
      effekt.datei
        .text()
        .then((inhalt) => dispatch({ typ: "DateiGeladen", inhalt }))
        .catch(() => dispatch({ typ: "DateiGeladen", inhalt: "" }));
      break;
  }
}

zeichne();
