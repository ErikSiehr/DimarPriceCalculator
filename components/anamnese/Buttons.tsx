"use client"

import styled from "styled-components"
import { colors, borderRadius, transitions, shadows } from "@/lib/theme"

// Base Button
const BaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: ${borderRadius.DEFAULT};
  cursor: pointer;
  transition: all ${transitions.DEFAULT};
  border: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// Back Button (outline style)
export const BackButton = styled(BaseButton)`
  border: 2px solid ${colors.border.strong};
  color: ${colors.primary.DEFAULT};
  background: transparent;
  
  &:hover:not(:disabled) {
    background-color: ${colors.accent.subtle};
  }
`

// Next Button (primary style)
export const NextButton = styled(BaseButton)`
  background-color: ${colors.accent.DEFAULT};
  color: ${colors.background.card};
  
  &:hover:not(:disabled) {
    background-color: ${colors.accent.dark};
  }
`

// Submit Button (primary style with emphasis)
export const SubmitButton = styled(BaseButton)`
  padding: 0.75rem 2rem;
  background-color: ${colors.accent.DEFAULT};
  color: ${colors.background.card};
  box-shadow: ${shadows.accent};
  
  &:hover:not(:disabled) {
    background-color: ${colors.accent.dark};
  }
`

// PDF Button
export const PdfButton = styled(BaseButton)`
  background-color: ${colors.accent.DEFAULT};
  color: ${colors.background.card};
  
  &:hover:not(:disabled) {
    background-color: ${colors.accent.dark};
  }
`

// Email Button
export const EmailButton = styled(BaseButton)`
  background-color: ${colors.accent.DEFAULT};
  color: ${colors.background.card};
  padding: 0.75rem 1rem;
  
  &:hover:not(:disabled) {
    background-color: ${colors.accent.dark};
  }
`
