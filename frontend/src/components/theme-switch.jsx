"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 p-2 rounded-full bg-zinc-800 dark:bg-zinc-200"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-white" />
      )}
    </button>
  )
}