"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({})

export function ThemeProvider({ children, attribute = "class", defaultTheme = "system" }) {
  const [theme, setTheme] = useState(null) // Inicializar como null para evitar inconsistencias
  const [mounted, setMounted] = useState(false) // Estado para asegurarnos de que el cliente está listo

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || defaultTheme
    setTheme(storedTheme)
    setMounted(true) // Marcamos que el cliente ya se ha montado
  }, [])

  useEffect(() => {
    if (!mounted || !theme) return // Evita cambios antes de que el estado esté definido

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.setAttribute("data-theme", theme)

    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  if (!mounted) {
    return <div className="invisible" /> // Evita renderizar contenido hasta que el cliente esté listo
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)