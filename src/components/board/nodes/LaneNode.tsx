import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import type { LaneNodeType } from '../../../types/flow'

function LaneNodeInner({ data }: NodeProps<LaneNodeType>) {
  const accent = `var(${data.lane.accentVar})`
  return (
    <div
      className="lane"
      style={
        {
          width: data.width,
          height: data.height,
          '--lane-accent': accent,
        } as React.CSSProperties
      }
    >
      <span className="lane__title mono">{data.lane.title}</span>
    </div>
  )
}

export const LaneNode = memo(LaneNodeInner)
