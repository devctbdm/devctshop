"use client"

import * as React from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "devct-theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"
const THEME_CHANGE_EVENT = "devct-theme-change"

function getSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light"
}

function getStoredTheme(): Theme | null {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "light" || stored === "dark" ? stored : null
}

function getTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia(DARK_QUERY)
  mql.addEventListener("change", callback)
  window.addEventListener("storage", callback)
  window.addEventListener(THEME_CHANGE_EVENT, callback)
  return () => {
    mql.removeEventListener("change", callback)
    window.removeEventListener("storage", callback)
    window.removeEventListener(THEME_CHANGE_EVENT, callback)
  }
}

export function useTheme() {
  const theme = React.useSyncExternalStore(
    subscribe,
    getTheme,
    () => "light"
  )

  const toggleTheme = React.useCallback(() => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    window.localStorage.setItem(STORAGE_KEY, next)
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }, [])

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  }
}
