import type { ViewId } from '../types/content'
import type { AppEdge, AppNode } from '../types/flow'
import { buildLifecycleGraph } from '../layout/lifecycleLayout'
import {
  buildAgileGraph,
  buildGitflowGraph,
  buildIncidentGraph,
  buildRolesGraph,
} from '../layout/flowLayouts'

export interface BoardView {
  id: ViewId
  title: string
  buildGraph: () => { nodes: AppNode[]; edges: AppEdge[] }
  /** Only the lifecycle view supports play mode */
  playable?: boolean
}

export const views: BoardView[] = [
  {
    id: 'lifecycle',
    title: 'Ticket Lifecycle',
    buildGraph: buildLifecycleGraph,
    playable: true,
  },
  { id: 'roles', title: 'Roles', buildGraph: buildRolesGraph },
  { id: 'gitflow', title: 'Git & Releases', buildGraph: buildGitflowGraph },
  { id: 'incident', title: 'Incidents', buildGraph: buildIncidentGraph },
  { id: 'agile', title: 'Agile Cadence', buildGraph: buildAgileGraph },
]

export const viewById = new Map(views.map((v) => [v.id, v]))
