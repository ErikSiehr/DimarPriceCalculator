"use client"

import styled from "styled-components"
import { Edit2, Shield } from "lucide-react"
import { colors, borderRadius, shadows, transitions } from "@/lib/theme"
import type { AnamneseState } from "@/lib/types"

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
  justify-content: space-between;
  font-size: 0.875rem;
  padding: 0.25rem 0;
  
  .label {
    color: ${colors.accent.DEFAULT};
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

export function Overview({ 
  state, 
  onEditStep, 
  consentGiven, 
  onConsentChange,
  calculateMaxHeartRate 
}: OverviewProps) {
  return (
    <>
      <OverviewCard>
        <OverviewHeader>
          <h3>Ihre Angaben im Überblick</h3>
        </OverviewHeader>
        <OverviewContent>
          {/* Basisdaten */}
          <OverviewSection>
            <OverviewSectionHeader>
              <h4>Basisdaten</h4>
              <EditButton onClick={() => onEditStep(0)}>
                <Edit2 className="h-4 w-4" />
                Bearbeiten
              </EditButton>
            </OverviewSectionHeader>
            <OverviewGrid>
              <OverviewItem>
                <span className="label">Name:</span>
                <span className="value">{state.vorname} {state.nachname}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Geburtsdatum:</span>
                <span className="value">{state.geburtsdatum}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Geschlecht:</span>
                <span className="value">{state.geschlecht}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Größe:</span>
                <span className="value">{state.koerpergroesse} cm</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Gewicht:</span>
                <span className="value">{state.gewicht} kg</span>
              </OverviewItem>
            </OverviewGrid>
          </OverviewSection>

          {/* Kontaktdaten */}
          <OverviewSection>
            <OverviewSectionHeader>
              <h4>Kontaktdaten</h4>
              <EditButton onClick={() => onEditStep(1)}>
                <Edit2 className="h-4 w-4" />
                Bearbeiten
              </EditButton>
            </OverviewSectionHeader>
            <OverviewGrid>
              {state.strasse && (
                <OverviewItem>
                  <span className="label">Adresse:</span>
                  <span className="value">{state.strasse}, {state.plzOrt}</span>
                </OverviewItem>
              )}
              {state.land && (
                <OverviewItem>
                  <span className="label">Land:</span>
                  <span className="value">{state.land}</span>
                </OverviewItem>
              )}
              {state.email && (
                <OverviewItem>
                  <span className="label">E-Mail:</span>
                  <span className="value">{state.email}</span>
                </OverviewItem>
              )}
              <OverviewItem>
                <span className="label">Telefon:</span>
                <span className="value">{state.telefon}</span>
              </OverviewItem>
            </OverviewGrid>
          </OverviewSection>

          {/* Gesundheit 1 */}
          <OverviewSection>
            <OverviewSectionHeader>
              <h4>Gesundheitsdaten (Teil 1)</h4>
              <EditButton onClick={() => onEditStep(2)}>
                <Edit2 className="h-4 w-4" />
                Bearbeiten
              </EditButton>
            </OverviewSectionHeader>
            <OverviewGrid>
              <OverviewItem>
                <span className="label">Rauchen:</span>
                <span className="value">{state.rauchen}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Hypertonie:</span>
                <span className="value">{state.hypertonie}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Schilddrüse:</span>
                <span className="value">{state.schilddruese}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Schlafstörungen:</span>
                <span className="value">{state.schlafstoerungen}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Diabetes:</span>
                <span className="value">{state.diabetes}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Sport:</span>
                <span className="value">{state.sportlicheAktivitaet}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">COPD:</span>
                <span className="value">{state.copd}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Antidepressiva:</span>
                <span className="value">{state.antidepressiva}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Alkohol:</span>
                <span className="value">{state.alkohol}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Schichtarbeit:</span>
                <span className="value">{state.schichtarbeit}</span>
              </OverviewItem>
            </OverviewGrid>
          </OverviewSection>

          {/* Gesundheit 2 */}
          <OverviewSection>
            <OverviewSectionHeader>
              <h4>Gesundheitsdaten (Teil 2)</h4>
              <EditButton onClick={() => onEditStep(3)}>
                <Edit2 className="h-4 w-4" />
                Bearbeiten
              </EditButton>
            </OverviewSectionHeader>
            <OverviewGrid>
              <OverviewItem>
                <span className="label">Allergien:</span>
                <span className="value">{state.allergien.join(", ") || "-"}</span>
              </OverviewItem>
              {state.ernaehrung.length > 0 && (
                <OverviewItem>
                  <span className="label">Ernährung:</span>
                  <span className="value">{state.ernaehrung.join(", ")}</span>
                </OverviewItem>
              )}
              <OverviewItem>
                <span className="label">Krebstherapie:</span>
                <span className="value">{state.krebstherapie}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Immunsystem:</span>
                <span className="value">{state.immunsystem}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Depressionen:</span>
                <span className="value">{state.depressionen}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Gelenkschmerzen:</span>
                <span className="value">{state.gelenkschmerzen}</span>
              </OverviewItem>
              {state.schmerzen && (
                <OverviewItem>
                  <span className="label">Schmerzen:</span>
                  <span className="value">{state.schmerzen}</span>
                </OverviewItem>
              )}
            </OverviewGrid>
          </OverviewSection>

          {/* Gesundheit 3 */}
          <OverviewSection>
            <OverviewSectionHeader>
              <h4>Lebensstil</h4>
              <EditButton onClick={() => onEditStep(4)}>
                <Edit2 className="h-4 w-4" />
                Bearbeiten
              </EditButton>
            </OverviewSectionHeader>
            <OverviewGrid>
              <OverviewItem>
                <span className="label">Hautprobleme:</span>
                <span className="value">{state.hautprobleme}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Passivrauchen:</span>
                <span className="value">{state.passivrauchen}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Weniger als 1,5L Wasser:</span>
                <span className="value">{state.wasserkonsum}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Gesüßte Getränke:</span>
                <span className="value">{state.gesuessteGetraenke}</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Erhöhter Zuckerkonsum:</span>
                <span className="value">{state.zuckerkonsum}</span>
              </OverviewItem>
            </OverviewGrid>
          </OverviewSection>

          {/* Körpermaße */}
          <OverviewSection>
            <OverviewSectionHeader>
              <h4>Körpermaße</h4>
              <EditButton onClick={() => onEditStep(5)}>
                <Edit2 className="h-4 w-4" />
                Bearbeiten
              </EditButton>
            </OverviewSectionHeader>
            <OverviewGrid>
              <OverviewItem>
                <span className="label">Nackenumfang:</span>
                <span className="value">{state.nackenumfang} cm</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Hüftumfang:</span>
                <span className="value">{state.hueftumfang} cm</span>
              </OverviewItem>
              <OverviewItem>
                <span className="label">Max. Herzfrequenz:</span>
                <span className="value">{calculateMaxHeartRate()} bpm</span>
              </OverviewItem>
              {state.blutgruppe && (
                <OverviewItem>
                  <span className="label">Blutgruppe:</span>
                  <span className="value">{state.blutgruppe}</span>
                </OverviewItem>
              )}
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
