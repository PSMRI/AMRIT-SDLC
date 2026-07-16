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
): { nodes: AppNode[]; edges: AppEdge[] } {
  const appNodes: AppNode[] = nodes.map((info) => ({
    id: info.id,
    type: 'info',
    position: positions[info.id] ?? { x: 0, y: 0 },
    data: { info },
    width: INFO_W,
    height: INFO_H,
    draggable: false,
  }))

  const appEdges: AppEdge[] = edges.map((e) => {
    const s = positions[e.source] ?? { x: 0, y: 0 }
    const t = positions[e.target] ?? { x: 0, y: 0 }
    return {
      id: e.id,
      type: 'flow',
      source: e.source,
      target: e.target,
      ...pickHandles(s, t),
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
  const positions: Record<string, Pos> = {
    'inc-sources': { x: 0, y: 0 },
    'inc-triage': { x: 360, y: 0 },
    'inc-l2': { x: 720, y: 0 },
    'inc-amm': { x: 1080, y: 0 },
    'inc-p12': { x: 1440, y: -170 },
    'inc-p34': { x: 1440, y: 170 },
    'inc-fix': { x: 1800, y: 0 },
    'inc-rca': { x: 2160, y: 0 },
    'inc-close': { x: 2520, y: 0 },
    'inc-matrix': { x: 360, y: 300 },
  }
  return buildInfoGraph(incidentNodes, incidentEdges, positions)
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
