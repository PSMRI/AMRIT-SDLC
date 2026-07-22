import type { Stage } from '../../types/content'

/**
 * The AMRIT ticket lifecycle, from the AMRIT SDLC SOP
 * (Confluence: AMRIT space, "AMRIT Software Development Lifecycle", §4a
 * "Ticket Movement"). The BRD stage precedes JIRA: the 12 JIRA states run
 * Open → Closed, with REOPENED off-path.
 */
export const stages: Stage[] = [
  {
    id: 'brd',
    order: 0,
    title: 'BRD',
    laneId: 'business-product',
    summary:
      'Before any ticket exists — the Business Systems Analyst documents the business need: BRD, functional specs, workflows.',
    responsibleRoles: ['bsa'],
    actions: [
      'Capture the business need from govt partners, field teams, or support',
      'Document as-is → to-be workflows, scope, and affected users',
      'Produce functional specs, data mapping sheets, report formulas',
      'Review the BRD with the Product Manager and stakeholders',
    ],
    inputs: [
      'Business need / feature request',
      'Field feedback (ASHAs, facility staff, state ops)',
      'Govt health program guidelines (RCH, NCD, TB, Immunization)',
    ],
    outputs: [
      {
        name: 'BRD',
        ownerRole: 'bsa',
        note: 'Business Requirement Document — reviewed with the Product Manager',
      },
      {
        name: 'FRD',
        ownerRole: 'bsa',
        note: 'Functional Requirement Document',
      },
      { name: 'Use case & workflow diagrams', ownerRole: 'bsa' },
      {
        name: 'Mapping sheets',
        ownerRole: 'bsa',
        note: 'Form fields → database',
      },
    ],
    tools: ['Confluence', 'Excel', 'dbdiagram.io'],
    exitCriteria: ['BRD reviewed and signed off by the Product Manager'],
  },
  {
    id: 'open',
    order: 1,
    title: 'Open',
    laneId: 'business-product',
    summary:
      'The Product Manager breaks the BRD into JIRA tickets — epics, stories, and tasks enter the backlog.',
    responsibleRoles: ['product-manager'],
    actions: [
      'Create epics, stories, and tasks in JIRA from the signed-off BRD',
      'Write INVEST-compliant user stories with acceptance criteria',
      'Tag module (Facility App, Sakhi App, Admin portal) and category',
      'Prioritize into the backlog',
    ],
    inputs: [
      'Signed-off BRD / FRD',
      'Bugs escalated by L2 from the IHD Service Desk enter here directly — no BRD',
      'Production bugs arrive tagged as product defects — CAPA required at closure',
    ],
    outputs: [
      {
        name: 'JIRA tickets (epics · stories · tasks)',
        ownerRole: 'product-manager',
      },
      {
        name: 'PRD & user stories',
        ownerRole: 'product-manager',
        note: 'INVEST, with acceptance criteria',
      },
      {
        name: 'Prioritized backlog',
        ownerRole: 'product-manager',
        note: 'Priority set with context: what, who is affected, urgency',
      },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: ['Ticket triaged, prioritized, and picked up for analysis'],
  },
  {
    id: 'analysis',
    order: 2,
    title: 'Analysis',
    laneId: 'engineering',
    summary:
      'Engineering analysis — devs and the Tech Architect design the solution; QA drafts test cases.',
    responsibleRoles: ['tech-architect', 'senior-developer', 'qa-tester'],
    actions: [
      'Feasibility & impact analysis: impacted modules, APIs, DB changes',
      'Write HLD/LLD; Tech Architect reviews and approves the design',
      'QA drafts test cases from the acceptance criteria; dev reviews them',
      'Three Amigos (BSA + Dev + QA) — intent, approach, and proof agreed',
    ],
    inputs: [
      'JIRA tickets with acceptance criteria (PRD / user stories)',
      'Signed-off BRD / FRD and workflow diagrams',
      'Architecture guidance & design patterns',
    ],
    outputs: [
      {
        name: 'HLD / LLD',
        ownerRole: 'tech-architect',
        note: 'Linked on the ticket; design review recorded',
      },
      {
        name: 'Impact analysis',
        ownerRole: 'senior-developer',
        note: 'Impacted modules, APIs, and DB changes',
      },
      {
        name: 'Test cases drafted from AC',
        ownerRole: 'qa-tester',
        note: 'Reviewed by the developer',
      },
    ],
    tools: ['Confluence', 'JIRA', 'dbdiagram.io', 'Swagger'],
    exitCriteria: [
      'Design reviewed and approved by the Tech Architect',
      'QA test cases drafted and dev-reviewed',
    ],
  },
  {
    id: 'ready-for-dev',
    order: 3,
    title: 'Ready for Development',
    laneId: 'engineering',
    summary:
      'The holding bay — design and test cases done, the ticket waits to be pulled into a sprint.',
    responsibleRoles: ['project-manager', 'developer'],
    actions: [
      'Verify all DoR artifacts are linked: FRD, HLD/LLD, QA-reviewed test cases',
      'Estimate with story points (1–3 small · 5–8 medium · 13+ large)',
      'Prioritize within the release; pull into sprint at sprint planning',
    ],
    inputs: [
      'DoR-complete ticket (design + test cases attached)',
      'Release plan & sprint capacity',
    ],
    outputs: [
      {
        name: 'Sprint-ready ticket',
        ownerRole: 'project-manager',
        note: 'Estimated, prioritized, dependency-free',
      },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: ['Pulled into a sprint with an assignee set'],
  },
  {
    id: 'in-development',
    order: 4,
    title: 'In Development',
    laneId: 'engineering',
    summary: 'Dev team implements the feature or fixes the issue.',
    responsibleRoles: ['developer', 'senior-developer'],
    actions: [
      'Branch from release-X.Y.Z (feature/ABC-123-…), commit regularly',
      'Write clean modular code per functional specs & wireframes',
      'Write unit tests; verify manually in the dev environment',
      'Open PR to the release branch; address code review feedback',
    ],
    inputs: [
      'Sprint-ready ticket with acceptance criteria',
      'Functional specs & wireframes',
      'release-X.Y.Z branch',
    ],
    outputs: [
      { name: 'Code + unit tests', ownerRole: 'developer' },
      {
        name: 'Pull request',
        ownerRole: 'developer',
        note: 'JIRA ID in branch & PR title; squash-merged after review',
      },
      { name: 'Code review sign-off', ownerRole: 'senior-developer' },
    ],
    tools: ['GitHub', 'Postman', 'Swagger', 'ELK', 'Android Studio'],
    exitCriteria: [
      'PR approved and squash-merged to release branch',
      'CI checks green: lint, unit tests, static analysis, build',
    ],
  },
  {
    id: 'pending-qa',
    order: 5,
    title: 'Pending QA',
    laneId: 'qa',
    summary: 'Development complete — ticket awaits QA testing.',
    responsibleRoles: ['qa-tester', 'qa-manager'],
    actions: [
      'Queue ticket for testing; assign QA owner',
      'Prepare test cases: positive, negative, boundary, role-based',
      'Confirm build availability in the test environment',
    ],
    inputs: [
      'Merged build on release branch',
      'User stories & acceptance criteria',
      'Test scenarios from BSA',
    ],
    outputs: [
      { name: 'Test cases & test plan', ownerRole: 'qa-tester' },
    ],
    tools: ['JIRA', 'TestLink', 'Zephyr'],
    exitCriteria: ['QA owner assigned and testing started'],
  },
  {
    id: 'in-qa',
    order: 6,
    title: 'In QA',
    laneId: 'qa',
    summary:
      'QA validates functionality against requirements — manual + automated tests.',
    responsibleRoles: ['qa-tester', 'qa-manager'],
    actions: [
      'Execute manual & automated tests against acceptance criteria',
      'Cross-browser & cross-device runs (Android 8+, low RAM, patchy net)',
      'Validate offline sync and multilingual flows',
      'Log defects in JIRA with severity (Critical/Major/Minor/Trivial)',
    ],
    inputs: [
      'Test cases & regression suite (per module: RCH, NCD, TB)',
      'Build deployed to test environment',
    ],
    outputs: [
      { name: 'Test execution report', ownerRole: 'qa-tester' },
      {
        name: 'Defect tickets',
        ownerRole: 'qa-tester',
        note: 'Rework loop back to development',
      },
    ],
    tools: [
      'Selenium',
      'Appium',
      'Playwright',
      'Postman',
      'BrowserStack',
      'Firebase',
    ],
    exitCriteria: [
      'All test cases pass',
      'No open critical/high-severity bugs',
    ],
  },
  {
    id: 'qa-approved',
    order: 7,
    title: 'QA Approved',
    laneId: 'qa',
    summary:
      'QA certifies the work meets quality standards — ready for deployment.',
    responsibleRoles: ['qa-manager'],
    actions: [
      'Review coverage, execution results, and open-defect status',
      'Give final QA sign-off before environment deployments',
      'Coordinate smoke-test & rollback plan with DevOps',
    ],
    inputs: ['Test execution report', 'Defect status & regression results'],
    outputs: [
      {
        name: 'QA sign-off',
        ownerRole: 'qa-manager',
        note: 'Gate: no critical/high bugs open',
      },
    ],
    tools: ['JIRA', 'GitHub Actions', 'Jenkins'],
    exitCriteria: ['QA Manager greenlights deployment'],
  },
  {
    id: 'dev-deployed',
    order: 8,
    title: 'Dev Env Deployed',
    laneId: 'devops-env',
    summary:
      'Deployed to the development environment for validation by devs & stakeholders.',
    responsibleRoles: ['senior-developer', 'tech-architect', 'devops-engineer'],
    actions: [
      'Deploy build via CI/CD pipeline to dev environment',
      'Developers & stakeholders validate end-to-end behavior',
      'Monitor logs and dashboards for anomalies',
    ],
    inputs: ['QA-approved build', 'CI/CD pipeline'],
    outputs: [
      { name: 'Dev-environment build', ownerRole: 'devops-engineer' },
      { name: 'Validation notes', ownerRole: 'senior-developer' },
    ],
    tools: ['GitHub Actions', 'Jenkins', 'AWS EC2', 'ELK', 'Grafana'],
    exitCriteria: ['Stakeholders approve promotion to UAT'],
  },
  {
    id: 'uat-deployed',
    order: 9,
    title: 'UAT Env Deployed',
    laneId: 'devops-env',
    summary:
      'Deployed to UAT for end-user validation — one release branch at a time.',
    responsibleRoles: ['product-manager', 'l2-support', 'devops-engineer'],
    actions: [
      'Deploy release-X.Y.Z to UAT (only one release under test at a time)',
      'Run Build Verification Testing (BVT) on core flows',
      'End users & stakeholders run UAT scenarios from the BSA',
    ],
    inputs: [
      'release-X.Y.Z build',
      'UAT test scenarios (BSA)',
      'BVT checklist',
    ],
    outputs: [
      { name: 'UAT build', ownerRole: 'devops-engineer' },
      { name: 'UAT feedback log', ownerRole: 'l2-support' },
    ],
    tools: ['JIRA', 'Firebase App Distribution', 'AWS'],
    exitCriteria: ['BVT passed', 'End users complete UAT scenarios'],
  },
  {
    id: 'uat-approved',
    order: 10,
    title: 'UAT Approved',
    laneId: 'devops-env',
    summary:
      'End users and stakeholders approve — the release is production-ready.',
    responsibleRoles: ['product-manager'],
    actions: [
      'Collect stakeholder approvals',
      'Freeze release scope; generate release notes from JIRA (Fix Version)',
      'Notify L1 support: features, fixes, known issues, areas to monitor',
    ],
    inputs: ['UAT feedback log', 'JIRA release (Fix Version)'],
    outputs: [
      { name: 'UAT approval', ownerRole: 'product-manager' },
      {
        name: 'Release notes',
        ownerRole: 'product-manager',
        note: 'Business-logic notes from BSA included',
      },
      { name: 'L1 pre-release notification', ownerRole: 'l2-support' },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: ['Sign-off recorded; production deployment scheduled'],
  },
  {
    id: 'prod-deployed',
    order: 11,
    title: 'Production Deployed',
    laneId: 'devops-env',
    summary: 'Live for end users — deployed, tagged, and monitored.',
    responsibleRoles: ['senior-developer', 'l2-support', 'devops-engineer'],
    actions: [
      'DevOps performs production deployment with rollback plan ready',
      'Merge release-X.Y.Z into main; tag with SemVer (e.g. v3.3.0)',
      'Smoke-test in production; monitor dashboards & error rates',
      'Mobile: promote from Play internal testing track to production',
    ],
    inputs: ['UAT-approved release', 'Deployment & rollback runbook'],
    outputs: [
      { name: 'Production release (tagged)', ownerRole: 'devops-engineer' },
      { name: 'Post-release monitoring report', ownerRole: 'l2-support' },
    ],
    tools: ['GitHub', 'Jenkins', 'AWS', 'Prometheus', 'Grafana', 'Play Console'],
    exitCriteria: ['Deployment verified healthy in production'],
  },
  {
    id: 'closed',
    order: 12,
    title: 'Closed',
    laneId: 'business-product',
    summary:
      'Resolved and closed after successful deployment and verification.',
    responsibleRoles: ['project-manager'],
    actions: [
      'Verify resolution with the reporter / field teams',
      'Close the JIRA ticket with closing comments',
      'Archive the JIRA release version; feed learnings to retrospective',
    ],
    inputs: ['Verified production release', 'Post-release monitoring'],
    outputs: [
      { name: 'Closed ticket', ownerRole: 'project-manager' },
      {
        name: 'Retro learnings',
        ownerRole: 'project-manager',
        note: 'Escalated incidents additionally require an RCA before closure',
      },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: ['Ticket closed with resolution comments'],
  },
  {
    id: 'reopened',
    order: 13,
    offPath: true,
    gridCol: 4,
    title: 'Reopened',
    laneId: 'qa',
    summary:
      'The grave state: defects or requirement gaps sent the ticket back. Watched, measured, never routine.',
    responsibleRoles: ['qa-tester', 'senior-developer', 'project-manager'],
    actions: [
      'Reopen with the failed acceptance criteria and evidence attached',
      'Tag the gap: requirement-gap / design-gap / implementation-gap',
      'Developer records a root-cause note before picking the fix up',
      'Reprioritize: P1/P2 into the current sprint, else next sprint',
      'Track reopen count — ≥2 reopens escalate to the Tech Architect',
    ],
    inputs: [
      'Failed test execution / defect report (In QA)',
      'UAT feedback from end users',
      'Desk-check or requirement mismatch found after Dev Done',
    ],
    outputs: [
      {
        name: 'Gap-tagged defect record',
        ownerRole: 'qa-tester',
        note: 'requirement / design / implementation',
      },
      {
        name: 'Reopen-rate metric',
        ownerRole: 'project-manager',
        note: 'Reviewed in the Monthly Quality Review',
      },
    ],
    tools: ['JIRA'],
    exitCriteria: [
      'Passes the Re-triage gate and re-enters In Development',
    ],
  },
]

export const stageById = new Map(stages.map((s) => [s.id, s]))

/** The 13 happy-path stages (BRD → Closed) — drives the forward chain, counts, play mode. */
export const pathStages = stages.filter((s) => !s.offPath)
