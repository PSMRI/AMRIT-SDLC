import { motion } from 'framer-motion'
import { views } from '../../data/views'
import { useAppStore } from '../../store/useAppStore'

export function ViewTabs() {
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)

  return (
    <nav className="view-tabs" aria-label="Board views">
      {views.map((v) => {
        const active = v.id === activeView
        return (
          <button
            key={v.id}
            type="button"
            className={`view-tab${active ? ' is-active' : ''}`}
            onClick={() => setActiveView(v.id)}
            aria-current={active ? 'page' : undefined}
          >
            {v.title}
            {active && (
              <motion.span
                layoutId="view-tab-underline"
                className="view-tab__underline"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
