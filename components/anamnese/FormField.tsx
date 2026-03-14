"use client"

import styled from "styled-components"
import { colors, borderRadius, transitions } from "@/lib/theme"

// Form Field Container
export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

// Form Label
export const FormLabel = styled.label<{ $required?: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.primary.DEFAULT};
  
  ${props => props.$required && `
    &::after {
      content: " *";
      color: ${colors.accent.DEFAULT};
    }
  `}
`

// Form Input
export const FormInput = styled.input`
  font-size: 1rem;
  padding: 0.75rem;
  border: 2px solid ${colors.border.strong};
  border-radius: ${borderRadius.DEFAULT};
  background: ${colors.background.card};
  color: ${colors.primary.DEFAULT};
  transition: border-color ${transitions.DEFAULT};
  
  &:focus {
    border-color: ${colors.accent.DEFAULT};
    outline: none;
  }
  
  &::placeholder {
    color: ${colors.accent.DEFAULT};
    opacity: 0.6;
  }
`

// Form Select
export const FormSelect = styled.select`
  font-size: 1rem;
  padding: 0.75rem;
  border: 2px solid ${colors.border.strong};
  border-radius: ${borderRadius.DEFAULT};
  background: ${colors.background.card};
  cursor: pointer;
  color: ${colors.primary.DEFAULT};
  transition: border-color ${transitions.DEFAULT};
  
  &:focus {
    border-color: ${colors.accent.DEFAULT};
    outline: none;
  }
`

// Form Grid
export const FormGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 1}, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

// Toggle Button Group
export const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const ToggleButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$isActive ? colors.accent.DEFAULT : colors.border.strong};
  border-radius: ${borderRadius.DEFAULT};
  background: ${props => props.$isActive ? colors.accent.DEFAULT : colors.background.card};
  color: ${props => props.$isActive ? colors.background.card : colors.primary.DEFAULT};
  font-weight: 500;
  cursor: pointer;
  transition: all ${transitions.DEFAULT};
  
  &:hover {
    border-color: ${colors.accent.DEFAULT};
  }
`

// Health Question Card (for toggle questions in grid)
export const HealthQuestionCard = styled.div`
  padding: 1rem;
  border: 2px solid ${colors.border.DEFAULT};
  border-radius: ${borderRadius.md};
  background: ${colors.background.card};
  display: flex;
  flex-direction: column;
  min-height: 120px;
`

export const HealthQuestionLabel = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${colors.primary.DEFAULT};
  margin-bottom: auto;
  padding-bottom: 0.75rem;
  min-height: 2.5rem;
  display: flex;
  align-items: flex-start;
`

// Health Questions Grid
export const HealthQuestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
