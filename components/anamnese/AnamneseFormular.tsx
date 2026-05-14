'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

// Import config and types
import { AnamneseState, initialAnamneseState, DiagnosenGridEntry } from '@/lib/types'
import { extendedAnamneseSteps, extendedValidationRules, ExtendedFormQuestion } from '@/lib/anamneseConfigExtended'
import { downloadAnamnePDF, downloadTherapistPDF, generateTherapistPDFBase64 } from '@/lib/pdfGenerator'
import { consumeToken } from '@/hooks/useFormToken'


// Import components
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
  QuestionDescription,
  NavigationFooter,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormGrid,
  ToggleGroup,
  ToggleButton,
  HealthQuestionCard,
  HealthQuestionLabel,
  HealthQuestionsGrid,
  MultiSelect,
  CheckboxGrid,
  StepProgress,
  Overview,
  BackButton,
  NextButton,
  SubmitButton,
  SuccessScreen,
} from '@/components/anamnese'

export function AnamneseFormular() {
  const [currentStep, setCurrentStep] = useState(0)
  const [maxReachedStep, setMaxReachedStep] = useState(0)
  const [state, setState] = useState<AnamneseState>(initialAnamneseState)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const updateState = (key: keyof AnamneseState, value: string | string[] | { [key: string]: DiagnosenGridEntry }) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  const calculateMaxHeartRate = () => {
    if (!state.geburtsdatum) return 0
    const birthYear = new Date(state.geburtsdatum).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear
    return Math.round(220 - age)
  }

  // Check if a question should be visible based on conditional logic
  const shouldShowQuestion = (question: ExtendedFormQuestion): boolean => {
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

  // Get visible questions for current step (filter gender-specific and conditional)
  const getVisibleQuestions = (stepId: number): ExtendedFormQuestion[] => {
    const step = extendedAnamneseSteps.find(s => s.id === stepId)
    if (!step) return []
    
    return step.questions.filter(q => shouldShowQuestion(q))
  }

  // Validate step based on config rules
  const isCurrentStepValid = (): boolean => {
    const validationKeys = extendedValidationRules[currentStep] || []
    
    for (const key of validationKeys) {
      // Skip validation for conditionally hidden fields
      const question = extendedAnamneseSteps[currentStep]?.questions.find(q => q.id === key)
      if (question && !shouldShowQuestion(question)) continue
      
      const value = state[key as keyof AnamneseState]
      
      if (Array.isArray(value)) {
        if (value.length === 0) return false
      } else if (typeof value === 'object' && value !== null) {
        // For DiagnosenGrid - no validation required
        continue
      } else {
        if (!value || value === '') return false
      }
    }
    
    return true
  }

  // Skip steps that have no visible questions (e.g., men skip women's questions step)
  const getNextVisibleStep = (fromStep: number, direction: 'forward' | 'backward'): number => {
    let nextStep = fromStep + (direction === 'forward' ? 1 : -1)
    
    while (nextStep >= 0 && nextStep < extendedAnamneseSteps.length) {
      const visibleQuestions = getVisibleQuestions(nextStep)
      // Overview step (last) should always be visible, or steps with visible questions
      if (nextStep === extendedAnamneseSteps.length - 1 || visibleQuestions.length > 0) {
        return nextStep
      }
      nextStep += (direction === 'forward' ? 1 : -1)
    }
    
    return direction === 'forward' ? extendedAnamneseSteps.length - 1 : 0
  }

  const handleNext = () => {
    if (currentStep < extendedAnamneseSteps.length - 1 && isCurrentStepValid()) {
      const nextStep = getNextVisibleStep(currentStep, 'forward')
      setCurrentStep(nextStep)
      setMaxReachedStep(prev => Math.max(prev, nextStep))
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = getNextVisibleStep(currentStep, 'backward')
      setCurrentStep(prevStep)
    }
  }

  const handleStepClick = (step: number) => {
    // Check if step has visible questions or is the overview
    const visibleQuestions = getVisibleQuestions(step)
    if (visibleQuestions.length > 0 || step === extendedAnamneseSteps.length - 1) {
      setCurrentStep(step)
    }
  }

  const handleSubmit = async () => {
    if (consentGiven) {
      setIsEmailSending(true)
      setEmailError(null)
      
      try {
        const pdfBase64 = generateTherapistPDFBase64(state, calculateMaxHeartRate())
        const patientName = `${state.vorname} ${state.nachname}`
        
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfBase64,
            patientName,
            formType: 'anamnese',
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
    downloadAnamnePDF(state, calculateMaxHeartRate())
  }

  const handleDownloadTherapistPdf = () => {
    downloadTherapistPDF(state, calculateMaxHeartRate())
  }

  // Render form field based on config type
  const renderFormField = (question: ExtendedFormQuestion) => {
    const key = question.id as keyof AnamneseState
    const value = state[key]

    switch (question.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'date':
        return (
          <FormField key={question.id}>
            <FormLabel $required={question.required}>
              {question.label}
            </FormLabel>
            <FormInput
              type={question.type}
              placeholder={question.placeholder}
              value={value as string}
              onChange={(e) => updateState(key, e.target.value)}
            />
          </FormField>
        )

      case 'select':
        return (
          <FormField key={question.id}>
            <FormLabel $required={question.required}>
              {question.label}
            </FormLabel>
            <FormSelect
              value={value as string}
              onChange={(e) => updateState(key, e.target.value)}
            >
              <option value="">Bitte auswählen</option>
              {question.options?.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </FormSelect>
          </FormField>
        )

      case 'togglegroup':
        return (
          <FormField key={question.id}>
            <FormLabel $required={question.required}>
              {question.label}
            </FormLabel>
            <ToggleGroup>
              {question.options?.map((opt: string) => (
                <ToggleButton
                  key={opt}
                  $isActive={value === opt}
                  onClick={() => updateState(key, opt)}
                >
                  {opt}
                </ToggleButton>
              ))}
            </ToggleGroup>
          </FormField>
        )

      case 'toggle':
        return (
          <HealthQuestionCard key={question.id}>
            <HealthQuestionLabel>{question.label}</HealthQuestionLabel>
            <ToggleGroup>
              {question.options?.map((opt: string) => (
                <ToggleButton
                  key={opt}
                  $isActive={value === opt}
                  onClick={() => updateState(key, opt)}
                >
                  {opt}
                </ToggleButton>
              ))}
            </ToggleGroup>
          </HealthQuestionCard>
        )

      case 'multiselect':
        return (
          <HealthQuestionCard key={question.id}>
            <HealthQuestionLabel>{question.label}</HealthQuestionLabel>
            <MultiSelect
              options={question.options || []}
              value={Array.isArray(value) ? value : []}
              onChange={(selected) => updateState(key, selected)}
            />
          </HealthQuestionCard>
        )

      case 'checkbox-grid':
        return (
          <div key={question.id} style={{ gridColumn: '1 / -1' }}>
            <FormLabel style={{ marginBottom: '1rem', display: 'block' }}>
              {question.label}
            </FormLabel>
            <CheckboxGrid
              options={question.options || []}
              gridOptions={question.gridOptions || []}
              value={(value as { [key: string]: DiagnosenGridEntry }) || {}}
              onChange={(newValue) => updateState(key, newValue)}
            />
          </div>
        )

      default:
        return null
    }
  }

  // Get steps that should be shown in the step progress (filter out hidden gender-specific steps)
  const getVisibleSteps = () => {
    return extendedAnamneseSteps.filter((step, idx) => {
      // Always show overview
      if (idx === extendedAnamneseSteps.length - 1) return true
      // Check if step has any visible questions
      const visibleQuestions = getVisibleQuestions(step.id)
      return visibleQuestions.length > 0
    })
  }

  // Render current step
  const renderStep = () => {
    if (currentStep >= extendedAnamneseSteps.length) return null

    const step = extendedAnamneseSteps[currentStep]
    const visibleQuestions = getVisibleQuestions(currentStep)

    // Overview step (last step)
    if (currentStep === extendedAnamneseSteps.length - 1) {
      if (isSubmitted) {
        return (
<SuccessScreen
  title="Danke für Ihre Eingaben!"
  description="Ihr Anamnese-Formular wurde erfolgreich übermittelt."
  onDownloadPdf={handleDownloadPdf}
  onDownloadTherapistPdf={handleDownloadTherapistPdf}
  />
        )
      }

      return (
        <Overview
          state={state}
          onEditStep={handleStepClick}
          consentGiven={consentGiven}
          onConsentChange={setConsentGiven}
          calculateMaxHeartRate={calculateMaxHeartRate}
        />
      )
    }

    // Regular form step
    const isHealthStep = step.id >= 2 && step.id !== 8 // Not the diagnosen grid step
    
    return (
      <StepContent>
        <QuestionTitle>{step.title}</QuestionTitle>
        {step.description && (
          <QuestionDescription>{step.description}</QuestionDescription>
        )}

        {/* Check if it's a health questions grid or regular form grid */}
        {isHealthStep ? (
          <HealthQuestionsGrid>
            {visibleQuestions.map(question => renderFormField(question))}
          </HealthQuestionsGrid>
        ) : (
          <FormGrid $columns={visibleQuestions[0]?.columns || 1}>
            {visibleQuestions.map(question => renderFormField(question))}
          </FormGrid>
        )}
      </StepContent>
    )
  }

  const visibleSteps = getVisibleSteps()

  return (
    <Container>
      <MainWrapper>
        {/* Header */}
        <HeaderSection>
          <HeaderCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <LogoContainer>
                <LogoIcon>
                  <span>A</span>
                </LogoIcon>
                <LogoText>
                  <div className="brand">Anamnese</div>
                  <div className="tagline">Health Assessment</div>
                </LogoText>
              </LogoContainer>
            </div>
            <ContactInfo>
              <div className="label">Info</div>
              <div className="phone">+49 123 4567890</div>
            </ContactInfo>
          </HeaderCard>
        </HeaderSection>

        {/* Title */}
        <TitleSection>
          <h1>Anamnese Formular</h1>
          <p>Bitte füllen Sie das Formular vollständig aus, um Ihre Gesundheitsdaten zu erfassen</p>
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
                  Schritt {currentStep + 1} von {extendedAnamneseSteps.length}
                </span>
              </div>
              <Progress value={((currentStep + 1) / extendedAnamneseSteps.length) * 100} />
            </div>

            {/* Step Progress */}
            <StepProgress
              steps={extendedAnamneseSteps}
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
                  <p style={{ color: '#A89454' }}>Ihre Anamnese wurde erfolgreich gesendet.</p>
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

          {/* Navigation */}
          {!isSubmitted && (
            <NavigationFooter>
              <BackButton onClick={handleBack} disabled={currentStep === 0}>
                <ChevronLeft className="h-5 w-5" />
                Zurück
              </BackButton>

              {currentStep === extendedAnamneseSteps.length - 1 ? (
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
                <NextButton onClick={handleNext} disabled={!isCurrentStepValid()}>
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

export default AnamneseFormular
