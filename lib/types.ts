// Anamnese Form Types

export interface AnamneseState {
  // Basisdaten
  vorname: string
  nachname: string
  geburtsdatum: string
  geschlecht: string
  koerpergroesse: string
  gewicht: string
  // Adresse & Kontakt
  strasse: string
  plzOrt: string
  land: string
  email: string
  telefon: string
  // Gesundheitsdaten Teil 1
  rauchen: string
  hypertonie: string
  schilddruese: string
  schlafstoerungen: string
  diabetes: string
  sportlicheAktivitaet: string
  copd: string
  antidepressiva: string
  alkohol: string
  schichtarbeit: string
  // Gesundheitsdaten Teil 2
  allergien: string[]
  ernaehrung: string[]
  krebstherapie: string
  immunsystem: string
  depressionen: string
  gelenkschmerzen: string
  schmerzen: string
  // Gesundheitsdaten Teil 3
  hautprobleme: string
  passivrauchen: string
  wasserkonsum: string
  gesuessteGetraenke: string
  zuckerkonsum: string
  // Körpermaße
  nackenumfang: string
  hueftumfang: string
  blutgruppe: string
}

export const initialAnamneseState: AnamneseState = {
  vorname: "",
  nachname: "",
  geburtsdatum: "",
  geschlecht: "",
  koerpergroesse: "",
  gewicht: "",
  strasse: "",
  plzOrt: "",
  land: "",
  email: "",
  telefon: "",
  rauchen: "",
  hypertonie: "",
  schilddruese: "",
  schlafstoerungen: "",
  diabetes: "",
  sportlicheAktivitaet: "",
  copd: "",
  antidepressiva: "",
  alkohol: "",
  schichtarbeit: "",
  allergien: [],
  ernaehrung: [],
  krebstherapie: "",
  immunsystem: "",
  depressionen: "",
  gelenkschmerzen: "",
  schmerzen: "",
  hautprobleme: "",
  passivrauchen: "",
  wasserkonsum: "",
  gesuessteGetraenke: "",
  zuckerkonsum: "",
  nackenumfang: "",
  hueftumfang: "",
  blutgruppe: "",
}

// Step configuration
export interface StepConfig {
  id: number
  label: string
  shortLabel?: string
}

export const formSteps: StepConfig[] = [
  { id: 0, label: "Basisdaten" },
  { id: 1, label: "Kontakt" },
  { id: 2, label: "Gesundheit 1" },
  { id: 3, label: "Gesundheit 2" },
  { id: 4, label: "Gesundheit 3" },
  { id: 5, label: "Körpermaße" },
  { id: 6, label: "Übersicht" },
]

// Form options
export const formOptions = {
  laender: ["Deutschland", "Österreich", "Schweiz", "Liechtenstein", "Luxemburg"],
  schilddrueseOptionen: ["Normal", "Überfunktion", "Unterfunktion"],
  sportOptionen: ["Kein Sport", "Gelegentlich (1-2x/Woche)", "Regelmäßig (3-4x/Woche)", "Intensiv (5+/Woche)"],
  alkoholOptionen: ["Kein Alkohol", "Gelegentlich", "Regelmäßig", "Täglich"],
  allergienOptionen: ["Keine", "Pollen", "Hausstaub", "Tierhaare", "Lebensmittel", "Medikamente", "Kontaktallergien", "Sonstige"],
  ernaehrungOptionen: ["Mischkost", "Vegetarisch", "Vegan", "Low-Carb", "Glutenfrei", "Laktosefrei", "Sonstige"],
  blutgruppenOptionen: ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-", "Unbekannt"],
}
