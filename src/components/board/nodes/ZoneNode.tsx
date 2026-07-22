import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import type { ZoneNodeType } from '../../../types/flow'

/** Dashed background band grouping the release-level stages. */
function ZoneNodeInner({ data }: NodeProps<ZoneNodeType>) {
  return (
    <div
      className="release-zone"
      style={{ width: data.width, height: data.height }}
    />
  )
}

export const ZoneNode = memo(ZoneNodeInner)
