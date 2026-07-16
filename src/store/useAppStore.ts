import { create } from 'zustand'
import type { ViewId } from '../types/content'

export type Theme = 'dark' | 'light'
export type PlayStatus = 'idle' | 'playing' | 'paused'

interface AppState {
  activeView: ViewId
  selectedNodeId: string | null
  theme: Theme
  playStatus: PlayStatus
  playIndex: number
  playSpeed: 1 | 2

  setActiveView: (view: ViewId) => void
  selectNode: (id: string | null) => void
  toggleTheme: () => void
  setPlay: (status: PlayStatus) => void
  setPlayIndex: (index: number) => void
  setPlaySpeed: (speed: 1 | 2) => void
}

const storedTheme = ((): Theme => {
  try {
    const t = localStorage.getItem('amrit-sdlc-theme')
    return t === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
})()

export const useAppStore = create<AppState>((set) => ({
  activeView: 'lifecycle',
  selectedNodeId: null,
  theme: storedTheme,
  playStatus: 'idle',
  playIndex: 0,
  playSpeed: 1,

  setActiveView: (view) =>
    set({ activeView: view, selectedNodeId: null, playStatus: 'idle', playIndex: 0 }),
  selectNode: (id) => set({ selectedNodeId: id }),
  toggleTheme: () =>
    set((s) => {
      const theme = s.theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('amrit-sdlc-theme', theme)
      } catch {
        /* private mode */
      }
      return { theme }
    }),
  setPlay: (playStatus) => set({ playStatus }),
  setPlayIndex: (playIndex) => set({ playIndex }),
  setPlaySpeed: (playSpeed) => set({ playSpeed }),
}))
