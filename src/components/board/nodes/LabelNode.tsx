import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import type { LabelNodeType } from '../../../types/flow'

function LabelNodeInner({ data }: NodeProps<LabelNodeType>) {
  return (
    <div className="board-label">
      <span className="board-label__title mono">{data.title}</span>
      {data.subtitle && (
        <span className="board-label__subtitle mono">{data.subtitle}</span>
      )}
    </div>
  )
}

export const LabelNode = memo(LabelNodeInner)
