"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Import types and config
import { AnamneseState, initialAnamneseState, formSteps, formOptions } from "@/lib/types"
import { downloadAnamnePDF } from "@/lib/pdfGenerator"

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
} from "@/components/anamnese"

export function AnamneseFormular() {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<AnamneseState>(initialAnamneseState)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  // Update state helper
  const updateState = (key: keyof AnamneseState, value: string | string[]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  // Calculate max heart rate based on birth date
  const calculateMaxHeartRate = () => {
    if (!state.geburtsdatum) return 0
    const birthYear = new Date(state.geburtsdatum).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear
    return Math.round(220 - age)
  }

  // Validate current step
  const isCurrentStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return state.vorname !== "" && state.nachname !== "" && 
               state.geburtsdatum !== "" && state.geschlecht !== "" &&
               state.koerpergroesse !== "" && state.gewicht !== ""
      case 1:
        return state.telefon !== ""
      case 2:
        return state.rauchen !== "" && state.hypertonie !== "" && 
               state.schilddruese !== "" && state.schlafstoerungen !== "" &&
               state.diabetes !== "" && state.sportlicheAktivitaet !== "" &&
               state.copd !== "" && state.antidepressiva !== "" &&
               state.alkohol !== "" && state.schichtarbeit !== ""
      case 3:
        return state.allergien.length > 0 && state.krebstherapie !== "" && 
               state.immunsystem !== "" && state.depressionen !== "" && 
               state.gelenkschmerzen !== ""
      case 4:
        return state.hautprobleme !== "" && state.passivrauchen !== "" &&
               state.wasserkonsum !== "" && state.gesuessteGetraenke !== "" &&
               state.zuckerkonsum !== ""
      case 5:
        return state.nackenumfang !== "" && state.hueftumfang !== ""
      case 6:
        return true
      default:
        return false
    }
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < formSteps.length - 1 && isCurrentStepValid(currentStep)) {
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

  // Toggle button component for yes/no questions
  const YesNoToggle = ({ 
    value, 
    onChange 
  }: { 
    value: string
    onChange: (val: string) => void 
  }) => (
    <ToggleGroup>
      <ToggleButton $isActive={value === "Ja"} onClick={() => onChange("Ja")}>
        Ja
      </ToggleButton>
      <ToggleButton $isActive={value === "Nein"} onClick={() => onChange("Nein")}>
        Nein
      </ToggleButton>
    </ToggleGroup>
  )

  // Render current step content
  const renderStep = () => {
    switch (currentStep) {
      // Step 0: Basisdaten
      case 0:
        return (
          <StepContent>
            <QuestionTitle>Basisdaten</QuestionTitle>
            <QuestionDescription>Bitte geben Sie Ihre persönlichen Daten ein</QuestionDescription>
            
            <FormGrid $columns={2}>
              <FormField>
                <FormLabel $required>Vorname</FormLabel>
                <FormInput
                  type="text"
                  placeholder="Max"
                  value={state.vorname}
                  onChange={(e) => updateState("vorname", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel $required>Nachname</FormLabel>
                <FormInput
                  type="text"
                  placeholder="Mustermann"
                  value={state.nachname}
                  onChange={(e) => updateState("nachname", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel $required>Geburtsdatum</FormLabel>
                <FormInput
                  type="date"
                  value={state.geburtsdatum}
                  onChange={(e) => updateState("geburtsdatum", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel $required>Biologisches Geschlecht</FormLabel>
                <ToggleGroup>
                  <ToggleButton 
                    $isActive={state.geschlecht === "Männlich"} 
                    onClick={() => updateState("geschlecht", "Männlich")}
                  >
                    Männlich
                  </ToggleButton>
                  <ToggleButton 
                    $isActive={state.geschlecht === "Weiblich"} 
                    onClick={() => updateState("geschlecht", "Weiblich")}
                  >
                    Weiblich
                  </ToggleButton>
                </ToggleGroup>
              </FormField>
              <FormField>
                <FormLabel $required>Körpergröße (cm)</FormLabel>
                <FormInput
                  type="number"
                  placeholder="175"
                  value={state.koerpergroesse}
                  onChange={(e) => updateState("koerpergroesse", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel $required>Gewicht (kg)</FormLabel>
                <FormInput
                  type="number"
                  placeholder="75"
                  value={state.gewicht}
                  onChange={(e) => updateState("gewicht", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </StepContent>
        )

      // Step 1: Kontakt
      case 1:
        return (
          <StepContent>
            <QuestionTitle>Adresse & Kontakt</QuestionTitle>
            <QuestionDescription>Ihre Kontaktdaten</QuestionDescription>
            
            <FormGrid $columns={2}>
              <FormField>
                <FormLabel>Straße und Hausnummer (optional)</FormLabel>
                <FormInput
                  type="text"
                  placeholder="Musterstraße 123"
                  value={state.strasse}
                  onChange={(e) => updateState("strasse", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel>PLZ und Ort (optional)</FormLabel>
                <FormInput
                  type="text"
                  placeholder="12345 Musterstadt"
                  value={state.plzOrt}
                  onChange={(e) => updateState("plzOrt", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel>Land (optional)</FormLabel>
                <FormSelect
                  value={state.land}
                  onChange={(e) => updateState("land", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {formOptions.laender.map((land) => (
                    <option key={land} value={land}>{land}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>E-Mail (optional)</FormLabel>
                <FormInput
                  type="email"
                  placeholder="max@beispiel.de"
                  value={state.email}
                  onChange={(e) => updateState("email", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel $required>Telefon</FormLabel>
                <FormInput
                  type="tel"
                  placeholder="+49 123 4567890"
                  value={state.telefon}
                  onChange={(e) => updateState("telefon", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </StepContent>
        )

      // Step 2: Gesundheit 1
      case 2:
        return (
          <StepContent>
            <QuestionTitle>Gesundheitsdaten</QuestionTitle>
            <QuestionDescription>Allgemeine Gesundheitsfragen (Teil 1)</QuestionDescription>
            
            <HealthQuestionsGrid>
              <HealthQuestionCard>
                <HealthQuestionLabel>Rauchen Sie? *</HealthQuestionLabel>
                <YesNoToggle value={state.rauchen} onChange={(v) => updateState("rauchen", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter Hypertonie/Bluthochdruck? *</HealthQuestionLabel>
                <YesNoToggle value={state.hypertonie} onChange={(v) => updateState("hypertonie", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Wie ist Ihre Schilddrüsenfunktion? *</HealthQuestionLabel>
                <FormSelect
                  value={state.schilddruese}
                  onChange={(e) => updateState("schilddruese", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {formOptions.schilddrueseOptionen.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </FormSelect>
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie Schlafstörungen? *</HealthQuestionLabel>
                <YesNoToggle value={state.schlafstoerungen} onChange={(v) => updateState("schlafstoerungen", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter Diabetes? *</HealthQuestionLabel>
                <YesNoToggle value={state.diabetes} onChange={(v) => updateState("diabetes", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Wie beschreiben Sie Ihre sportliche Aktivität? *</HealthQuestionLabel>
                <FormSelect
                  value={state.sportlicheAktivitaet}
                  onChange={(e) => updateState("sportlicheAktivitaet", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {formOptions.sportOptionen.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </FormSelect>
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter COPD? *</HealthQuestionLabel>
                <YesNoToggle value={state.copd} onChange={(v) => updateState("copd", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Nehmen Sie Antidepressiva? *</HealthQuestionLabel>
                <YesNoToggle value={state.antidepressiva} onChange={(v) => updateState("antidepressiva", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Wie oft konsumieren Sie Alkohol? *</HealthQuestionLabel>
                <FormSelect
                  value={state.alkohol}
                  onChange={(e) => updateState("alkohol", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {formOptions.alkoholOptionen.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </FormSelect>
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Arbeiten Sie in Schichtarbeit? *</HealthQuestionLabel>
                <YesNoToggle value={state.schichtarbeit} onChange={(v) => updateState("schichtarbeit", v)} />
              </HealthQuestionCard>
            </HealthQuestionsGrid>
          </StepContent>
        )

      // Step 3: Gesundheit 2
      case 3:
        return (
          <StepContent>
            <QuestionTitle>Gesundheitsdaten</QuestionTitle>
            <QuestionDescription>Allergien, Ernährung und weitere Fragen (Teil 2)</QuestionDescription>
            
            <HealthQuestionsGrid>
              <HealthQuestionCard>
                <HealthQuestionLabel>Welche Allergien haben Sie? *</HealthQuestionLabel>
                <MultiSelect
                  options={formOptions.allergienOptionen}
                  value={state.allergien}
                  onChange={(v) => updateState("allergien", v)}
                  placeholder="Auswählen (Mehrfachauswahl)"
                />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie spezielle Ernährungsgewohnheiten? (optional)</HealthQuestionLabel>
                <MultiSelect
                  options={formOptions.ernaehrungOptionen}
                  value={state.ernaehrung}
                  onChange={(v) => updateState("ernaehrung", v)}
                  placeholder="Auswählen (Mehrfachauswahl)"
                />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Befinden Sie sich in einer Krebstherapie? *</HealthQuestionLabel>
                <YesNoToggle value={state.krebstherapie} onChange={(v) => updateState("krebstherapie", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Gibt es Hinweise auf ein geschwächtes Immunsystem? *</HealthQuestionLabel>
                <YesNoToggle value={state.immunsystem} onChange={(v) => updateState("immunsystem", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter Depressionen? *</HealthQuestionLabel>
                <YesNoToggle value={state.depressionen} onChange={(v) => updateState("depressionen", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie Gelenkschmerzen? *</HealthQuestionLabel>
                <YesNoToggle value={state.gelenkschmerzen} onChange={(v) => updateState("gelenkschmerzen", v)} />
              </HealthQuestionCard>
            </HealthQuestionsGrid>
            
            <FormGrid $columns={1} style={{ marginTop: '1.5rem' }}>
              <FormField>
                <FormLabel>Haben Sie regelmäßig Schmerzen? Wenn ja, wo? (optional)</FormLabel>
                <FormInput
                  type="text"
                  placeholder="z.B. Rücken, Kopf, etc."
                  value={state.schmerzen}
                  onChange={(e) => updateState("schmerzen", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </StepContent>
        )

      // Step 4: Gesundheit 3
      case 4:
        return (
          <StepContent>
            <QuestionTitle>Lebensstil</QuestionTitle>
            <QuestionDescription>Fragen zu Ihrem Lebensstil (Teil 3)</QuestionDescription>
            
            <HealthQuestionsGrid>
              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie Hautprobleme? *</HealthQuestionLabel>
                <YesNoToggle value={state.hautprobleme} onChange={(v) => updateState("hautprobleme", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Sind Sie regelmäßig Passivrauch ausgesetzt? *</HealthQuestionLabel>
                <YesNoToggle value={state.passivrauchen} onChange={(v) => updateState("passivrauchen", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Trinken Sie weniger als 1,5L Wasser am Tag? *</HealthQuestionLabel>
                <YesNoToggle value={state.wasserkonsum} onChange={(v) => updateState("wasserkonsum", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Konsumieren Sie regelmäßig gesüßte Getränke? *</HealthQuestionLabel>
                <YesNoToggle value={state.gesuessteGetraenke} onChange={(v) => updateState("gesuessteGetraenke", v)} />
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie einen erhöhten Zuckerkonsum? *</HealthQuestionLabel>
                <YesNoToggle value={state.zuckerkonsum} onChange={(v) => updateState("zuckerkonsum", v)} />
              </HealthQuestionCard>
            </HealthQuestionsGrid>
          </StepContent>
        )

      // Step 5: Körpermaße
      case 5:
        return (
          <StepContent>
            <QuestionTitle>Körpermaße</QuestionTitle>
            <QuestionDescription>Zusätzliche Körpermaße und Gesundheitsdaten</QuestionDescription>
            
            <FormGrid $columns={2}>
              <FormField>
                <FormLabel $required>Nackenumfang (cm)</FormLabel>
                <FormInput
                  type="number"
                  placeholder="38"
                  value={state.nackenumfang}
                  onChange={(e) => updateState("nackenumfang", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel $required>Hüftumfang (cm)</FormLabel>
                <FormInput
                  type="number"
                  placeholder="95"
                  value={state.hueftumfang}
                  onChange={(e) => updateState("hueftumfang", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel>Max. Herzfrequenz (berechnet)</FormLabel>
                <FormInput
                  type="text"
                  value={calculateMaxHeartRate() ? `${calculateMaxHeartRate()} bpm` : "Bitte Geburtsdatum eingeben"}
                  disabled
                  style={{ backgroundColor: '#F7F5EF' }}
                />
              </FormField>
              <FormField>
                <FormLabel>Blutgruppe (optional)</FormLabel>
                <FormSelect
                  value={state.blutgruppe}
                  onChange={(e) => updateState("blutgruppe", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {formOptions.blutgruppenOptionen.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </FormSelect>
              </FormField>
            </FormGrid>
          </StepContent>
        )

      // Step 6: Übersicht
      case 6:
        if (isSubmitted) {
          return (
            <StepContent>
              <SuccessScreen onDownloadPdf={handleDownloadPdf} />
            </StepContent>
          )
        }
        
        return (
          <StepContent>
            <QuestionTitle>Zusammenfassung</QuestionTitle>
            <QuestionDescription>Bitte überprüfen Sie Ihre Angaben</QuestionDescription>
            
            <Overview
              state={state}
              onEditStep={handleStepClick}
              consentGiven={consentGiven}
              onConsentChange={setConsentGiven}
              calculateMaxHeartRate={calculateMaxHeartRate}
            />
          </StepContent>
        )

      default:
        return null
    }
  }

  return (
    <Container>
      <MainWrapper>
        <HeaderSection>
          <HeaderCard>
            <LogoContainer>
              <LogoIcon>
                <span>A</span>
              </LogoIcon>
              <LogoText>
                <span className="brand">Anamnese</span>
                <span className="tagline">Gesundheitsformular</span>
              </LogoText>
            </LogoContainer>
            <ContactInfo>
              <div className="label">Fragen?</div>
              <div className="phone">+49 123 456 789</div>
            </ContactInfo>
          </HeaderCard>
          
          <TitleSection>
            <h1>Anamnese Formular</h1>
            <p>Bitte füllen Sie das Formular vollständig aus, um Ihre Gesundheitsdaten zu erfassen</p>
          </TitleSection>
        </HeaderSection>
        
        <MainCard>
          <CardContentWrapper>
            <StepProgress
              currentStep={currentStep}
              onStepClick={handleStepClick}
              isStepValid={isCurrentStepValid}
            />
            
            {renderStep()}
          </CardContentWrapper>
          
          {!isSubmitted && (
            <NavigationFooter>
              <div>
                {currentStep > 0 && (
                  <BackButton onClick={handleBack}>
                    <ChevronLeft className="h-5 w-5" />
                    Zurück
                  </BackButton>
                )}
              </div>
              
              <div>
                {currentStep < formSteps.length - 1 ? (
                  <NextButton 
                    onClick={handleNext}
                    disabled={!isCurrentStepValid(currentStep)}
                  >
                    Weiter
                    <ChevronRight className="h-5 w-5" />
                  </NextButton>
                ) : (
                  <SubmitButton 
                    onClick={handleSubmit}
                    disabled={!consentGiven}
                    style={{ opacity: consentGiven ? 1 : 0.5 }}
                  >
                    <Send className="h-5 w-5" />
                    Formular übermitteln
                  </SubmitButton>
                )}
              </div>
            </NavigationFooter>
          )}
        </MainCard>
      </MainWrapper>
    </Container>
  )
}
