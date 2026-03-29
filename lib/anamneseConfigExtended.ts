// Extended Configuration for Anamnese Form
// All questions tagged with: 'vieva' | 'iasa' | 'beide'
// This is the single source of truth for both forms and PDFs

export type QuestionTag = 'vieva' | 'iasa' | 'beide'

export interface ExtendedFormQuestion {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'multiselect' | 'toggle' | 'togglegroup' | 'checkbox-grid'
  placeholder?: string
  required?: boolean
  options?: string[]
  columns?: number
  tag: QuestionTag
  // Conditional visibility
  showIf?: { field: string; value: string | string[] }
  // For checkbox-grid type (diagnoses with timeframes)
  gridOptions?: string[]
  // Sub-questions (e.g., "Ja" with follow-up text field)
  subQuestion?: { type: string; placeholder?: string; showIf?: string }
}

export interface ExtendedStepDefinition {
  id: number
  label: string
  shortLabel?: string
  title: string
  description: string
  questions: ExtendedFormQuestion[]
}

// Order definitions for PDF generation
export const vievaQuestionOrder: string[] = [
  'vorname', 'nachname', 'geburtsdatum', 'geschlecht', 'koerpergroesse', 'gewicht',
  'strasse', 'plzOrt', 'land', 'email', 'telefon',
  'rauchen', 'hypertonie', 'schilddruese', 'schlafstoerungen', 'diabetes',
  'sportlicheAktivitaet', 'copd', 'antidepressiva', 'alkohol', 'schichtarbeit',
  'allergien', 'ernaehrung', 'krebstherapie', 'immunsystem', 'depressionen', 'gelenkschmerzen', 'schmerzen',
  'hautprobleme', 'passivrauchen', 'wasserkonsum', 'gesuessteGetraenke', 'zuckerkonsum'
]

export const iasaQuestionOrder: string[] = [
  // Persönliche Daten
  'vorname', 'nachname', 'geburtsdatum', 'geschlecht', 'koerpergroesse', 'gewicht',
  'beruf', 'telefonGeschaeftlich', 'hfvEmpfehlung', 'arztTherapeut',
  // Soziales Umfeld
  'sozialesUmfeld',
  // Beruf & Toxisches
  'beruflicheTaetigkeiten', 'beschaeftigungsstatus', 'pensionSeit',
  'toxischeStoffeKontakt', 'toxischeStoffeWelche', 'taetowierung',
  // Arbeitsplatz
  'arbeitsplatzErleben', 'bildschirmarbeit',
  // Bewegung
  'sportlicheAktivitaet', 'sportart', 'bewegung140Puls',
  // Schlaf
  'schlafstoerungen', 'einschlafen', 'durchschlafen', 'schlafkomfort',
  'erholtNachSchlaf', 'schlafstunden', 'mittagsschlaf', 'schlafmittel', 'traeumen',
  // Ernährung
  'ernaehrung', 'vegetarierVeganer', 'fleischFischMilch', 'fruechtGemuese',
  'wasserkonsum', 'trinkmengeLiter', 'urinfarbe', 'alkohol', 'alkoholMenge',
  // Diagnosen
  'diagnosenGrid', 'weitereDiagnosen',
  // Allergien
  'allergien', 'allergienIasa', 'weitereUnvertraeglichkeiten',
  // Körperliches Befinden
  'verdauung', 'allgemeinesBefinden', 'beineDurchblutung', 'weiteresBefinden', 'lokaleSchmerzenWo',
  // Wohnsituation
  'wohnsituation', 'mobiltelefonNutzung',
  'rauchen', 'rauchenSeit', 'zigarettenProTag', 'andereRauchwaren', 'drogenAufputschmittel',
  // Umgebung
  'umgebung200m',
  // Frauen-Fragen
  'zyklus', 'blutverlust', 'zyklusschmerzen', 'zyklusKopfschmerzen',
  'stimmungsschwankungenFrau', 'libidoproblemeFrau', 'wechseljahre', 'wechseljahrbeschwerden',
  // Männer-Fragen
  'harndrang', 'harnstrahl', 'wasserlassenTaeglich', 'toiletteNachts',
  'libidoproblemeMann', 'stimmungsschwankungenMann',
  // Medikamente
  'keineMedikamente', 'medikamenteEinnahme', 'weitereMedikamente',
  'covidImpfstatus', 'covidNebenwirkungen',
  // Familiäre Erkrankungen
  'familiaereErkrankungen',
  // Säure-Basen
  'phWert', 'kraempfe', 'kraempfeWo',
  // Zähne
  'amalgamplomben', 'amalgamEntfernt', 'mutterAmalgam', 'implantate', 'implantateWelche',
  // Toxische Belastungen
  'toxischeBelastungen', 'toxischeBelastungenWeitere',
  // Therapien
  'therapien12Monate', 'vorsorge5Jahre', 'praeventionBisher', 'bevorstehendeOperationen'
]

export const extendedAnamneseSteps: ExtendedStepDefinition[] = [
  {
    id: 0,
    label: 'Basisdaten',
    title: 'Persönliche Daten',
    description: 'Bitte geben Sie Ihre persönlichen Daten ein',
    questions: [
      { id: 'vorname', label: 'Vorname', type: 'text', placeholder: 'Max', required: true, columns: 1, tag: 'beide' },
      { id: 'nachname', label: 'Nachname', type: 'text', placeholder: 'Mustermann', required: true, columns: 1, tag: 'beide' },
      { id: 'geburtsdatum', label: 'Geburtsdatum', type: 'date', required: true, columns: 1, tag: 'beide' },
      { id: 'geschlecht', label: 'Biologisches Geschlecht', type: 'togglegroup', options: ['Männlich', 'Weiblich'], required: true, columns: 1, tag: 'beide' },
      { id: 'koerpergroesse', label: 'Körpergröße (cm)', type: 'number', placeholder: '175', required: true, columns: 1, tag: 'beide' },
      { id: 'gewicht', label: 'Gewicht (kg)', type: 'number', placeholder: '75', required: true, columns: 1, tag: 'beide' },
      { id: 'beruf', label: 'Beruf', type: 'text', placeholder: 'Ihr Beruf', required: false, columns: 1, tag: 'iasa' },
    ],
  },
  {
    id: 1,
    label: 'Kontakt',
    title: 'Adresse & Kontakt',
    description: 'Ihre Kontaktdaten',
    questions: [
      { id: 'strasse', label: 'Straße und Hausnummer (optional)', type: 'text', placeholder: 'Musterstraße 123', columns: 1, tag: 'vieva' },
      { id: 'plzOrt', label: 'PLZ und Ort (optional)', type: 'text', placeholder: '12345 Musterstadt', columns: 1, tag: 'vieva' },
      { id: 'land', label: 'Land (optional)', type: 'select', options: ['Deutschland', 'Österreich', 'Schweiz', 'Liechtenstein', 'Luxemburg'], columns: 1, tag: 'vieva' },
      { id: 'email', label: 'E-Mail (optional)', type: 'email', placeholder: 'max@beispiel.de', columns: 1, tag: 'vieva' },
      { id: 'telefon', label: 'Telefon', type: 'tel', placeholder: '+49 123 4567890', required: true, columns: 1, tag: 'beide' },
      { id: 'telefonGeschaeftlich', label: 'Telefon Geschäftlich (optional)', type: 'tel', placeholder: '+49 123 4567890', columns: 1, tag: 'iasa' },
      { id: 'hfvEmpfehlung', label: 'Wer hat Ihnen eine HFV-Messung empfohlen?', type: 'text', placeholder: '', columns: 1, tag: 'iasa' },
      { id: 'arztTherapeut', label: 'Ihr Arzt / Therapeut', type: 'text', placeholder: '', columns: 1, tag: 'iasa' },
    ],
  },
  {
    id: 2,
    label: 'Soziales',
    title: 'Soziales Umfeld & Beruf',
    description: 'Informationen zu Ihrem sozialen und beruflichen Umfeld',
    questions: [
      { id: 'sozialesUmfeld', label: 'Mein soziales Umfeld', type: 'select', options: ['Ich lebe allein', 'Ich lebe in einer Partnerschaft', 'Ich habe Familie/Kinder', 'Ich bin alleinerziehend'], required: false, columns: 1, tag: 'iasa' },
      { id: 'beruflicheTaetigkeiten', label: 'Berufliche Tätigkeiten in den letzten 20 Jahren', type: 'text', placeholder: 'Beschreiben Sie Ihre beruflichen Tätigkeiten...', columns: 1, tag: 'iasa' },
      { id: 'beschaeftigungsstatus', label: 'Beschäftigungsstatus', type: 'select', options: ['Ich bin angestellt', 'Ich bin selbständig erwerbend', 'Ich bin pensioniert'], required: false, columns: 1, tag: 'iasa' },
      { id: 'pensionSeit', label: 'Pensioniert seit (Jahr)', type: 'text', placeholder: 'z.B. 2020', columns: 1, tag: 'iasa', showIf: { field: 'beschaeftigungsstatus', value: 'Ich bin pensioniert' } },
      { id: 'toxischeStoffeKontakt', label: 'Ich bin schon mit toxischen (giftigen) Stoffen in Kontakt gekommen', type: 'toggle', options: ['Ja', 'Nein'], columns: 1, tag: 'iasa' },
      { id: 'toxischeStoffeWelche', label: 'Welche toxischen Stoffe?', type: 'text', placeholder: 'Beschreiben Sie...', columns: 1, tag: 'iasa', showIf: { field: 'toxischeStoffeKontakt', value: 'Ja' } },
      { id: 'taetowierung', label: 'Ich habe eine Tätowierung', type: 'toggle', options: ['Ja', 'Nein'], columns: 1, tag: 'iasa' },
      { id: 'schichtarbeit', label: 'Arbeiten Sie in Schichtarbeit?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
    ],
  },
  {
    id: 3,
    label: 'Arbeitsplatz',
    title: 'Arbeitsplatz & Belastung',
    description: 'Wie erleben Sie Ihren Arbeitsplatz?',
    questions: [
      { id: 'arbeitsplatzErleben', label: 'Wie erleben Sie Ihren Arbeitsplatz?', type: 'multiselect', options: ['bin zufrieden', 'bin unzufrieden', 'fühle mich überfordert', 'fühle mich gemobbt', 'arbeite körperlich', 'arbeite geistig', 'arbeite sitzend', 'arbeite stehend', 'arbeite im Freien', 'Stress am Arbeitsplatz'], tag: 'iasa' },
      { id: 'bildschirmarbeit', label: 'Ich arbeite am Bildschirm', type: 'select', options: ['bis 2 Stunden', 'bis 4 Stunden', 'mehr als 4 Stunden'], tag: 'iasa' },
    ],
  },
  {
    id: 4,
    label: 'Bewegung',
    title: 'Bewegung & Sport',
    description: 'Ihre sportlichen Aktivitäten',
    questions: [
      { id: 'sportlicheAktivitaet', label: 'Wie beschreiben Sie Ihre sportliche Aktivität?', type: 'select', options: ['Kein Sport', 'Gelegentlich (1-2x/Woche)', 'Regelmäßig (3-4x/Woche)', 'Intensiv (5+/Woche)'], required: true, tag: 'beide' },
      { id: 'sportart', label: 'Sportart', type: 'text', placeholder: 'z.B. Joggen, Schwimmen, Yoga...', tag: 'iasa' },
      { id: 'bewegung140Puls', label: 'Ich bewege mich täglich mehr als 5 Minuten mit über 140 Pulsschlägen pro Minute', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
    ],
  },
  {
    id: 5,
    label: 'Schlaf',
    title: 'Schlaf & Schlafqualität',
    description: 'Informationen zu Ihrem Schlafverhalten',
    questions: [
      { id: 'schlafstoerungen', label: 'Haben Sie Schlafstörungen?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'beide' },
      { id: 'einschlafen', label: 'Einschlafen', type: 'select', options: ['Ich kann gut einschlafen', 'Ich kann schlecht einschlafen'], tag: 'iasa' },
      { id: 'durchschlafen', label: 'Durchschlafen', type: 'select', options: ['Ich kann durchschlafen', 'Ich kann nicht durchschlafen'], tag: 'iasa' },
      { id: 'schlafkomfort', label: 'Schlafkomfort', type: 'select', options: ['Ich liege bequem', 'Ich liege eher unbequem'], tag: 'iasa' },
      { id: 'erholtNachSchlaf', label: 'Ich fühle mich nach dem Aufstehen erholt', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'schlafstunden', label: 'Ich schlafe ca. ___ Stunden in der Nacht', type: 'number', placeholder: '7', tag: 'iasa' },
      { id: 'mittagsschlaf', label: 'Ich mache, wenn möglich, einen Mittagsschlaf', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'schlafmittel', label: 'Schlafmittel nehme ich', type: 'select', options: ['nie', 'gelegentlich', 'regelmäßig'], tag: 'iasa' },
      { id: 'traeumen', label: 'Ich träume', type: 'select', options: ['oft', 'selten', 'nie'], tag: 'iasa' },
    ],
  },
  {
    id: 6,
    label: 'Ernährung',
    title: 'Ernährungsgewohnheiten',
    description: 'Ihre Ernährung und Trinkgewohnheiten',
    questions: [
      { id: 'ernaehrung', label: 'Haben Sie spezielle Ernährungsgewohnheiten?', type: 'multiselect', options: ['Mischkost', 'Vegetarisch', 'Vegan', 'Low-Carb', 'Glutenfrei', 'Laktosefrei', 'Sonstige'], tag: 'vieva' },
      { id: 'vegetarierVeganer', label: 'Ich bin', type: 'select', options: ['Vegetarier', 'Veganer', 'beides trifft nicht zu'], tag: 'iasa' },
      { id: 'fleischFischMilch', label: 'Fleisch, Fisch, Milchprodukte, Eier', type: 'select', options: ['täglich', '2-3 mal/Woche', 'selten', 'nie'], tag: 'iasa' },
      { id: 'fruechtGemuese', label: 'Früchte, Gemüse, Salat', type: 'select', options: ['täglich', '2-3 mal/Woche', 'selten', 'nie'], tag: 'iasa' },
      { id: 'wasserkonsum', label: 'Trinken Sie weniger als 1,5L Wasser pro Tag?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
      { id: 'trinkmengeLiter', label: 'Ich trinke täglich ___ Liter', type: 'number', placeholder: '2', tag: 'beide' },
      { id: 'urinfarbe', label: 'Mein Urin ist', type: 'select', options: ['dunkelgelb', 'hellgelb', 'farblos'], tag: 'iasa' },
      { id: 'alkohol', label: 'Alkoholkonsum', type: 'select', options: ['Kein Alkohol', 'Gelegentlich', 'Regelmäßig', 'Täglich'], required: true, tag: 'beide' },
      { id: 'alkoholMenge', label: 'Alkohol pro Tag (Wein = 0.2l/Glas, Bier 0.5l/Glas)', type: 'select', options: ['nie', '1-2 Gläser', '3-4 Gläser', 'mehr'], tag: 'iasa' },
      { id: 'gesuessteGetraenke', label: 'Trinken Sie regelmäßig gesüßte Getränke?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
      { id: 'zuckerkonsum', label: 'Haben Sie einen erhöhten Zuckerkonsum?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
    ],
  },
  {
    id: 7,
    label: 'Gesundheit',
    title: 'Gesundheitsdaten',
    description: 'Allgemeine Gesundheitsfragen',
    questions: [
      { id: 'rauchen', label: 'Rauchen Sie?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'beide' },
      { id: 'rauchenSeit', label: 'Seit wie vielen Jahren?', type: 'number', placeholder: '10', tag: 'iasa', showIf: { field: 'rauchen', value: 'Ja' } },
      { id: 'zigarettenProTag', label: 'Anzahl Zigaretten pro Tag', type: 'number', placeholder: '10', tag: 'iasa', showIf: { field: 'rauchen', value: 'Ja' } },
      { id: 'andereRauchwaren', label: 'Andere Rauchwaren', type: 'text', placeholder: 'z.B. E-Zigarette, Pfeife...', tag: 'iasa' },
      { id: 'drogenAufputschmittel', label: 'Andere Drogen / Aufputschmittel', type: 'text', placeholder: '', tag: 'iasa' },
      { id: 'passivrauchen', label: 'Sind Sie Passivrauchen ausgesetzt?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
      { id: 'hypertonie', label: 'Leiden Sie unter Hypertonie/Bluthochdruck?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'beide' },
      { id: 'schilddruese', label: 'Wie ist Ihre Schilddrüsenfunktion?', type: 'select', options: ['Normal', 'Überfunktion', 'Unterfunktion'], required: true, tag: 'beide' },
      { id: 'diabetes', label: 'Leiden Sie unter Diabetes?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'beide' },
      { id: 'copd', label: 'Leiden Sie unter COPD?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
      { id: 'antidepressiva', label: 'Nehmen Sie Antidepressiva?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'beide' },
      { id: 'krebstherapie', label: 'Haben Sie jemals Krebstherapie erhalten?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
      { id: 'immunsystem', label: 'Haben Sie Probleme mit Ihrem Immunsystem?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
      { id: 'depressionen', label: 'Haben Sie Depression?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'beide' },
      { id: 'gelenkschmerzen', label: 'Haben Sie Gelenkschmerzen?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
      { id: 'schmerzen', label: 'Haben Sie chronische Schmerzen?', type: 'text', placeholder: 'Beschreiben Sie die Art der Schmerzen...', tag: 'vieva' },
      { id: 'hautprobleme', label: 'Haben Sie Hautprobleme?', type: 'toggle', options: ['Ja', 'Nein'], required: true, tag: 'vieva' },
    ],
  },
  {
    id: 8,
    label: 'Diagnosen',
    title: 'Diagnosen & Krankheiten',
    description: 'Bitte geben Sie an, ob diese Diagnosen aktuell, in den letzten 3 Jahren oder in den letzten 20 Jahren zutreffen',
    questions: [
      { 
        id: 'diagnosenGrid', 
        label: 'Diagnosen', 
        type: 'checkbox-grid', 
        tag: 'iasa',
        gridOptions: ['aktuell', 'letzte 3 Jahre', 'letzte 20 Jahre'],
        options: [
          'Alzheimer/Demenz', 'Arteriosklerose', 'Arthrose', 'Asthma', 'Bluthochdruck',
          'Bronchitis', 'Brüchige Nägel', 'Burnout', 'Tagesmüdigkeit', 'Covid-19',
          'Darmerkrankungen', 'Depressionen', 'Diabetes Typ 1', 'Diabetes Typ 2',
          'Entzündungen', 'Epilepsie', 'Erkältungen', 'Fibromyalgie/CFS', 'Gastritis',
          'Haarausfall', 'Rheuma', 'Herpes (Simplex/Zoster)', 'Herzinfarkt',
          'Herzinsuffizienz', 'Herzarrhythmien', 'Hyperaktivität (ADHS)', 'Krebserkrankung',
          'Augenkrankheiten', 'Migräne', 'Mitochondriale Myopathie', 'Multiple Sklerose (MS)',
          'Neurodermitis', 'Niereninsuffizienz', 'Leberleiden', 'Osteoporose', 'Paradontitis',
          'Parkinson', 'Potenzprobleme', 'Psoriasis', 'Schilddrüsenunterfunktion',
          'Schilddrüsenüberfunktion', 'Tinnitus', 'Zöliakie'
        ]
      },
      { id: 'weitereDiagnosen', label: 'Weitere Diagnosen', type: 'text', placeholder: 'Weitere Diagnosen hier angeben...', tag: 'iasa' },
    ],
  },
  {
    id: 9,
    label: 'Allergien',
    title: 'Unverträglichkeiten & Allergien',
    description: 'Informationen zu Ihren Allergien und Unverträglichkeiten',
    questions: [
      { id: 'allergien', label: 'Welche Allergien haben Sie?', type: 'multiselect', options: ['Keine', 'Pollen', 'Hausstaub', 'Tierhaare', 'Lebensmittel', 'Medikamente', 'Kontaktallergien', 'Sonstige'], required: true, tag: 'beide' },
      { id: 'allergienIasa', label: 'Spezifische Unverträglichkeiten', type: 'multiselect', options: ['Blütenpollen', 'Tierhaare', 'Milchprodukte', 'Gluten', 'Früchte', 'Meeresfrüchte'], tag: 'iasa' },
      { id: 'weitereUnvertraeglichkeiten', label: 'Weitere Unverträglichkeiten', type: 'text', placeholder: 'Beschreiben Sie weitere Unverträglichkeiten...', tag: 'iasa' },
    ],
  },
  {
    id: 10,
    label: 'Befinden',
    title: 'Körperliches Befinden',
    description: 'Wie fühlen Sie sich körperlich und mental?',
    questions: [
      { id: 'verdauung', label: 'Verdauung', type: 'multiselect', options: ['leide unter Verstopfungen', 'habe oft Durchfall', 'habe oft Magensäure/Aufstossen'], tag: 'iasa' },
      { id: 'allgemeinesBefinden', label: 'Allgemeines Befinden', type: 'multiselect', options: ['fühle mich mental gestresst', 'bin oft traurig, niedergeschlagen', 'fühle mich öfter einsam', 'bin eher der ängstliche Typ', 'fühle mich körperlich gestresst'], tag: 'iasa' },
      { id: 'beineDurchblutung', label: 'Beine/Durchblutung', type: 'multiselect', options: ['habe oft schwere Beine', 'habe oft schmerzende Beine', 'habe oft unruhige Beine', 'habe oft kalte Hände und Füße'], tag: 'iasa' },
      { id: 'weiteresBefinden', label: 'Weiteres', type: 'multiselect', options: ['mein Herz stolpert manchmal', 'habe wandernde Schmerzen', 'Rückenschmerzen', 'Nervenschmerzen', 'habe lokal Schmerzen', 'ich schnarche', 'habe Atemaussetzer in der Nacht', 'habe ein gutes Gedächtnis', 'habe ein schlechtes Gedächtnis'], tag: 'iasa' },
      { id: 'lokaleSchmerzenWo', label: 'Wo haben Sie lokale Schmerzen?', type: 'text', placeholder: 'Beschreiben Sie...', tag: 'iasa', showIf: { field: 'weiteresBefinden', value: ['habe lokal Schmerzen'] } },
    ],
  },
  {
    id: 11,
    label: 'Wohnen',
    title: 'Wohnsituation & Umwelteinflüsse',
    description: 'Informationen zu Ihrer Wohnsituation',
    questions: [
      { id: 'wohnsituation', label: 'Wohnsituation', type: 'multiselect', options: ['Fußbodenheizung', 'Freistromschalter im Schlafraum', 'bin oft Lärm ausgesetzt', 'benutze ein drahtloses Telefon', 'habe elektrische Geräte im Schlafzimmer', 'benutze kabellose EDV-Geräte', 'habe WLAN in der Wohnung', 'habe WLAN am Arbeitsplatz'], tag: 'iasa' },
      { id: 'mobiltelefonNutzung', label: 'Ich benutze mein Mobiltelefon', type: 'select', options: ['1-5 mal täglich', 'bis 10 mal täglich', 'mehr als 10 mal täglich'], tag: 'iasa' },
      { id: 'umgebung200m', label: 'In meiner Umgebung (ca. 200 Meter)', type: 'multiselect', options: ['Mobilfunkantenne', 'Bahnlinie', 'Hochspannungsleitung', 'Flughafen', 'Trafostation', 'Militäreinrichtung'], tag: 'iasa' },
    ],
  },
  {
    id: 12,
    label: 'Frauen',
    title: 'Fragen an Frauen',
    description: 'Spezifische Fragen für Frauen',
    questions: [
      { id: 'zyklus', label: 'Mein Zyklus ist', type: 'select', options: ['regelmäßig', 'unregelmäßig'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
      { id: 'blutverlust', label: 'Mein Blutverlust ist', type: 'select', options: ['klein', 'normal', 'groß'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
      { id: 'zyklusschmerzen', label: 'Ich habe Zyklusschmerzen (PMS)', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
      { id: 'zyklusKopfschmerzen', label: 'Ich bekomme während dem Zyklus vermehrt Kopfschmerzen oder Migräne', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
      { id: 'stimmungsschwankungenFrau', label: 'Ich leide unter Stimmungsschwankungen', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
      { id: 'libidoproblemeFrau', label: 'Ich habe Libidoprobleme', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
      { id: 'wechseljahre', label: 'Ich bin in den Wechseljahren', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
      { id: 'wechseljahrbeschwerden', label: 'Ich habe Wechseljahrbeschwerden (Hitzewallungen etc.)', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Weiblich' } },
    ],
  },
  {
    id: 13,
    label: 'Männer',
    title: 'Fragen an Männer',
    description: 'Spezifische Fragen für Männer',
    questions: [
      { id: 'harndrang', label: 'Ich habe oft Harndrang', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Männlich' } },
      { id: 'harnstrahl', label: 'Mein Harnstrahl ist', type: 'select', options: ['normal', 'eher schwach'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Männlich' } },
      { id: 'wasserlassenTaeglich', label: 'Ich muss täglich mehr als 4 mal Wasser lassen', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Männlich' } },
      { id: 'toiletteNachts', label: 'Ich muss in der Nacht in der Regel mehr als 2 mal auf die Toilette', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Männlich' } },
      { id: 'libidoproblemeMann', label: 'Ich habe Libidoprobleme', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Männlich' } },
      { id: 'stimmungsschwankungenMann', label: 'Ich leide unter Stimmungsschwankungen', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa', showIf: { field: 'geschlecht', value: 'Männlich' } },
    ],
  },
  {
    id: 14,
    label: 'Medikamente',
    title: 'Medikamente',
    description: 'Informationen zu Ihren Medikamenten',
    questions: [
      { id: 'keineMedikamente', label: 'Ich nehme keine Medikamente ein', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'medikamenteEinnahme', label: 'Ich nehme folgende Medikamente', type: 'multiselect', options: ['Lipidsenker/Cholesterinsenker', 'Blutverdünner', 'Antidepressiva', 'Diabetes Medikamente (Tabletten)', 'Hormone', 'Ritalin', 'Diabetes Medikamente (Insulin)', 'Mittel zur Gewichtsreduktion', 'Parkinsonmittel', 'Blutdrucksenker', 'Rheuma-/Gichtmittel', 'Schmerzmittel', 'Betablocker', 'Psychopharmaka', 'Abführmittel'], tag: 'iasa', showIf: { field: 'keineMedikamente', value: 'Nein' } },
      { id: 'weitereMedikamente', label: 'Weitere Medikamente', type: 'text', placeholder: 'Weitere Medikamente hier angeben...', tag: 'iasa', showIf: { field: 'keineMedikamente', value: 'Nein' } },
      { id: 'covidImpfstatus', label: 'Covid-19 Impfstatus', type: 'select', options: ['nicht geimpft', 'geimpft'], tag: 'iasa' },
      { id: 'covidNebenwirkungen', label: 'Nebenwirkungen', type: 'text', placeholder: 'Beschreiben Sie eventuelle Nebenwirkungen...', tag: 'iasa', showIf: { field: 'covidImpfstatus', value: 'geimpft' } },
    ],
  },
  {
    id: 15,
    label: 'Familie',
    title: 'Familiäre Erkrankungen',
    description: 'Erkrankungen in Ihrer Familie (Großeltern, Eltern, Geschwister)',
    questions: [
      { id: 'familiaereErkrankungen', label: 'In meiner Familie sind folgende Erkrankungen bekannt', type: 'multiselect', options: ['Krebserkrankungen', 'Diabetes', 'Parkinson', 'Rheuma', 'Herz-Kreislauferkrankungen', 'Alzheimer', 'Depressionen', 'Hirnschlag', 'Demenz vor Alter 80', 'Demenz nach Alter 80', 'Andere psychische Erkrankungen', 'Hautkrankheiten', 'Hormonstörungen (Schilddrüse)', 'Augenkrankheiten'], tag: 'iasa' },
    ],
  },
  {
    id: 16,
    label: 'Körper',
    title: 'Säure-Basen & Zähne',
    description: 'Weitere körperliche Informationen',
    questions: [
      { id: 'phWert', label: 'Mein pH-Wert liegt bei ___ im Morgenurin', type: 'text', placeholder: 'z.B. 6.5', tag: 'iasa' },
      { id: 'kraempfe', label: 'Ich habe manchmal Krämpfe', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'kraempfeWo', label: 'Wo haben Sie Krämpfe?', type: 'text', placeholder: 'z.B. Waden, Füße...', tag: 'iasa', showIf: { field: 'kraempfe', value: 'Ja' } },
      { id: 'amalgamplomben', label: 'Ich habe Amalgamplomben im Mund', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'amalgamEntfernt', label: 'Amalgamplomben wurden entfernt', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'mutterAmalgam', label: 'Meine Mutter hat Amalgamplomben', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'implantate', label: 'Ich habe Implantate', type: 'toggle', options: ['Ja', 'Nein'], tag: 'iasa' },
      { id: 'implantateWelche', label: 'Welche Implantate?', type: 'text', placeholder: 'Beschreiben Sie...', tag: 'iasa', showIf: { field: 'implantate', value: 'Ja' } },
    ],
  },
  {
    id: 17,
    label: 'Toxisch',
    title: 'Mögliche toxische Belastungen',
    description: 'Potenzielle Belastungsquellen',
    questions: [
      { id: 'toxischeBelastungen', label: 'Mögliche toxische Belastungen', type: 'multiselect', options: ['Medikamente', 'Fotokopiergeräte'], tag: 'iasa' },
      { id: 'toxischeBelastungenWeitere', label: 'Weitere toxische Belastungen', type: 'text', placeholder: 'Beschreiben Sie weitere Belastungen...', tag: 'iasa' },
    ],
  },
  {
    id: 18,
    label: 'Therapie',
    title: 'Therapien & Vorsorge',
    description: 'Bisherige und geplante Behandlungen',
    questions: [
      { id: 'therapien12Monate', label: 'Durchgeführte oder empfohlene Therapien in den letzten 12 Monaten', type: 'text', placeholder: 'Beschreiben Sie...', tag: 'iasa' },
      { id: 'vorsorge5Jahre', label: 'Durchgeführte oder empfohlene Vorsorgeuntersuchungen in den letzten 5 Jahren', type: 'text', placeholder: 'Beschreiben Sie...', tag: 'iasa' },
      { id: 'praeventionBisher', label: 'Präventions-/Vorsorgemaßnahmen bisher', type: 'text', placeholder: 'Beschreiben Sie...', tag: 'iasa' },
      { id: 'bevorstehendeOperationen', label: 'Bevorstehende Operationen / Wann?', type: 'text', placeholder: 'Beschreiben Sie...', tag: 'iasa' },
    ],
  },
  {
    id: 19,
    label: 'Übersicht',
    title: 'Übersicht',
    description: 'Überprüfen Sie Ihre Eingaben',
    questions: [],
  },
]

// Validation rules for extended form
export const extendedValidationRules: { [stepId: number]: string[] } = {
  0: ['vorname', 'nachname', 'geburtsdatum', 'geschlecht', 'koerpergroesse', 'gewicht'],
  1: ['telefon'],
  2: ['schichtarbeit'],
  3: [],
  4: ['sportlicheAktivitaet'],
  5: ['schlafstoerungen'],
  6: ['wasserkonsum', 'alkohol', 'gesuessteGetraenke', 'zuckerkonsum'],
  7: ['rauchen', 'hypertonie', 'schilddruese', 'diabetes', 'antidepressiva', 'krebstherapie', 'immunsystem', 'depressionen', 'gelenkschmerzen', 'hautprobleme', 'passivrauchen', 'copd'],
  8: [],
  9: ['allergien'],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: [],
  19: [],
}

// Helper function to get all questions with a specific tag
export function getQuestionsByTag(tag: QuestionTag | 'beide'): ExtendedFormQuestion[] {
  const questions: ExtendedFormQuestion[] = []
  for (const step of extendedAnamneseSteps) {
    for (const q of step.questions) {
      if (q.tag === tag || q.tag === 'beide') {
        questions.push(q)
      }
    }
  }
  return questions
}

// Get all questions for Vieva PDF (vieva + beide)
export function getVievaQuestions(): ExtendedFormQuestion[] {
  const questions: ExtendedFormQuestion[] = []
  for (const id of vievaQuestionOrder) {
    for (const step of extendedAnamneseSteps) {
      const q = step.questions.find(q => q.id === id)
      if (q && (q.tag === 'vieva' || q.tag === 'beide')) {
        questions.push(q)
        break
      }
    }
  }
  return questions
}

// Get all questions for IASA PDF (iasa + beide)
export function getIasaQuestions(): ExtendedFormQuestion[] {
  const questions: ExtendedFormQuestion[] = []
  for (const id of iasaQuestionOrder) {
    for (const step of extendedAnamneseSteps) {
      const q = step.questions.find(q => q.id === id)
      if (q && (q.tag === 'iasa' || q.tag === 'beide')) {
        questions.push(q)
        break
      }
    }
  }
  return questions
}

// Get all unique questions for customer form/PDF (no duplicates)
export function getAllUniqueQuestions(): ExtendedFormQuestion[] {
  const questions: ExtendedFormQuestion[] = []
  const seenIds = new Set<string>()
  
  for (const step of extendedAnamneseSteps) {
    for (const q of step.questions) {
      if (!seenIds.has(q.id)) {
        questions.push(q)
        seenIds.add(q.id)
      }
    }
  }
  return questions
}
