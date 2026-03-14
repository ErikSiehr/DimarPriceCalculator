import { jsPDF } from "jspdf"
import type { AnamneseState } from "./types"
import { colors } from "./theme"

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

export function generateAnamnePDF(state: AnamneseState, maxHeartRate: number): jsPDF {
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
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.setFont("helvetica", "bold")
    doc.text(value || "-", leftMargin + 70, yPos)
    yPos += lineHeight
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
  
  // Basisdaten
  addSectionHeader("Basisdaten")
  addDataRow("Name:", `${state.vorname} ${state.nachname}`)
  addDataRow("Geburtsdatum:", state.geburtsdatum)
  addDataRow("Geschlecht:", state.geschlecht)
  addDataRow("Körpergröße:", `${state.koerpergroesse} cm`)
  addDataRow("Gewicht:", `${state.gewicht} kg`)
  yPos += sectionGap
  
  // Kontaktdaten
  addSectionHeader("Kontaktdaten")
  if (state.strasse) addDataRow("Straße:", state.strasse)
  if (state.plzOrt) addDataRow("PLZ/Ort:", state.plzOrt)
  if (state.land) addDataRow("Land:", state.land)
  if (state.email) addDataRow("E-Mail:", state.email)
  addDataRow("Telefon:", state.telefon)
  yPos += sectionGap
  
  // Gesundheitsdaten Teil 1
  addSectionHeader("Gesundheitsdaten (Teil 1)")
  addDataRow("Rauchen:", state.rauchen)
  addDataRow("Hypertonie:", state.hypertonie)
  addDataRow("Schilddrüse:", state.schilddruese)
  addDataRow("Schlafstörungen:", state.schlafstoerungen)
  addDataRow("Diabetes:", state.diabetes)
  addDataRow("Sportliche Aktivität:", state.sportlicheAktivitaet)
  addDataRow("COPD:", state.copd)
  addDataRow("Antidepressiva:", state.antidepressiva)
  addDataRow("Alkohol:", state.alkohol)
  addDataRow("Schichtarbeit:", state.schichtarbeit)
  yPos += sectionGap
  
  // Gesundheitsdaten Teil 2
  addSectionHeader("Gesundheitsdaten (Teil 2)")
  addDataRow("Allergien:", state.allergien.length > 0 ? state.allergien.join(", ") : "-")
  if (state.ernaehrung.length > 0) addDataRow("Ernährung:", state.ernaehrung.join(", "))
  addDataRow("Krebstherapie:", state.krebstherapie)
  addDataRow("Immunsystem-Hinweis:", state.immunsystem)
  addDataRow("Depressionen:", state.depressionen)
  addDataRow("Gelenkschmerzen:", state.gelenkschmerzen)
  if (state.schmerzen) addDataRow("Schmerzen:", state.schmerzen)
  yPos += sectionGap
  
  // Lebensstil
  addSectionHeader("Lebensstil")
  addDataRow("Hautprobleme:", state.hautprobleme)
  addDataRow("Passivrauchen:", state.passivrauchen)
  addDataRow("Weniger als 1,5L Wasser/Tag:", state.wasserkonsum)
  addDataRow("Gesüßte Getränke:", state.gesuessteGetraenke)
  addDataRow("Erhöhter Zuckerkonsum:", state.zuckerkonsum)
  yPos += sectionGap
  
  // Körpermaße
  addSectionHeader("Körpermaße")
  addDataRow("Nackenumfang:", `${state.nackenumfang} cm`)
  addDataRow("Hüftumfang:", `${state.hueftumfang} cm`)
  addDataRow("Max. Herzfrequenz:", `${maxHeartRate} bpm`)
  if (state.blutgruppe) addDataRow("Blutgruppe:", state.blutgruppe)
  
  // Footer
  doc.addPage()
  yPos = 20
  doc.setFontSize(10)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  doc.text("Dieses Dokument wurde elektronisch erstellt und enthält vertrauliche Gesundheitsdaten.", leftMargin, yPos)
  yPos += lineHeight
  doc.text("Die Daten werden nur für die Dauer der Zusammenarbeit gespeichert.", leftMargin, yPos)
  
  return doc
}

export function downloadAnamnePDF(state: AnamneseState, maxHeartRate: number): void {
  const doc = generateAnamnePDF(state, maxHeartRate)
  const filename = `Anamnese_${state.vorname}_${state.nachname}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
