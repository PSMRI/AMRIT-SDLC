import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import type { RoleNodeType } from '../../../types/flow'
import { laneById } from '../../../data/lifecycle/lanes'
import { SideHandles } from './StageNode'

function RoleNodeInner({ data, selected }: NodeProps<RoleNodeType>) {
  const { role } = data
  const accent = `var(${laneById.get(role.laneId)?.accentVar})`

  return (
    <div
      className={`card role-card${selected ? ' is-selected' : ''}`}
      style={{ '--card-accent': accent } as React.CSSProperties}
    >
      <div className="role-card__head">
        <span className="chip mono">{role.abbreviation}</span>
        <span className="role-card__count mono">
          {role.deliverables.length} deliverables
        </span>
      </div>
      <h3 className="role-card__name">{role.name}</h3>
      <p className="role-card__desc">{role.description}</p>
      <SideHandles />
    </div>
  )
}

export const RoleNode = memo(RoleNodeInner)
