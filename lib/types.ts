// Anamnese Form Types - Extended for Vieva + IASA

export interface DiagnosenGridEntry {
  aktuell: boolean
  letzte3Jahre: boolean
  letzte20Jahre: boolean
}

export interface AnamneseState {
  // === Basisdaten (beide) ===
  vorname: string
  nachname: string
  geburtsdatum: string
  geschlecht: string
  koerpergroesse: string
  gewicht: string
  beruf: string // iasa
  
  // === Adresse & Kontakt ===
  strasse: string // vieva
  plzOrt: string // vieva
  land: string // vieva
  email: string // vieva
  telefon: string // beide
  telefonGeschaeftlich: string // iasa
  hfvEmpfehlung: string // iasa
  arztTherapeut: string // iasa
  
  // === Soziales Umfeld & Beruf (iasa) ===
  sozialesUmfeld: string
  beruflicheTaetigkeiten: string
  beschaeftigungsstatus: string
  pensionSeit: string
  toxischeStoffeKontakt: string
  toxischeStoffeWelche: string
  taetowierung: string
  schichtarbeit: string // vieva
  
  // === Arbeitsplatz (iasa) ===
  arbeitsplatzErleben: string[]
  bildschirmarbeit: string
  
  // === Bewegung & Sport ===
  sportlicheAktivitaet: string // beide
  sportart: string // iasa
  bewegung140Puls: string // iasa
  
  // === Schlaf ===
  schlafstoerungen: string // beide
  einschlafen: string // iasa
  durchschlafen: string // iasa
  schlafkomfort: string // iasa
  erholtNachSchlaf: string // iasa
  schlafstunden: string // iasa
  mittagsschlaf: string // iasa
  schlafmittel: string // iasa
  traeumen: string // iasa
  
  // === Ernährung ===
  ernaehrung: string[] // vieva
  vegetarierVeganer: string // iasa
  fleischFischMilch: string // iasa
  fruechtGemuese: string // iasa
  wasserkonsum: string // vieva
  trinkmengeLiter: string // beide
  urinfarbe: string // iasa
  alkohol: string // beide
  alkoholMenge: string // iasa
  gesuessteGetraenke: string // vieva
  zuckerkonsum: string // vieva
  
  // === Gesundheit ===
  rauchen: string // beide
  rauchenSeit: string // iasa
  zigarettenProTag: string // iasa
  andereRauchwaren: string // iasa
  drogenAufputschmittel: string // iasa
  passivrauchen: string // vieva
  hypertonie: string // beide
  schilddruese: string // beide
  diabetes: string // beide
  copd: string // vieva
  antidepressiva: string // beide
  krebstherapie: string // vieva
  immunsystem: string // vieva
  depressionen: string // beide
  gelenkschmerzen: string // vieva
  schmerzen: string // vieva
  hautprobleme: string // vieva
  
  // === Diagnosen (iasa) ===
  diagnosenGrid: { [key: string]: DiagnosenGridEntry }
  weitereDiagnosen: string
  
  // === Allergien ===
  allergien: string[] // beide
  allergienIasa: string[] // iasa
  weitereUnvertraeglichkeiten: string // iasa
  
  // === Körperliches Befinden (iasa) ===
  verdauung: string[]
  allgemeinesBefinden: string[]
  beineDurchblutung: string[]
  weiteresBefinden: string[]
  lokaleSchmerzenWo: string
  
  // === Wohnsituation (iasa) ===
  wohnsituation: string[]
  mobiltelefonNutzung: string
  umgebung200m: string[]
  
  // === Fragen an Frauen (iasa) ===
  zyklus: string
  blutverlust: string
  zyklusschmerzen: string
  zyklusKopfschmerzen: string
  stimmungsschwankungenFrau: string
  libidoproblemeFrau: string
  wechseljahre: string
  wechseljahrbeschwerden: string
  
  // === Fragen an Männer (iasa) ===
  harndrang: string
  harnstrahl: string
  wasserlassenTaeglich: string
  toiletteNachts: string
  libidoproblemeMann: string
  stimmungsschwankungenMann: string
  
  // === Medikamente (iasa) ===
  keineMedikamente: string
  medikamenteEinnahme: string[]
  weitereMedikamente: string
  covidImpfstatus: string
  covidNebenwirkungen: string
  
  // === Familiäre Erkrankungen (iasa) ===
  familiaereErkrankungen: string[]
  
  // === Säure-Basen & Zähne (iasa) ===
  phWert: string
  kraempfe: string
  kraempfeWo: string
  amalgamplomben: string
  amalgamEntfernt: string
  mutterAmalgam: string
  implantate: string
  implantateWelche: string
  
  // === Toxische Belastungen (iasa) ===
  toxischeBelastungen: string[]
  toxischeBelastungenWeitere: string
  
  // === Therapien & Vorsorge (iasa) ===
  therapien12Monate: string
  vorsorge5Jahre: string
  praeventionBisher: string
  bevorstehendeOperationen: string
  
  // Legacy fields (kept for compatibility)
  nackenumfang: string
  hueftumfang: string
  blutgruppe: string
}

export const initialAnamneseState: AnamneseState = {
  // Basisdaten
  vorname: "",
  nachname: "",
  geburtsdatum: "",
  geschlecht: "",
  koerpergroesse: "",
  gewicht: "",
  beruf: "",
  
  // Adresse & Kontakt
  strasse: "",
  plzOrt: "",
  land: "",
  email: "",
  telefon: "",
  telefonGeschaeftlich: "",
  hfvEmpfehlung: "",
  arztTherapeut: "",
  
  // Soziales Umfeld & Beruf
  sozialesUmfeld: "",
  beruflicheTaetigkeiten: "",
  beschaeftigungsstatus: "",
  pensionSeit: "",
  toxischeStoffeKontakt: "",
  toxischeStoffeWelche: "",
  taetowierung: "",
  schichtarbeit: "",
  
  // Arbeitsplatz
  arbeitsplatzErleben: [],
  bildschirmarbeit: "",
  
  // Bewegung & Sport
  sportlicheAktivitaet: "",
  sportart: "",
  bewegung140Puls: "",
  
  // Schlaf
  schlafstoerungen: "",
  einschlafen: "",
  durchschlafen: "",
  schlafkomfort: "",
  erholtNachSchlaf: "",
  schlafstunden: "",
  mittagsschlaf: "",
  schlafmittel: "",
  traeumen: "",
  
  // Ernährung
  ernaehrung: [],
  vegetarierVeganer: "",
  fleischFischMilch: "",
  fruechtGemuese: "",
  wasserkonsum: "",
  trinkmengeLiter: "",
  urinfarbe: "",
  alkohol: "",
  alkoholMenge: "",
  gesuessteGetraenke: "",
  zuckerkonsum: "",
  
  // Gesundheit
  rauchen: "",
  rauchenSeit: "",
  zigarettenProTag: "",
  andereRauchwaren: "",
  drogenAufputschmittel: "",
  passivrauchen: "",
  hypertonie: "",
  schilddruese: "",
  diabetes: "",
  copd: "",
  antidepressiva: "",
  krebstherapie: "",
  immunsystem: "",
  depressionen: "",
  gelenkschmerzen: "",
  schmerzen: "",
  hautprobleme: "",
  
  // Diagnosen
  diagnosenGrid: {},
  weitereDiagnosen: "",
  
  // Allergien
  allergien: [],
  allergienIasa: [],
  weitereUnvertraeglichkeiten: "",
  
  // Körperliches Befinden
  verdauung: [],
  allgemeinesBefinden: [],
  beineDurchblutung: [],
  weiteresBefinden: [],
  lokaleSchmerzenWo: "",
  
  // Wohnsituation
  wohnsituation: [],
  mobiltelefonNutzung: "",
  umgebung200m: [],
  
  // Fragen an Frauen
  zyklus: "",
  blutverlust: "",
  zyklusschmerzen: "",
  zyklusKopfschmerzen: "",
  stimmungsschwankungenFrau: "",
  libidoproblemeFrau: "",
  wechseljahre: "",
  wechseljahrbeschwerden: "",
  
  // Fragen an Männer
  harndrang: "",
  harnstrahl: "",
  wasserlassenTaeglich: "",
  toiletteNachts: "",
  libidoproblemeMann: "",
  stimmungsschwankungenMann: "",
  
  // Medikamente
  keineMedikamente: "",
  medikamenteEinnahme: [],
  weitereMedikamente: "",
  covidImpfstatus: "",
  covidNebenwirkungen: "",
  
  // Familiäre Erkrankungen
  familiaereErkrankungen: [],
  
  // Säure-Basen & Zähne
  phWert: "",
  kraempfe: "",
  kraempfeWo: "",
  amalgamplomben: "",
  amalgamEntfernt: "",
  mutterAmalgam: "",
  implantate: "",
  implantateWelche: "",
  
  // Toxische Belastungen
  toxischeBelastungen: [],
  toxischeBelastungenWeitere: "",
  
  // Therapien & Vorsorge
  therapien12Monate: "",
  vorsorge5Jahre: "",
  praeventionBisher: "",
  bevorstehendeOperationen: "",
  
  // Legacy fields
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
  { id: 2, label: "Soziales" },
  { id: 3, label: "Arbeitsplatz" },
  { id: 4, label: "Bewegung" },
  { id: 5, label: "Schlaf" },
  { id: 6, label: "Ernährung" },
  { id: 7, label: "Gesundheit" },
  { id: 8, label: "Diagnosen" },
  { id: 9, label: "Allergien" },
  { id: 10, label: "Befinden" },
  { id: 11, label: "Wohnen" },
  { id: 12, label: "Frauen" },
  { id: 13, label: "Männer" },
  { id: 14, label: "Medikamente" },
  { id: 15, label: "Familie" },
  { id: 16, label: "Körper" },
  { id: 17, label: "Toxisch" },
  { id: 18, label: "Therapie" },
  { id: 19, label: "Übersicht" },
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
