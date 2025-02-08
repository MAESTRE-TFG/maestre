"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({})

export function ThemeProvider({ children, attribute = 'class', defaultTheme = 'system', enableSystem = true, disableTransitionOnChange = false }) {
  const [theme, setTheme] = useState(() => {
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove transition temporarily if disableTransitionOnChange is true
    if (disableTransitionOnChange) {
      root.classList.add('disable-transitions')
    }

    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    if (attribute === 'class') {
      root.setAttribute('data-theme', theme)
    }

    localStorage.setItem('theme', theme)

    // Re-enable transitions after theme change
    if (disableTransitionOnChange) {
      setTimeout(() => {
        root.classList.remove('disable-transitions')
      }, 0)
    }
  }, [theme, attribute, disableTransitionOnChange])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)