import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { StageNodeType } from '../../../types/flow'
import { laneById } from '../../../data/lifecycle/lanes'
import { roleById } from '../../../data/roles'
import { pathStages } from '../../../data/lifecycle/stages'

/** Invisible 4-way handles so edges can attach on any side. */
export function SideHandles() {
  return (
    <>
      <Handle id="l" type="source" position={Position.Left} className="port" />
      <Handle id="r" type="source" position={Position.Right} className="port" />
      <Handle id="t" type="source" position={Position.Top} className="port" />
      <Handle id="b" type="source" position={Position.Bottom} className="port" />
      <Handle id="l" type="target" position={Position.Left} className="port" />
      <Handle id="r" type="target" position={Position.Right} className="port" />
      <Handle id="t" type="target" position={Position.Top} className="port" />
      <Handle id="b" type="target" position={Position.Bottom} className="port" />
    </>
  )
}

function StageNodeInner({ data, selected }: NodeProps<StageNodeType>) {
  const { stage } = data
  const lane = laneById.get(stage.laneId)
  const accent = stage.offPath
    ? 'var(--rework)'
    : `var(${lane?.accentVar ?? '--accent'})`

  return (
    <div
      className={`card stage-card${stage.offPath ? ' stage-card--alert' : ''}${
        selected ? ' is-selected' : ''
      }`}
      style={{ '--card-accent': accent } as React.CSSProperties}
    >
      <div className="stage-card__eyebrow">
        <span className="mono">
          {stage.offPath
            ? 'REWORK STATE'
            : `${String(stage.order + 1).padStart(2, '0')} / ${pathStages.length}`}
        </span>
        <span className="stage-card__dot" aria-hidden="true" />
      </div>
      <h3 className="stage-card__title">{stage.title}</h3>
      <p className="stage-card__summary">{stage.summary}</p>
      <div className="stage-card__footer">
        <div className="chip-row">
          {stage.responsibleRoles.slice(0, 3).map((id) => (
            <span key={id} className="chip mono">
              {roleById.get(id)?.abbreviation ?? id}
            </span>
          ))}
          {stage.responsibleRoles.length > 3 && (
            <span className="chip chip--more mono">
              +{stage.responsibleRoles.length - 3}
            </span>
          )}
        </div>
        <span className="stage-card__outputs mono">
          {stage.outputs.length} out
        </span>
      </div>
      <SideHandles />
    </div>
  )
}

export const StageNode = memo(StageNodeInner)
