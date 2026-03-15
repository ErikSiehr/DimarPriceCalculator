import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { colors, spacing, borderRadius, shadows, transitions } from '@/lib/theme'
import { ageRanges, TimelineEntry } from '@/lib/lebensgeschichteConfig'

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`

const TimelineScrollWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.background.muted};
    border-radius: ${borderRadius.lg};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.accent.DEFAULT};
    border-radius: ${borderRadius.lg};
    
    &:hover {
      background: ${colors.accent.light};
    }
  }
`

const TimelineRow = styled.div`
  display: flex;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  min-width: min-content;
`

interface TimelineBlockProps {
  $isActive: boolean
  $color: string
}

const TimelineBlock = styled.button<TimelineBlockProps>`
  min-width: 60px;
  height: 60px;
  padding: ${spacing.md};
  border: 2px solid ${props => props.$isActive ? props.$color : colors.border.light};
  border-radius: ${borderRadius.md};
  background: ${props => props.$isActive ? props.$color : colors.background.card};
  color: ${props => props.$isActive ? '#FFFFFF' : colors.primary.DEFAULT};
  font-weight: 500;
  font-size: ${colors => colors.fontSize || '0.875rem'};
  cursor: pointer;
  transition: all ${transitions.DEFAULT};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: ${props => props.$isActive ? shadows.accent : shadows.sm};
  
  &:hover {
    border-color: ${props => props.$color};
    ${props => !props.$isActive && `background-color: ${colors.accent.muted};`}
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const PopoverOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 40;
`

const PopoverContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${colors.background.card};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  padding: ${spacing['2xl']};
  z-index: 50;
  max-width: 500px;
  width: 90%;
  
  @media (max-width: 640px) {
    width: calc(100% - ${spacing.xl});
  }
`

const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.xl};
  border-bottom: 2px solid ${colors.border.light};
  padding-bottom: ${spacing.lg};
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${colors.primary.DEFAULT};
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.accent.DEFAULT};
    transition: color ${transitions.DEFAULT};
    
    &:hover {
      color: ${colors.accent.dark};
    }
  }
`

const PopoverInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${spacing.lg};
  border: 2px solid ${colors.border.DEFAULT};
  border-radius: ${borderRadius.md};
  font-family: inherit;
  font-size: 1rem;
  color: ${colors.primary.DEFAULT};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.DEFAULT};
    box-shadow: 0 0 0 3px ${colors.accent.muted};
  }
  
  &::placeholder {
    color: ${colors.accent.DEFAULT};
  }
`

const PopoverActions = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
  justify-content: flex-end;
`

const PopoverButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.md} ${spacing.xl};
  border: 2px solid ${props => props.$variant === 'primary' ? colors.accent.DEFAULT : colors.border.DEFAULT};
  border-radius: ${borderRadius.md};
  background: ${props => props.$variant === 'primary' ? colors.accent.DEFAULT : 'transparent'};
  color: ${props => props.$variant === 'primary' ? '#FFFFFF' : colors.primary.DEFAULT};
  font-weight: 600;
  cursor: pointer;
  transition: all ${transitions.DEFAULT};
  
  &:hover {
    ${props => props.$variant === 'primary' 
      ? `background-color: ${colors.accent.dark}; border-color: ${colors.accent.dark};`
      : `background-color: ${colors.background.muted}; border-color: ${colors.accent.DEFAULT};`
    }
  }
`

const PreviewTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.primary.DEFAULT};
  color: white;
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-size: 0.875rem;
  white-space: nowrap;
  max-width: 150px;
  white-space: normal;
  pointer-events: none;
  margin-bottom: ${spacing.md};
  box-shadow: ${shadows.md};
  z-index: 100;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${colors.primary.DEFAULT};
  }
`

interface TimelineProps {
  entries: TimelineEntry[]
  categoryColor: string
  maxAge?: number // Filter timeline to only show age ranges up to this age
  onAddEntry: (ageRangeId: string) => void
  onUpdateEntry: (ageRangeId: string, text: string) => void
  onRemoveEntry: (ageRangeId: string) => void
}

export function Timeline({
  entries,
  categoryColor,
  maxAge,
  onAddEntry,
  onUpdateEntry,
  onRemoveEntry,
}: TimelineProps) {
  const [selectedAgeRangeId, setSelectedAgeRangeId] = useState<string | null>(null)
  const [currentText, setCurrentText] = useState('')
  const [hoveredAgeRangeId, setHoveredAgeRangeId] = useState<string | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Filter age ranges based on maxAge prop
  const filteredAgeRanges = maxAge !== undefined 
    ? ageRanges.filter(range => range.start <= maxAge)
    : ageRanges

  const filledAgeRanges = entries.map(e => e.ageRangeId)
  
  const getEntryText = (ageRangeId: string) => {
    return entries.find(e => e.ageRangeId === ageRangeId)?.text || ''
  }

  const handleBlockClick = (ageRangeId: string) => {
    setSelectedAgeRangeId(ageRangeId)
    setCurrentText(getEntryText(ageRangeId))
  }

  const handleSave = () => {
    if (selectedAgeRangeId) {
      if (currentText.trim()) {
        onUpdateEntry(selectedAgeRangeId, currentText)
      } else {
        onRemoveEntry(selectedAgeRangeId)
      }
      setSelectedAgeRangeId(null)
      setCurrentText('')
    }
  }

  const handleRemove = () => {
    if (selectedAgeRangeId) {
      onRemoveEntry(selectedAgeRangeId)
      setSelectedAgeRangeId(null)
      setCurrentText('')
    }
  }

  const handleClose = () => {
    setSelectedAgeRangeId(null)
    setCurrentText('')
  }

  return (
    <TimelineContainer>
      <TimelineScrollWrapper>
        <TimelineRow>
          {filteredAgeRanges.map(ageRange => {
            const isFilled = filledAgeRanges.includes(ageRange.id)
            const entryText = getEntryText(ageRange.id)
            const isHovered = hoveredAgeRangeId === ageRange.id

            return (
              <div key={ageRange.id} style={{ position: 'relative' }}>
                <TimelineBlock
                  $isActive={isFilled}
                  $color={categoryColor}
                  onClick={() => handleBlockClick(ageRange.id)}
                  onMouseEnter={() => isFilled && setHoveredAgeRangeId(ageRange.id)}
                  onMouseLeave={() => setHoveredAgeRangeId(null)}
                  title={isFilled ? entryText : ''}
                >
                  {ageRange.label}
                </TimelineBlock>
                {isHovered && isFilled && (
                  <PreviewTooltip ref={tooltipRef}>
                    {entryText.substring(0, 100)}
                    {entryText.length > 100 ? '...' : ''}
                  </PreviewTooltip>
                )}
              </div>
            )
          })}
        </TimelineRow>
      </TimelineScrollWrapper>

      <PopoverOverlay $isOpen={selectedAgeRangeId !== null} onClick={handleClose} />
      
      {selectedAgeRangeId && (
        <PopoverContent>
          <PopoverHeader>
            <h3>Alter {ageRanges.find(ar => ar.id === selectedAgeRangeId)?.label} Jahre</h3>
            <button onClick={handleClose}>
              <X className="h-5 w-5" />
            </button>
          </PopoverHeader>
          
          <PopoverInput
            placeholder="Schreiben Sie auf, was in diesem Zeitraum wichtig war..."
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            autoFocus
          />
          
          <PopoverActions>
            {filledAgeRanges.includes(selectedAgeRangeId) && (
              <PopoverButton $variant="secondary" onClick={handleRemove}>
                Löschen
              </PopoverButton>
            )}
            <PopoverButton $variant="secondary" onClick={handleClose}>
              Abbrechen
            </PopoverButton>
            <PopoverButton $variant="primary" onClick={handleSave}>
              Speichern
            </PopoverButton>
          </PopoverActions>
        </PopoverContent>
      )}
    </TimelineContainer>
  )
}

export default Timeline
