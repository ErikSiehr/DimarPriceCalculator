"use client"

import { useState } from "react"
import styled from "styled-components"
import { Check, FileText, Download, Mail } from "lucide-react"
import { colors, borderRadius, shadows, transitions } from "@/lib/theme"
import { FormInput } from "./FormField"
import { PdfButton, EmailButton } from "./Buttons"

// Styled Components
const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  .icon {
    width: 5rem;
    height: 5rem;
    background-color: ${colors.accent.DEFAULT};
    border-radius: ${borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }
  
  h2 {
    font-size: 2rem;
    font-weight: bold;
    color: ${colors.primary.DEFAULT};
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.125rem;
    color: ${colors.accent.DEFAULT};
    margin-bottom: 2rem;
  }
`

const PdfSection = styled.div`
  max-width: 36rem;
  margin: 2rem auto 0;
  padding: 1.5rem;
  background-color: ${colors.accent.subtle};
  border-radius: ${borderRadius.md};
  text-align: center;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${colors.primary.DEFAULT};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  > p {
    font-size: 0.9rem;
    color: ${colors.accent.DEFAULT};
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

const EmailSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid ${colors.accent.DEFAULT};
  
  .label {
    font-size: 0.9rem;
    font-weight: 500;
    color: ${colors.primary.DEFAULT};
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

const EmailSentCard = styled.div`
  max-width: 24rem;
  margin: 1rem auto 0;
  padding: 1rem;
  border: 2px solid ${colors.accent.muted};
  background-color: ${colors.accent.subtle};
  border-radius: ${borderRadius.DEFAULT};
  text-align: center;
  
  p {
    color: ${colors.accent.dark};
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`

const TherapistButton = styled(PdfButton)`
  background-color: ${colors.primary.DEFAULT};
  color: ${colors.background.card};
  
  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`

const TherapistNote = styled.p`
  font-size: 0.75rem !important;
  color: ${colors.accent.muted} !important;
  margin-top: 0.5rem !important;
  margin-bottom: 0 !important;
  font-style: italic;
`

// Component Props
interface SuccessScreenProps {
  title?: string
  description?: string
  onDownloadPdf: () => void
  onDownloadTherapistPdf?: () => void
}

export function SuccessScreen({ title, description, onDownloadPdf, onDownloadTherapistPdf }: SuccessScreenProps) {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  
  const handleSendEmail = () => {
    if (email) {
      setEmailSent(true)
    }
  }
  
  return (
    <>
      <SuccessMessage>
        <div className="icon">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h2>{title ?? 'Formular erfolgreich übermittelt!'}</h2>
        <p>{description ?? 'Vielen Dank für Ihre Angaben. Ihre Daten wurden erfolgreich gespeichert und Ihre PDF wurde erstellt.'}</p>
      </SuccessMessage>
      
      <PdfSection>
        <h3>
          <FileText className="h-6 w-6" />
          Ihre Anamnese-PDF
        </h3>
        <p>
          Sie können Ihre Anamnese-Daten jetzt als PDF herunterladen oder sich per E-Mail zusenden lassen.
        </p>
        
        <ButtonGroup>
          <PdfButton onClick={onDownloadPdf}>
            <Download className="h-5 w-5" />
            Kunden-PDF herunterladen
          </PdfButton>
          {onDownloadTherapistPdf && (
            <TherapistButton onClick={onDownloadTherapistPdf}>
              <Download className="h-5 w-5" />
              Therapeuten-PDF herunterladen
            </TherapistButton>
          )}
        </ButtonGroup>

        {onDownloadTherapistPdf && (
          <TherapistNote>
            Therapeuten-PDF enthält beide Abschnitte (Vieva + IASA) – nur zu Testzwecken sichtbar.
          </TherapistNote>
        )}
        
        <EmailSection>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <EmailButton onClick={handleSendEmail} disabled={!email}>
                  <Mail className="h-4 w-4" />
                  Senden
                </EmailButton>
              </div>
            </>
          ) : (
            <EmailSentCard>
              <p>
                <Check className="h-5 w-5" />
                PDF wurde an {email} gesendet!
              </p>
            </EmailSentCard>
          )}
        </EmailSection>
      </PdfSection>
    </>
  )
}
