import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react'
import type { FlowEdgeType } from '../../../types/flow'
import { useAppStore } from '../../../store/useAppStore'

/**
 * Pipeline edge: base conduit + animated dash overlay + SMIL "data packet"
 * dots on forward edges. Rework edges are dashed, warning-colored, dot-free.
 * All motion is CSS/SMIL — zero React renders per frame.
 *
 * Forward edges carry a clickable hard-gate chip at the path midpoint;
 * clicking it opens the gate's criteria/evidence/owner in the detail panel.
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
  const selectedNodeId = useAppStore((s) => s.selectedNodeId)
  const selectNode = useAppStore((s) => s.selectNode)

  const kind = data?.kind ?? 'forward'
  const gate = data?.gate
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
      {gate ? (
        <EdgeLabelRenderer>
          <button
            type="button"
            className={`gate-chip nopan${
              selectedNodeId === gate.id ? ' is-selected' : ''
            }`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            title={`${gate.title} — click for criteria`}
            aria-label={`Gate: ${gate.title}`}
            onClick={(e) => {
              e.stopPropagation()
              selectNode(gate.id)
            }}
          >
            <svg
              className="gate-chip__icon"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path d="M6 0.8 L11.2 6 L6 11.2 L0.8 6 Z" />
            </svg>
            <span className="gate-chip__label mono">{gate.short}</span>
          </button>
        </EdgeLabelRenderer>
      ) : (
        data?.label && (
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
        )
      )}
    </>
  )
}

export const FlowEdge = memo(FlowEdgeInner)
