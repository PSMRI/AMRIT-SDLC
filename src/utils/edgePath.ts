import { Position, getSmoothStepPath } from '@xyflow/react'
import type { AppNode } from '../types/flow'

/**
 * Rebuild the exact SVG path a forward lifecycle edge renders with
 * (right handle → left handle, same borderRadius/offset as FlowEdge),
 * so the play-mode token can follow it via CSS offset-path.
 */
export function buildForwardEdgePath(source: AppNode, target: AppNode): string {
  const sw = source.width ?? 0
  const sh = source.height ?? 0
  const th = target.height ?? 0
  const [path] = getSmoothStepPath({
    sourceX: source.position.x + sw,
    sourceY: source.position.y + sh / 2,
    sourcePosition: Position.Right,
    targetX: target.position.x,
    targetY: target.position.y + th / 2,
    targetPosition: Position.Left,
    borderRadius: 14,
    offset: 24,
  })
  return path
}
