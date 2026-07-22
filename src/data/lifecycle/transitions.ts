import type { Transition } from '../../types/content'
import { pathStages } from './stages'

/** Forward chain generated from happy-path stage order. */
const ordered = [...pathStages].sort((a, b) => a.order - b.order)

const forward: Transition[] = ordered.slice(0, -1).map((s, i) => {
  const next = ordered[i + 1]
  return {
    id: `f-${s.id}--${next.id}`,
    source: s.id,
    target: next.id,
    kind: 'forward',
  }
})

/**
 * Rework drains into the REOPENED state; the only way back onto the path is
 * the forward re-entry into In Development (through the Re-triage gate).
 */
const rework: Transition[] = [
  {
    id: 'r-in-qa--reopened',
    source: 'in-qa',
    target: 'reopened',
    kind: 'rework',
    label: 'defects found',
  },
  {
    id: 'r-uat-deployed--reopened',
    source: 'uat-deployed',
    target: 'reopened',
    kind: 'rework',
    label: 'UAT feedback',
  },
]

const reentry: Transition[] = [
  {
    id: 'f-reopened--in-development',
    source: 'reopened',
    target: 'in-development',
    kind: 'forward',
  },
]

export const transitions: Transition[] = [...forward, ...reentry, ...rework]
