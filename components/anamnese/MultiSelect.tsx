"use client"

import { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { ChevronDown, X } from "lucide-react"
import { colors, borderRadius, shadows, transitions } from "@/lib/theme"

// Styled Components
const Container = styled.div`
  position: relative;
`

const Trigger = styled.div<{ $hasSelection: boolean; $isOpen: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border: 2px solid ${props => props.$isOpen ? colors.accent.DEFAULT : colors.border.strong};
  border-radius: ${borderRadius.DEFAULT};
  background: ${colors.background.card};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  transition: border-color ${transitions.DEFAULT};
  
  &:hover {
    border-color: ${colors.accent.DEFAULT};
  }
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  flex: 1;
`

const Placeholder = styled.span`
  color: ${colors.accent.DEFAULT};
  opacity: 0.8;
  font-size: 0.95rem;
`

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: ${colors.accent.muted};
  border-radius: ${borderRadius.sm};
  font-size: 0.875rem;
  color: ${colors.primary.DEFAULT};
`

const TagRemoveButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${colors.accent.DEFAULT};
  transition: color ${transitions.fast};
  
  &:hover {
    color: ${colors.primary.DEFAULT};
  }
`

const ChevronIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  color: ${colors.accent.DEFAULT};
  transition: transform ${transitions.DEFAULT};
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  flex-shrink: 0;
`

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${colors.background.card};
  border: 2px solid ${colors.border.strong};
  border-radius: ${borderRadius.DEFAULT};
  box-shadow: ${shadows.md};
  max-height: 240px;
  overflow-y: auto;
  z-index: 50;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`

const Option = styled.label<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color ${transitions.fast};
  background-color: ${props => props.$isSelected ? colors.accent.subtle : colors.background.card};
  
  &:hover {
    background-color: ${colors.accent.muted};
  }
  
  &:first-child {
    border-radius: ${borderRadius.sm} ${borderRadius.sm} 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 ${borderRadius.sm} ${borderRadius.sm};
  }
`

const Checkbox = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  accent-color: ${colors.accent.DEFAULT};
  cursor: pointer;
`

const OptionLabel = styled.span`
  color: ${colors.primary.DEFAULT};
  font-size: 0.95rem;
`

// Component Props
interface MultiSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Bitte auswählen (Mehrfachauswahl möglich)",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option))
    } else {
      onChange([...value, option])
    }
  }
  
  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter(v => v !== option))
  }
  
  return (
    <Container ref={containerRef} className={className}>
      <Trigger
        $hasSelection={value.length > 0}
        $isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <TagsContainer>
          {value.length === 0 ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            value.map(item => (
              <Tag key={item}>
                {item}
                <TagRemoveButton onClick={(e) => removeOption(item, e)}>
                  <X size={14} />
                </TagRemoveButton>
              </Tag>
            ))
          )}
        </TagsContainer>
        <ChevronIcon size={18} $isOpen={isOpen} />
      </Trigger>
      
      <Dropdown $isOpen={isOpen}>
        {options.map(option => (
          <Option key={option} $isSelected={value.includes(option)}>
            <Checkbox
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggleOption(option)}
            />
            <OptionLabel>{option}</OptionLabel>
          </Option>
        ))}
      </Dropdown>
    </Container>
  )
}
