import type { InfoEdge, InfoNode } from '../types/content'

/**
 * Agile cadence (SOP §4a): the 2-week sprint loop, rendered as a cycle.
 * Node order in this array = position around the circle.
 */
export const agileNodes: InfoNode[] = [
  {
    id: 'ag-grooming',
    kind: 'event',
    title: 'Backlog Grooming',
    subtitle: 'before each sprint',
    detail: [
      'PO + key stakeholders participate',
      'Every task gets acceptance criteria, dependencies, estimates',
      'Story points: 1–3 small · 5–8 medium · 13+ large',
    ],
    accentVar: '--lane-business',
    roles: ['product-manager', 'bsa', 'project-manager'],
  },
  {
    id: 'ag-planning',
    kind: 'event',
    title: 'Sprint Planning',
    subtitle: 'day 1',
    detail: [
      'PO presents prioritized backlog',
      'Team discusses scope, approach, and effort',
      'Sprint goal set; tasks broken down and pointed',
      'Definition of done clarified',
    ],
    accentVar: '--lane-engineering',
    roles: ['project-manager', 'product-manager', 'developer'],
  },
  {
    id: 'ag-standup',
    kind: 'event',
    title: 'Daily Standup',
    subtitle: '~15 min, every day',
    detail: [
      'Yesterday · Today · Blockers',
      'Project Manager (Scrum Master hat) runs it, tracks and clears blockers',
    ],
    accentVar: '--lane-engineering',
    roles: ['project-manager', 'developer', 'qa-tester'],
  },
  {
    id: 'ag-work',
    kind: 'event',
    title: 'Sprint Work',
    subtitle: '2-week sprint',
    detail: [
      'Development, code review, QA — the ticket lifecycle in motion',
      'Tickets move: In Development → QA → environments',
    ],
    accentVar: '--lane-qa',
    roles: ['developer', 'senior-developer', 'qa-tester'],
  },
  {
    id: 'ag-review',
    kind: 'event',
    title: 'Sprint Review',
    subtitle: 'end of sprint',
    detail: [
      'Demo completed work to PO & stakeholders',
      'Feed acceptance results back into the backlog',
    ],
    accentVar: '--lane-business',
    roles: ['product-manager', 'project-manager', 'developer'],
  },
  {
    id: 'ag-retro',
    kind: 'event',
    title: 'Retrospective',
    subtitle: 'continuous improvement',
    detail: [
      'What went well · What can improve · Action items',
      'Project Manager facilitates and tracks actions',
      'Feeds Monthly Quality Reviews & engineering guilds',
    ],
    accentVar: '--lane-devops',
    roles: ['project-manager'],
  },
]

export const agileEdges: InfoEdge[] = agileNodes.map((n, i) => {
  const next = agileNodes[(i + 1) % agileNodes.length]
  return {
    id: `a-${n.id}--${next.id}`,
    source: n.id,
    target: next.id,
    kind: 'forward' as const,
    label: next.id === 'ag-grooming' ? 'next sprint' : undefined,
  }
})
