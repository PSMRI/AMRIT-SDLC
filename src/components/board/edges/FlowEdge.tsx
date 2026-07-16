import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react'
import type { FlowEdgeType } from '../../../types/flow'

/**
 * Pipeline edge: base conduit + animated dash overlay + SMIL "data packet"
 * dots on forward edges. Rework edges are dashed, warning-colored, dot-free.
 * All motion is CSS/SMIL — zero React renders per frame.
 */
function FlowEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<FlowEdgeType>) {
  const kind = data?.kind ?? 'forward'
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 14,
    offset: kind === 'rework' ? 40 : 24,
  })

  return (
    <>
      <BaseEdge id={id} path={path} className={`flow-edge flow-edge--${kind}`} />
      {kind === 'forward' && (
        <>
          <path d={path} className="flow-edge__dash" fill="none" />
          <circle className="flow-edge__packet" r="3">
            <animateMotion dur="3.2s" repeatCount="indefinite" path={path} />
          </circle>
          <circle className="flow-edge__packet" r="3">
            <animateMotion
              dur="3.2s"
              begin="1.6s"
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        </>
      )}
      {data?.label && (
        <EdgeLabelRenderer>
          <span
            className={`edge-label mono edge-label--${kind}`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {data.label}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export const FlowEdge = memo(FlowEdgeInner)
