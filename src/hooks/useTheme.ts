import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

/** Stamps data-theme on <html> so CSS variables switch. */
export function useTheme() {
  const theme = useAppStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return theme
}
