"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import { MoonIcon, SunIcon } from "lucide-react"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      {mounted && isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
