'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Edit2, Send, Download, Mail, Shield } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

// Imports
import {
  lebensgeschichteCategories,
  lebensgeschichteSteps,
  getCategoryById,
  LebensgeschichteState,
  initialLebensgeschichteState,
  TimelineEntry,
  calculateAge,
  PersonalInfo,
} from '@/lib/lebensgeschichteConfig'
import { downloadLebensgeschichtePDF, generateLebensgeschichtePDFBase64 } from '@/lib/pdfGeneratorLebensgeschichte'
import { Timeline } from './Timeline'

// Reuse Anamnese components for consistent styling
import {
  Container,
  MainWrapper,
  HeaderSection,
  HeaderCard,
  LogoContainer,
  LogoIcon,
  LogoText,
  ContactInfo,
  TitleSection,
  MainCard,
  CardContentWrapper,
  StepContent,
  QuestionTitle,
  NavigationFooter,
  BackButton,
  NextButton,
  SubmitButton,
  ConsentSection,
  ConsentHeader,
  ConsentText,
  ConsentCheckbox,
  SuccessScreen,
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  ToggleGroup,
  ToggleButton,
} from '@/components/anamnese'

// Progress indicator reused
import { StepProgress } from '@/components/anamnese'
import { consumeToken } from '@/hooks/useFormToken'

interface LebensgeschichteOverviewItem {
  categoryId: string
  categoryLabel: string
  categoryColor: string
  entries: TimelineEntry[]
}

export function LebensgeschichteFormular() {
  const [currentStep, setCurrentStep] = useState(0)
  const [maxReachedStep, setMaxReachedStep] = useState(0)
  const [state, setState] = useState<LebensgeschichteState>(initialLebensgeschichteState)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [sendEmail, setSendEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleNext = () => {
    // Validate personal info step before proceeding
    if (currentStep === 0 && !isPersonalInfoValid()) {
      return
    }
    if (currentStep < lebensgeschichteSteps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setMaxReachedStep(prev => Math.max(prev, nextStep))
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

const handleSubmit = async () => {
    if (consentGiven) {
      setIsEmailSending(true)
      setEmailError(null)
      
      try {
        const { pdfBase64, visualizationBase64 } = generateLebensgeschichtePDFBase64(state)
        const patientName = `${state.personalInfo.vorname} ${state.personalInfo.nachname}`
        
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfBase64,
            visualizationPdfBase64: visualizationBase64,
            patientName,
            formType: 'lebensgeschichte',
          }),
        })
        
        const result = await response.json()
        
        if (!result.success) {
          setEmailError(result.error || 'E-Mail konnte nicht gesendet werden')
        } else {
          setEmailSent(true)
          await consumeToken() // ← Token verbrauchen nach erfolgreichem Versand
        }
      } catch (error) {
        console.error('Error sending email:', error)
        setEmailError('E-Mail konnte nicht gesendet werden')
      } finally {
        setIsEmailSending(false)
        setIsSubmitted(true)
      }
    }
  }

  const handleDownloadPdf = () => {
    downloadLebensgeschichtePDF(state)
  }

  const handleSendEmail = () => {
    if (sendEmail) {
      setEmailSent(true)
    }
  }

  // Calculate current age based on birthdate
  const currentAge = calculateAge(state.personalInfo.geburtsdatum)

  // Update personal info
  const updatePersonalInfo = (key: keyof PersonalInfo, value: string) => {
    setState(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [key]: value }
    }))
  }

  // Validate personal info step
  const isPersonalInfoValid = () => {
    const { vorname, nachname, geburtsdatum, geschlecht } = state.personalInfo
    return vorname.trim() !== '' && nachname.trim() !== '' && geburtsdatum !== '' && geschlecht !== ''
  }

  // Add or update timeline entry
  const updateTimelineEntry = (categoryId: string, ageRangeId: string, text: string) => {
    setState(prev => {
      const categoryKey = categoryId as keyof LebensgeschichteState
      const entries = prev[categoryKey] as TimelineEntry[]
      
      const existingIndex = entries.findIndex(e => e.ageRangeId === ageRangeId)
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...entries]
        updated[existingIndex] = { ageRangeId, text }
        return { ...prev, [categoryKey]: updated }
      } else {
        // Add new
        return { ...prev, [categoryKey]: [...entries, { ageRangeId, text }] }
      }
    })
  }

  // Remove timeline entry
  const removeTimelineEntry = (categoryId: string, ageRangeId: string) => {
    setState(prev => {
      const categoryKey = categoryId as keyof LebensgeschichteState
      const entries = prev[categoryKey] as TimelineEntry[]
      return { ...prev, [categoryKey]: entries.filter(e => e.ageRangeId !== ageRangeId) }
    })
  }

  const renderStep = () => {
    const step = lebensgeschichteSteps[currentStep]
    
    if (!step) return null

    // Personal info step (first step)
    if (step.categoryId === 'personal') {
      return (
        <StepContent>
          <QuestionTitle>{step.title}</QuestionTitle>
          <p style={{ textAlign: 'center', color: '#A89454', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Bitte geben Sie Ihre persönlichen Daten ein, damit wir Ihre Lebensgeschichte zuordnen können.
          </p>
          
          <FormGrid $columns={2}>
            <FormField>
              <FormLabel htmlFor="vorname">Vorname *</FormLabel>
              <FormInput
                id="vorname"
                type="text"
                placeholder="Max"
                value={state.personalInfo.vorname}
                onChange={(e) => updatePersonalInfo('vorname', e.target.value)}
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="nachname">Nachname *</FormLabel>
              <FormInput
                id="nachname"
                type="text"
                placeholder="Mustermann"
                value={state.personalInfo.nachname}
                onChange={(e) => updatePersonalInfo('nachname', e.target.value)}
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="geburtsdatum">Geburtsdatum *</FormLabel>
              <FormInput
                id="geburtsdatum"
                type="date"
                value={state.personalInfo.geburtsdatum}
                onChange={(e) => updatePersonalInfo('geburtsdatum', e.target.value)}
              />
              {state.personalInfo.geburtsdatum && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#A89454' }}>
                  Aktuelles Alter: {currentAge} Jahre
                </p>
              )}
            </FormField>
            <FormField>
              <FormLabel>Biologisches Geschlecht *</FormLabel>
              <ToggleGroup>
                <ToggleButton
                  type="button"
                  $isActive={state.personalInfo.geschlecht === 'Männlich'}
                  onClick={() => updatePersonalInfo('geschlecht', 'Männlich')}
                >
                  Männlich
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $isActive={state.personalInfo.geschlecht === 'Weiblich'}
                  onClick={() => updatePersonalInfo('geschlecht', 'Weiblich')}
                >
                  Weiblich
                </ToggleButton>
              </ToggleGroup>
            </FormField>
          </FormGrid>
        </StepContent>
      )
    }

    // Overview step
    if (currentStep === lebensgeschichteSteps.length - 1) {
      if (isSubmitted) {
        return (
          <SuccessScreen
  title="Danke für Ihre Eingaben!"
  description="Ihre Lebensgeschichte wurde erfolgreich erfasst."
  onDownloadPdf={handleDownloadPdf}
/>
        )
      }

      // Map category id to step index for navigation
      const categoryStepIndex: Record<string, number> = {}
      lebensgeschichteSteps.forEach((step, idx) => {
        if (step.categoryId !== 'personal' && step.categoryId !== 'overview') {
          categoryStepIndex[step.categoryId] = idx
        }
      })

      return (
        <StepContent>
          <QuestionTitle>Übersicht</QuestionTitle>
          
          {/* Personal Info Summary */}
          <div
            style={{
              padding: '1rem',
              border: '2px solid #3A3429',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(168, 148, 84, 0.05)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#3A3429', fontWeight: '600' }}>Persönliche Daten</h4>
              <button
                onClick={() => handleStepClick(0)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.25rem 0.5rem', fontSize: '0.875rem',
                  color: '#A89454', background: 'transparent', border: 'none', cursor: 'pointer',
                }}
              >
                <Edit2 className="h-4 w-4" />
                Bearbeiten
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div>
                <div style={{ color: '#A89454', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.1rem' }}>Name</div>
                <div style={{ color: '#3A3429', fontWeight: '500' }}>{state.personalInfo.vorname} {state.personalInfo.nachname}</div>
              </div>
              <div>
                <div style={{ color: '#A89454', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.1rem' }}>Geburtsdatum</div>
                <div style={{ color: '#3A3429', fontWeight: '500' }}>{state.personalInfo.geburtsdatum}</div>
              </div>
              <div>
                <div style={{ color: '#A89454', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.1rem' }}>Alter</div>
                <div style={{ color: '#3A3429', fontWeight: '500' }}>{currentAge} Jahre</div>
              </div>
              <div>
                <div style={{ color: '#A89454', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.1rem' }}>Geschlecht</div>
                <div style={{ color: '#3A3429', fontWeight: '500' }}>{state.personalInfo.geschlecht}</div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {lebensgeschichteCategories.map(category => {
              const entries = state[category.id as keyof LebensgeschichteState] as TimelineEntry[]
              const stepIdx = categoryStepIndex[category.id]
              return (
                <div
                  key={category.id}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${category.color}`,
                    borderRadius: '0.75rem',
                    backgroundColor: 'rgba(168, 148, 84, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ color: category.color, fontWeight: '600' }}>
                      {category.label}
                    </h4>
                    <button
                      onClick={() => handleStepClick(stepIdx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.25rem 0.5rem', fontSize: '0.875rem',
                        color: '#A89454', background: 'transparent', border: 'none', cursor: 'pointer',
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                      Bearbeiten
                    </button>
                  </div>
                  {entries.length > 0 ? (
                    <ul style={{ marginLeft: '1rem', fontSize: '0.875rem', listStyle: 'disc' }}>
                      {entries.map((entry, idx) => (
                        <li key={idx} style={{ marginBottom: '0.4rem', color: '#3A3429' }}>
                          <strong style={{ color: category.color }}>{entry.ageRangeId} Jahre</strong>
                          {' — '}
                          {entry.text.substring(0, 100)}{entry.text.length > 100 ? '...' : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: '#A89454', fontStyle: 'italic' }}>
                      Keine Einträge
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Consent Section */}
          <ConsentSection>
            <ConsentHeader>
              <Shield className="h-6 w-6" style={{ color: '#3A3429' }} />
              <h4 style={{ color: '#3A3429' }}>Einverständniserklärung zur Datenverarbeitung</h4>
            </ConsentHeader>
            
            <ConsentText>
              <p>
                <strong>Hinweis zu Gesundheitsdaten:</strong> Die von Ihnen angegebenen Daten enthalten 
                sensible Gesundheitsinformationen gemäß Art. 9 DSGVO.
              </p>
              
              <ul>
                <li>
                  <strong>Zweck der Datenerhebung:</strong> Ihre Angaben werden zur Erstellung einer 
                  lebensgeschichtlichen Gesundheitsanalyse verwendet.
                </li>
                <li>
                  <strong>Datenempfänger:</strong> Ihre Daten werden ausschließlich an unser Fachpersonal 
                  übermittelt und nicht an Dritte weitergegeben.
                </li>
                <li>
                  <strong>Speicherdauer:</strong> Ihre Daten werden nur für die Dauer der 
                  Zusammenarbeit gespeichert. Nach Beendigung werden alle Dokumente gelöscht.
                </li>
              </ul>
              
              <ConsentCheckbox>
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                />
                <span>
                  Ich stimme der Verarbeitung meiner Daten zu.
                </span>
              </ConsentCheckbox>
            </ConsentText>
          </ConsentSection>
        </StepContent>
      )
    }

    // Timeline steps
    const category = getCategoryById(step.categoryId)
    if (!category) return null

    const categoryEntries = state[category.id as keyof LebensgeschichteState] as TimelineEntry[]

    return (
      <StepContent>
        <QuestionTitle>{step.title}</QuestionTitle>
        <p style={{ textAlign: 'center', color: '#A89454', marginBottom: '2rem', fontSize: '1.125rem' }}>
          {category.description}
        </p>

        <Timeline
          entries={categoryEntries}
          categoryColor={category.color}
          maxAge={currentAge > 0 ? currentAge : undefined}
          onAddEntry={(ageRangeId) => updateTimelineEntry(category.id, ageRangeId, '')}
          onUpdateEntry={(ageRangeId, text) => updateTimelineEntry(category.id, ageRangeId, text)}
          onRemoveEntry={(ageRangeId) => removeTimelineEntry(category.id, ageRangeId)}
        />
      </StepContent>
    )
  }

  return (
    <Container>
      <MainWrapper>
        {/* Header */}
        <HeaderSection>
          <HeaderCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <LogoContainer>
                <LogoIcon>
                  <span>L</span>
                </LogoIcon>
                <LogoText>
                  <div className="brand" style={{ color: '#3A3429' }}>Lebensgeschichte</div>
                  <div className="tagline" style={{ color: '#A89454' }}>Life Timeline</div>
                </LogoText>
              </LogoContainer>
            </div>
            <ContactInfo>
              <div className="label" style={{ color: '#A89454' }}>Info</div>
              <div className="phone" style={{ color: '#3A3429' }}>+49 123 4567890</div>
            </ContactInfo>
          </HeaderCard>
        </HeaderSection>

        {/* Title */}
        <TitleSection>
          <h1 style={{ color: '#3A3429' }}>Lebensgeschichte</h1>
          <p style={{ color: '#A89454' }}>Erfassen Sie die wichtigsten Ereignisse Ihres Lebens</p>
        </TitleSection>

        {/* Main Card */}
        <MainCard>
          <CardContentWrapper>
            {/* Progress */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#3A3429' }}>
                  Fortschritt
                </h2>
                <span style={{ fontSize: '1.125rem', color: '#A89454' }}>
                  Schritt {currentStep + 1} von {lebensgeschichteSteps.length}
                </span>
              </div>
              <Progress value={((currentStep + 1) / lebensgeschichteSteps.length) * 100} />
            </div>

            {/* Step Progress Indicator */}
            <StepProgress
              steps={lebensgeschichteSteps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              completedSteps={Array.from({ length: maxReachedStep }, (_, i) => i)}
            />

            {/* Step Content */}
            {renderStep()}
            
            {/* Success Message */}
            {isSubmitted && emailSent && (
              <StepContent>
                <div style={{ textAlign: 'center', padding: '2rem', color: '#4CAF50' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                  <h2 style={{ color: '#3A3429', marginBottom: '0.5rem' }}>Formular erfolgreich eingereicht!</h2>
                  <p style={{ color: '#A89454' }}>Ihre Lebensgeschichte wurde an {process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || 'die Praxis'} gesendet.</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: '#999' }}>Vielen Dank für Ihre Teilnahme!</p>
                </div>
              </StepContent>
            )}
            
            {/* Error Message */}
            {isSubmitted && emailError && (
              <StepContent>
                <div style={{ textAlign: 'center', padding: '2rem', color: '#F44336' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✕</div>
                  <h2 style={{ color: '#3A3429', marginBottom: '0.5rem' }}>Fehler beim Übermitteln</h2>
                  <p style={{ color: '#A89454' }}>{emailError}</p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmailError(null)
                    }}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#A89454',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    Erneut versuchen
                  </button>
                </div>
              </StepContent>
            )}
          </CardContentWrapper>

          {/* Navigation - always visible unless submitted */}
          {!isSubmitted && (
            <NavigationFooter>
              <BackButton onClick={handleBack} disabled={currentStep === 0}>
                <ChevronLeft className="h-5 w-5" />
                Zurück
              </BackButton>
              
              {currentStep === lebensgeschichteSteps.length - 1 ? (
                <SubmitButton 
                  onClick={handleSubmit} 
                  disabled={!consentGiven || isEmailSending}
                  style={{ opacity: isEmailSending ? 0.7 : 1 }}
                >
                  {isEmailSending ? (
                    <>
                      <span style={{ display: 'inline-block', marginRight: '0.5rem' }}>⏳</span>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Formular übermitteln
                    </>
                  )}
                </SubmitButton>
              ) : (
                <NextButton 
                  onClick={handleNext}
                  disabled={currentStep === 0 && !isPersonalInfoValid()}
                >
                  Weiter
                  <ChevronRight className="h-5 w-5" />
                </NextButton>
              )}
            </NavigationFooter>
          )}
        </MainCard>
      </MainWrapper>
    </Container>
  )
}

export default LebensgeschichteFormular
