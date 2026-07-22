import type { LaneId } from '../types/content'
import type { AppEdge, AppNode } from '../types/flow'
import { gateByTransition } from '../data/lifecycle/gates'
import { lanes } from '../data/lifecycle/lanes'
import { pathStages, stages } from '../data/lifecycle/stages'
import { transitions } from '../data/lifecycle/transitions'
import {
  COL_GAP,
  LANE_H,
  LANE_PAD_X,
  STAGE_H,
  STAGE_W,
} from './constants'

const laneRow: Record<LaneId, number> = {
  'business-product': 0,
  engineering: 1,
  qa: 2,
  'devops-env': 3,
}

/**
 * Swimlane grid: x from stage order, y from owning lane row.
 * Lane background nodes span the full board width (negative zIndex so
 * edges render above them).
 */
export function buildLifecycleGraph(): { nodes: AppNode[]; edges: AppEdge[] } {
  const boardWidth =
    pathStages.length * STAGE_W + (pathStages.length - 1) * COL_GAP

  const laneNodes: AppNode[] = lanes.map((lane) => {
    const row = laneRow[lane.id]
    return {
      id: `lane-${lane.id}`,
      type: 'lane',
      position: { x: -LANE_PAD_X, y: row * LANE_H },
      data: {
        lane,
        width: boardWidth + LANE_PAD_X * 2,
        height: LANE_H - 16,
      },
      width: boardWidth + LANE_PAD_X * 2,
      height: LANE_H - 16,
      zIndex: -10,
      selectable: false,
      draggable: false,
      focusable: false,
    }
  })

  const stageNodes: AppNode[] = stages.map((stage) => ({
    id: stage.id,
    type: 'stage',
    position: {
      x: (stage.gridCol ?? stage.order) * (STAGE_W + COL_GAP),
      y: laneRow[stage.laneId] * LANE_H + (LANE_H - 16 - STAGE_H) / 2,
    },
    data: { stage },
    width: STAGE_W,
    height: STAGE_H,
    draggable: false,
  }))

  // Non-default edge routing:
  //  - rework loops enter REOPENED from below (they run in the lane gap /
  //    under the board instead of cutting vertically through gate chips)
  //  - the re-entry rises vertically from REOPENED into In Development
  const handleOverrides: Record<
    string,
    { sourceHandle: string; targetHandle: string }
  > = {
    'r-in-qa--reopened': { sourceHandle: 'b', targetHandle: 'b' },
    'r-uat-deployed--reopened': { sourceHandle: 'b', targetHandle: 'b' },
    'f-reopened--in-development': { sourceHandle: 't', targetHandle: 'b' },
  }

  const edges: AppEdge[] = transitions.map((t) => ({
    id: t.id,
    type: 'flow',
    source: t.source,
    target: t.target,
    sourceHandle:
      handleOverrides[t.id]?.sourceHandle ??
      (t.kind === 'forward' ? 'r' : 'l'),
    targetHandle:
      handleOverrides[t.id]?.targetHandle ??
      (t.kind === 'forward' ? 'l' : 'r'),
    data: {
      kind: t.kind,
      label: t.label,
      gate:
        t.kind === 'forward'
          ? gateByTransition.get(`${t.source}--${t.target}`)
          : undefined,
    },
  }))

  return { nodes: [...laneNodes, ...stageNodes], edges }
}
