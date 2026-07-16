import { useMemo } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { BoardCanvas } from './components/board/BoardCanvas'
import { DetailPanel } from './components/panel/DetailPanel'
import { TopBar } from './components/chrome/TopBar'
import { useTheme } from './hooks/useTheme'
import { buildLifecycleGraph } from './layout/lifecycleLayout'

function App() {
  useTheme()
  const { nodes, edges } = useMemo(() => buildLifecycleGraph(), [])

  return (
    <ReactFlowProvider>
      <div className="app-shell">
        <TopBar />
        <div className="board-area">
          <BoardCanvas nodes={nodes} edges={edges} />
          <DetailPanel />
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default App
