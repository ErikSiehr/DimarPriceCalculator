'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

// Import config and types
import { AnamneseState, initialAnamneseState } from '@/lib/types'
import { anamneseSteps, anamneseValidationRules } from '@/lib/anamneseConfig'
import { downloadAnamnePDF } from '@/lib/pdfGenerator'

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
  StepProgress,
  Overview,
  BackButton,
  NextButton,
  SubmitButton,
  SuccessScreen,
} from '@/components/anamnese'

export function AnamneseFormular() {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<AnamneseState>(initialAnamneseState)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  const updateState = (key: keyof AnamneseState, value: string | string[]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  const calculateMaxHeartRate = () => {
    if (!state.geburtsdatum) return 0
    const birthYear = new Date(state.geburtsdatum).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear
    return Math.round(220 - age)
  }

  // Validate step based on config rules
  const isCurrentStepValid = (): boolean => {
    const validationKeys = anamneseValidationRules[currentStep] || []
    
    for (const key of validationKeys) {
      const value = state[key as keyof AnamneseState]
      
      if (Array.isArray(value)) {
        if (value.length === 0) return false
      } else {
        if (!value || value === '') return false
      }
    }
    
    return true
  }

  const handleNext = () => {
    if (currentStep < anamneseSteps.length - 1 && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1)
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

  const handleSubmit = () => {
    if (consentGiven) {
      setIsSubmitted(true)
    }
  }

  const handleDownloadPdf = () => {
    downloadAnamnePDF(state, calculateMaxHeartRate())
  }

  // Render form field based on config type
  const renderFormField = (question: any) => {
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

      default:
        return null
    }
  }

  // Render current step
  const renderStep = () => {
    if (currentStep >= anamneseSteps.length) return null

    const step = anamneseSteps[currentStep]

    // Overview step (last step)
    if (currentStep === anamneseSteps.length - 1) {
      if (isSubmitted) {
        return (
          <SuccessScreen
            title="Danke für Ihre Eingaben!"
            description="Ihr Anamnese-Formular wurde erfolgreich übermittelt."
            onDownloadPdf={handleDownloadPdf}
          />
        )
      }

      return (
        <Overview
          state={state}
          consentGiven={consentGiven}
          onConsentChange={setConsentGiven}
          calculateMaxHeartRate={calculateMaxHeartRate}
        />
      )
    }

    // Regular form step
    return (
      <StepContent>
        <QuestionTitle>{step.title}</QuestionTitle>
        {step.description && (
          <QuestionDescription>{step.description}</QuestionDescription>
        )}

        {/* Check if it's a health questions grid or regular form grid */}
        {step.id >= 2 && step.id <= 4 ? (
          <HealthQuestionsGrid>
            {step.questions.map(question => renderFormField(question))}
          </HealthQuestionsGrid>
        ) : (
          <FormGrid $columns={step.questions[0]?.columns || 1}>
            {step.questions.map(question => renderFormField(question))}
          </FormGrid>
        )}
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
                  Schritt {currentStep + 1} von {anamneseSteps.length}
                </span>
              </div>
              <Progress value={((currentStep + 1) / anamneseSteps.length) * 100} />
            </div>

            {/* Step Progress */}
            <StepProgress
              steps={anamneseSteps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
            />

            {/* Step Content */}
            {renderStep()}
          </CardContentWrapper>

          {/* Navigation */}
          {!isSubmitted && (
            <NavigationFooter>
              <BackButton onClick={handleBack} disabled={currentStep === 0}>
                <ChevronLeft className="h-5 w-5" />
                Zurück
              </BackButton>

              {currentStep === anamneseSteps.length - 1 ? (
                <SubmitButton onClick={handleSubmit} disabled={!consentGiven}>
                  <Send className="h-5 w-5" />
                  Formular übermitteln
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
