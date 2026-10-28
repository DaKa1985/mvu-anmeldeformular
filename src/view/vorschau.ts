// src/view/vorschau.ts – zeigt die View mit Beispiel-Models. Nur zum Entwickeln.
import "../style.css";
import { view } from "./view";
import * as beispiele from "./fixtures";
import type { Model, Msg } from "../types";

const app = document.querySelector<HTMLDivElement>("#app")!;
const auswahl = document.querySelector<HTMLSelectElement>("#beispiel")!;
const modelle: Record<string, Model> = { ...beispiele };

// Statt Davids update: jede Msg nur in der Konsole anzeigen
function dispatch(msg: Msg): void {
  console.log("Msg:", msg);
}

function zeige(): void {
  app.replaceChildren(view(modelle[auswahl.value], dispatch));
}

for (const name of Object.keys(modelle)) {
  auswahl.append(new Option(name, name));
}

auswahl.addEventListener("change", zeige);
zeige();
