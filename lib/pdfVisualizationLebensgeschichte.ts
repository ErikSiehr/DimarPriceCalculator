import { jsPDF } from 'jspdf'
import { lebensgeschichteCategories, ageRanges, LebensgeschichteState, calculateAge, TimelineEntry } from '@/lib/lebensgeschichteConfig'

// Category colors for the visualization (matching the image style)
const categoryColors: Record<string, { r: number; g: number; b: number }> = {
  wohnorte: { r: 144, g: 238, b: 144 },       // Light green
  gesundheit: { r: 221, g: 160, b: 221 },     // Plum/pink
  familiengesundheit: { r: 255, g: 179, b: 128 }, // Light orange
  arbeit: { r: 135, g: 206, b: 250 },         // Light sky blue
  beziehungen: { r: 153, g: 50, b: 204 },     // Purple
  ereignisse: { r: 34, g: 139, b: 34 },       // Forest green
}

export function downloadVisualizationPDF(state: LebensgeschichteState) {
  // Use landscape orientation for wide matrix
  const doc = new jsPDF('landscape')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  // Brand colors
  const primaryColor = { r: 58, g: 52, b: 41 }
  const accentColor = { r: 168, g: 148, b: 84 }
  const gridColor = { r: 200, g: 200, b: 200 }
  
  // Calculate user's age to filter visible columns
  const currentAge = calculateAge(state.personalInfo.geburtsdatum)
  const filteredAgeRanges = currentAge > 0 
    ? ageRanges.filter(range => range.start <= currentAge)
    : ageRanges
  
  // Layout constants
  const leftMargin = 45
  const topMargin = 35
  const cellWidth = (pageWidth - leftMargin - 10) / filteredAgeRanges.length
  const cellHeight = 12
  const categoryLabelWidth = 40
  const headerHeight = 15
  
  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text('Lebensgeschichte - Übersicht', pageWidth / 2, 15, { align: 'center' })
  
  // Personal info subtitle
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  const subtitle = `${state.personalInfo.vorname} ${state.personalInfo.nachname} | Alter: ${currentAge} Jahre`
  doc.text(subtitle, pageWidth / 2, 22, { align: 'center' })
  
  // Draw age range headers
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  
  filteredAgeRanges.forEach((ageRange, index) => {
    const x = leftMargin + (index * cellWidth)
    doc.text(ageRange.label, x + cellWidth / 2, topMargin - 3, { align: 'center' })
  })
  
  // Build a map of entries for quick lookup
  const entryMap = new Map<string, Set<string>>()
  
  lebensgeschichteCategories.forEach(category => {
    const categoryKey = category.id as keyof Omit<LebensgeschichteState, 'personalInfo'>
    const entries = state[categoryKey] as TimelineEntry[]
    const filledAgeRanges = new Set(entries.map(e => e.ageRangeId))
    entryMap.set(category.id, filledAgeRanges)
  })
  
  // Draw the grid
  let yPos = topMargin
  
  lebensgeschichteCategories.forEach((category, categoryIndex) => {
    const filledRanges = entryMap.get(category.id) || new Set()
    const color = categoryColors[category.id] || { r: 200, g: 200, b: 200 }
    
    // Draw category label
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    
    // Split long labels into two lines
    const labelParts = category.label.split(' ')
    if (labelParts.length > 1 && category.label.length > 12) {
      const midPoint = Math.ceil(labelParts.length / 2)
      const line1 = labelParts.slice(0, midPoint).join(' ')
      const line2 = labelParts.slice(midPoint).join(' ')
      doc.text(line1, leftMargin - 5, yPos + cellHeight / 2 - 1, { align: 'right' })
      doc.text(line2, leftMargin - 5, yPos + cellHeight / 2 + 4, { align: 'right' })
    } else {
      doc.text(category.label, leftMargin - 5, yPos + cellHeight / 2 + 2, { align: 'right' })
    }
    
    // Draw cells for each age range
    filteredAgeRanges.forEach((ageRange, colIndex) => {
      const x = leftMargin + (colIndex * cellWidth)
      const hasEntry = filledRanges.has(ageRange.id)
      
      // Fill cell if there's an entry
      if (hasEntry) {
        doc.setFillColor(color.r, color.g, color.b)
        doc.rect(x, yPos, cellWidth, cellHeight, 'F')
      }
      
      // Draw cell border
      doc.setDrawColor(gridColor.r, gridColor.g, gridColor.b)
      doc.setLineWidth(0.3)
      doc.rect(x, yPos, cellWidth, cellHeight, 'S')
    })
    
    yPos += cellHeight + 5 // Add spacing between categories
  })
  
  // Add legend at the bottom
  yPos += 10
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text('Legende:', leftMargin, yPos)
  yPos += 8
  
  const legendItemWidth = 45
  let legendX = leftMargin
  
  lebensgeschichteCategories.forEach((category, index) => {
    const color = categoryColors[category.id]
    
    // Draw colored box
    doc.setFillColor(color.r, color.g, color.b)
    doc.rect(legendX, yPos - 4, 8, 5, 'F')
    doc.setDrawColor(gridColor.r, gridColor.g, gridColor.b)
    doc.rect(legendX, yPos - 4, 8, 5, 'S')
    
    // Draw label
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    
    // Shorten labels for legend
    const shortLabels: Record<string, string> = {
      wohnorte: 'Wohnorte',
      gesundheit: 'Gesundheit',
      familiengesundheit: 'Fam. Gesundh.',
      arbeit: 'Arbeit',
      beziehungen: 'Beziehungen',
      ereignisse: 'Ereignisse',
    }
    
    doc.text(shortLabels[category.id] || category.label, legendX + 10, yPos, { align: 'left' })
    
    legendX += legendItemWidth
    
    // Wrap to next line if needed
    if (legendX > pageWidth - 60) {
      legendX = leftMargin
      yPos += 10
    }
  })
  
  // Footer with date
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  const today = new Date().toLocaleDateString('de-DE')
  doc.text(`Erstellt am: ${today}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
  
  // Download
  const fileName = `Lebensgeschichte_Visualisierung_${state.personalInfo.vorname}_${state.personalInfo.nachname}_${today.replace(/\./g, '-')}.pdf`
  doc.save(fileName)
}
