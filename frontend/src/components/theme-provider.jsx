"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({})

export function ThemeProvider({ children, attribute = "class", defaultTheme = "system" }) {
  const [theme, setTheme] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || defaultTheme
    setTheme(storedTheme)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !theme) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.setAttribute("data-theme", theme)

    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  if (!mounted) {
    return <div className="invisible" />
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)