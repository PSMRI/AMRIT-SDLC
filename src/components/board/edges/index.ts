import type { EdgeTypes } from '@xyflow/react'
import { FlowEdge } from './FlowEdge'

/** Module-scope constant — never recreate per render. */
export const edgeTypes: EdgeTypes = {
  flow: FlowEdge,
}
