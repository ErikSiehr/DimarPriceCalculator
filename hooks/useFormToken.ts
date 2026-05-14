// hooks/useFormToken.ts

import { useState, useEffect } from 'react'

// WordPress-URL
const WP_API_URL = 'https://lightskyblue-weasel-716136.hostingersite.com/wp-json/vieva/v1'

export type TokenStatus = 'loading' | 'valid' | 'invalid' | 'used' | 'expired' | 'missing'

export interface TokenData {
  status: TokenStatus
  formType: 'anamnese' | 'lebensgeschichte' | null
  clientName: string | null
  errorMessage: string | null
}

export function useFormToken(): TokenData {
  const [data, setData] = useState<TokenData>({
    status: 'loading',
    formType: null,
    clientName: null,
    errorMessage: null,
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (!token) {
      setData({ status: 'missing', formType: null, clientName: null, errorMessage: 'Kein Zugangscode gefunden.' })
      return
    }

    fetch(`${WP_API_URL}/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.valid) {
          setData({
            status: 'valid',
            formType: json.form_type as 'anamnese' | 'lebensgeschichte',
            clientName: json.client_name ?? null,
            errorMessage: null,
          })
        } else {
          const msg: string = json.error || 'Zugang nicht möglich.'
          let status: TokenStatus = 'invalid'
          if (msg.includes('verwendet')) status = 'used'
          if (msg.includes('abgelaufen')) status = 'expired'
          setData({ status, formType: null, clientName: null, errorMessage: msg })
        }
      })
      .catch(() => {
        setData({
          status: 'invalid',
          formType: null,
          clientName: null,
          errorMessage: 'Verbindungsfehler. Bitte versuche es später erneut.',
        })
      })
  }, [])

  return data
}

// Token nach erfolgreichem Absenden verbrauchen
export async function consumeToken(): Promise<void> {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  if (!token) return

  await fetch(`${WP_API_URL}/consume-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
}