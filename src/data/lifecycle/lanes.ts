import type { Lane } from '../../types/content'

export const lanes: Lane[] = [
  {
    id: 'business-product',
    title: 'Business & Product',
    accentVar: '--lane-business',
  },
  {
    id: 'engineering',
    title: 'Engineering',
    accentVar: '--lane-engineering',
  },
  {
    id: 'qa',
    title: 'Quality Assurance',
    accentVar: '--lane-qa',
  },
  {
    id: 'devops-env',
    title: 'IT · DevOps · Environments',
    accentVar: '--lane-devops',
  },
]

export const laneById = new Map(lanes.map((l) => [l.id, l]))
