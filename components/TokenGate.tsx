// components/TokenGate.tsx
// Umhüllt beide Formulare — zeigt das richtige basierend auf dem Token

'use client'

import React from 'react'
import { useFormToken, TokenStatus } from '../hooks/useFormToken'
import { AnamneseFormular } from './anamnese/AnamneseFormular'
import { LebensgeschichteFormular } from './lebensgeschichte/LebensgeschichteFormular'

export function TokenGate() {
  const { status, formType, errorMessage } = useFormToken()

  // ── Laden ──
  if (status === 'loading') {
    return <GateScreen icon="⏳" title="Einen Moment..." subtitle="Zugangscode wird geprüft..." />
  }

  // ── Gültig → richtiges Formular zeigen ──
  if (status === 'valid') {
    if (formType === 'lebensgeschichte') {
      return <LebensgeschichteFormular />
    }
    // Standard: Anamnese (auch als Fallback)
    return <AnamneseFormular />
  }

  // ── Fehlerzustände ──
  const screens: Record<Exclude<TokenStatus, 'loading' | 'valid'>, { icon: string; title: string }> = {
    missing:  { icon: '🔒', title: 'Kein Zugangscode' },
    invalid:  { icon: '❌', title: 'Ungültiger Link' },
    used:     { icon: '✅', title: 'Formular bereits ausgefüllt' },
    expired:  { icon: '⏰', title: 'Link abgelaufen' },
  }

  const screen = screens[status]

  return (
    <GateScreen
      icon={screen.icon}
      title={screen.title}
      subtitle={errorMessage || 'Bitte wende dich an deine Ansprechperson für einen neuen Link.'}
    />
  )
}

// ── Hilfskomponente für Fehler- und Ladescreen ──
function GateScreen({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#f9f7f4',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        maxWidth: '420px',
        width: '90%',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <h2 style={{ color: '#3A3429', marginBottom: '0.75rem', fontSize: '1.4rem' }}>{title}</h2>
        <p style={{ color: '#888', lineHeight: '1.6', margin: 0 }}>{subtitle}</p>
      </div>
    </div>
  )
}
