import type { InfoEdge, InfoNode } from '../types/content'

/**
 * Git branching & release flow (SOP §4b/4c, §7 Release Management).
 * Three tracks: branches → PR/CI pipeline → environments, plus mobile track.
 */
export const gitflowNodes: InfoNode[] = [
  // --- branches track ---
  {
    id: 'branch-main',
    kind: 'branch',
    title: 'main',
    subtitle: 'production-ready · always tagged',
    detail: [
      'Most stable branch — every production release merges & tags here',
      'Hotfixes branch from main (hotfix/ABC-456-…), tagged e.g. v3.3.1',
      'SemVer: MAJOR.MINOR.PATCH · pre-releases -alpha/-beta/-rc1',
    ],
    accentVar: '--lane-devops',
    roles: ['senior-developer', 'devops-engineer'],
  },
  {
    id: 'branch-release',
    kind: 'branch',
    title: 'release-X.Y.Z',
    subtitle: 'one per upcoming release',
    detail: [
      'All work for a release lands here (e.g. release-3.3.0)',
      'Deployed to UAT — only ONE release branch under test at a time',
      'Merged into main after production deployment',
    ],
    accentVar: '--lane-engineering',
    roles: ['senior-developer'],
  },
  {
    id: 'branch-feature',
    kind: 'branch',
    title: 'feature/* · bugfix/* · hotfix/*',
    subtitle: 'JIRA ID in branch name',
    detail: [
      'Branched from the release branch (hotfixes from main)',
      'e.g. feature/ABC-123-login-screen',
      'Any branch may deploy to dev — it is a playground environment',
      'Rebase on the release branch before opening a PR',
    ],
    accentVar: '--lane-business',
    roles: ['developer'],
  },

  // --- PR / CI pipeline track ---
  {
    id: 'pr',
    kind: 'event',
    title: 'Pull Request',
    subtitle: 'to release-X.Y.Z',
    detail: [
      'Meaningful description; JIRA issue linked in title',
      'Reviewers assigned by area (frontend/backend) & complexity',
    ],
    roles: ['developer'],
    tools: ['GitHub'],
  },
  {
    id: 'ci-checks',
    kind: 'check',
    title: 'Automated CI Checks',
    subtitle: 'must pass before merge',
    detail: [
      'Angular: unit + e2e tests, ESLint, Prettier',
      'Java: JUnit/Mockito, SonarQube, Checkstyle',
      'Kotlin: JUnit/KotlinTest, Detekt',
      'Build verification — code must compile',
    ],
    tools: ['GitHub Actions', 'SonarQube'],
  },
  {
    id: 'code-review',
    kind: 'check',
    title: 'Code Review',
    subtitle: 'human gate',
    detail: [
      'Architecture, error handling, tests, security (no secrets in code)',
      'Comments addressed by pushing to the same PR',
    ],
    roles: ['senior-developer', 'tech-architect'],
  },
  {
    id: 'squash-merge',
    kind: 'event',
    title: 'Squash & Merge',
    subtitle: 'clean history',
    detail: ['Approved PRs are squash-merged; branch deleted after merge'],
    tools: ['GitHub'],
  },

  // --- environments track ---
  {
    id: 'env-dev',
    kind: 'environment',
    title: 'DEV',
    subtitle: 'any branch · playground',
    detail: ['Developers deploy any branch here for testing'],
    accentVar: '--lane-business',
    roles: ['developer', 'devops-engineer'],
  },
  {
    id: 'env-uat',
    kind: 'environment',
    title: 'UAT',
    subtitle: 'release-X.Y.Z only',
    detail: [
      'One release tested at a time — new branches wait their turn',
      'QA runs BVT + regression; end users run UAT scenarios',
    ],
    accentVar: '--lane-qa',
    roles: ['qa-manager', 'product-manager', 'devops-engineer'],
  },
  {
    id: 'env-prod',
    kind: 'environment',
    title: 'PRODUCTION',
    subtitle: 'main · tagged SemVer',
    detail: [
      'DevOps deploys with rollback plan ready',
      'Post-release: smoke tests + monitoring (Prometheus, Grafana)',
    ],
    accentVar: '--lane-devops',
    roles: ['devops-engineer', 'l2-support'],
  },

  // --- mobile track ---
  {
    id: 'mobile-firebase',
    kind: 'event',
    title: 'Firebase App Distribution',
    subtitle: 'all internal & QA builds',
    detail: [
      'QA/UAT builds versioned x.y.z (e.g. 2.2.1), increment per build',
      'Shared with QA & stakeholders; feedback + crash reports',
    ],
    roles: ['senior-mobile-developer'],
    tools: ['Firebase'],
  },
  {
    id: 'mobile-internal',
    kind: 'event',
    title: 'Play Internal Testing',
    subtitle: 'final build x.y (e.g. 2.2)',
    detail: ['Beta testers validate; ops team informed & approvals sought'],
    roles: ['senior-mobile-developer'],
    tools: ['Play Console'],
  },
  {
    id: 'mobile-prod',
    kind: 'environment',
    title: 'Play Store Production',
    subtitle: 'promoted from internal track',
    detail: ['Crashlytics + Pre-launch Reports monitored after rollout'],
    accentVar: '--lane-devops',
    roles: ['senior-mobile-developer'],
  },
]

export const gitflowEdges: InfoEdge[] = [
  { id: 'g1', source: 'branch-release', target: 'branch-feature', kind: 'forward', label: 'branch off' },
  { id: 'g2', source: 'branch-feature', target: 'pr', kind: 'forward', label: 'rebase, then open PR' },
  { id: 'g3', source: 'pr', target: 'ci-checks', kind: 'forward' },
  { id: 'g4', source: 'ci-checks', target: 'code-review', kind: 'forward', label: 'checks green' },
  { id: 'g5', source: 'code-review', target: 'squash-merge', kind: 'forward', label: 'approved' },
  { id: 'g6', source: 'code-review', target: 'branch-feature', kind: 'rework', label: 'changes requested' },
  { id: 'g7', source: 'squash-merge', target: 'branch-release', kind: 'forward', label: 'into release-X.Y.Z' },
  { id: 'g8', source: 'branch-feature', target: 'env-dev', kind: 'forward', label: 'any branch' },
  { id: 'g9', source: 'branch-release', target: 'env-uat', kind: 'forward', label: 'one at a time' },
  { id: 'g10', source: 'env-uat', target: 'env-prod', kind: 'forward', label: 'QA sign-off' },
  { id: 'g11', source: 'env-prod', target: 'branch-main', kind: 'forward', label: 'merge + tag vX.Y.Z' },
  { id: 'g12', source: 'branch-main', target: 'branch-feature', kind: 'rework', label: 'hotfix/* from main' },
  { id: 'g13', source: 'branch-release', target: 'mobile-firebase', kind: 'forward', label: 'mobile builds' },
  { id: 'g14', source: 'mobile-firebase', target: 'mobile-internal', kind: 'forward', label: 'sign-off' },
  { id: 'g15', source: 'mobile-internal', target: 'mobile-prod', kind: 'forward', label: 'promote' },
]
