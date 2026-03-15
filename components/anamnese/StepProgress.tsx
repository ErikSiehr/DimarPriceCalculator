"use client"

import styled from "styled-components"
import { Check } from "lucide-react"
import { colors, borderRadius, transitions } from "@/lib/theme"

// Types
interface Step {
  id: number
  label: string
  title?: string
  description?: string
  questions?: any[]
}

// Styled Components
const ProgressSection = styled.div`
  margin-bottom: 2rem;
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
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
  completedSteps: number[]
}

export function StepProgress({ steps, currentStep, onStepClick, completedSteps }: StepProgressProps) {
  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex) || stepIndex < currentStep
  }
  
  const canNavigateToStep = (stepIndex: number) => {
    // Can always go back or stay on current
    if (stepIndex <= currentStep) return true
    // Can go forward if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!isStepCompleted(i) && i !== currentStep) return false
    }
    return false
  }
  
  return (
    <ProgressSection>
      <StepNavigation>
        {steps.map((step, index) => {
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
