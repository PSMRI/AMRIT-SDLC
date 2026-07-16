import type { InfoEdge, InfoNode } from '../types/content'

/**
 * Incident response flow (SOP §9): Field/L1 → triage → L2 → AMM board →
 * Engineering fix (P1/P2 vs P3/P4) → QA verify → deploy → RCA before closure.
 */
export const incidentNodes: InfoNode[] = [
  {
    id: 'inc-sources',
    kind: 'event',
    title: 'Incident Sources',
    subtitle: 'JIRA Service Desk portal',
    detail: [
      'Field users: ASHAs, lab techs, facility staff',
      'Operations team & L1 support',
      'All routed through the Support Portal',
    ],
    accentVar: '--lane-business',
    tools: ['JIRA Service Desk'],
  },
  {
    id: 'inc-triage',
    kind: 'check',
    title: 'Initial Triage (L1 & Ops)',
    subtitle: 'validate · reproduce · tag',
    detail: [
      'Check known errors & training issues',
      'Tag severity & category: Bug / Enhancement / Infra',
      'Attach logs, screenshots, steps to reproduce',
      'L1 resolves directly when possible',
    ],
    accentVar: '--lane-business',
  },
  {
    id: 'inc-l2',
    kind: 'event',
    title: 'L2 Investigation',
    subtitle: 'technical deep-dive',
    detail: [
      'Logs (ELK), DB & API health, backend/frontend/perf/infra',
      'Reproduce in test/staging',
      'Code/system issue confirmed → escalate to engineering',
    ],
    accentVar: '--lane-devops',
    roles: ['l2-support'],
    tools: ['ELK', 'Postman', 'SQL'],
  },
  {
    id: 'inc-amm',
    kind: 'event',
    title: 'AMM JIRA Board Handoff',
    subtitle: 'engineering queue',
    detail: [
      'Linked to original Service Desk ticket',
      'Summary, replication steps + environment, error logs',
      'Priority + component labels, suggested RCA',
    ],
    accentVar: '--lane-engineering',
    roles: ['l2-support'],
  },
  {
    id: 'inc-p12',
    kind: 'decision',
    title: 'P1 / P2 — Critical',
    subtitle: 'hotfix or current sprint',
    detail: [
      'Triaged at daily standup or within SLA window',
      'Hotfixed from main, or prioritized into the running sprint',
    ],
    accentVar: '--rework',
    roles: ['senior-developer', 'scrum-master'],
  },
  {
    id: 'inc-p34',
    kind: 'decision',
    title: 'P3 / P4 — Standard',
    subtitle: 'product backlog',
    detail: ['Added to the backlog for future sprints'],
    accentVar: '--lane-engineering',
    roles: ['product-manager', 'scrum-master'],
  },
  {
    id: 'inc-fix',
    kind: 'event',
    title: 'Engineering Fix',
    subtitle: 'root cause → resolution',
    detail: [
      'Developer resolves; QA verifies in staging',
      'Build deployed through the standard pipeline',
    ],
    accentVar: '--lane-engineering',
    roles: ['developer', 'senior-developer', 'qa-tester'],
  },
  {
    id: 'inc-rca',
    kind: 'check',
    title: 'RCA — Required Gate',
    subtitle: 'before closure, P1–P4',
    detail: [
      'Format: Root cause · Trigger · Impact · Fix · Preventive measures',
      'Owned by the resolving developer; L2/QA/Tech Lead support',
      'Reviewed by Tech Lead or QA Manager — revised if insufficient',
      'Blameless post-mortems for P1; learnings → KB & retros',
    ],
    accentVar: '--lane-qa',
    roles: ['developer', 'qa-manager', 'tech-architect'],
  },
  {
    id: 'inc-close',
    kind: 'event',
    title: 'Close & Communicate',
    subtitle: 'loop back to the field',
    detail: [
      'L2 closes engineering ticket; updates Service Desk with notes',
      'Field ops / L1 informed at escalation, in-progress, and resolution',
    ],
    accentVar: '--lane-devops',
    roles: ['l2-support'],
  },
]

export const incidentEdges: InfoEdge[] = [
  { id: 'i1', source: 'inc-sources', target: 'inc-triage', kind: 'forward' },
  { id: 'i2', source: 'inc-triage', target: 'inc-l2', kind: 'forward', label: 'not resolvable at L1' },
  { id: 'i3', source: 'inc-l2', target: 'inc-amm', kind: 'forward', label: 'code/system issue' },
  { id: 'i4', source: 'inc-amm', target: 'inc-p12', kind: 'forward', label: 'P1 · P2' },
  { id: 'i5', source: 'inc-amm', target: 'inc-p34', kind: 'forward', label: 'P3 · P4' },
  { id: 'i6', source: 'inc-p12', target: 'inc-fix', kind: 'forward', label: 'hotfix / sprint' },
  { id: 'i7', source: 'inc-p34', target: 'inc-fix', kind: 'forward', label: 'future sprint' },
  { id: 'i8', source: 'inc-fix', target: 'inc-rca', kind: 'forward', label: 'QA verified' },
  { id: 'i9', source: 'inc-rca', target: 'inc-close', kind: 'forward', label: 'RCA approved' },
  { id: 'i10', source: 'inc-rca', target: 'inc-fix', kind: 'rework', label: 'RCA insufficient' },
]

/** Responsibility matrix (verbatim from SOP §9). */
export const incidentMatrix: Array<{ role: string; responsibility: string }> = [
  { role: 'L1 Support / Ops', responsibility: 'First triage, check known issues, basic support' },
  { role: 'L2 Support', responsibility: 'Technical investigation, escalation to AMM' },
  { role: 'Engineering', responsibility: 'Root cause analysis, fix, QA, deployment' },
  { role: 'QA', responsibility: 'Build verification, fix validation' },
  { role: 'Release Manager', responsibility: 'Confirm fix deployment and update JIRA' },
  { role: 'Scrum Master / PO', responsibility: 'Sprint-level prioritization and communication' },
]
