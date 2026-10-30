// src/historie.ts – Liste aller bisherigen Models. Reine Funktionen, keine Seiteneffekte.
import type { Model, Msg } from "./types";

export type Historie = {
  eintraege: Model[]; // der letzte Eintrag ist der aktuelle Zustand
  letzteMsg: Msg | null; // braucht man, um Tippen zusammenzufassen
};

export function neueHistorie(start: Model): Historie {
  return { eintraege: [start], letzteMsg: null };
}

export function aktuell(h: Historie): Model {
  return h.eintraege[h.eintraege.length - 1];
}

// Merkt sich das neue Model nach einer Msg.
export function merke(h: Historie, msg: Msg, neu: Model): Historie {
  // Hat update nichts geändert, gibt es keinen neuen Eintrag.
  if (neu === aktuell(h)) return { ...h, letzteMsg: msg };

  // Tippen im selben Feld wie eben: letzten Eintrag ersetzen statt anhängen.
  const weiterGetippt =
    msg.typ === "FeldGeaendert" &&
    h.letzteMsg?.typ === "FeldGeaendert" &&
    h.letzteMsg.feld === msg.feld;

  const bisher = weiterGetippt ? h.eintraege.slice(0, -1) : h.eintraege;
  return { eintraege: [...bisher, neu], letzteMsg: msg };
}

// Rückgängig: letzten Eintrag entfernen. Der Startzustand bleibt immer.
export function zurueck(h: Historie): Historie {
  if (h.eintraege.length <= 1) return h;
  return { eintraege: h.eintraege.slice(0, -1), letzteMsg: null };
}
