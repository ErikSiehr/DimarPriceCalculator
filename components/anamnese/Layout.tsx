"use client"

import styled from "styled-components"
import { colors, shadows, borderRadius } from "@/lib/theme"

// Main Container
export const Container = styled.div`
  min-height: 100vh;
  background-color: ${colors.background.DEFAULT};
`

export const MainWrapper = styled.div`
  max-width: 1536px;
  margin: 0 auto;
  padding: 1.5rem;
`

// Header Components
export const HeaderSection = styled.div`
  margin-bottom: 3rem;
`

export const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${colors.background.card};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  border: 2px solid ${colors.border.light};
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const LogoIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: ${colors.accent.DEFAULT};
  border-radius: ${borderRadius.DEFAULT};
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    color: ${colors.background.card};
    font-weight: bold;
    font-size: 1.25rem;
  }
`

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  
  .brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${colors.primary.DEFAULT};
    letter-spacing: -0.025em;
  }
  
  .tagline {
    font-size: 0.75rem;
    color: ${colors.accent.DEFAULT};
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`

export const ContactInfo = styled.div`
  text-align: right;
  
  .label {
    font-size: 0.875rem;
    color: ${colors.accent.DEFAULT};
    margin-bottom: 0.25rem;
  }
  
  .phone {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${colors.primary.DEFAULT};
  }
`

export const TitleSection = styled.div`
  text-align: center;
  
  h1 {
    font-size: 3rem;
    font-weight: bold;
    color: ${colors.primary.DEFAULT};
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.25rem;
    color: ${colors.accent.DEFAULT};
  }
`

// Main Card
export const MainCard = styled.div`
  border: 2px solid ${colors.border.light};
  box-shadow: ${shadows.lg};
  border-radius: ${borderRadius.DEFAULT};
  background: ${colors.background.card};
`

export const CardContentWrapper = styled.div`
  padding: 2rem;
`

// Step Content
export const StepContent = styled.div`
  min-height: 400px;
`

export const QuestionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${colors.primary.DEFAULT};
  text-align: center;
`

export const QuestionDescription = styled.p`
  font-size: 1.125rem;
  color: ${colors.accent.DEFAULT};
  text-align: center;
  margin-bottom: 2rem;
`

// Navigation Footer
export const NavigationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 2px solid ${colors.border.light};
  background-color: ${colors.background.muted};
`
