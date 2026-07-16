import { useMemo } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { BoardCanvas } from './components/board/BoardCanvas'
import { DetailPanel } from './components/panel/DetailPanel'
import { HelpOverlay } from './components/chrome/HelpOverlay'
import { TopBar } from './components/chrome/TopBar'
import { useHashView } from './hooks/useHashView'
import { useTheme } from './hooks/useTheme'
import { useAppStore } from './store/useAppStore'
import { viewById } from './data/views'

function App() {
  useTheme()
  useHashView()
  const activeView = useAppStore((s) => s.activeView)
  const { nodes, edges } = useMemo(
    () => viewById.get(activeView)!.buildGraph(),
    [activeView],
  )

  return (
    <ReactFlowProvider>
      <div className="app-shell">
        <TopBar />
        <div className="board-area">
          <BoardCanvas nodes={nodes} edges={edges} />
          <DetailPanel />
          <HelpOverlay />
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default App
