/* ---------------------------------------------------------------------------
   Content data model — the contract between src/data/**, layout, and UI.
   All SDLC content is data-driven: update the SOP → edit src/data only.
--------------------------------------------------------------------------- */

export type RoleId =
  | 'bsa'
  | 'product-manager'
  | 'scrum-master'
  | 'developer'
  | 'senior-developer'
  | 'senior-mobile-developer'
  | 'tech-architect'
  | 'project-manager'
  | 'l2-support'
  | 'qa-tester'
  | 'qa-manager'
  | 'dba'
  | 'devops-engineer'

export type LaneId = 'business-product' | 'engineering' | 'qa' | 'devops-env'

export interface Lane {
  id: LaneId
  title: string
  /** CSS custom property carrying the lane accent color, e.g. '--lane-qa' */
  accentVar: string
}

export interface Role {
  id: RoleId
  name: string
  abbreviation: string
  laneId: LaneId
  description: string
  responsibilities: string[]
  deliverables: string[]
  tools: string[]
}

export interface Artifact {
  name: string
  ownerRole: RoleId
  note?: string
}

export type StageId =
  | 'open'
  | 'analysis'
  | 'ready-for-dev'
  | 'in-development'
  | 'pending-qa'
  | 'in-qa'
  | 'qa-approved'
  | 'dev-deployed'
  | 'uat-deployed'
  | 'uat-approved'
  | 'prod-deployed'
  | 'closed'
  | 'reopened'

export interface Stage {
  id: StageId
  /** 0-based position in the lifecycle; drives layout and play mode */
  order: number
  /**
   * True for states outside the happy path (e.g. REOPENED): excluded from
   * the forward chain, play mode, and stage counts; rendered in alert tone.
   */
  offPath?: boolean
  /** Layout column override for off-path states (defaults to `order`) */
  gridCol?: number
  title: string
  laneId: LaneId
  /** One-liner shown on the card */
  summary: string
  responsibleRoles: RoleId[]
  actions: string[]
  inputs: string[]
  outputs: Artifact[]
  tools: string[]
  exitCriteria: string[]
}

export interface Transition {
  id: string
  source: StageId
  target: StageId
  kind: 'forward' | 'rework'
  label?: string
}

/**
 * A hard gate on a stage transition: the ticket cannot move until the
 * criteria are met, evidenced on the ticket, and signed off by the owner.
 */
export interface Gate {
  /** `gate-<source>--<target>` */
  id: string
  source: StageId
  target: StageId
  title: string
  /** Short label shown on the edge chip, e.g. "DoR" */
  short: string
  purpose: string
  /** Role whose sign-off flips the status */
  owner: RoleId
  /** What must be true to pass */
  criteria: string[]
  /** Links/artifacts that must be on the ticket — no verbal sign-offs */
  evidence: string[]
  /** When (if ever) the gate may be relaxed */
  waiver?: string
}

/* ------------------------- generic flow content --------------------------
   Used by the Git Flow / Incident / Agile views, which are simpler graphs
   of typed "info cards" connected by labeled edges.
-------------------------------------------------------------------------- */

export type InfoNodeKind =
  | 'branch' // git branch pill
  | 'environment' // dev / UAT / prod
  | 'check' // CI check / gate
  | 'event' // ceremony, incident step
  | 'decision' // branching decision point
  | 'note' // free-standing callout

export interface InfoNode {
  id: string
  kind: InfoNodeKind
  title: string
  subtitle?: string
  detail?: string[]
  /** Optional lane/track accent */
  accentVar?: string
  /** Roles involved, cross-links into the Roles view */
  roles?: RoleId[]
  tools?: string[]
}

export interface InfoEdge {
  id: string
  source: string
  target: string
  kind: 'forward' | 'rework'
  label?: string
}

export type ViewId = 'lifecycle' | 'roles' | 'gitflow' | 'incident' | 'agile'
