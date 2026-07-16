import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SEEN_KEY = 'amrit-sdlc-hint-seen'

/** One-time onboarding hint for the board interactions. */
export function HelpOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) setVisible(true)
    } catch {
      /* private mode */
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode */
    }
  }

  useEffect(() => {
    if (!visible) return
    const t = window.setTimeout(dismiss, 12000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="help-overlay"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          role="status"
        >
          <p className="help-overlay__text">
            <strong>Drag</strong> to pan · <strong>scroll</strong> to move ·{' '}
            <strong>pinch</strong> or use the corner buttons to zoom ·{' '}
            <strong>click any card</strong> for full details — or press{' '}
            <strong>▶ Follow a ticket</strong> to watch one travel the whole
            lifecycle.
          </p>
          <button
            type="button"
            className="help-overlay__dismiss mono"
            onClick={dismiss}
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
