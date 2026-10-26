// src/init.ts
import type { Formulardaten, Model } from "./types";

export function leereDaten(): Formulardaten {
  return {
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",

    kurs: "",
    starttermin: "",
    format: "",

    rechnungsempfaenger: "",
    firma: "",
    strasse: "",
    hausnr: "",
    plz: "",
    ort: "",

    datenschutz: false,
  };
}

export function init(): Model {
  return {
    seite: 1,
    hoechsteSeite: 1,
    daten: leereDaten(),
    fehler: {},
    ladeFehler: null,
    abgeschickt: false,
  };
}
