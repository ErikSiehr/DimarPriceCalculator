"use client"

import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { ChevronLeft, ChevronRight, Check, Edit2, Send, Mail, Download, FileText, Shield, X, ChevronDown } from "lucide-react"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #F7F5EF;
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
  border: 2px solid rgba(168, 148, 84, 0.1);
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const LogoIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: #A89454;
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
    color: #3A3429;
    letter-spacing: -0.025em;
  }
  
  .tagline {
    font-size: 0.75rem;
    color: #A89454;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`

const ContactInfo = styled.div`
  text-align: right;
  
  .label {
    font-size: 0.875rem;
    color: #A89454;
    margin-bottom: 0.25rem;
  }
  
  .phone {
    font-size: 1.125rem;
    font-weight: 600;
    color: #3A3429;
  }
`

const TitleSection = styled.div`
  text-align: center;
  
  h1 {
    font-size: 3rem;
    font-weight: bold;
    color: #3A3429;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.25rem;
    color: #A89454;
  }
`

const MainCard = styled.div`
  border: 2px solid rgba(168, 148, 84, 0.15);
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
    color: #3A3429;
  }
  
  .step-info {
    font-size: 1.125rem;
    color: #A89454;
  }
`

const ProgressBarWrapper = styled.div`
  margin-bottom: 1.5rem;
  height: 0.75rem;
`

const StepNavigation = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(7, 1fr);
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
    background-color: #A89454;
    color: white;
    border-color: #A89454;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  `}
  
  ${(props) =>
    props.$isCompleted &&
    !props.$isActive &&
    `
    background-color: rgba(168, 148, 84, 0.1);
    color: #3A3429;
    border-color: rgba(168, 148, 84, 0.3);
    
    &:hover {
      background-color: rgba(168, 148, 84, 0.2);
    }
  `}
  
  ${(props) =>
    !props.$isCompleted &&
    !props.$isActive &&
    `
    background-color: #F7F5EF;
    color: #A89454;
    border-color: rgba(168, 148, 84, 0.3);
    
    &:hover {
      background-color: rgba(247, 245, 239, 0.8);
    }
  `}
`

const StepLabel = styled.span<{ $isActive: boolean; $isCompleted: boolean }>`
  font-size: 0.65rem;
  margin-top: 0.5rem;
  text-align: center;
  line-height: 1.2;
  
  ${(props) =>
    props.$isActive &&
    `
    color: #3A3429;
    font-weight: 600;
  `}
  
  ${(props) =>
    props.$isCompleted &&
    !props.$isActive &&
    `
    color: #3A3429;
  `}
  
  ${(props) =>
    !props.$isCompleted &&
    !props.$isActive &&
    `
    color: #A89454;
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
  color: #3A3429;
  text-align: center;
`

const QuestionDescription = styled.p`
  font-size: 1.125rem;
  color: #A89454;
  text-align: center;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FormLabel = styled(Label)`
  font-size: 1rem;
  font-weight: 500;
  color: #3A3429;
`

const FormInput = styled(Input)`
  font-size: 1rem;
  padding: 0.75rem;
  border: 2px solid rgba(168, 148, 84, 0.3);
  border-radius: 0.5rem;
  
  &:focus {
    border-color: #A89454;
    outline: none;
  }
`

const FormSelect = styled.select`
  font-size: 1rem;
  padding: 0.75rem;
  border: 2px solid rgba(168, 148, 84, 0.3);
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  color: #3A3429;
  
  &:focus {
    border-color: #A89454;
    outline: none;
  }
`

const MultiSelectContainer = styled.div`
  position: relative;
`

const MultiSelectTrigger = styled.button<{ $hasSelection: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border: 2px solid rgba(168, 148, 84, 0.3);
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  text-align: left;
  color: ${props => props.$hasSelection ? '#3A3429' : '#A89454'};
  font-size: 1rem;
  
  &:focus {
    border-color: #A89454;
    outline: none;
  }
  
  &:hover {
    border-color: #A89454;
  }
`

const MultiSelectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  flex: 1;
`

const MultiSelectTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(168, 148, 84, 0.15);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #3A3429;
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: #A89454;
    
    &:hover {
      color: #3A3429;
    }
  }
`

const MultiSelectDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid rgba(168, 148, 84, 0.3);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow-y: auto;
  z-index: 50;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`

const MultiSelectOption = styled.label<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  background-color: ${props => props.$isSelected ? 'rgba(168, 148, 84, 0.08)' : 'white'};
  
  &:hover {
    background-color: rgba(168, 148, 84, 0.12);
  }
  
  input {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: #A89454;
    cursor: pointer;
  }
  
  span {
    color: #3A3429;
    font-size: 0.95rem;
  }
`

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ToggleButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => (props.$isActive ? "#A89454" : "rgba(168, 148, 84, 0.3)")};
  border-radius: 0.5rem;
  background: ${(props) => (props.$isActive ? "#A89454" : "white")};
  color: ${(props) => (props.$isActive ? "white" : "#3A3429")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #A89454;
  }
`

const HealthQuestionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 64rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const HealthQuestionCard = styled.div`
  padding: 1rem;
  border: 2px solid rgba(168, 148, 84, 0.2);
  border-radius: 0.75rem;
  background: white;
  display: flex;
  flex-direction: column;
  min-height: 120px;
`

const HealthQuestionLabel = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #3A3429;
  margin-bottom: auto;
  padding-bottom: 0.75rem;
  min-height: 2.5rem;
  display: flex;
  align-items: flex-start;
`

const OverviewCard = styled.div`
  border: 2px solid rgba(168, 148, 84, 0.15);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  background: white;
  margin-bottom: 2rem;
`

const OverviewHeader = styled.div`
  background-color: rgba(168, 148, 84, 0.05);
  padding: 1.5rem;
  border-bottom: 2px solid #A89454;
  
  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3A3429;
  }
`

const OverviewContent = styled.div`
  padding: 1rem;
`

const OverviewSection = styled.div`
  padding: 1rem;
  background-color: rgba(168, 148, 84, 0.08);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #A89454;
  
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
    color: #3A3429;
  }
`

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const OverviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  padding: 0.25rem 0;
  
  .label {
    color: #A89454;
  }
  
  .value {
    font-weight: 500;
    color: #3A3429;
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
  border: 2px solid rgba(168, 148, 84, 0.3);
  color: #3A3429;
  background: transparent;
  
  &:hover {
    background-color: rgba(168, 148, 84, 0.08);
  }
`

const NextButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  background-color: #A89454;
  color: white;
  
  &:hover {
    background-color: rgba(168, 148, 84, 0.9);
  }
`

const SubmitButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
  background-color: #A89454;
  color: white;
  
  &:hover {
    background-color: rgba(168, 148, 84, 0.9);
  }
`

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  .icon {
    width: 5rem;
    height: 5rem;
    background-color: #A89454;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }
  
  h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #3A3429;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.125rem;
    color: #A89454;
    margin-bottom: 2rem;
  }
`

const EmailSection = styled.div`
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: rgba(168, 148, 84, 0.08);
  border-radius: 0.75rem;
  
  .label {
    font-size: 1rem;
    font-weight: 500;
    color: #3A3429;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  .input-group {
    display: flex;
    gap: 0.5rem;
  }
`

const ConsentSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: rgba(168, 148, 84, 0.05);
  border: 2px solid rgba(168, 148, 84, 0.2);
  border-radius: 0.75rem;
`

const ConsentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #3A3429;
  }
`

const ConsentText = styled.div`
  font-size: 0.875rem;
  color: #A89454;
  line-height: 1.6;
  
  ul {
    margin: 1rem 0;
    padding-left: 1.25rem;
    
    li {
      margin-bottom: 0.5rem;
      position: relative;
      
      &::marker {
        color: #A89454;
      }
    }
  }
  
  strong {
    color: #3A3429;
  }
`

const ConsentCheckbox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid rgba(168, 148, 84, 0.3);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #A89454;
  }
  
  input {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.125rem;
    accent-color: #A89454;
    cursor: pointer;
  }
  
  span {
    font-size: 0.9rem;
    color: #3A3429;
    font-weight: 500;
  }
`

const PdfSuccessSection = styled.div`
  max-width: 36rem;
  margin: 2rem auto 0;
  padding: 1.5rem;
  background-color: rgba(168, 148, 84, 0.08);
  border-radius: 0.75rem;
  text-align: center;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #3A3429;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: #A89454;
    margin-bottom: 1.5rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`

const PdfButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #A89454;
  color: white;
  
  &:hover {
    background-color: rgba(168, 148, 84, 0.9);
  }
`

const EmailPdfSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #A89454;
  
  .label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #3A3429;
    margin-bottom: 0.75rem;
    display: block;
  }
  
  .input-group {
    display: flex;
    gap: 0.5rem;
    max-width: 28rem;
    margin: 0 auto;
  }
`

interface AnamneseState {
  // Basisdaten
  vorname: string
  nachname: string
  geburtsdatum: string
  koerpergroesse: string
  gewicht: string
  geschlecht: string
  
  // Adresse & Kontakt
  strasse: string
  plzOrt: string
  land: string
  email: string
  telefon: string
  
  // Gesundheitsdaten Teil 1
  rauchen: string
  hypertonie: string
  schilddruese: string
  schlafstoerungen: string
  diabetes: string
  sportlicheAktivitaet: string
  copd: string
  antidepressiva: string
  alkohol: string
  schichtarbeit: string
  
  // Gesundheitsdaten Teil 2
  allergien: string[]
  ernaehrung: string[]
  krebstherapie: string
  immunsystem: string
  depressionen: string
  gelenkschmerzen: string
  schmerzen: string
  
  // Gesundheitsdaten Teil 3
  hautprobleme: string
  passivrauchen: string
  wasserkonsum: string
  gesuessteGetraenke: string
  zuckerkonsum: string
  
  // Körpermaße
  nackenumfang: string
  hueftumfang: string
  maxHerzfrequenz: string
  blutgruppe: string
}

const initialState: AnamneseState = {
  vorname: "",
  nachname: "",
  geburtsdatum: "",
  koerpergroesse: "",
  gewicht: "",
  geschlecht: "",
  strasse: "",
  plzOrt: "",
  land: "",
  email: "",
  telefon: "",
  rauchen: "",
  hypertonie: "",
  schilddruese: "",
  schlafstoerungen: "",
  diabetes: "",
  sportlicheAktivitaet: "",
  copd: "",
  antidepressiva: "",
  alkohol: "",
  schichtarbeit: "",
  allergien: [],
  ernaehrung: [],
  krebstherapie: "",
  immunsystem: "",
  depressionen: "",
  gelenkschmerzen: "",
  schmerzen: "",
  hautprobleme: "",
  passivrauchen: "",
  wasserkonsum: "",
  gesuessteGetraenke: "",
  zuckerkonsum: "",
  nackenumfang: "",
  hueftumfang: "",
  maxHerzfrequenz: "",
  blutgruppe: "",
}

const steps = [
  "Basisdaten",
  "Kontakt",
  "Gesundheit 1",
  "Gesundheit 2",
  "Gesundheit 3",
  "Körpermaße",
  "Übersicht",
]

const laender = [
  "Deutschland",
  "Österreich",
  "Schweiz",
  "Belgien",
  "Niederlande",
  "Luxemburg",
  "Frankreich",
  "Italien",
  "Spanien",
  "Andere",
]

const allergienOptionen = [
  "Keine",
  "Pollen",
  "Hausstaubmilben",
  "Tierhaare",
  "Nahrungsmittel",
  "Medikamente",
  "Insektengift",
  "Latex",
  "Schimmelpilze",
  "Kontaktallergien",
  "Mehrere",
]

const ernaehrungOptionen = [
  "Keine besonderen",
  "Vegetarisch",
  "Vegan",
  "Glutenfrei",
  "Laktosefrei",
  "Halal",
  "Koscher",
  "Low Carb",
  "Ketogen",
  "Andere",
]

const blutgruppenOptionen = [
  "Unbekannt",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "0+",
  "0-",
]

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

export default function AnamneseFormular() {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<AnamneseState>(initialState)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [sendEmail, setSendEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const [allergienOpen, setAllergienOpen] = useState(false)
  const [ernaehrungOpen, setErnaehrungOpen] = useState(false)
  const allergienRef = useRef<HTMLDivElement>(null)
  const ernaehrungRef = useRef<HTMLDivElement>(null)
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (allergienRef.current && !allergienRef.current.contains(event.target as Node)) {
        setAllergienOpen(false)
      }
      if (ernaehrungRef.current && !ernaehrungRef.current.contains(event.target as Node)) {
        setErnaehrungOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateState = (key: keyof AnamneseState, value: string | string[]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }
  
  const toggleArrayValue = (key: "allergien" | "ernaehrung", value: string) => {
    setState((prev) => {
      const currentArray = prev[key]
      if (currentArray.includes(value)) {
        return { ...prev, [key]: currentArray.filter(v => v !== value) }
      } else {
        return { ...prev, [key]: [...currentArray, value] }
      }
    })
  }
  
  const removeArrayValue = (key: "allergien" | "ernaehrung", value: string) => {
    setState((prev) => ({
      ...prev,
      [key]: prev[key].filter(v => v !== value)
    }))
  }

  // Berechne maximale Herzfrequenz basierend auf Geburtsdatum
  const calculateMaxHeartRate = () => {
    if (!state.geburtsdatum) return ""
    const birthDate = new Date(state.geburtsdatum)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return String(220 - age)
  }

  const isStepCompleted = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return state.vorname !== "" && state.nachname !== "" && state.geburtsdatum !== "" && 
               state.koerpergroesse !== "" && state.gewicht !== "" && state.geschlecht !== ""
      case 1:
        return state.telefon !== ""
      case 2:
        return state.rauchen !== "" && state.hypertonie !== "" && state.schilddruese !== "" &&
               state.schlafstoerungen !== "" && state.diabetes !== "" && state.sportlicheAktivitaet !== "" &&
               state.copd !== "" && state.antidepressiva !== "" && state.alkohol !== "" && state.schichtarbeit !== ""
      case 3:
        return state.allergien.length > 0 && state.krebstherapie !== "" && state.immunsystem !== "" &&
               state.depressionen !== "" && state.gelenkschmerzen !== ""
      case 4:
        return state.hautprobleme !== "" && state.passivrauchen !== "" && state.wasserkonsum !== "" &&
               state.gesuessteGetraenke !== "" && state.zuckerkonsum !== ""
      case 5:
        return state.nackenumfang !== "" && state.hueftumfang !== ""
      case 6:
        return true
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

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPos = 20
    const lineHeight = 7
    const sectionGap = 12
    const leftMargin = 20
    const rightMargin = pageWidth - 20
    
    // Brand colors for PDF: Primary text #3A3429 (58, 52, 41), Accent #A89454 (168, 148, 84)
    const primaryColor = { r: 58, g: 52, b: 41 }
    const accentColor = { r: 168, g: 148, b: 84 }
    
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
    addDataRow("Max. Herzfrequenz:", `${calculateMaxHeartRate()} bpm`)
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

  const handleSubmit = () => {
    if (!consentGiven) return
    setIsSubmitted(true)
    setPdfGenerated(true)
  }

  const handleDownloadPdf = () => {
    const doc = generatePDF()
    doc.save(`Anamnese_${state.vorname}_${state.nachname}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handleSendEmail = () => {
    if (sendEmail) {
      // Hier würde normalerweise die E-Mail-Logik mit PDF-Anhang implementiert werden
      // In einer echten Implementierung würde hier ein API-Call erfolgen
      setEmailSent(true)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Basisdaten</QuestionTitle>
              <QuestionDescription>
                Bitte geben Sie Ihre persönlichen Grunddaten ein
              </QuestionDescription>
            </QuestionSection>
            <FormGrid>
              <FormField>
                <FormLabel htmlFor="vorname">Vorname *</FormLabel>
                <FormInput
                  id="vorname"
                  placeholder="Max"
                  value={state.vorname}
                  onChange={(e) => updateState("vorname", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="nachname">Nachname *</FormLabel>
                <FormInput
                  id="nachname"
                  placeholder="Mustermann"
                  value={state.nachname}
                  onChange={(e) => updateState("nachname", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="geburtsdatum">Geburtsdatum *</FormLabel>
                <FormInput
                  id="geburtsdatum"
                  type="date"
                  value={state.geburtsdatum}
                  onChange={(e) => updateState("geburtsdatum", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="geschlecht">Biologisches Geschlecht *</FormLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.geschlecht === "Männlich"}
                    onClick={() => updateState("geschlecht", "Männlich")}
                  >
                    Männlich
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.geschlecht === "Weiblich"}
                    onClick={() => updateState("geschlecht", "Weiblich")}
                  >
                    Weiblich
                  </ToggleButton>
                </ToggleGroup>
              </FormField>
              <FormField>
                <FormLabel htmlFor="koerpergroesse">Körpergröße (cm) *</FormLabel>
                <FormInput
                  id="koerpergroesse"
                  type="number"
                  placeholder="175"
                  value={state.koerpergroesse}
                  onChange={(e) => updateState("koerpergroesse", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="gewicht">Gewicht (kg) *</FormLabel>
                <FormInput
                  id="gewicht"
                  type="number"
                  placeholder="70"
                  value={state.gewicht}
                  onChange={(e) => updateState("gewicht", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </StepContent>
        )

      case 1:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Adresse & Kontakt</QuestionTitle>
              <QuestionDescription>
                Wie können wir Sie erreichen?
              </QuestionDescription>
            </QuestionSection>
            <FormGrid>
              <FormField>
                <FormLabel htmlFor="strasse">Straße + Nr. (optional)</FormLabel>
                <FormInput
                  id="strasse"
                  placeholder="Musterstraße 123"
                  value={state.strasse}
                  onChange={(e) => updateState("strasse", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="plzOrt">PLZ + Ort (optional)</FormLabel>
                <FormInput
                  id="plzOrt"
                  placeholder="12345 Musterstadt"
                  value={state.plzOrt}
                  onChange={(e) => updateState("plzOrt", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="land">Land (optional)</FormLabel>
                <FormSelect
                  id="land"
                  value={state.land}
                  onChange={(e) => updateState("land", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {laender.map((land) => (
                    <option key={land} value={land}>{land}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel htmlFor="email">E-Mail Adresse (optional)</FormLabel>
                <FormInput
                  id="email"
                  type="email"
                  placeholder="max@beispiel.de"
                  value={state.email}
                  onChange={(e) => updateState("email", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="telefon">Telefon *</FormLabel>
                <FormInput
                  id="telefon"
                  type="tel"
                  placeholder="+49 123 456789"
                  value={state.telefon}
                  onChange={(e) => updateState("telefon", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </StepContent>
        )

      case 2:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Gesundheitsdaten</QuestionTitle>
              <QuestionDescription>
                Allgemeine Gesundheitsfragen (Teil 1)
              </QuestionDescription>
            </QuestionSection>
            <HealthQuestionGrid>
              <HealthQuestionCard>
                <HealthQuestionLabel>Rauchen Sie? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.rauchen === "Ja"}
                    onClick={() => updateState("rauchen", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.rauchen === "Nein"}
                    onClick={() => updateState("rauchen", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter Hypertonie/Bluthochdruck? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.hypertonie === "Ja"}
                    onClick={() => updateState("hypertonie", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.hypertonie === "Nein"}
                    onClick={() => updateState("hypertonie", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Wie ist Ihre Schilddrüsenfunktion? *</HealthQuestionLabel>
                <FormSelect
                  value={state.schilddruese}
                  onChange={(e) => updateState("schilddruese", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Normal">Normal</option>
                  <option value="Unterfunktion">Unterfunktion</option>
                  <option value="Überfunktion">Überfunktion</option>
                </FormSelect>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie Schlafstörungen? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.schlafstoerungen === "Ja"}
                    onClick={() => updateState("schlafstoerungen", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.schlafstoerungen === "Nein"}
                    onClick={() => updateState("schlafstoerungen", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter Diabetes? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.diabetes === "Ja"}
                    onClick={() => updateState("diabetes", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.diabetes === "Nein"}
                    onClick={() => updateState("diabetes", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Wie beschreiben Sie Ihre sportliche Aktivität? *</HealthQuestionLabel>
                <FormSelect
                  value={state.sportlicheAktivitaet}
                  onChange={(e) => updateState("sportlicheAktivitaet", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Athlet">Athlet</option>
                  <option value="Reguläres Training">Reguläres Training</option>
                  <option value="Leicht trainiert">Leicht trainiert</option>
                  <option value="Untrainiert">Untrainiert</option>
                </FormSelect>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter COPD? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.copd === "Ja"}
                    onClick={() => updateState("copd", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.copd === "Nein"}
                    onClick={() => updateState("copd", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Nehmen Sie Antidepressiva? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.antidepressiva === "Ja"}
                    onClick={() => updateState("antidepressiva", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.antidepressiva === "Nein"}
                    onClick={() => updateState("antidepressiva", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Trinken Sie Alkohol? *</HealthQuestionLabel>
                <FormSelect
                  value={state.alkohol}
                  onChange={(e) => updateState("alkohol", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Nie">Nie</option>
                  <option value="Gelegentlich">Gelegentlich</option>
                  <option value="Regelmäßig">Regelmäßig</option>
                </FormSelect>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Arbeiten Sie im Schicht- oder Nachtdienst? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.schichtarbeit === "Ja"}
                    onClick={() => updateState("schichtarbeit", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.schichtarbeit === "Nein"}
                    onClick={() => updateState("schichtarbeit", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>
            </HealthQuestionGrid>
          </StepContent>
        )

      case 3:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Gesundheitsdaten</QuestionTitle>
              <QuestionDescription>
                Weitere Gesundheitsfragen (Teil 2)
              </QuestionDescription>
            </QuestionSection>
            <HealthQuestionGrid>
<HealthQuestionCard>
                <HealthQuestionLabel>Welche Allergien haben Sie? *</HealthQuestionLabel>
                <MultiSelectContainer ref={allergienRef}>
                  <MultiSelectTrigger 
                    type="button"
                    $hasSelection={state.allergien.length > 0}
                    onClick={() => setAllergienOpen(!allergienOpen)}
                  >
                    <MultiSelectTags>
                      {state.allergien.length === 0 ? (
                        <span>Bitte auswählen (Mehrfachauswahl möglich)</span>
                      ) : (
                        state.allergien.map(item => (
                          <MultiSelectTag key={item}>
                            {item}
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeArrayValue("allergien", item); }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </MultiSelectTag>
                        ))
                      )}
                    </MultiSelectTags>
                    <ChevronDown className="h-4 w-4 text-[#A89454]" />
                  </MultiSelectTrigger>
                  <MultiSelectDropdown $isOpen={allergienOpen}>
                    {allergienOptionen.filter(o => o !== "Mehrere").map((option) => (
                      <MultiSelectOption 
                        key={option} 
                        $isSelected={state.allergien.includes(option)}
                      >
                        <input
                          type="checkbox"
                          checked={state.allergien.includes(option)}
                          onChange={() => toggleArrayValue("allergien", option)}
                        />
                        <span>{option}</span>
                      </MultiSelectOption>
                    ))}
                  </MultiSelectDropdown>
                </MultiSelectContainer>
              </HealthQuestionCard>
              
              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie spezielle Ernährungsgewohnheiten? (optional)</HealthQuestionLabel>
                <MultiSelectContainer ref={ernaehrungRef}>
                  <MultiSelectTrigger 
                    type="button"
                    $hasSelection={state.ernaehrung.length > 0}
                    onClick={() => setErnaehrungOpen(!ernaehrungOpen)}
                  >
                    <MultiSelectTags>
                      {state.ernaehrung.length === 0 ? (
                        <span>Bitte auswählen (Mehrfachauswahl möglich)</span>
                      ) : (
                        state.ernaehrung.map(item => (
                          <MultiSelectTag key={item}>
                            {item}
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeArrayValue("ernaehrung", item); }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </MultiSelectTag>
                        ))
                      )}
                    </MultiSelectTags>
                    <ChevronDown className="h-4 w-4 text-[#A89454]" />
                  </MultiSelectTrigger>
                  <MultiSelectDropdown $isOpen={ernaehrungOpen}>
                    {ernaehrungOptionen.map((option) => (
                      <MultiSelectOption 
                        key={option} 
                        $isSelected={state.ernaehrung.includes(option)}
                      >
                        <input
                          type="checkbox"
                          checked={state.ernaehrung.includes(option)}
                          onChange={() => toggleArrayValue("ernaehrung", option)}
                        />
                        <span>{option}</span>
                      </MultiSelectOption>
                    ))}
                  </MultiSelectDropdown>
                </MultiSelectContainer>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie spezielle Ern��hrungsgewohnheiten? (optional)</HealthQuestionLabel>
                <FormSelect
                  value={state.ernaehrung}
                  onChange={(e) => updateState("ernaehrung", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {ernaehrungOptionen.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </FormSelect>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Wird derzeit eine Krebstherapie bei Ihnen durchgeführt? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.krebstherapie === "Ja"}
                    onClick={() => updateState("krebstherapie", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.krebstherapie === "Nein"}
                    onClick={() => updateState("krebstherapie", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Könnte eine Stärkung Ihres Immunsystems negative Folgen haben? (Transplantationen, Immunsuppressiva etc.) *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.immunsystem === "Ja"}
                    onClick={() => updateState("immunsystem", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.immunsystem === "Nein"}
                    onClick={() => updateState("immunsystem", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter Depressionen? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.depressionen === "Ja"}
                    onClick={() => updateState("depressionen", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.depressionen === "Nein"}
                    onClick={() => updateState("depressionen", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie Gelenkschmerzen? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.gelenkschmerzen === "Ja"}
                    onClick={() => updateState("gelenkschmerzen", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.gelenkschmerzen === "Nein"}
                    onClick={() => updateState("gelenkschmerzen", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie Schmerzen? (optional)</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.schmerzen === "Ja"}
                    onClick={() => updateState("schmerzen", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.schmerzen === "Nein"}
                    onClick={() => updateState("schmerzen", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>
            </HealthQuestionGrid>
          </StepContent>
        )

      case 4:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Gesundheitsdaten</QuestionTitle>
              <QuestionDescription>
                Lebensstil und Gewohnheiten (Teil 3)
              </QuestionDescription>
            </QuestionSection>
            <HealthQuestionGrid>
              <HealthQuestionCard>
                <HealthQuestionLabel>Leiden Sie unter Hautproblemen? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.hautprobleme === "Ja"}
                    onClick={() => updateState("hautprobleme", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.hautprobleme === "Nein"}
                    onClick={() => updateState("hautprobleme", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Wird in Ihrem Umfeld geraucht? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.passivrauchen === "Ja"}
                    onClick={() => updateState("passivrauchen", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.passivrauchen === "Nein"}
                    onClick={() => updateState("passivrauchen", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Trinken Sie weniger als 1,5 Liter Wasser pro Tag? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.wasserkonsum === "Ja"}
                    onClick={() => updateState("wasserkonsum", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.wasserkonsum === "Nein"}
                    onClick={() => updateState("wasserkonsum", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Trinken Sie mehr als 1 Glas gesüßte Getränke am Tag? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.gesuessteGetraenke === "Ja"}
                    onClick={() => updateState("gesuessteGetraenke", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.gesuessteGetraenke === "Nein"}
                    onClick={() => updateState("gesuessteGetraenke", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>

              <HealthQuestionCard>
                <HealthQuestionLabel>Haben Sie einen erhöhten Zuckerkonsum (mehr als 6 Teelöffel/Tag)? *</HealthQuestionLabel>
                <ToggleGroup>
                  <ToggleButton
                    type="button"
                    $isActive={state.zuckerkonsum === "Ja"}
                    onClick={() => updateState("zuckerkonsum", "Ja")}
                  >
                    Ja
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $isActive={state.zuckerkonsum === "Nein"}
                    onClick={() => updateState("zuckerkonsum", "Nein")}
                  >
                    Nein
                  </ToggleButton>
                </ToggleGroup>
              </HealthQuestionCard>
            </HealthQuestionGrid>
          </StepContent>
        )

      case 5:
        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Körpermaße</QuestionTitle>
              <QuestionDescription>
                Zusätzliche Körpermaße für die Analyse
              </QuestionDescription>
            </QuestionSection>
            <FormGrid>
              <FormField>
                <FormLabel htmlFor="nackenumfang">Nackenumfang (cm) *</FormLabel>
                <FormInput
                  id="nackenumfang"
                  type="number"
                  placeholder="38"
                  value={state.nackenumfang}
                  onChange={(e) => updateState("nackenumfang", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="hueftumfang">Hüftumfang (cm) *</FormLabel>
                <FormInput
                  id="hueftumfang"
                  type="number"
                  placeholder="95"
                  value={state.hueftumfang}
                  onChange={(e) => updateState("hueftumfang", e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="maxHerzfrequenz">Maximale Herzfrequenz (berechnet)</FormLabel>
                <FormInput
                  id="maxHerzfrequenz"
                  type="text"
                  value={calculateMaxHeartRate() ? `${calculateMaxHeartRate()} bpm` : "Wird aus Geburtsdatum berechnet"}
                  disabled
                  style={{ backgroundColor: "#f4f7e8" }}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="blutgruppe">Blutgruppe (optional)</FormLabel>
                <FormSelect
                  id="blutgruppe"
                  value={state.blutgruppe}
                  onChange={(e) => updateState("blutgruppe", e.target.value)}
                >
                  <option value="">Bitte auswählen</option>
                  {blutgruppenOptionen.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </FormSelect>
              </FormField>
            </FormGrid>
          </StepContent>
        )

      case 6:
        if (isSubmitted) {
          return (
            <StepContent>
              <SuccessMessage>
                <div className="icon">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2>Formular erfolgreich übermittelt!</h2>
                <p>Vielen Dank für Ihre Angaben. Ihre Daten wurden erfolgreich gespeichert und Ihre PDF wurde erstellt.</p>
              </SuccessMessage>
              
              <PdfSuccessSection>
                <h3>
                  <FileText className="h-6 w-6" />
                  Ihre Anamnese-PDF
                </h3>
                <p>
                  Sie können Ihre Anamnese-Daten jetzt als PDF herunterladen oder sich per E-Mail zusenden lassen.
                </p>
                
                <ButtonGroup>
                  <PdfButton onClick={handleDownloadPdf}>
                    <Download className="h-5 w-5" />
                    PDF herunterladen
                  </PdfButton>
                </ButtonGroup>
                
                <EmailPdfSection>
                  {!emailSent ? (
                    <>
                      <label className="label" htmlFor="sendEmail">
                        PDF per E-Mail erhalten:
                      </label>
                      <div className="input-group">
                        <FormInput
                          id="sendEmail"
                          type="email"
                          placeholder="ihre@email.de"
                          value={sendEmail}
                          onChange={(e) => setSendEmail(e.target.value)}
                        />
                        <Button
                          onClick={handleSendEmail}
                          disabled={!sendEmail}
                          style={{ backgroundColor: "#2d5a3d", color: "white" }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Senden
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Card className="max-w-md mx-auto border-2 border-green-200 bg-green-50">
                      <CardContent className="pt-6 text-center">
                        <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-700 font-medium">
                          PDF wurde an {sendEmail} gesendet!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </EmailPdfSection>
              </PdfSuccessSection>
            </StepContent>
          )
        }

        return (
          <StepContent>
            <QuestionSection>
              <QuestionTitle>Übersicht Ihrer Angaben</QuestionTitle>
              <QuestionDescription>
                Bitte überprüfen Sie Ihre Eingaben vor dem Absenden
              </QuestionDescription>
            </QuestionSection>

            <OverviewCard>
              <OverviewHeader>
                <h3>Zusammenfassung</h3>
              </OverviewHeader>
              <OverviewContent>
                {/* Basisdaten */}
                <OverviewSection>
                  <OverviewSectionHeader>
                    <h4>Basisdaten</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToStep(0)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
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
                      <span className="label">Größe/Gewicht:</span>
                      <span className="value">{state.koerpergroesse} cm / {state.gewicht} kg</span>
                    </OverviewItem>
                  </OverviewGrid>
                </OverviewSection>

                {/* Kontakt */}
                <OverviewSection>
                  <OverviewSectionHeader>
                    <h4>Kontaktdaten</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToStep(1)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </OverviewSectionHeader>
                  <OverviewGrid>
                    {state.strasse && (
                      <OverviewItem>
                        <span className="label">Adresse:</span>
                        <span className="value">{state.strasse}</span>
                      </OverviewItem>
                    )}
                    {state.plzOrt && (
                      <OverviewItem>
                        <span className="label">PLZ/Ort:</span>
                        <span className="value">{state.plzOrt}</span>
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

                {/* Gesundheitsdaten Teil 1 */}
                <OverviewSection>
                  <OverviewSectionHeader>
                    <h4>Gesundheitsdaten (Teil 1)</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToStep(2)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
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
                      <span className="label">Sportliche Aktivität:</span>
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

                {/* Gesundheitsdaten Teil 2 */}
                <OverviewSection>
                  <OverviewSectionHeader>
                    <h4>Gesundheitsdaten (Teil 2)</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToStep(3)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
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
                      <span className="label">Immunsystem-Hinweis:</span>
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

                {/* Gesundheitsdaten Teil 3 */}
                <OverviewSection>
                  <OverviewSectionHeader>
                    <h4>Lebensstil</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToStep(4)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
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
                      <span className="label">Weniger als 1,5L Wasser/Tag:</span>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToStep(5)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
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

            {/* Einverständniserklärung */}
            <ConsentSection>
              <ConsentHeader>
                <Shield className="h-6 w-6 text-[#2d5a3d]" />
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
                    onChange={(e) => setConsentGiven(e.target.checked)}
                  />
                  <span>
                    Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner 
                    Gesundheitsdaten für den oben genannten Zweck ausdrücklich zu. Mir ist bewusst, 
                    dass ich diese Einwilligung jederzeit widerrufen kann.
                  </span>
                </ConsentCheckbox>
              </ConsentText>
            </ConsentSection>
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
              <div className="label">Fragen?</div>
              <div className="phone">+49 (0) 123 456 789</div>
            </ContactInfo>
          </HeaderCard>

          <TitleSection>
            <h1>Anamnese Formular</h1>
            <p>Bitte füllen Sie das Formular vollständig aus, um Ihre Gesundheitsdaten zu erfassen</p>
          </TitleSection>
        </HeaderSection>

        <MainCard>
          <CardContentWrapper>
            {/* Progress Bar */}
            {!isSubmitted && (
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
            )}

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            {!isSubmitted && (
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
<SubmitButton onClick={handleSubmit} disabled={!consentGiven} style={{ opacity: consentGiven ? 1 : 0.5 }}>
  <Send className="h-5 w-5" />
  Formular übermitteln
  </SubmitButton>
                )}
              </NavigationButtons>
            )}
          </CardContentWrapper>
        </MainCard>
      </MainWrapper>
    </Container>
  )
}
