"use client"

import { useState } from "react"
import styled from "styled-components"
import { ChevronLeft, ChevronRight, Check, Edit2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f4f7e8;
`

const MainWrapper = styled.div`
  max-width: 1536px;
  margin: 0 auto;
  padding: 1.5rem;
`

const HeaderSection = styled.div`
  margin-bottom: 3rem;
`

const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(45, 90, 61, 0.1);
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const LogoIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: #2d5a3d;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    color: white;
    font-weight: bold;
    font-size: 1.25rem;
  }
`

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  
  .brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2d5a3d;
    letter-spacing: -0.025em;
  }
  
  .tagline {
    font-size: 0.75rem;
    color: #5a6b4a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`

const ContactInfo = styled.div`
  text-align: right;
  
  .label {
    font-size: 0.875rem;
    color: #5a6b4a;
    margin-bottom: 0.25rem;
  }
  
  .phone {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d5a3d;
  }
`

const TitleSection = styled.div`
  text-align: center;
  
  h1 {
    font-size: 3rem;
    font-weight: bold;
    color: #2d5a3d;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.25rem;
    color: #5a6b4a;
  }
`

const MainCard = styled.div`
  border: 2px solid rgba(45, 90, 61, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  background: white;
`

const CardContentWrapper = styled.div`
  padding: 2rem;
`

const ProgressSection = styled.div`
  margin-bottom: 3rem;
`

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  .title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d5a3d;
  }
  
  .step-info {
    font-size: 1.125rem;
    color: #5a6b4a;
  }
`

const ProgressBarWrapper = styled.div`
  margin-bottom: 1.5rem;
  height: 0.75rem;
`

const StepNavigation = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(9, 1fr);
  }
`

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StepButton = styled.button<{
  $isActive: boolean
  $isCompleted: boolean
  $isDisabled: boolean
}>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
  
  ${(props) =>
    props.$isActive &&
    `
    background-color: #2d5a3d;
    color: white;
    border-color: #2d5a3d;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  `}
  
  ${(props) =>
    props.$isCompleted &&
    !props.$isActive &&
    `
    background-color: rgba(45, 90, 61, 0.1);
    color: #2d5a3d;
    border-color: rgba(45, 90, 61, 0.3);
    
    &:hover {
      background-color: rgba(45, 90, 61, 0.2);
    }
  `}
  
  ${(props) =>
    !props.$isCompleted &&
    !props.$isActive &&
    `
    background-color: #e8f0dc;
    color: #5a6b4a;
    border-color: rgba(90, 107, 74, 0.3);
    
    &:hover {
      background-color: rgba(232, 240, 220, 0.8);
    }
  `}
`

const StepLabel = styled.span<{ $isActive: boolean; $isCompleted: boolean }>`
  font-size: 0.75rem;
  margin-top: 0.5rem;
  text-align: center;
  line-height: 1.2;
  
  ${(props) =>
    props.$isActive &&
    `
    color: #2d5a3d;
    font-weight: 600;
  `}
  
  ${(props) =>
    props.$isCompleted &&
    !props.$isActive &&
    `
    color: #2d5a3d;
  `}
  
  ${(props) =>
    !props.$isCompleted &&
    !props.$isActive &&
    `
    color: #5a6b4a;
  `}
`

const StepContent = styled.div`
  margin-bottom: 3rem;
`

const QuestionSection = styled.div`
  margin-bottom: 2rem;
`

const QuestionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2d5a3d;
  text-align: center;
`

const QuestionDescription = styled.p`
  font-size: 1.125rem;
  color: #5a6b4a;
  text-align: center;
`

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 64rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const OptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e8f0dc;
  border-radius: 0.75rem;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: rgba(45, 90, 61, 0.3);
  }
`

const OptionCardLarge = styled(OptionCard)`
  padding: 1.5rem;
`

const OptionContent = styled.div`
  flex: 1;
  
  .title {
    font-size: 1.125rem;
    font-weight: 500;
    cursor: pointer;
    display: block;
  }
  
  .description {
    font-size: 0.875rem;
    color: #5a6b4a;
    margin-top: 0.25rem;
  }
`

const PriceOverviewCard = styled.div`
  border: 2px solid rgba(45, 90, 61, 0.2);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  background: white;
`

const PriceHeader = styled.div`
  background-color: rgba(45, 90, 61, 0.05);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(45, 90, 61, 0.1);
`

const PriceTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  
  .label {
    color: #2d5a3d;
  }
  
  .amount {
    font-size: 1.875rem;
    font-weight: bold;
    color: #ff6b35;
  }
`

const PriceContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: rgba(232, 240, 220, 0.3);
  border-radius: 0.5rem;
  
  .label {
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .price {
    font-weight: bold;
    font-size: 0.875rem;
  }
`

const DetailSection = styled.div`
  padding: 0.75rem;
  background-color: rgba(232, 240, 220, 0.3);
  border-radius: 0.5rem;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .title {
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .item {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #5a6b4a;
  }
  
  .item-price {
    font-weight: 500;
  }
`

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
`

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  border: 2px solid rgba(45, 90, 61, 0.3);
  color: #2d5a3d;
  background: transparent;
  
  &:hover {
    background-color: rgba(45, 90, 61, 0.1);
  }
`

const NextButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  background-color: #ff6b35;
  color: white;
  
  &:hover {
    background-color: rgba(255, 107, 53, 0.9);
  }
`

const FinalButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
  background-color: #ff6b35;
  color: white;
  
  &:hover {
    background-color: rgba(255, 107, 53, 0.9);
  }
`

const UrlInputSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: rgba(232, 240, 220, 0.5);
  border-radius: 0.75rem;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
  
  .label {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  input {
    font-size: 1.125rem;
    padding: 0.75rem;
    border: 2px solid #e8f0dc;
  }
`

interface CalculatorState {
  customerType: string
  websiteType: string
  hasExistingWebsite: string
  existingWebsiteUrl: string
  contentPages: string[]
  hasPhotos: string
  hasTexts: string
  hasLogo: string
  features: string[]
  comments: string
}

const initialState: CalculatorState = {
  customerType: "",
  websiteType: "",
  hasExistingWebsite: "",
  existingWebsiteUrl: "",
  contentPages: [],
  hasPhotos: "",
  hasTexts: "",
  hasLogo: "",
  features: [],
  comments: "",
}

const steps = [
  "Kundentyp",
  "Website-Art",
  "Bestehende Website",
  "Inhalte/Unterseiten",
  "Fotos/Videos",
  "Texte",
  "Logo/Design",
  "Features",
  "Übersicht",
]

const pricing = {
  customerType: {
    Privatperson: 0,
    "kleines Unternehmen": 200,
    "großes Unternehmen": 500,
  },
  websiteType: {
    "One Pager": 800,
    "Multi Pager": 1500,
  },
  hasExistingWebsite: {
    Ja: -200,
    Nein: 0,
  },
  contentPages: {
    Home: 0,
    "Über Uns": 150,
    "Online Shop": 800,
    Kontakt: 100,
    Blog: 300,
    Portfolio: 250,
    Impressum: 50,
    Datenschutz: 50,
  },
  hasPhotos: {
    Ja: 0,
    Nein: 300,
  },
  hasTexts: {
    Ja: 0,
    Nein: 400,
  },
  hasLogo: {
    Ja: 0,
    Nein: 350,
  },
  features: {
    Suchfunktion: 200,
    "Multi Language": 400,
    "PDF Download": 150,
    Zahlungssystem: 600,
    Buchungssystem: 500,
    "Social Media Integration": 100,
    Newsletter: 200,
    Kontaktformular: 100,
  },
}

const DimarLogo = () => (
  <LogoContainer>
    <LogoIcon>
      <span>D</span>
    </LogoIcon>
    <LogoText>
      <span className="brand">DIMAR</span>
      <span className="tagline">DIGITALES MARKETING</span>
    </LogoText>
  </LogoContainer>
)

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<CalculatorState>(initialState)

  const updateState = (key: keyof CalculatorState, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const calculatePrice = () => {
    let total = 0

    total += pricing.customerType[state.customerType as keyof typeof pricing.customerType] || 0
    total += pricing.websiteType[state.websiteType as keyof typeof pricing.websiteType] || 0
    total += pricing.hasExistingWebsite[state.hasExistingWebsite as keyof typeof pricing.hasExistingWebsite] || 0

    state.contentPages.forEach((page) => {
      total += pricing.contentPages[page as keyof typeof pricing.contentPages] || 0
    })

    total += pricing.hasPhotos[state.hasPhotos as keyof typeof pricing.hasPhotos] || 0
    total += pricing.hasTexts[state.hasTexts as keyof typeof pricing.hasTexts] || 0
    total += pricing.hasLogo[state.hasLogo as keyof typeof pricing.hasLogo] || 0

    state.features.forEach((feature) => {
      total += pricing.features[feature as keyof typeof pricing.features] || 0
    })

    return Math.max(total, 500) // Mindestpreis
  }

  const isStepCompleted = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return state.customerType !== ""
      case 1:
        return state.websiteType !== ""
      case 2:
        return state.hasExistingWebsite !== ""
      case 3:
        return state.contentPages.length > 0
      case 4:
        return state.hasPhotos !== ""
      case 5:
        return state.hasTexts !== ""
      case 6:
        return state.hasLogo !== ""
      case 7:
        return true // Features sind optional
      case 8:
        return true // Overview ist immer "completed"
      default:
        return false
    }
  }

  const canProceed = () => {
    return isStepCompleted(currentStep)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Wer bist du?</QuestionTitle>
              <QuestionDescription>
                Wähle deinen Kundentyp aus, um ein passendes Angebot zu erhalten
              </QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              <RadioGroup
                value={state.customerType}
                onValueChange={(value) => updateState("customerType", value)}
                className="contents"
              >
                <OptionCard>
                  <RadioGroupItem value="Privatperson" id="privatperson" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="privatperson" className="title">
                      Privatperson
                    </Label>
                  </OptionContent>
                  <Badge variant="outline" className="bg-muted">
                    Basis
                  </Badge>
                </OptionCard>
                <OptionCard>
                  <RadioGroupItem value="kleines Unternehmen" id="kleines-unternehmen" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="kleines-unternehmen" className="title">
                      Kleines Unternehmen
                    </Label>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    +200€
                  </Badge>
                </OptionCard>
                <OptionCard>
                  <RadioGroupItem value="großes Unternehmen" id="grosses-unternehmen" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="grosses-unternehmen" className="title">
                      Großes Unternehmen
                    </Label>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    +500€
                  </Badge>
                </OptionCard>
              </RadioGroup>
            </OptionsGrid>
          </StepContent>
        )

      case 1:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Was möchtest du machen?</QuestionTitle>
              <QuestionDescription>
                Wähle den Website-Typ aus, der am besten zu deinen Bedürfnissen passt
              </QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              <RadioGroup
                value={state.websiteType}
                onValueChange={(value) => updateState("websiteType", value)}
                className="contents"
              >
                <OptionCardLarge>
                  <RadioGroupItem value="One Pager" id="one-pager" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="one-pager" className="title">
                      One Pager
                    </Label>
                    <p className="description">Alle Inhalte auf einer Seite - perfekt für einfache Präsentationen</p>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    800€
                  </Badge>
                </OptionCardLarge>
                <OptionCardLarge>
                  <RadioGroupItem value="Multi Pager" id="multi-pager" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="multi-pager" className="title">
                      Multi Pager
                    </Label>
                    <p className="description">Mehrere Unterseiten - ideal für umfangreiche Websites</p>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    1.500€
                  </Badge>
                </OptionCardLarge>
              </RadioGroup>
            </OptionsGrid>
          </StepContent>
        )

      case 2:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Hast du schon eine Website?</QuestionTitle>
              <QuestionDescription>
                Falls ja, können wir bestehende Inhalte übernehmen und sparen Zeit
              </QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              <RadioGroup
                value={state.hasExistingWebsite}
                onValueChange={(value) => updateState("hasExistingWebsite", value)}
                className="contents"
              >
                <OptionCard>
                  <RadioGroupItem value="Ja" id="website-ja" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="website-ja" className="title">
                      Ja, ich habe bereits eine Website
                    </Label>
                  </OptionContent>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    -200€
                  </Badge>
                </OptionCard>
                <OptionCard>
                  <RadioGroupItem value="Nein" id="website-nein" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="website-nein" className="title">
                      Nein, das wird meine erste Website
                    </Label>
                  </OptionContent>
                </OptionCard>
              </RadioGroup>
            </OptionsGrid>
            {state.hasExistingWebsite === "Ja" && (
              <UrlInputSection>
                <Label htmlFor="website-url" className="label">
                  Website URL:
                </Label>
                <Input
                  id="website-url"
                  placeholder="https://deine-website.de"
                  value={state.existingWebsiteUrl}
                  onChange={(e) => updateState("existingWebsiteUrl", e.target.value)}
                />
              </UrlInputSection>
            )}
          </StepContent>
        )

      case 3:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>
                {state.websiteType === "One Pager"
                  ? "Welche Inhalte möchtest du haben?"
                  : "Welche Unterseiten möchtest du haben?"}
              </QuestionTitle>
              <QuestionDescription>
                Wähle alle gewünschten {state.websiteType === "One Pager" ? "Inhalte" : "Unterseiten"} aus
              </QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              {Object.keys(pricing.contentPages).map((page) => (
                <OptionCard key={page}>
                  <Checkbox
                    id={page}
                    checked={state.contentPages.includes(page)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateState("contentPages", [...state.contentPages, page])
                      } else {
                        updateState(
                          "contentPages",
                          state.contentPages.filter((p) => p !== page),
                        )
                      }
                    }}
                    className="border-primary"
                  />
                  <OptionContent>
                    <Label htmlFor={page} className="title">
                      {page}
                    </Label>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    +{pricing.contentPages[page as keyof typeof pricing.contentPages]}€
                  </Badge>
                </OptionCard>
              ))}
            </OptionsGrid>
          </StepContent>
        )

      case 4:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Hast du schon verwendbare Fotos/Videos?</QuestionTitle>
              <QuestionDescription>
                Professionelle Bilder sind wichtig für eine ansprechende Website
              </QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              <RadioGroup
                value={state.hasPhotos}
                onValueChange={(value) => updateState("hasPhotos", value)}
                className="contents"
              >
                <OptionCardLarge>
                  <RadioGroupItem value="Ja" id="photos-ja" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="photos-ja" className="title">
                      Ja, ich habe bereits Fotos/Videos
                    </Label>
                    <p className="description">Perfekt! Wir können deine vorhandenen Medien verwenden</p>
                  </OptionContent>
                </OptionCardLarge>
                <OptionCardLarge>
                  <RadioGroupItem value="Nein" id="photos-nein" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="photos-nein" className="title">
                      Nein, ich benötige Unterstützung
                    </Label>
                    <p className="description">Wir erstellen oder beschaffen professionelle Bilder für dich</p>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    +300€
                  </Badge>
                </OptionCardLarge>
              </RadioGroup>
            </OptionsGrid>
          </StepContent>
        )

      case 5:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Hast du schon verwendbare Texte?</QuestionTitle>
              <QuestionDescription>Gute Texte sind entscheidend für den Erfolg deiner Website</QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              <RadioGroup
                value={state.hasTexts}
                onValueChange={(value) => updateState("hasTexts", value)}
                className="contents"
              >
                <OptionCardLarge>
                  <RadioGroupItem value="Ja" id="texts-ja" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="texts-ja" className="title">
                      Ja, ich habe bereits Texte
                    </Label>
                    <p className="description">Großartig! Wir können deine vorhandenen Inhalte verwenden</p>
                  </OptionContent>
                </OptionCardLarge>
                <OptionCardLarge>
                  <RadioGroupItem value="Nein" id="texts-nein" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="texts-nein" className="title">
                      Nein, ich benötige Texterstellung
                    </Label>
                    <p className="description">Wir erstellen professionelle, SEO-optimierte Texte für dich</p>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    +400€
                  </Badge>
                </OptionCardLarge>
              </RadioGroup>
            </OptionsGrid>
          </StepContent>
        )

      case 6:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Hast du schon ein Firmenlogo oder Design-Konzept?</QuestionTitle>
              <QuestionDescription>Ein einheitliches Design ist wichtig für deine Markenidentität</QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              <RadioGroup
                value={state.hasLogo}
                onValueChange={(value) => updateState("hasLogo", value)}
                className="contents"
              >
                <OptionCardLarge>
                  <RadioGroupItem value="Ja" id="logo-ja" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="logo-ja" className="title">
                      Ja, ich habe bereits ein Logo/Design
                    </Label>
                    <p className="description">Perfekt! Wir verwenden dein bestehendes Corporate Design</p>
                  </OptionContent>
                </OptionCardLarge>
                <OptionCardLarge>
                  <RadioGroupItem value="Nein" id="logo-nein" className="border-primary" />
                  <OptionContent>
                    <Label htmlFor="logo-nein" className="title">
                      Nein, ich benötige ein Design-Konzept
                    </Label>
                    <p className="description">Wir entwickeln ein individuelles Design-Konzept für dich</p>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    +350€
                  </Badge>
                </OptionCardLarge>
              </RadioGroup>
            </OptionsGrid>
          </StepContent>
        )

      case 7:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Hast du noch besondere Feature-Wünsche?</QuestionTitle>
              <QuestionDescription>
                Wähle zusätzliche Funktionen aus, die deine Website noch besser machen
              </QuestionDescription>
            </QuestionSection>
            <OptionsGrid>
              {Object.keys(pricing.features).map((feature) => (
                <OptionCard key={feature}>
                  <Checkbox
                    id={feature}
                    checked={state.features.includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateState("features", [...state.features, feature])
                      } else {
                        updateState(
                          "features",
                          state.features.filter((f) => f !== feature),
                        )
                      }
                    }}
                    className="border-primary"
                  />
                  <OptionContent>
                    <Label htmlFor={feature} className="title">
                      {feature}
                    </Label>
                  </OptionContent>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    +{pricing.features[feature as keyof typeof pricing.features]}€
                  </Badge>
                </OptionCard>
              ))}
            </OptionsGrid>
          </StepContent>
        )

      case 8:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Dein individuelles Angebot</QuestionTitle>
              <QuestionDescription>
                Hier ist eine Übersicht deiner Auswahl und des kalkulierten Preises
              </QuestionDescription>
            </QuestionSection>

            <PriceOverviewCard>
              <PriceHeader>
                <PriceTitle>
                  <span className="label">Preisübersicht</span>
                  <span className="amount">{calculatePrice()}€</span>
                </PriceTitle>
              </PriceHeader>
              <PriceContent>
                <PriceGrid>
                  <PriceItem>
                    <span className="label">Kundentyp: {state.customerType}</span>
                    <div className="actions">
                      <span className="price">
                        +{pricing.customerType[state.customerType as keyof typeof pricing.customerType] || 0}€
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(0)}
                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </PriceItem>

                  <PriceItem>
                    <span className="label">Website-Typ: {state.websiteType}</span>
                    <div className="actions">
                      <span className="price">
                        +{pricing.websiteType[state.websiteType as keyof typeof pricing.websiteType] || 0}€
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(1)}
                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </PriceItem>

                  <PriceItem>
                    <span className="label">Bestehende Website: {state.hasExistingWebsite}</span>
                    <div className="actions">
                      <span className="price">
                        {pricing.hasExistingWebsite[
                          state.hasExistingWebsite as keyof typeof pricing.hasExistingWebsite
                        ] || 0}
                        €
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(2)}
                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </PriceItem>

                  <PriceItem>
                    <span className="label">Fotos/Videos vorhanden: {state.hasPhotos}</span>
                    <div className="actions">
                      <span className="price">
                        +{pricing.hasPhotos[state.hasPhotos as keyof typeof pricing.hasPhotos] || 0}€
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(4)}
                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </PriceItem>

                  <PriceItem>
                    <span className="label">Texte vorhanden: {state.hasTexts}</span>
                    <div className="actions">
                      <span className="price">
                        +{pricing.hasTexts[state.hasTexts as keyof typeof pricing.hasTexts] || 0}€
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(5)}
                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </PriceItem>

                  <PriceItem>
                    <span className="label">Logo/Design vorhanden: {state.hasLogo}</span>
                    <div className="actions">
                      <span className="price">
                        +{pricing.hasLogo[state.hasLogo as keyof typeof pricing.hasLogo] || 0}€
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(6)}
                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </PriceItem>

                  <DetailSection>
                    <div className="header">
                      <span className="title">Inhalte/Unterseiten:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(3)}
                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="items">
                      {state.contentPages.map((page) => (
                        <div key={page} className="item">
                          <span>• {page}</span>
                          <span className="item-price">
                            +{pricing.contentPages[page as keyof typeof pricing.contentPages]}€
                          </span>
                        </div>
                      ))}
                    </div>
                  </DetailSection>

                  {state.features.length > 0 && (
                    <DetailSection>
                      <div className="header">
                        <span className="title">Zusätzliche Features:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => goToStep(7)}
                          className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="items">
                        {state.features.map((feature) => (
                          <div key={feature} className="item">
                            <span>• {feature}</span>
                            <span className="item-price">
                              +{pricing.features[feature as keyof typeof pricing.features]}€
                            </span>
                          </div>
                        ))}
                      </div>
                    </DetailSection>
                  )}
                </PriceGrid>
              </PriceContent>
            </PriceOverviewCard>

            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-primary">Hast du noch Anmerkungen?</CardTitle>
                <CardDescription>Teile uns weitere Details oder spezielle Wünsche mit</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Beschreibe hier deine besonderen Wünsche, Vorstellungen oder Fragen..."
                  value={state.comments}
                  onChange={(e) => updateState("comments", e.target.value)}
                  className="min-h-[120px] text-lg border-2"
                />
              </CardContent>
            </Card>
          </StepContent>
        )

      default:
        return null
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Container>
      <MainWrapper>
        {/* Header */}
        <HeaderSection>
          <HeaderCard>
            <DimarLogo />
            <ContactInfo>
              <div className="label">Kostenlose Beratung</div>
              <div className="phone">+49 (0) 123 456 789</div>
            </ContactInfo>
          </HeaderCard>

          <TitleSection>
            <h1>Website Preiskalkulator</h1>
            <p>Erhalte in wenigen Schritten dein individuelles Angebot für deine neue Website</p>
          </TitleSection>
        </HeaderSection>

        <MainCard>
          <CardContentWrapper>
            {/* Progress Bar */}
            <ProgressSection>
              <ProgressHeader>
                <span className="title">Fortschritt</span>
                <span className="step-info">
                  Schritt {currentStep + 1} von {steps.length}
                </span>
              </ProgressHeader>
              <ProgressBarWrapper>
                <Progress value={progress} className="h-3" />
              </ProgressBarWrapper>

              {/* Step Navigation */}
              <StepNavigation>
                {steps.map((step, index) => (
                  <StepItem key={index}>
                    <StepButton
                      onClick={() => goToStep(index)}
                      disabled={index > currentStep && !isStepCompleted(currentStep)}
                      $isActive={currentStep === index}
                      $isCompleted={isStepCompleted(index)}
                      $isDisabled={index > currentStep && !isStepCompleted(currentStep)}
                    >
                      {isStepCompleted(index) && index !== currentStep ? <Check className="h-4 w-4" /> : index + 1}
                    </StepButton>
                    <StepLabel $isActive={currentStep === index} $isCompleted={isStepCompleted(index)}>
                      {step}
                    </StepLabel>
                  </StepItem>
                ))}
              </StepNavigation>
            </ProgressSection>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <NavigationButtons>
              <BackButton variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ChevronLeft className="h-5 w-5" />
                Zurück
              </BackButton>

              {currentStep < steps.length - 1 ? (
                <NextButton onClick={nextStep} disabled={!canProceed()}>
                  Weiter
                  <ChevronRight className="h-5 w-5" />
                </NextButton>
              ) : (
                <FinalButton>
                  <Check className="h-5 w-5" />
                  Angebot einholen
                  <ArrowRight className="h-5 w-5" />
                </FinalButton>
              )}
            </NavigationButtons>
          </CardContentWrapper>
        </MainCard>
      </MainWrapper>
    </Container>
  )
}
