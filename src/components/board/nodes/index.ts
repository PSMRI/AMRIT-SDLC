import type { NodeTypes } from '@xyflow/react'
import { InfoNode } from './InfoNode'
import { LabelNode } from './LabelNode'
import { LaneNode } from './LaneNode'
import { RoleNode } from './RoleNode'
import { StageNode } from './StageNode'
import { ZoneNode } from './ZoneNode'

/** Module-scope constant — never recreate per render (would remount nodes). */
export const nodeTypes: NodeTypes = {
  stage: StageNode,
  lane: LaneNode,
  role: RoleNode,
  info: InfoNode,
  label: LabelNode,
  zone: ZoneNode,
}
