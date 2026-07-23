import { describe, expect, it } from 'vitest'
import { bulletGuide, bulletText, type Bullet } from '../types/content'
import { gates } from './lifecycle/gates'
import { lanes } from './lifecycle/lanes'
import { pathStages, stages } from './lifecycle/stages'
import { transitions } from './lifecycle/transitions'
import { roles } from './roles'
import { agileEdges, agileNodes } from './agile'
import { gitflowEdges, gitflowNodes } from './gitflow'
import { incidentEdges, incidentNodes } from './incident'
import {
  buildAgileGraph,
  buildGitflowGraph,
  buildIncidentGraph,
  buildRolesGraph,
} from '../layout/flowLayouts'
import { buildLifecycleGraph } from '../layout/lifecycleLayout'

const laneIds = new Set(lanes.map((l) => l.id))
const stageIds = new Set(stages.map((s) => s.id))
const roleIds = new Set(roles.map((r) => r.id))

describe('lifecycle data', () => {
  it('has 12 happy-path stages with contiguous order, plus off-path states', () => {
    expect(pathStages).toHaveLength(12)
    const orders = pathStages.map((s) => s.order).sort((a, b) => a - b)
    expect(orders).toEqual(Array.from({ length: 12 }, (_, i) => i))
    // off-path states must not collide with the path's order range
    for (const s of stages.filter((x) => x.offPath)) {
      expect(s.order).toBeGreaterThanOrEqual(pathStages.length)
      expect(s.gridCol, `${s.id} needs a gridCol for layout`).toBeDefined()
    }
  })

  it('every stage references a valid lane and valid roles', () => {
    for (const s of stages) {
      expect(laneIds, `${s.id} lane`).toContain(s.laneId)
      expect(s.responsibleRoles.length).toBeGreaterThan(0)
      for (const r of s.responsibleRoles) {
        expect(roleIds, `${s.id} role ${r}`).toContain(r)
      }
      for (const o of s.outputs) {
        expect(roleIds, `${s.id} output owner ${o.ownerRole}`).toContain(
          o.ownerRole,
        )
      }
    }
  })

  it('every stage has content in all detail sections', () => {
    for (const s of stages) {
      expect(s.summary.length, `${s.id} summary`).toBeGreaterThan(0)
      expect(s.actions.length, `${s.id} actions`).toBeGreaterThan(0)
      expect(s.inputs.length, `${s.id} inputs`).toBeGreaterThan(0)
      expect(s.outputs.length, `${s.id} outputs`).toBeGreaterThan(0)
      expect(s.tools.length, `${s.id} tools`).toBeGreaterThan(0)
      expect(s.exitCriteria.length, `${s.id} exitCriteria`).toBeGreaterThan(0)
    }
  })

  it('bullets and artifact templates are well-formed', () => {
    const checkBullets = (owner: string, bullets: Bullet[]) => {
      for (const b of bullets) {
        expect(bulletText(b).length, `${owner} bullet text`).toBeGreaterThan(0)
        const guide = bulletGuide(b)
        if (guide) {
          expect(guide.length, `${owner} "${bulletText(b)}" guide`).toBeGreaterThan(0)
          for (const g of guide) expect(g.length).toBeGreaterThan(0)
        }
      }
    }
    for (const s of stages) {
      checkBullets(`stage ${s.id} actions`, s.actions)
      checkBullets(`stage ${s.id} exitCriteria`, s.exitCriteria)
      for (const o of s.outputs) {
        if (o.guide) {
          expect(o.guide.length, `${s.id} output "${o.name}" guide`).toBeGreaterThan(0)
          for (const g of o.guide) expect(g.length).toBeGreaterThan(0)
        }
      }
    }
    for (const g of gates) checkBullets(`gate ${g.id} criteria`, g.criteria)
  })

  it('transitions reference valid stages and form a full forward chain', () => {
    for (const t of transitions) {
      expect(stageIds, t.id).toContain(t.source)
      expect(stageIds, t.id).toContain(t.target)
    }
    // 11 happy-path hops + the REOPENED re-entry
    const forward = transitions.filter((t) => t.kind === 'forward')
    expect(forward).toHaveLength(12)
    // rework edges must drain into the REOPENED state
    for (const t of transitions.filter((x) => x.kind === 'rework')) {
      expect(t.target, t.id).toBe('reopened')
    }
  })
})

describe('gates data', () => {
  it('every forward transition has exactly one gate', () => {
    const forward = transitions.filter((t) => t.kind === 'forward')
    expect(gates).toHaveLength(forward.length)
    const keys = new Set(gates.map((g) => `${g.source}--${g.target}`))
    for (const t of forward) {
      expect(keys, `${t.source}→${t.target} missing gate`).toContain(
        `${t.source}--${t.target}`,
      )
    }
  })

  it('gates reference valid stages/roles and have full content', () => {
    const ids = new Set(gates.map((g) => g.id))
    expect(ids.size).toBe(gates.length)
    for (const g of gates) {
      expect(g.id).toBe(`gate-${g.source}--${g.target}`)
      expect(stageIds, g.id).toContain(g.source)
      expect(stageIds, g.id).toContain(g.target)
      expect(roleIds, `${g.id} owner`).toContain(g.owner)
      expect(g.criteria.length, `${g.id} criteria`).toBeGreaterThan(0)
      expect(g.evidence.length, `${g.id} evidence`).toBeGreaterThan(0)
      expect(g.short.length, `${g.id} short`).toBeGreaterThan(0)
      expect(g.purpose.length, `${g.id} purpose`).toBeGreaterThan(0)
    }
  })
})

describe('roles data', () => {
  it('has 12 roles with unique ids, all in valid lanes', () => {
    expect(roles).toHaveLength(12)
    expect(roleIds.size).toBe(12)
    for (const r of roles) {
      expect(laneIds, r.id).toContain(r.laneId)
      expect(r.deliverables.length, `${r.id} deliverables`).toBeGreaterThan(0)
      expect(r.responsibilities.length, `${r.id} resp`).toBeGreaterThan(0)
    }
  })
})

describe('layout builders', () => {
  // buildInfoGraph throws when a data node id has no layout position —
  // catches data/layout drift (e.g. renaming a node id in data only).
  it.each([
    ['lifecycle', buildLifecycleGraph],
    ['gitflow', buildGitflowGraph],
    ['incident', buildIncidentGraph],
    ['agile', buildAgileGraph],
    ['roles', buildRolesGraph],
  ] as const)('%s builds with every node positioned', (_name, build) => {
    const { nodes } = build()
    expect(nodes.length).toBeGreaterThan(0)
    const seen = new Set<string>()
    for (const n of nodes) {
      const key = `${n.position.x},${n.position.y}`
      expect(seen.has(key), `nodes stacked at ${key}`).toBe(false)
      seen.add(key)
    }
  })
})

describe.each([
  ['gitflow', gitflowNodes, gitflowEdges],
  ['incident', incidentNodes, incidentEdges],
  ['agile', agileNodes, agileEdges],
] as const)('%s graph', (_name, nodes, edges) => {
  const ids = new Set(nodes.map((n) => n.id))

  it('has unique node ids', () => {
    expect(ids.size).toBe(nodes.length)
  })

  it('edges reference existing nodes with unique edge ids', () => {
    const edgeIds = new Set(edges.map((e) => e.id))
    expect(edgeIds.size).toBe(edges.length)
    for (const e of edges) {
      expect(ids, `${e.id} source`).toContain(e.source)
      expect(ids, `${e.id} target`).toContain(e.target)
    }
  })

  it('roles referenced on nodes exist', () => {
    for (const n of nodes) {
      for (const r of n.roles ?? []) {
        expect(roleIds, `${n.id} role ${r}`).toContain(r)
      }
    }
  })
})
