import React, { createContext, useContext, useMemo } from 'react'

type CurrencyCode = 'USD' | 'CAD' | 'EUR'

type CurrencyContextType = {
  currency: CurrencyCode
  format: (amount: number) => string
  code: CurrencyCode
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

function detectCurrency(): CurrencyCode {
  try {
    // Prefer explicit country from navigator.language or timeZone
    const lang = (navigator.languages?.[0] || navigator.language || '').toUpperCase()
    if (lang.includes('-US') || lang.endsWith('US')) return 'USD'
    if (lang.includes('-CA') || lang.endsWith('CA')) return 'CAD'
    // Fallback: use timeZone heuristic
    const tz = (Intl as any)?.DateTimeFormat?.().resolvedOptions?.().timeZone || ''
    if (/AMERICA\/TORONTO|AMERICA\/MONTREAL|AMERICA\/VANCOUVER|AMERICA\/EDMONTON/i.test(tz)) return 'CAD'
    if (/AMERICA\//i.test(tz)) return 'USD'
  } catch {}
  return 'EUR'
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = detectCurrency()
  const value = useMemo<CurrencyContextType>(() => {
    const symbol = currency === 'USD' ? '$' : currency === 'CAD' ? 'CA$' : '€'
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return {
      currency,
      code: currency,
      symbol,
      format: (amount: number) => formatter.format(amount),
    }
  }, [currency])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    // Safe fallback if provider missing
    const currency: CurrencyCode = detectCurrency()
    const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency })
    return {
      currency,
      code: currency,
      symbol: currency === 'USD' ? '$' : currency === 'CAD' ? 'CA$' : '€',
      format: (amount: number) => formatter.format(amount),
    } as CurrencyContextType
  }
  return ctx
}
