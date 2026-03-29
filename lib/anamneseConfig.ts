// Configuration-driven form structure for Anamnese
// All step content, questions, options, and validation rules are defined here

import { colors } from './theme'

export interface FormQuestion {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'multiselect' | 'toggle' | 'togglegroup'
  placeholder?: string
  required?: boolean
  options?: string[]
  columns?: number
}

export interface StepDefinition {
  id: number
  label: string
  shortLabel?: string
  title: string
  description: string
  questions: FormQuestion[]
}

export interface ValidationRules {
  [stepId: number]: string[]
}

export const anamneseSteps: StepDefinition[] = [
  {
    id: 0,
    label: 'Basisdaten',
    title: 'Basisdaten',
    description: 'Bitte geben Sie Ihre persönlichen Daten ein',
    questions: [
      { id: 'vorname', label: 'Vorname', type: 'text', placeholder: 'Max', required: true, columns: 1 },
      { id: 'nachname', label: 'Nachname', type: 'text', placeholder: 'Mustermann', required: true, columns: 1 },
      { id: 'geburtsdatum', label: 'Geburtsdatum', type: 'date', required: true, columns: 1 },
      { id: 'geschlecht', label: 'Biologisches Geschlecht', type: 'togglegroup', options: ['Männlich', 'Weiblich'], required: true, columns: 1 },
      { id: 'koerpergroesse', label: 'Körpergröße (cm)', type: 'number', placeholder: '175', required: true, columns: 1 },
      { id: 'gewicht', label: 'Gewicht (kg)', type: 'number', placeholder: '75', required: true, columns: 1 },
    ],
  },
  {
    id: 1,
    label: 'Kontakt',
    title: 'Adresse & Kontakt',
    description: 'Ihre Kontaktdaten',
    questions: [
      { id: 'strasse', label: 'Straße und Hausnummer (optional)', type: 'text', placeholder: 'Musterstraße 123', columns: 1 },
      { id: 'plzOrt', label: 'PLZ und Ort (optional)', type: 'text', placeholder: '12345 Musterstadt', columns: 1 },
      { id: 'land', label: 'Land (optional)', type: 'select', options: ['Deutschland', 'Österreich', 'Schweiz', 'Liechtenstein', 'Luxemburg'], columns: 1 },
      { id: 'email', label: 'E-Mail (optional)', type: 'email', placeholder: 'max@beispiel.de', columns: 1 },
      { id: 'telefon', label: 'Telefon', type: 'tel', placeholder: '+49 123 4567890', required: true, columns: 1 },
    ],
  },
  {
    id: 2,
    label: 'Gesundheit 1',
    title: 'Gesundheitsdaten',
    description: 'Allgemeine Gesundheitsfragen (Teil 1)',
    questions: [
      { id: 'rauchen', label: 'Rauchen Sie?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'hypertonie', label: 'Leiden Sie unter Hypertonie/Bluthochdruck?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'schilddruese', label: 'Wie ist Ihre Schilddrüsenfunktion?', type: 'select', options: ['Normal', 'Überfunktion', 'Unterfunktion'], required: true },
      { id: 'schlafstoerungen', label: 'Haben Sie Schlafstörungen?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'diabetes', label: 'Leiden Sie unter Diabetes?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'sportlicheAktivitaet', label: 'Wie beschreiben Sie Ihre sportliche Aktivität?', type: 'select', options: ['Kein Sport', 'Gelegentlich (1-2x/Woche)', 'Regelmäßig (3-4x/Woche)', 'Intensiv (5+/Woche)'], required: true },
      { id: 'copd', label: 'Leiden Sie unter COPD?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'antidepressiva', label: 'Nehmen Sie Antidepressiva?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'alkohol', label: 'Alkoholkonsum', type: 'select', options: ['Kein Alkohol', 'Gelegentlich', 'Regelmäßig', 'Täglich'], required: true },
      { id: 'schichtarbeit', label: 'Arbeiten Sie in Schichtarbeit?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
    ],
  },
  {
    id: 3,
    label: 'Gesundheit 2',
    title: 'Gesundheitsdaten',
    description: 'Allgemeine Gesundheitsfragen (Teil 2)',
    questions: [
      { id: 'allergien', label: 'Welche Allergien haben Sie?', type: 'multiselect', options: ['Keine', 'Pollen', 'Hausstaub', 'Tierhaare', 'Lebensmittel', 'Medikamente', 'Kontaktallergien', 'Sonstige'], required: true },
      { id: 'ernaehrung', label: 'Haben Sie spezielle Ernährungsgewohnheiten? (optional)', type: 'multiselect', options: ['Mischkost', 'Vegetarisch', 'Vegan', 'Low-Carb', 'Glutenfrei', 'Laktosefrei', 'Sonstige'], required: false },
      { id: 'krebstherapie', label: 'Haben Sie jemals Krebstherapie erhalten?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'immunsystem', label: 'Haben Sie Probleme mit Ihrem Immunsystem?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'depressionen', label: 'Haben Sie Depression?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'gelenkschmerzen', label: 'Haben Sie Gelenkschmerzen?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'schmerzen', label: 'Haben Sie chronische Schmerzen? (optional)', type: 'text', placeholder: 'Beschreiben Sie die Art der Schmerzen...', required: false },
    ],
  },
  {
    id: 4,
    label: 'Gesundheit 3',
    title: 'Gesundheitsdaten',
    description: 'Allgemeine Gesundheitsfragen (Teil 3)',
    questions: [
      { id: 'hautprobleme', label: 'Haben Sie Hautprobleme?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'passivrauchen', label: 'Sind Sie Passivrauchen ausgesetzt?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'wasserkonsum', label: 'Trinken Sie weniger als 1,5L Wasser pro Tag?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'gesuessteGetraenke', label: 'Trinken Sie regelmäßig gesüßte Getränke?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
      { id: 'zuckerkonsum', label: 'Haben Sie einen erhöhten Zuckerkonsum?', type: 'toggle', options: ['Ja', 'Nein'], required: true },
    ],
  },
  {
    id: 5,
    label: 'Übersicht',
    title: 'Übersicht',
    description: 'Überprüfen Sie Ihre Eingaben',
    questions: [],
  },
]

// Validation rules - which fields are required for each step to be valid
export const anamneseValidationRules: ValidationRules = {
  0: ['vorname', 'nachname', 'geburtsdatum', 'geschlecht', 'koerpergroesse', 'gewicht'],
  1: ['telefon'],
  2: ['rauchen', 'hypertonie', 'schilddruese', 'schlafstoerungen', 'diabetes', 'sportlicheAktivitaet', 'copd', 'antidepressiva', 'alkohol', 'schichtarbeit'],
  3: ['allergien', 'krebstherapie', 'immunsystem', 'depressionen', 'gelenkschmerzen'],
  4: ['hautprobleme', 'passivrauchen', 'wasserkonsum', 'gesuessteGetraenke', 'zuckerkonsum'],
  5: [],
}
