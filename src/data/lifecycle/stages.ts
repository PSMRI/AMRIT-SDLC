import type { Stage } from '../../types/content'

/**
 * The 12-state AMRIT ticket lifecycle, from the AMRIT SDLC SOP
 * (Confluence: AMRIT space, "AMRIT Software Development Lifecycle", §4a
 * "Ticket Movement").
 */
export const stages: Stage[] = [
  {
    id: 'open',
    order: 0,
    title: 'Open',
    laneId: 'business-product',
    summary: 'Ticket is created and logged — a new need enters the system.',
    responsibleRoles: ['project-manager', 'bsa'],
    actions: [
      'Log the ticket in JIRA with context and priority',
      'Capture the business need from govt partners, field teams, or support',
      'Tag module (Facility App, Sakhi App, Admin portal) and category',
    ],
    inputs: [
      'Business need / feature request / bug report',
      'Field feedback (ASHAs, facility staff, state ops)',
      'Escalations from L1/L2 support',
    ],
    outputs: [
      { name: 'JIRA ticket', ownerRole: 'project-manager' },
      {
        name: 'Initial problem statement',
        ownerRole: 'bsa',
        note: 'Context, affected users, urgency',
      },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: ['Ticket triaged and picked up for analysis'],
  },
  {
    id: 'analysis',
    order: 1,
    title: 'Analysis',
    laneId: 'business-product',
    summary:
      'Requirements and scope are analyzed — business needs, technical specs, feasibility.',
    responsibleRoles: ['bsa', 'product-manager'],
    actions: [
      'Gather business requirements and map as-is → to-be workflows',
      'Write INVEST-compliant user stories with acceptance criteria',
      'Produce functional specs, data mapping sheets, report formulas',
      'Feasibility check with Tech Architect; groom with dev & QA',
    ],
    inputs: [
      'JIRA ticket + problem statement',
      'Govt health program guidelines (RCH, NCD, TB, Immunization)',
      'Stakeholder interviews & field workflows',
    ],
    outputs: [
      {
        name: 'BRD / FRD',
        ownerRole: 'bsa',
        note: 'Functional Requirement Document',
      },
      { name: 'Use case & workflow diagrams', ownerRole: 'bsa' },
      {
        name: 'Mapping sheets',
        ownerRole: 'bsa',
        note: 'Form fields → database',
      },
      {
        name: 'PRD & user stories',
        ownerRole: 'product-manager',
        note: 'INVEST, with acceptance criteria',
      },
    ],
    tools: ['Confluence', 'JIRA', 'Excel', 'dbdiagram.io'],
    exitCriteria: [
      'Requirements documented and signed off',
      'Acceptance criteria defined for every story',
    ],
  },
  {
    id: 'ready-for-dev',
    order: 2,
    title: 'Ready for Development',
    laneId: 'engineering',
    summary:
      'Reviewed and approved for development — all prerequisites finalized.',
    responsibleRoles: ['scrum-master', 'tech-architect'],
    actions: [
      'Verify design documents and acceptance criteria are complete',
      'Estimate with story points (1–3 small · 5–8 medium · 13+ large)',
      'Pull into sprint at sprint planning; set sprint goal',
      'Tech Architect confirms approach & component design',
    ],
    inputs: [
      'FRD, user stories, acceptance criteria',
      'Architecture guidance & design patterns',
      'Groomed, estimated backlog',
    ],
    outputs: [
      {
        name: 'Sprint-ready ticket',
        ownerRole: 'scrum-master',
        note: 'Estimated, prioritized, dependency-free',
      },
      { name: 'Technical design notes', ownerRole: 'tech-architect' },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: [
      'All prerequisites (design docs, acceptance criteria) finalized',
      'Ticket assigned to a developer in the sprint',
    ],
  },
  {
    id: 'in-development',
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
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
    order: 8,
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
    order: 9,
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
    order: 10,
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
    order: 11,
    title: 'Closed',
    laneId: 'business-product',
    summary:
      'Resolved and closed after successful deployment and verification.',
    responsibleRoles: ['project-manager', 'scrum-master'],
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
        ownerRole: 'scrum-master',
        note: 'Escalated incidents additionally require an RCA before closure',
      },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: ['Ticket closed with resolution comments'],
  },
]

export const stageById = new Map(stages.map((s) => [s.id, s]))
