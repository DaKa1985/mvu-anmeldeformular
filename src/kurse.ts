// src/kurse.ts - fixe Kursliste. Kein teil des Models, ändert sich nie

export type Kurs = {
  id: string; // steht im Model unter daten.kurs
  name: string; // wird eingesetzt
  termine: string[]; // Starttermin als YYYY-mm-DD
};

export const KURSE: Kurs[] = [
  {
    id: "ts-grundlagen",
    name: "TypeScript Grundlagen",
    termine: ["2027-01-11", "2027-05-03"],
  },
  {
    id: "it-sicherheit",
    name: "IT-Sicherheit kompakt",
    termine: ["2027-01-18", "2027-04-12"],
  },
  {
    id: "cloud-einstieg",
    name: "Einstieg in die Cloud",
    termine: ["2027-02-01", "2027-05-10"],
  },
  {
    id: "agil-scrum",
    name: "Agiles Arbeiten im Scrum",
    termine: ["2027-02-15", "2027-06-07"],
  },
];

//Sucht einen Kurs anhand der ID
export function findeKurs(id: string): Kurs | undefined {
  return KURSE.find((kurs) => kurs.id === id);
}
