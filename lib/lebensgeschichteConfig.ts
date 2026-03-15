// Configuration for Lebensgeschichte (Life History) form with interactive timeline

import { colors } from './theme'

export interface TimelineCategory {
  id: string
  label: string
  description: string
  color: string
  icon?: string
}

export interface AgeRange {
  id: string
  label: string
  start: number
  end: number
}

export const lebensgeschichteCategories: TimelineCategory[] = [
  {
    id: 'wohnorte',
    label: 'Meine Wohnorte',
    description: 'Wo haben Sie gelebt?',
    color: '#3A3429',
  },
  {
    id: 'gesundheit',
    label: 'Meine Gesundheit',
    description: 'Wie war Ihre Gesundheit?',
    color: '#A89454',
  },
  {
    id: 'familiengesundheit',
    label: 'Gesundheit meiner Familie',
    description: 'Gesundheitliche Aspekte der Familie',
    color: '#C4B070',
  },
  {
    id: 'arbeit',
    label: 'Meine Ausbildung & Arbeit',
    description: 'Ihre berufliche Entwicklung',
    color: '#8A7A44',
  },
  {
    id: 'beziehungen',
    label: 'Freunde & Beziehungen',
    description: 'Soziale Beziehungen und Verbindungen',
    color: '#5A5449',
  },
  {
    id: 'ereignisse',
    label: 'Ereignisse',
    description: 'Wichtige Lebensereignisse (Geburten, Todesfälle, Heirat, Trennung, Reisen)',
    color: '#2A2419',
  },
]

export const ageRanges: AgeRange[] = [
  { id: 'age-0-3', label: '0–3', start: 0, end: 3 },
  { id: 'age-4-6', label: '4–6', start: 4, end: 6 },
  { id: 'age-7-9', label: '7–9', start: 7, end: 9 },
  { id: 'age-10-12', label: '10–12', start: 10, end: 12 },
  { id: 'age-13-15', label: '13–15', start: 13, end: 15 },
  { id: 'age-16-18', label: '16–18', start: 16, end: 18 },
  { id: 'age-19-21', label: '19–21', start: 19, end: 21 },
  { id: 'age-22-24', label: '22–24', start: 22, end: 24 },
  { id: 'age-25-27', label: '25–27', start: 25, end: 27 },
  { id: 'age-28-30', label: '28–30', start: 28, end: 30 },
  { id: 'age-31-33', label: '31–33', start: 31, end: 33 },
  { id: 'age-34-36', label: '34–36', start: 34, end: 36 },
  { id: 'age-37-39', label: '37–39', start: 37, end: 39 },
  { id: 'age-40-42', label: '40–42', start: 40, end: 42 },
  { id: 'age-43-45', label: '43–45', start: 43, end: 45 },
  { id: 'age-46-48', label: '46–48', start: 46, end: 48 },
  { id: 'age-49-51', label: '49–51', start: 49, end: 51 },
  { id: 'age-52-54', label: '52–54', start: 52, end: 54 },
  { id: 'age-55-57', label: '55–57', start: 55, end: 57 },
  { id: 'age-58-60', label: '58–60', start: 58, end: 60 },
  { id: 'age-61-63', label: '61–63', start: 61, end: 63 },
  { id: 'age-64-66', label: '64–66', start: 64, end: 66 },
  { id: 'age-67-69', label: '67–69', start: 67, end: 69 },
  { id: 'age-70-72', label: '70–72', start: 70, end: 72 },
]

// Lebensgeschichte form structure - 6 steps, one per category
export const lebensgeschichteSteps = [
  { id: 0, label: 'Wohnorte', categoryId: 'wohnorte', title: 'Meine Wohnorte' },
  { id: 1, label: 'Meine Gesundheit', categoryId: 'gesundheit', title: 'Meine Gesundheit' },
  { id: 2, label: 'Familiengesundheit', categoryId: 'familiengesundheit', title: 'Gesundheit meiner Familie' },
  { id: 3, label: 'Arbeit & Ausbildung', categoryId: 'arbeit', title: 'Meine Ausbildung & Arbeit' },
  { id: 4, label: 'Beziehungen', categoryId: 'beziehungen', title: 'Freunde & Beziehungen' },
  { id: 5, label: 'Ereignisse', categoryId: 'ereignisse', title: 'Ereignisse' },
  { id: 6, label: 'Übersicht', categoryId: 'overview', title: 'Übersicht' },
]

// Type for storing timeline data
export interface TimelineEntry {
  ageRangeId: string
  text: string
}

export interface LebensgeschichteState {
  wohnorte: TimelineEntry[]
  gesundheit: TimelineEntry[]
  familiengesundheit: TimelineEntry[]
  arbeit: TimelineEntry[]
  beziehungen: TimelineEntry[]
  ereignisse: TimelineEntry[]
}

export const initialLebensgeschichteState: LebensgeschichteState = {
  wohnorte: [],
  gesundheit: [],
  familiengesundheit: [],
  arbeit: [],
  beziehungen: [],
  ereignisse: [],
}

// Helper to get category by ID
export function getCategoryById(id: string) {
  return lebensgeschichteCategories.find(cat => cat.id === id)
}

// Helper to get age range display
export function getAgeRangeLabel(id: string) {
  return ageRanges.find(ar => ar.id === id)?.label
}

// Helper to get filled age ranges for a category
export function getFilledAgeRanges(entries: TimelineEntry[]): string[] {
  return entries.map(e => e.ageRangeId)
}
