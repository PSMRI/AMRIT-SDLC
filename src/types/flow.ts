import type { Edge, Node } from '@xyflow/react'
import type { Gate, InfoNode, Lane, Role, Stage, Transition } from './content'

export type StageNodeType = Node<{ stage: Stage }, 'stage'>
export type LaneNodeType = Node<
  { lane: Lane; width: number; height: number },
  'lane'
>
export type RoleNodeType = Node<{ role: Role }, 'role'>
export type InfoNodeType = Node<{ info: InfoNode }, 'info'>
export type LabelNodeType = Node<
  { title: string; subtitle?: string },
  'label'
>

export type AppNode =
  | StageNodeType
  | LaneNodeType
  | RoleNodeType
  | InfoNodeType
  | LabelNodeType

export type FlowEdgeType = Edge<
  { kind: Transition['kind']; label?: string; gate?: Gate },
  'flow'
>
export type AppEdge = FlowEdgeType
