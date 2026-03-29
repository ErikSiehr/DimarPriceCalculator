'use client'

import styled from 'styled-components'
import { colors } from '@/lib/theme'
import { DiagnosenGridEntry } from '@/lib/types'

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`

const TableHeader = styled.thead`
  background-color: ${colors.accent.light};
`

const TableHeaderCell = styled.th`
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 600;
  color: ${colors.primary.DEFAULT};
  border-bottom: 2px solid ${colors.primary.DEFAULT};
  
  &:first-child {
    text-align: left;
    width: 40%;
  }
`

const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.accent.light};
  
  &:hover {
    background-color: rgba(168, 148, 84, 0.05);
  }
`

const TableCell = styled.td`
  padding: 0.5rem;
  text-align: center;
  
  &:first-child {
    text-align: left;
    color: ${colors.primary.DEFAULT};
  }
`

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${colors.accent.DEFAULT};
`

const DiagnosisLabel = styled.span`
  color: ${colors.primary.DEFAULT};
  font-size: 0.875rem;
`

interface CheckboxGridProps {
  options: string[]
  gridOptions: string[]
  value: { [key: string]: DiagnosenGridEntry }
  onChange: (newValue: { [key: string]: DiagnosenGridEntry }) => void
}

export function CheckboxGrid({ options, gridOptions, value, onChange }: CheckboxGridProps) {
  const handleCheckboxChange = (diagnosis: string, timeframe: string, checked: boolean) => {
    const currentEntry = value[diagnosis] || { aktuell: false, letzte3Jahre: false, letzte20Jahre: false }
    
    const timeframeKey = timeframe === 'aktuell' ? 'aktuell' 
                       : timeframe === 'letzte 3 Jahre' ? 'letzte3Jahre' 
                       : 'letzte20Jahre'
    
    const newEntry = {
      ...currentEntry,
      [timeframeKey]: checked
    }
    
    onChange({
      ...value,
      [diagnosis]: newEntry
    })
  }

  const isChecked = (diagnosis: string, timeframe: string): boolean => {
    const entry = value[diagnosis]
    if (!entry) return false
    
    if (timeframe === 'aktuell') return entry.aktuell
    if (timeframe === 'letzte 3 Jahre') return entry.letzte3Jahre
    return entry.letzte20Jahre
  }

  return (
    <Container>
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>Diagnose</TableHeaderCell>
            {gridOptions.map(opt => (
              <TableHeaderCell key={opt}>{opt}</TableHeaderCell>
            ))}
          </tr>
        </TableHeader>
        <tbody>
          {options.map(diagnosis => (
            <TableRow key={diagnosis}>
              <TableCell>
                <DiagnosisLabel>{diagnosis}</DiagnosisLabel>
              </TableCell>
              {gridOptions.map(timeframe => (
                <TableCell key={timeframe}>
                  <Checkbox
                    type="checkbox"
                    checked={isChecked(diagnosis, timeframe)}
                    onChange={(e) => handleCheckboxChange(diagnosis, timeframe, e.target.checked)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
