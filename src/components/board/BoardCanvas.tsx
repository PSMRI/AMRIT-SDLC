import { useCallback, useEffect } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesInitialized,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react'
import type { AppEdge, AppNode } from '../../types/flow'
import { useAppStore } from '../../store/useAppStore'
import { nodeTypes } from './nodes'
import { edgeTypes } from './edges'

interface BoardCanvasProps {
  nodes: AppNode[]
  edges: AppEdge[]
}

const SELECTABLE = new Set(['stage', 'role', 'info'])

const MINIMAP_LANE_COLORS: Record<string, string> = {
  'business-product': '#e8a63d',
  engineering: '#5f8ff2',
  qa: '#a880f0',
  'devops-env': '#3cbf96',
}

function minimapNodeColor(node: AppNode): string {
  if (node.type === 'lane') return 'transparent'
  const laneId =
    node.type === 'stage'
      ? node.data.stage.laneId
      : node.type === 'role'
        ? node.data.role.laneId
        : undefined
  return (laneId && MINIMAP_LANE_COLORS[laneId]) || '#64707e'
}

function minimapStrokeColor(node: AppNode): string {
  return node.type === 'lane' ? '#36445766' : 'transparent'
}

export function BoardCanvas({ nodes, edges }: BoardCanvasProps) {
  const theme = useAppStore((s) => s.theme)
  const activeView = useAppStore((s) => s.activeView)
  const selectNode = useAppStore((s) => s.selectNode)
  const { fitView } = useReactFlow()
  const nodesInitialized = useNodesInitialized()

  // Re-frame whenever the view (graph) changes, once nodes are measured.
  useEffect(() => {
    if (!nodesInitialized) return
    const raf = requestAnimationFrame(() => {
      void fitView({ duration: 600, padding: 0.06 })
    })
    return () => cancelAnimationFrame(raf)
  }, [activeView, nodesInitialized, fitView])

  const onNodeClick = useCallback<NodeMouseHandler<AppNode>>(
    (_evt, node) => {
      if (node.type && SELECTABLE.has(node.type)) selectNode(node.id)
    },
    [selectNode],
  )

  const onPaneClick = useCallback(() => selectNode(null), [selectNode])

  return (
    <div className="board-canvas">
      <ReactFlow<AppNode, AppEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode={theme}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        minZoom={0.15}
        maxZoom={1.75}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        zoomOnDoubleClick={false}
        panOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: false }}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={26}
          size={1.4}
          color={theme === 'dark' ? '#1d2735' : '#c6cfda'}
        />
        <MiniMap
          className="board-minimap"
          pannable
          zoomable
          nodeColor={minimapNodeColor}
          nodeStrokeColor={minimapStrokeColor}
          nodeStrokeWidth={2}
          nodeBorderRadius={4}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
