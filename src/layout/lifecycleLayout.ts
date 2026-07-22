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

  // Release-level segment: dashed zone band spanning all lanes, plus
  // per-segment workflow labels above the board.
  const releaseStages = pathStages.filter((s) => s.scope === 'release')
  const extraNodes: AppNode[] = []
  if (releaseStages.length > 0) {
    const firstCol = Math.min(...releaseStages.map((s) => s.order))
    const zoneX = firstCol * (STAGE_W + COL_GAP) - COL_GAP / 2
    const zoneW = releaseStages.length * (STAGE_W + COL_GAP)
    const zoneH = 4 * LANE_H - 16 + 28
    extraNodes.push(
      {
        id: 'zone-release',
        type: 'zone',
        position: { x: zoneX, y: -14 },
        data: { width: zoneW, height: zoneH },
        width: zoneW,
        height: zoneH,
        zIndex: -5,
        selectable: false,
        draggable: false,
        focusable: false,
      },
      {
        id: 'lbl-ticket-workflow',
        type: 'label',
        position: { x: 0, y: -76 },
        data: {
          title: 'TICKET WORKFLOW',
          subtitle: 'per ticket · closed right after QA approval',
        },
        draggable: false,
        selectable: false,
        zIndex: -5,
      },
      {
        id: 'lbl-release-workflow',
        type: 'label',
        position: { x: zoneX + COL_GAP / 2, y: -76 },
        data: {
          title: 'RELEASE WORKFLOW',
          subtitle: 'per release · tracked & approved on the release ticket',
        },
        draggable: false,
        selectable: false,
        zIndex: -5,
      },
    )
  }

  // Non-default edge routing:
  //  - rework loops enter REOPENED from below (they run in the lane gap /
  //    under the board instead of cutting vertically through gate chips)
  //  - the re-entry rises vertically from REOPENED into In Development
  const handleOverrides: Record<
    string,
    { sourceHandle: string; targetHandle: string }
  > = {
    'r-in-qa--reopened': { sourceHandle: 'b', targetHandle: 'b' },
    'r-release-uat--reopened': { sourceHandle: 'b', targetHandle: 'b' },
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

  return { nodes: [...laneNodes, ...extraNodes, ...stageNodes], edges }
}
