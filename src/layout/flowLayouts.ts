import type { InfoEdge, InfoNode } from '../types/content'
import type { AppEdge, AppNode } from '../types/flow'
import { agileEdges, agileNodes } from '../data/agile'
import { gitflowEdges, gitflowNodes } from '../data/gitflow'
import { incidentEdges, incidentNodes } from '../data/incident'
import { lanes } from '../data/lifecycle/lanes'
import { roles } from '../data/roles'
import { INFO_H, INFO_W, ROLE_H, ROLE_W } from './constants'

type Pos = { x: number; y: number }

/** Choose edge attachment sides from relative geometry (center to center). */
function pickHandles(source: Pos, target: Pos, w = INFO_W, h = INFO_H) {
  const dx = target.x + w / 2 - (source.x + w / 2)
  const dy = target.y + h / 2 - (source.y + h / 2)
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: 'r', targetHandle: 'l' }
      : { sourceHandle: 'l', targetHandle: 'r' }
  }
  return dy >= 0
    ? { sourceHandle: 'b', targetHandle: 't' }
    : { sourceHandle: 't', targetHandle: 'b' }
}

function buildInfoGraph(
  nodes: InfoNode[],
  edges: InfoEdge[],
  positions: Record<string, Pos>,
  extra: AppNode[] = [],
  handleOverrides: Record<
    string,
    { sourceHandle: string; targetHandle: string }
  > = {},
): { nodes: AppNode[]; edges: AppEdge[] } {
  // Fail loudly on data/layout drift (e.g. a renamed node id) — a silent
  // {0,0} fallback stacks cards on top of each other.
  const pos = (id: string): Pos => {
    const p = positions[id]
    if (!p) throw new Error(`flowLayouts: no position for info node "${id}"`)
    return p
  }

  const appNodes: AppNode[] = nodes.map((info) => ({
    id: info.id,
    type: 'info',
    position: pos(info.id),
    data: { info },
    width: INFO_W,
    height: INFO_H,
    draggable: false,
  }))

  const appEdges: AppEdge[] = edges.map((e) => {
    const s = pos(e.source)
    const t = pos(e.target)
    return {
      id: e.id,
      type: 'flow',
      source: e.source,
      target: e.target,
      ...(handleOverrides[e.id] ?? pickHandles(s, t)),
      data: { kind: e.kind, label: e.label },
    }
  })

  return { nodes: [...extra, ...appNodes], edges: appEdges }
}

function trackLabel(id: string, title: string, x: number, y: number): AppNode {
  return {
    id,
    type: 'label',
    position: { x, y },
    data: { title },
    draggable: false,
    selectable: false,
    zIndex: -5,
  }
}

/* ------------------------------- git flow -------------------------------- */

export function buildGitflowGraph() {
  const positions: Record<string, Pos> = {
    // branches track
    'branch-feature': { x: 0, y: 0 },
    'branch-release': { x: 700, y: 0 },
    'branch-main': { x: 1400, y: 0 },
    // PR pipeline track
    pr: { x: 0, y: 260 },
    'ci-checks': { x: 350, y: 260 },
    'code-review': { x: 700, y: 260 },
    'squash-merge': { x: 1050, y: 260 },
    // environments track
    'env-dev': { x: 0, y: 540 },
    'env-uat': { x: 700, y: 540 },
    'env-prod': { x: 1400, y: 540 },
    // mobile track
    'mobile-firebase': { x: 350, y: 800 },
    'mobile-internal': { x: 875, y: 800 },
    'mobile-prod': { x: 1400, y: 800 },
  }
  const labels = [
    trackLabel('lbl-branches', 'BRANCHES', -300, 40),
    trackLabel('lbl-pipeline', 'PR PIPELINE', -300, 300),
    trackLabel('lbl-envs', 'ENVIRONMENTS', -300, 580),
    trackLabel('lbl-mobile', 'MOBILE TRACK', -300, 840),
  ]
  return buildInfoGraph(gitflowNodes, gitflowEdges, positions, labels)
}

/* ------------------------------- incident -------------------------------- */

export function buildIncidentGraph() {
  // 430px columns leave a 180px gap so edge-label pills ("not resolvable
  // at L1", "RCA insufficient", …) sit clear of the card edges.
  const COL = 430
  const positions: Record<string, Pos> = {
    'inc-sources': { x: 0, y: 0 },
    'inc-triage': { x: COL, y: 0 },
    'inc-l2': { x: COL * 2, y: 0 },
    'inc-amm': { x: COL * 3, y: 0 },
    'inc-critical': { x: COL * 4, y: -190 },
    'inc-standard': { x: COL * 4, y: 190 },
    'inc-fix': { x: COL * 5, y: 0 },
    'inc-rca': { x: COL * 6, y: 0 },
    'inc-capa': { x: COL * 7, y: 0 },
    'inc-close': { x: COL * 8, y: 0 },
    'inc-matrix': { x: 0, y: 320 },
  }
  // Route the RCA-insufficient rework loop under the cards so it doesn't
  // render on top of the forward Engineering Fix → RCA edge.
  const handleOverrides = {
    i10: { sourceHandle: 'b', targetHandle: 'b' },
  }
  return buildInfoGraph(incidentNodes, incidentEdges, positions, [], handleOverrides)
}

/* --------------------------------- agile ---------------------------------- */

export function buildAgileGraph() {
  const radius = 430
  const positions: Record<string, Pos> = {}
  agileNodes.forEach((n, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / agileNodes.length
    positions[n.id] = {
      x: Math.round(radius * Math.cos(angle)) - INFO_W / 2,
      y: Math.round(radius * 0.72 * Math.sin(angle)) - INFO_H / 2,
    }
  })
  const center: AppNode = {
    id: 'lbl-sprint',
    type: 'label',
    position: { x: -130, y: -34 },
    data: { title: '2-WEEK SPRINT', subtitle: 'grooming → retro, repeat' },
    draggable: false,
    selectable: false,
    zIndex: -5,
  }
  return buildInfoGraph(agileNodes, agileEdges, positions, [center])
}

/* --------------------------------- roles ---------------------------------- */

export function buildRolesGraph(): { nodes: AppNode[]; edges: AppEdge[] } {
  const COL_GAP = 90
  const ROW_GAP = 36
  const HEADER = 64

  const nodes: AppNode[] = []

  lanes.forEach((lane, col) => {
    const laneRoles = roles.filter((r) => r.laneId === lane.id)
    const x = col * (ROLE_W + COL_GAP)
    const height = HEADER + laneRoles.length * (ROLE_H + ROW_GAP) + 8

    nodes.push({
      id: `lane-${lane.id}`,
      type: 'lane',
      position: { x: x - 24, y: -HEADER },
      data: { lane, width: ROLE_W + 48, height },
      width: ROLE_W + 48,
      height,
      zIndex: -10,
      selectable: false,
      draggable: false,
      focusable: false,
    })

    laneRoles.forEach((role, row) => {
      nodes.push({
        id: `role-${role.id}`,
        type: 'role',
        position: { x, y: row * (ROLE_H + ROW_GAP) + 16 },
        data: { role },
        width: ROLE_W,
        height: ROLE_H,
        draggable: false,
      })
    })
  })

  return { nodes, edges: [] }
}
