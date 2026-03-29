"use client"

import styled from "styled-components"
import { Edit2, Shield } from "lucide-react"
import { colors, borderRadius, shadows, transitions } from "@/lib/theme"
import type { AnamneseState, DiagnosenGridEntry } from "@/lib/types"
import { extendedAnamneseSteps, ExtendedFormQuestion } from "@/lib/anamneseConfigExtended"

// Styled Components
const OverviewCard = styled.div`
  border: 2px solid ${colors.border.light};
  box-shadow: ${shadows.DEFAULT};
  border-radius: ${borderRadius.DEFAULT};
  background: ${colors.background.card};
  margin-bottom: 2rem;
`

const OverviewHeader = styled.div`
  background-color: ${colors.background.muted};
  padding: 1.5rem;
  border-bottom: 2px solid ${colors.accent.DEFAULT};
  
  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${colors.primary.DEFAULT};
  }
`

const OverviewContent = styled.div`
  padding: 1.5rem;
`

const OverviewSection = styled.div`
  padding: 1rem;
  background-color: ${colors.accent.subtle};
  border-radius: ${borderRadius.DEFAULT};
  margin-bottom: 1rem;
  border-left: 4px solid ${colors.accent.DEFAULT};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const OverviewSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${colors.primary.DEFAULT};
  }
`

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: ${colors.accent.DEFAULT};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color ${transitions.DEFAULT};
  
  &:hover {
    color: ${colors.accent.dark};
  }
`

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  padding: 0.25rem 0;
  
  .label {
    color: ${colors.accent.DEFAULT};
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 0.1rem;
  }
  
  .value {
    font-weight: 500;
    color: ${colors.primary.DEFAULT};
  }
`

// Consent Section - Exported for reuse
export const ConsentSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: ${colors.background.muted};
  border: 2px solid ${colors.border.DEFAULT};
  border-radius: ${borderRadius.md};
`

export const ConsentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${colors.primary.DEFAULT};
  }
`

export const ConsentText = styled.div`
  font-size: 0.875rem;
  color: ${colors.accent.DEFAULT};
  line-height: 1.6;
  
  ul {
    margin: 1rem 0;
    padding-left: 1.25rem;
    
    li {
      margin-bottom: 0.5rem;
      
      &::marker {
        color: ${colors.accent.DEFAULT};
      }
    }
  }
  
  strong {
    color: ${colors.primary.DEFAULT};
  }
`

export const ConsentCheckbox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
  background: ${colors.background.card};
  border: 2px solid ${colors.border.strong};
  border-radius: ${borderRadius.DEFAULT};
  cursor: pointer;
  transition: border-color ${transitions.DEFAULT};
  
  &:hover {
    border-color: ${colors.accent.DEFAULT};
  }
  
  input {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.125rem;
    accent-color: ${colors.accent.DEFAULT};
    cursor: pointer;
  }
  
  span {
    font-size: 0.9rem;
    color: ${colors.primary.DEFAULT};
    font-weight: 500;
  }
`

// Component Props
interface OverviewProps {
  state: AnamneseState
  onEditStep: (step: number) => void
  consentGiven: boolean
  onConsentChange: (checked: boolean) => void
  calculateMaxHeartRate: () => number
}

// Helper to get value as display string
function getDisplayValue(state: AnamneseState, questionId: string): string | null {
  const value = state[questionId as keyof AnamneseState]
  
  if (value === undefined || value === null || value === '') {
    return null
  }
  
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : null
  }
  
  if (typeof value === 'object') {
    // Handle DiagnosenGrid
    const diagnosenGrid = value as { [key: string]: DiagnosenGridEntry }
    const entries = Object.entries(diagnosenGrid)
      .filter(([, v]) => v.aktuell || v.letzte3Jahre || v.letzte20Jahre)
      .map(([diagnosis, v]) => {
        const times = []
        if (v.aktuell) times.push('aktuell')
        if (v.letzte3Jahre) times.push('3J')
        if (v.letzte20Jahre) times.push('20J')
        return `${diagnosis} (${times.join(', ')})`
      })
    return entries.length > 0 ? entries.join('; ') : null
  }
  
  return String(value)
}

// Check if question should be shown based on conditional visibility
function shouldShowQuestion(state: AnamneseState, question: ExtendedFormQuestion): boolean {
  if (!question.showIf) return true
  
  const { field, value } = question.showIf
  const fieldValue = state[field as keyof AnamneseState]
  
  if (Array.isArray(value)) {
    if (Array.isArray(fieldValue)) {
      return value.some(v => fieldValue.includes(v))
    }
    return value.includes(fieldValue as string)
  }
  
  return fieldValue === value
}

export function Overview({ 
  state, 
  onEditStep, 
  consentGiven, 
  onConsentChange,
  calculateMaxHeartRate 
}: OverviewProps) {
  // Filter steps that have visible, answered questions
  const stepsWithAnswers = extendedAnamneseSteps
    .filter(step => step.questions.length > 0)
    .map(step => {
      const visibleQuestions = step.questions.filter(q => {
        if (!shouldShowQuestion(state, q)) return false
        const value = getDisplayValue(state, q.id)
        return value !== null
      })
      return { ...step, visibleQuestions }
    })
    .filter(step => step.visibleQuestions.length > 0)

  return (
    <>
      <OverviewCard>
        <OverviewHeader>
          <h3>Ihre Angaben im Überblick</h3>
        </OverviewHeader>
        <OverviewContent>
          {stepsWithAnswers.map(step => (
            <OverviewSection key={step.id}>
              <OverviewSectionHeader>
                <h4>{step.title}</h4>
                <EditButton onClick={() => onEditStep(step.id)}>
                  <Edit2 className="h-4 w-4" />
                  Bearbeiten
                </EditButton>
              </OverviewSectionHeader>
              <OverviewGrid>
                {step.visibleQuestions.map(question => {
                  const value = getDisplayValue(state, question.id)
                  if (!value) return null
                  return (
                    <OverviewItem key={question.id}>
                      <span className="label">{question.label}</span>
                      <span className="value">{value}</span>
                    </OverviewItem>
                  )
                })}
              </OverviewGrid>
            </OverviewSection>
          ))}

          {/* Berechnete Werte */}
          <OverviewSection>
            <OverviewSectionHeader>
              <h4>Berechnete Werte</h4>
            </OverviewSectionHeader>
            <OverviewGrid>
              <OverviewItem>
                <span className="label">Max. Herzfrequenz</span>
                <span className="value">{calculateMaxHeartRate()} bpm</span>
              </OverviewItem>
            </OverviewGrid>
          </OverviewSection>
        </OverviewContent>
      </OverviewCard>

      {/* Consent Section */}
      <ConsentSection>
        <ConsentHeader>
          <Shield className="h-6 w-6" style={{ color: colors.accent.DEFAULT }} />
          <h4>Einverständniserklärung zur Datenverarbeitung</h4>
        </ConsentHeader>
        
        <ConsentText>
          <p>
            <strong>Hinweis zu Gesundheitsdaten:</strong> Die von Ihnen angegebenen Daten enthalten 
            sensible Gesundheitsinformationen gemäß Art. 9 DSGVO (besondere Kategorien personenbezogener Daten).
          </p>
          
          <ul>
            <li>
              <strong>Zweck der Datenerhebung:</strong> Ihre Angaben werden zur Erstellung einer 
              individuellen Gesundheitsanalyse und Beratung verwendet. [DUMMY: Bitte passen Sie 
              diesen Text an Ihren spezifischen Verwendungszweck an.]
            </li>
            <li>
              <strong>Datenempfänger:</strong> Ihre Daten werden ausschließlich an [DUMMY: Name 
              des Unternehmens/der verantwortlichen Person] übermittelt und nicht an Dritte 
              weitergegeben.
            </li>
            <li>
              <strong>Speicherdauer:</strong> Ihre Daten werden nur für die Dauer der 
              Zusammenarbeit gespeichert. Nach Beendigung der Zusammenarbeit werden alle 
              PDF-Dokumente und personenbezogenen Daten gelöscht. [DUMMY: Bitte geben Sie hier 
              die konkrete Aufbewahrungsfrist an.]
            </li>
            <li>
              <strong>Ihre Rechte:</strong> Sie haben jederzeit das Recht auf Auskunft, 
              Berichtigung, Löschung und Widerspruch bezüglich Ihrer Daten.
            </li>
          </ul>
          
          <ConsentCheckbox>
            <input
              type="checkbox"
              id="consent"
              checked={consentGiven}
              onChange={(e) => onConsentChange(e.target.checked)}
            />
            <span>
              Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner 
              Gesundheitsdaten für den oben genannten Zweck ausdrücklich zu. Mir ist bewusst, 
              dass ich diese Einwilligung jederzeit widerrufen kann.
            </span>
          </ConsentCheckbox>
        </ConsentText>
      </ConsentSection>
    </>
  )
}
