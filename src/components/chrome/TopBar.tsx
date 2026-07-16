import { useAppStore } from '../../store/useAppStore'

export function TopBar() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__eyebrow mono">
          PIRAMAL SWASTHYA · AMRIT PLATFORM
        </span>
        <h1 className="topbar__title">Software Development Lifecycle</h1>
      </div>
      <div className="topbar__actions">
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '◐' : '◑'}
        </button>
      </div>
    </header>
  )
}
