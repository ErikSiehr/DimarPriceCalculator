"use client"

import styled from "styled-components"
import { Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { colors, borderRadius, transitions } from "@/lib/theme"
import { formSteps } from "@/lib/types"

// Styled Components
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
    color: ${colors.primary.DEFAULT};
  }
  
  .step-info {
    font-size: 1.125rem;
    color: ${colors.accent.DEFAULT};
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
  border-radius: ${borderRadius.full};
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all ${transitions.DEFAULT};
  cursor: ${props => props.$isDisabled ? "not-allowed" : "pointer"};
  opacity: ${props => props.$isDisabled ? 0.5 : 1};
  
  ${props => props.$isActive && `
    background-color: ${colors.accent.DEFAULT};
    color: ${colors.background.card};
    border-color: ${colors.accent.DEFAULT};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  `}
  
  ${props => props.$isCompleted && !props.$isActive && `
    background-color: ${colors.accent.muted};
    color: ${colors.primary.DEFAULT};
    border-color: ${colors.border.strong};
    
    &:hover {
      background-color: ${colors.accent.subtle};
    }
  `}
  
  ${props => !props.$isCompleted && !props.$isActive && `
    background-color: ${colors.background.DEFAULT};
    color: ${colors.accent.DEFAULT};
    border-color: ${colors.border.strong};
    
    &:hover:not(:disabled) {
      background-color: ${colors.background.card};
    }
  `}
`

const StepLabel = styled.span<{
  $isActive: boolean
  $isCompleted: boolean
}>`
  font-size: 0.75rem;
  margin-top: 0.5rem;
  text-align: center;
  transition: color ${transitions.DEFAULT};
  
  ${props => props.$isActive && `
    color: ${colors.primary.DEFAULT};
    font-weight: 600;
  `}
  
  ${props => props.$isCompleted && !props.$isActive && `
    color: ${colors.primary.DEFAULT};
  `}
  
  ${props => !props.$isCompleted && !props.$isActive && `
    color: ${colors.accent.DEFAULT};
  `}
`

// Component Props
interface StepProgressProps {
  currentStep: number
  onStepClick: (step: number) => void
  isStepValid: (step: number) => boolean
}

export function StepProgress({ currentStep, onStepClick, isStepValid }: StepProgressProps) {
  const progress = ((currentStep + 1) / formSteps.length) * 100
  
  const isStepCompleted = (stepIndex: number) => {
    if (stepIndex < currentStep) return true
    if (stepIndex === currentStep) return isStepValid(stepIndex)
    return false
  }
  
  const canNavigateToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep) return true
    // Can only go to next step if current is valid
    for (let i = 0; i < stepIndex; i++) {
      if (!isStepValid(i)) return false
    }
    return true
  }
  
  return (
    <ProgressSection>
      <ProgressHeader>
        <span className="title">Fortschritt</span>
        <span className="step-info">Schritt {currentStep + 1} von {formSteps.length}</span>
      </ProgressHeader>
      
      <ProgressBarWrapper>
        <Progress value={progress} />
      </ProgressBarWrapper>
      
      <StepNavigation>
        {formSteps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = isStepCompleted(index)
          const canNavigate = canNavigateToStep(index)
          
          return (
            <StepItem key={step.id}>
              <StepButton
                $isActive={isActive}
                $isCompleted={isCompleted}
                $isDisabled={!canNavigate}
                onClick={() => canNavigate && onStepClick(index)}
                disabled={!canNavigate}
              >
                {isCompleted && !isActive ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </StepButton>
              <StepLabel $isActive={isActive} $isCompleted={isCompleted}>
                {step.label}
              </StepLabel>
            </StepItem>
          )
        })}
      </StepNavigation>
    </ProgressSection>
  )
}
