'use client'

import React, { createContext, useContext } from 'react'

// Create a wrapper context that can be used instead of Sanity's internal context
export const SanityContext = createContext<any>(null)
export const useSanityContext = () => useContext(SanityContext)

// Wrapper component to provide the context
export function SanityProvider({ 
  children, 
  value 
}: { 
  children: React.ReactNode
  value: any 
}) {
  return (
    <SanityContext.Provider value={value}>
      {children}
    </SanityContext.Provider>
  )
}
