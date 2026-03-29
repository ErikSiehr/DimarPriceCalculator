import { jsPDF } from "jspdf"
import type { AnamneseState, DiagnosenGridEntry } from "./types"
import { colors } from "./theme"
import { 
  extendedAnamneseSteps, 
  getVievaQuestions, 
  getIasaQuestions,
  vievaQuestionOrder,
  iasaQuestionOrder,
  ExtendedFormQuestion
} from "./anamneseConfigExtended"

// Extract RGB values from hex colors
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const primaryColor = hexToRgb(colors.primary.DEFAULT)
const accentColor = hexToRgb(colors.accent.DEFAULT)
const vievaColor = { r: 76, g: 175, b: 80 } // Green for Vieva section
const iasaColor = { r: 33, g: 150, b: 243 } // Blue for IASA section

// Helper to get value from state as string
function getValueAsString(state: AnamneseState, key: string): string {
  const value = state[key as keyof AnamneseState]
  
  if (value === undefined || value === null || value === '') {
    return '-'
  }
  
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '-'
  }
  
  if (typeof value === 'object') {
    // Handle DiagnosenGrid
    const diagnosenGrid = value as { [key: string]: DiagnosenGridEntry }
    const entries = Object.entries(diagnosenGrid)
      .filter(([, v]) => v.aktuell || v.letzte3Jahre || v.letzte20Jahre)
      .map(([diagnosis, v]) => {
        const times = []
        if (v.aktuell) times.push('aktuell')
        if (v.letzte3Jahre) times.push('letzte 3 Jahre')
        if (v.letzte20Jahre) times.push('letzte 20 Jahre')
        return `${diagnosis} (${times.join(', ')})`
      })
    return entries.length > 0 ? entries.join('; ') : '-'
  }
  
  return String(value)
}

// ==========================================
// CUSTOMER PDF - All questions, no tags
// ==========================================
export function generateCustomerPDF(state: AnamneseState, maxHeartRate: number): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20
  const lineHeight = 7
  const sectionGap = 12
  const leftMargin = 20
  const rightMargin = pageWidth - 20
  
  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.text(title, leftMargin, yPos)
    yPos += lineHeight + 2
    doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
    doc.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 6
  }
  
  // Helper function to add data row
  const addDataRow = (label: string, value: string) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
    doc.text(label, leftMargin, yPos)
    
    // Handle long values with text wrapping
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.setFont("helvetica", "bold")
    const maxWidth = rightMargin - leftMargin - 75
    const lines = doc.splitTextToSize(value || "-", maxWidth)
    doc.text(lines, leftMargin + 75, yPos)
    yPos += lineHeight * Math.max(1, lines.length)
  }
  
  // Title
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text("Anamnese Formular", pageWidth / 2, yPos, { align: "center" })
  yPos += 10
  
  // Subtitle with date
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  const today = new Date().toLocaleDateString("de-DE")
  doc.text(`Erstellt am: ${today}`, pageWidth / 2, yPos, { align: "center" })
  yPos += sectionGap + 5
  
  // Patient name header
  doc.setFontSize(12)
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text(`Patient: ${state.vorname} ${state.nachname}`, pageWidth / 2, yPos, { align: "center" })
  yPos += sectionGap
  
  // Group questions by step for thematic sections
  for (const step of extendedAnamneseSteps) {
    if (step.questions.length === 0) continue // Skip overview step
    
    addSectionHeader(step.title)
    
    for (const question of step.questions) {
      // Skip gender-specific questions that don't apply
      if (question.showIf) {
        const fieldValue = state[question.showIf.field as keyof AnamneseState]
        if (Array.isArray(question.showIf.value)) {
          if (Array.isArray(fieldValue)) {
            if (!question.showIf.value.some(v => fieldValue.includes(v))) continue
          } else {
            if (!question.showIf.value.includes(fieldValue as string)) continue
          }
        } else {
          if (fieldValue !== question.showIf.value) continue
        }
      }
      
      const value = getValueAsString(state, question.id)
      if (value !== '-' || question.required) {
        addDataRow(question.label + ":", value)
      }
    }
    
    yPos += sectionGap / 2
  }
  
  // Add max heart rate
  addSectionHeader("Berechnete Werte")
  addDataRow("Max. Herzfrequenz:", `${maxHeartRate} bpm`)
  
  // Footer
  yPos += sectionGap
  if (yPos > 260) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(9)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  doc.text("Dieses Dokument wurde elektronisch erstellt und enthält vertrauliche Gesundheitsdaten.", leftMargin, yPos)
  yPos += lineHeight
  doc.text("Die Daten werden gemäß DSGVO verarbeitet und nur für die vereinbarte Zusammenarbeit genutzt.", leftMargin, yPos)
  
  return doc
}

// ==========================================
// THERAPIST PDF - Two sections: Vieva + IASA
// ==========================================
export function generateTherapistPDF(state: AnamneseState, maxHeartRate: number): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20
  const lineHeight = 7
  const sectionGap = 10
  const leftMargin = 20
  const rightMargin = pageWidth - 20
  
  // Helper function to add main section header (Vieva / IASA)
  const addMainSectionHeader = (title: string, color: { r: number, g: number, b: number }) => {
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    
    // Draw colored background box
    doc.setFillColor(color.r, color.g, color.b)
    doc.rect(leftMargin - 5, yPos - 5, rightMargin - leftMargin + 10, 15, 'F')
    
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text(title, pageWidth / 2, yPos + 5, { align: "center" })
    yPos += 18
  }
  
  // Helper function to add sub-section header
  const addSubSectionHeader = (title: string) => {
    if (yPos > 255) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.text(title, leftMargin, yPos)
    yPos += lineHeight + 1
    doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
    doc.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 4
  }
  
  // Helper function to add data row
  const addDataRow = (label: string, value: string) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
    doc.text(label, leftMargin, yPos)
    
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.setFont("helvetica", "bold")
    const maxWidth = rightMargin - leftMargin - 70
    const lines = doc.splitTextToSize(value || "-", maxWidth)
    doc.text(lines, leftMargin + 70, yPos)
    yPos += lineHeight * Math.max(1, lines.length)
  }
  
  // Title
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text("Therapeuten-Auswertung", pageWidth / 2, yPos, { align: "center" })
  yPos += 8
  
  // Subtitle
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  const today = new Date().toLocaleDateString("de-DE")
  doc.text(`Erstellt am: ${today}`, pageWidth / 2, yPos, { align: "center" })
  yPos += 6
  
  // Patient info
  doc.setFontSize(11)
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text(`Patient: ${state.vorname} ${state.nachname}`, pageWidth / 2, yPos, { align: "center" })
  yPos += 5
  doc.setFontSize(10)
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  doc.text(`Geburtsdatum: ${state.geburtsdatum} | Geschlecht: ${state.geschlecht}`, pageWidth / 2, yPos, { align: "center" })
  yPos += sectionGap + 5
  
  // ==========================================
  // SECTION 1: VIEVA
  // ==========================================
  addMainSectionHeader("VIEVA FORMULAR", vievaColor)
  
  // Group Vieva questions by category
  const vievaCategories: { [key: string]: ExtendedFormQuestion[] } = {}
  
  for (const id of vievaQuestionOrder) {
    for (const step of extendedAnamneseSteps) {
      const question = step.questions.find(q => q.id === id && (q.tag === 'vieva' || q.tag === 'beide'))
      if (question) {
        const category = step.title
        if (!vievaCategories[category]) {
          vievaCategories[category] = []
        }
        vievaCategories[category].push(question)
        break
      }
    }
  }
  
  for (const [category, questions] of Object.entries(vievaCategories)) {
    addSubSectionHeader(category)
    for (const question of questions) {
      // Skip if conditional and not applicable
      if (question.showIf) {
        const fieldValue = state[question.showIf.field as keyof AnamneseState]
        if (Array.isArray(question.showIf.value)) {
          if (!question.showIf.value.includes(fieldValue as string)) continue
        } else {
          if (fieldValue !== question.showIf.value) continue
        }
      }
      
      const value = getValueAsString(state, question.id)
      addDataRow(question.label + ":", value)
    }
    yPos += 3
  }
  
  // Add max heart rate to Vieva section
  addSubSectionHeader("Berechnete Werte")
  addDataRow("Max. Herzfrequenz:", `${maxHeartRate} bpm`)
  
  // New page for IASA section
  doc.addPage()
  yPos = 20
  
  // ==========================================
  // SECTION 2: IASA
  // ==========================================
  addMainSectionHeader("IASA FORMULAR", iasaColor)
  
  // Group IASA questions by category
  const iasaCategories: { [key: string]: ExtendedFormQuestion[] } = {}
  
  for (const id of iasaQuestionOrder) {
    for (const step of extendedAnamneseSteps) {
      const question = step.questions.find(q => q.id === id && (q.tag === 'iasa' || q.tag === 'beide'))
      if (question) {
        const category = step.title
        if (!iasaCategories[category]) {
          iasaCategories[category] = []
        }
        // Avoid duplicates in same category
        if (!iasaCategories[category].some(q => q.id === question.id)) {
          iasaCategories[category].push(question)
        }
        break
      }
    }
  }
  
  for (const [category, questions] of Object.entries(iasaCategories)) {
    addSubSectionHeader(category)
    for (const question of questions) {
      // Skip if conditional and not applicable
      if (question.showIf) {
        const fieldValue = state[question.showIf.field as keyof AnamneseState]
        if (Array.isArray(question.showIf.value)) {
          if (Array.isArray(fieldValue)) {
            if (!question.showIf.value.some(v => fieldValue.includes(v))) continue
          } else {
            if (!question.showIf.value.includes(fieldValue as string)) continue
          }
        } else {
          if (fieldValue !== question.showIf.value) continue
        }
      }
      
      const value = getValueAsString(state, question.id)
      addDataRow(question.label + ":", value)
    }
    yPos += 3
  }
  
  // Footer
  yPos += sectionGap
  if (yPos > 260) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(9)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  doc.text("VERTRAULICH - Nur für therapeutische Zwecke", leftMargin, yPos)
  yPos += lineHeight
  doc.text("Dieses Dokument enthält Vieva- und IASA-Daten des Patienten.", leftMargin, yPos)
  
  return doc
}

// ==========================================
// Legacy function - now generates Customer PDF
// ==========================================
export function generateAnamnePDF(state: AnamneseState, maxHeartRate: number): jsPDF {
  return generateCustomerPDF(state, maxHeartRate)
}

export function downloadAnamnePDF(state: AnamneseState, maxHeartRate: number): void {
  const doc = generateCustomerPDF(state, maxHeartRate)
  const filename = `Anamnese_${state.vorname}_${state.nachname}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

// Generate base64 for customer PDF (for customer download)
export function generateAnamnePDFBase64(state: AnamneseState, maxHeartRate: number): string {
  const doc = generateCustomerPDF(state, maxHeartRate)
  return doc.output('datauristring').split(',')[1]
}

// Generate base64 for therapist PDF (for email to therapist)
export function generateTherapistPDFBase64(state: AnamneseState, maxHeartRate: number): string {
  const doc = generateTherapistPDF(state, maxHeartRate)
  return doc.output('datauristring').split(',')[1]
}

// Download therapist PDF (for testing/manual download)
export function downloadTherapistPDF(state: AnamneseState, maxHeartRate: number): void {
  const doc = generateTherapistPDF(state, maxHeartRate)
  const filename = `Therapeuten_Auswertung_${state.vorname}_${state.nachname}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
