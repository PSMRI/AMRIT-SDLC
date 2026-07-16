import type { Transition } from '../../types/content'
import { stages } from './stages'

/** Forward chain generated from stage order, plus explicit rework loops. */
const ordered = [...stages].sort((a, b) => a.order - b.order)

const forward: Transition[] = ordered.slice(0, -1).map((s, i) => {
  const next = ordered[i + 1]
  return {
    id: `f-${s.id}--${next.id}`,
    source: s.id,
    target: next.id,
    kind: 'forward',
  }
})

// Meaningful gate labels on key forward hops
const labels: Record<string, string> = {
  'f-analysis--ready-for-dev': 'requirements signed off',
  'f-in-development--pending-qa': 'PR merged · CI green',
  'f-in-qa--qa-approved': 'all tests pass',
  'f-uat-deployed--uat-approved': 'end-user sign-off',
  'f-prod-deployed--closed': 'verified in production',
}
for (const t of forward) {
  const label = labels[t.id]
  if (label) t.label = label
}

const rework: Transition[] = [
  {
    id: 'r-in-qa--in-development',
    source: 'in-qa',
    target: 'in-development',
    kind: 'rework',
    label: 'defects found',
  },
  {
    id: 'r-uat-deployed--in-development',
    source: 'uat-deployed',
    target: 'in-development',
    kind: 'rework',
    label: 'UAT feedback',
  },
]

export const transitions: Transition[] = [...forward, ...rework]
