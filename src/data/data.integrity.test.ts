import { describe, expect, it } from 'vitest'
import { gates } from './lifecycle/gates'
import { lanes } from './lifecycle/lanes'
import { stages } from './lifecycle/stages'
import { transitions } from './lifecycle/transitions'
import { roles } from './roles'
import { agileEdges, agileNodes } from './agile'
import { gitflowEdges, gitflowNodes } from './gitflow'
import { incidentEdges, incidentNodes } from './incident'

const laneIds = new Set(lanes.map((l) => l.id))
const stageIds = new Set(stages.map((s) => s.id))
const roleIds = new Set(roles.map((r) => r.id))

describe('lifecycle data', () => {
  it('has 12 stages with unique, contiguous order values', () => {
    expect(stages).toHaveLength(12)
    const orders = stages.map((s) => s.order).sort((a, b) => a - b)
    expect(orders).toEqual(Array.from({ length: 12 }, (_, i) => i))
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

  it('transitions reference valid stages and form a full forward chain', () => {
    for (const t of transitions) {
      expect(stageIds, t.id).toContain(t.source)
      expect(stageIds, t.id).toContain(t.target)
    }
    const forward = transitions.filter((t) => t.kind === 'forward')
    expect(forward).toHaveLength(11)
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
  it('has 13 roles with unique ids, all in valid lanes', () => {
    expect(roles).toHaveLength(13)
    expect(roleIds.size).toBe(13)
    for (const r of roles) {
      expect(laneIds, r.id).toContain(r.laneId)
      expect(r.deliverables.length, `${r.id} deliverables`).toBeGreaterThan(0)
      expect(r.responsibilities.length, `${r.id} resp`).toBeGreaterThan(0)
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
