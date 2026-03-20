import { jsPDF } from 'jspdf'
import { lebensgeschichteCategories, ageRanges, LebensgeschichteState, calculateAge, TimelineEntry } from '@/lib/lebensgeschichteConfig'

export function downloadLebensgeschichtePDF(state: LebensgeschichteState) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20
  const lineHeight = 7
  const sectionGap = 12
  const leftMargin = 20
  const rightMargin = pageWidth - 20

  // Brand colors
  const primaryColor = { r: 58, g: 52, b: 41 }
  const accentColor = { r: 168, g: 148, b: 84 }

  // Helper functions
  const addSectionHeader = (title: string) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.text(title, leftMargin, yPos)
    yPos += lineHeight + 2
    doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
    doc.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 6
  }

  const addAgeRangeSection = (ageRangeLabel: string, entries: { category: string; text: string; color: string }[]) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.text(`Alter: ${ageRangeLabel}`, leftMargin, yPos)
    yPos += lineHeight + 2

    if (entries.length === 0) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(168, 148, 84)
      doc.text('Keine Einträge', leftMargin + 5, yPos)
      yPos += lineHeight
    } else {
      entries.forEach((entry) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
        doc.text(`${entry.category}:`, leftMargin + 5, yPos)
        yPos += lineHeight

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
        const wrappedText = doc.splitTextToSize(entry.text, rightMargin - leftMargin - 10)
        doc.text(wrappedText, leftMargin + 10, yPos)
        yPos += wrappedText.length * lineHeight + 2
      })
    }
    yPos += sectionGap
  }

  // Title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text('Meine Lebensgeschichte', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  // Subtitle with date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  const today = new Date().toLocaleDateString('de-DE')
  doc.text(`Erstellt am: ${today}`, pageWidth / 2, yPos, { align: 'center' })
  yPos += sectionGap + 5

  // Personal Info Section
  addSectionHeader('Persönliche Daten')
  const { personalInfo } = state
  const age = calculateAge(personalInfo.geburtsdatum)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  
  doc.text(`Name: ${personalInfo.vorname} ${personalInfo.nachname}`, leftMargin, yPos)
  yPos += lineHeight
  doc.text(`Geburtsdatum: ${personalInfo.geburtsdatum}`, leftMargin, yPos)
  yPos += lineHeight
  doc.text(`Alter: ${age} Jahre`, leftMargin, yPos)
  yPos += lineHeight
  doc.text(`Geschlecht: ${personalInfo.geschlecht}`, leftMargin, yPos)
  yPos += sectionGap + 5

  // Timeline Section Header
  addSectionHeader('Lebensgeschichte nach Jahren')

  // Collect all entries grouped by age range
  const entriesByAgeRange: Map<string, { category: string; text: string; color: string }[]> = new Map()
  
  // Initialize all age ranges
  ageRanges.forEach(ar => {
    entriesByAgeRange.set(ar.id, [])
  })

  // Collect entries from all categories
  lebensgeschichteCategories.forEach(category => {
    const categoryKey = category.id as keyof Omit<LebensgeschichteState, 'personalInfo'>
    const categoryEntries = state[categoryKey] as TimelineEntry[]
    
    if (categoryEntries && categoryEntries.length > 0) {
      categoryEntries.forEach(entry => {
        const existing = entriesByAgeRange.get(entry.ageRangeId) || []
        existing.push({
          category: category.label,
          text: entry.text,
          color: category.color
        })
        entriesByAgeRange.set(entry.ageRangeId, existing)
      })
    }
  })

  // Output entries sorted by age range (chronologically)
  ageRanges.forEach(ageRange => {
    const entries = entriesByAgeRange.get(ageRange.id) || []
    // Only show age ranges that have entries
    if (entries.length > 0) {
      addAgeRangeSection(ageRange.label, entries)
    }
  })

  // Check if there are any entries at all
  const hasAnyEntries = Array.from(entriesByAgeRange.values()).some(entries => entries.length > 0)
  if (!hasAnyEntries) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(168, 148, 84)
    doc.text('Keine Lebensgeschichte-Einträge vorhanden.', leftMargin, yPos)
    yPos += lineHeight
  }

  // Footer
  doc.addPage()
  yPos = 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b)
  doc.text('Dieses Dokument enthält persönliche Erinnerungen aus Ihrer Lebensgeschichte.', leftMargin, yPos)
  yPos += lineHeight
  doc.text('Die Daten werden vertraulich behandelt und nur für die Dauer der Zusammenarbeit gespeichert.', leftMargin, yPos)

  // Download with person's name
  const fileName = `Lebensgeschichte_${state.personalInfo.vorname}_${state.personalInfo.nachname}_${today.replace(/\./g, '-')}.pdf`
  doc.save(fileName)
}
