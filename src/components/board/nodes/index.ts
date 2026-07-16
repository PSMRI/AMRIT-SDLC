import type { NodeTypes } from '@xyflow/react'
import { LaneNode } from './LaneNode'
import { StageNode } from './StageNode'

/** Module-scope constant — never recreate per render (would remount nodes). */
export const nodeTypes: NodeTypes = {
  stage: StageNode,
  lane: LaneNode,
}
