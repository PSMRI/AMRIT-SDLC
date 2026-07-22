import { useEffect, useMemo, useRef } from 'react'
import { ViewportPortal, useReactFlow } from '@xyflow/react'
import type { AppNode, StageNodeType } from '../../types/flow'
import { buildForwardEdgePath } from '../../utils/edgePath'
import { useAppStore } from '../../store/useAppStore'

const DWELL_MS = 2600
const TRAVEL_MS = 1300

/**
 * Play mode: a ticket token travels stage to stage along the exact edge
 * paths, with camera follow and the detail panel tracking the active stage.
 * Rendered inside <ReactFlow> so ViewportPortal shares flow coordinates.
 */
export function PlayMode({ nodes }: { nodes: AppNode[] }) {
  const status = useAppStore((s) => s.playStatus)
  const playIndex = useAppStore((s) => s.playIndex)
  const speed = useAppStore((s) => s.playSpeed)
  const setPlay = useAppStore((s) => s.setPlay)
  const setPlayIndex = useAppStore((s) => s.setPlayIndex)
  const selectNode = useAppStore((s) => s.selectNode)
  const { setCenter, fitBounds, getNodesBounds } = useReactFlow()
  const tokenRef = useRef<HTMLDivElement>(null)

  const stageNodes = useMemo(
    () =>
      (
        nodes.filter(
          (n) => n.type === 'stage' && !n.data.stage.offPath,
        ) as StageNodeType[]
      ).sort((a, b) => a.data.stage.order - b.data.stage.order),
    [nodes],
  )

  // Focus + panel for the active stage whenever playback lands on it.
  useEffect(() => {
    if (status === 'idle') return
    const cur = stageNodes[playIndex]
    if (!cur) return
    selectNode(cur.id)
    setCenter(
      cur.position.x + (cur.width ?? 0) / 2 + 60,
      cur.position.y + (cur.height ?? 0) / 2,
      { zoom: 0.95, duration: 650 },
    )
  }, [status, playIndex, stageNodes, selectNode, setCenter])

  // The playing loop: dwell on the stage, then travel to the next one.
  useEffect(() => {
    if (status !== 'playing') return
    const cur = stageNodes[playIndex]
    const next = stageNodes[playIndex + 1]
    const token = tokenRef.current
    if (!cur || !token) return

    // Park the token at the start of the outgoing edge (or card edge on last stage).
    const path = next ? buildForwardEdgePath(cur, next) : null
    token.style.offsetPath = path ? `path("${path}")` : 'none'
    token.style.offsetDistance = '0%'
    if (!path) {
      token.style.left = `${cur.position.x + (cur.width ?? 0) - 14}px`
      token.style.top = `${cur.position.y + (cur.height ?? 0) / 2 - 14}px`
    } else {
      token.style.left = '0px'
      token.style.top = '0px'
    }

    let anim: Animation | undefined
    const dwell = window.setTimeout(() => {
      if (!next) {
        // journey complete
        setPlay('idle')
        fitBounds(getNodesBounds(nodes), { duration: 800, padding: 0.06 })
        return
      }
      anim = token.animate(
        [{ offsetDistance: '0%' }, { offsetDistance: '100%' }],
        {
          duration: TRAVEL_MS / speed,
          easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
          fill: 'forwards',
        },
      )
      anim.onfinish = () => setPlayIndex(playIndex + 1)
    }, DWELL_MS / speed)

    return () => {
      window.clearTimeout(dwell)
      anim?.cancel()
    }
  }, [
    status,
    playIndex,
    speed,
    stageNodes,
    nodes,
    setPlay,
    setPlayIndex,
    fitBounds,
    getNodesBounds,
  ])

  // Escape exits play mode.
  useEffect(() => {
    if (status === 'idle') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlay('idle')
        fitBounds(getNodesBounds(nodes), { duration: 700, padding: 0.06 })
      } else if (e.key === 'ArrowRight') {
        setPlay('paused')
        setPlayIndex(Math.min(playIndex + 1, stageNodes.length - 1))
      } else if (e.key === 'ArrowLeft') {
        setPlay('paused')
        setPlayIndex(Math.max(playIndex - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    status,
    playIndex,
    stageNodes.length,
    nodes,
    setPlay,
    setPlayIndex,
    fitBounds,
    getNodesBounds,
  ])

  if (status === 'idle') return null

  return (
    <ViewportPortal>
      <div ref={tokenRef} className="ticket-token" aria-hidden="true">
        <span className="ticket-token__id mono">AMM-042</span>
      </div>
    </ViewportPortal>
  )
}
