export type Seite = 1 | 2 | 3 | 4;

export type Formulardaten = {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;

  kurs: string;
  starttermin: string;
  format: "" | "präsenz" | "online";

  rechnungsenpfaenger: "" | "selbst" | "arbeitgeber";
  firma: string;
  strasse: string;
  hausnr: string;
  plz: string;
  ort: string;

  datenschutz: boolean;
};

export type TextFeld = Exclude<keyof Formulardaten, "datenschutz">;
export type Fehler = Partial<Record<keyof Formulardaten, string>>;

export type Model = {
  seite: Seite;
  hoechstSeite: Seite;
  daten: Formulardaten;
  fehler: Fehler;
  ladeFehler: string | null;
  abgeschickt: boolean;
};

export type Msg =
  | { typ: "FeldGeaendert"; feld: TextFeld; wert: string }
  | { typ: "DatenschutzGeaendert"; wert: boolean }
  | { typ: "Weiter" }
  | { typ: "Zurueck" }
  | { typ: "GeheZuSeite"; seite: Seite }
  | { typ: "DateiAusgewaehlt"; datei: File }
  | { typ: "DateiGeladen"; inhalt: string }
  | { typ: "SpeichernGeklickt" }
  | { typ: "Absenden" }
  | { typ: "NeueAnmeldung" }
  | { typ: "Rueckgaengig" };

export type Effekt =
  | { typ: "DateiHerunterladen"; dateiname: string; inhalt: string }
  | { typ: "DateiLesen"; datei: File };

export type UpdateErgebnis = { model: Model; effekte: Effekt[] };

export type Dispatch = (msg: Msg) => void;
