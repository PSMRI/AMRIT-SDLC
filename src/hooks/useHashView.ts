import { useEffect } from 'react'
import type { ViewId } from '../types/content'
import { viewById } from '../data/views'
import { useAppStore } from '../store/useAppStore'

function parseHash(): ViewId | null {
  const id = window.location.hash.replace(/^#\/?/, '')
  return viewById.has(id as ViewId) ? (id as ViewId) : null
}

/** Two-way sync between location.hash (#/gitflow) and the active view. */
export function useHashView() {
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)

  // hash → store (initial + back/forward)
  useEffect(() => {
    const apply = () => {
      const v = parseHash()
      if (v && v !== useAppStore.getState().activeView) setActiveView(v)
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [setActiveView])

  // store → hash
  useEffect(() => {
    const next = `#/${activeView}`
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', next)
    }
  }, [activeView])
}
