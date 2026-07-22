import type { Role } from '../types/content'

/**
 * The 12 roles from the AMRIT SDLC SOP §3 "Roles & Responsibilities".
 * The Scrum Master function is a hat worn by the Project Manager, not a
 * separate person.
 */
export const roles: Role[] = [
  {
    id: 'bsa',
    name: 'Business Systems Analyst',
    abbreviation: 'BSA',
    laneId: 'business-product',
    description:
      'Bridges government health programs and engineering — turns field workflows into precise, buildable requirements.',
    responsibilities: [
      'Understand govt health programs (RCH, NCD, TB, Immunization)',
      'Gather requirements; create as-is and to-be workflows',
      'Map manual processes to digital journeys',
      'Groom tasks and explain them to devs & QA',
      'Bridge technical and non-technical stakeholders',
    ],
    deliverables: [
      'Functional Requirement Documents (FRD)',
      'Use case & workflow diagrams',
      'Mapping sheets (form fields → database)',
      'Test scenarios for UAT',
      'Release notes (business-logic standpoint)',
    ],
    tools: ['Confluence', 'JIRA', 'Excel', 'dbdiagram.io'],
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    abbreviation: 'PM',
    laneId: 'business-product',
    description:
      'Owns product vision, roadmap, and backlog per module; the voice of the user in every sprint.',
    responsibilities: [
      'Create epics, stories & tasks in JIRA from the signed-off BRD',
      'Own backlog prioritization',
      'Plan releases jointly with the Project Manager',
      'Own product vision & roadmap; manage lifecycle concept → launch',
      'Write INVEST-compliant user stories with acceptance criteria',
      'Define & monitor KPIs; run user research',
      'Ensure DPDP / NDHM / FHIR compliance',
    ],
    deliverables: [
      'Product roadmap',
      'PRD & prioritized backlog',
      'Release plan (jointly with the Project Manager)',
      'User stories with acceptance criteria',
      'KPI / adoption dashboards',
    ],
    tools: ['JIRA', 'Confluence', 'Mixpanel'],
  },
  {
    id: 'developer',
    name: 'Developer',
    abbreviation: 'Dev',
    laneId: 'engineering',
    description:
      'Writes clean, modular frontend and backend code from tickets, specs, and wireframes.',
    responsibilities: [
      'Implement features & fixes per functional specs',
      'Write unit tests; verify manually in dev/staging',
      'Follow Git branching strategy, linting, commit conventions',
      'Participate in ceremonies; pair with L2 support',
    ],
    deliverables: ['Code + unit tests', 'Pull requests', 'Dev verification notes'],
    tools: ['GitHub', 'Postman', 'Swagger', 'ELK', 'Firebase Crashlytics'],
  },
  {
    id: 'senior-developer',
    name: 'Senior Developer',
    abbreviation: 'Sr Dev',
    laneId: 'engineering',
    description:
      'Breaks down epics, owns critical components, reviews code, and leads root-cause analysis for live issues.',
    responsibilities: [
      'Break epics into components; choose design patterns',
      'Review junior code; enforce quality & CI/CD checks',
      'Own components: auth, offline sync, data sync, caching',
      'Lead RCA for live bugs; implement hotfixes',
      'Coordinate with QA, L2, and DevOps',
    ],
    deliverables: ['Component designs', 'Code reviews', 'RCA documents', 'Hotfixes'],
    tools: ['GitHub', 'SonarQube', 'ELK', 'Postman'],
  },
  {
    id: 'senior-mobile-developer',
    name: 'Senior Mobile Developer',
    abbreviation: 'Mobile',
    laneId: 'engineering',
    description:
      'Builds the Android apps (Sakhi, Facility) — offline-first, resilient on low-end devices and patchy networks.',
    responsibilities: [
      'Offline-first architecture (SQLite/Room), sync & conflict resolution',
      'Support Android 8+, low-end devices, patchy connectivity',
      'CI/CD via GitHub Actions & Bitrise; Play Store rollout plans',
      'Crash & analytics instrumentation (Crashlytics, Mixpanel)',
    ],
    deliverables: [
      'Android app releases (Sakhi, Facility)',
      'Sync/conflict-resolution designs',
      'Play Store rollout plans',
    ],
    tools: ['Android Studio', 'Jetpack Compose', 'Room', 'Retrofit', 'Firebase', 'Bitrise'],
  },
  {
    id: 'tech-architect',
    name: 'Technical Architect',
    abbreviation: 'Arch',
    laneId: 'engineering',
    description:
      'Designs the system — Spring Boot services, Angular frontends, data pipelines — and guards security & standards.',
    responsibilities: [
      'Design architecture: REST/GraphQL backend, Angular frontend, pipelines',
      'Own deployment strategy (AWS EC2, RDS) and CI/CD design',
      'Security audits & DPDP compliance; API gateways, RBAC, auth',
      'Promote OpenHIE / FHIR standards',
      'Approve third-party components',
    ],
    deliverables: [
      'Architecture & data-flow diagrams',
      'Deployment models',
      'Security audit reports',
      'Third-party approvals',
    ],
    tools: ['AWS', 'ELK', 'Prometheus', 'Grafana', 'Confluence'],
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    abbreviation: 'PjM',
    laneId: 'business-product',
    description:
      'Plans releases with the Product Manager and keeps them on track — and wears the Scrum Master hat: standups, ceremonies, and delivery reporting.',
    responsibilities: [
      'Plan releases with the Product Manager; keep them on track',
      'Act as Scrum Master: daily standups, sprint planning, reviews, retros',
      'Unblock bottlenecks; monitor velocity, spillover, cycle time',
      'Stakeholder engagement (NHM, State Health Societies, funders)',
      'Quality & compliance assurance: QA sign-off before release',
      'Risk & issue management; progress tracking & reporting',
    ],
    deliverables: [
      'Project plan (primary deliverable)',
      'Sprint plans, velocity / spillover reports',
      'Status reports & trackers',
      'Escalation matrix',
      'Retro action items',
    ],
    tools: ['JIRA', 'Asana', 'Excel', 'Confluence'],
  },
  {
    id: 'l2-support',
    name: 'L2 Support',
    abbreviation: 'L2',
    laneId: 'devops-env',
    description:
      'Technical investigation layer between field/L1 and engineering — reproduces, diagnoses, and escalates.',
    responsibilities: [
      'Analyze issues escalated from L1, call center, and field teams',
      'Reproduce bugs in test/staging; query logs via ELK; SQL on read-only prod',
      'Create reproducible bug reports; escalate to devs/QA via AMM board',
      'Maintain knowledge base; monthly SLA & ticket-volume reports',
      'Second QA layer on high-risk releases; post-release monitoring',
    ],
    deliverables: [
      'Reproducible bug reports',
      'Monthly L2 ticket & SLA reports',
      'Knowledge-base articles',
    ],
    tools: ['ELK', 'Postman', 'Swagger', 'SQL', 'JIRA Service Desk'],
  },
  {
    id: 'qa-tester',
    name: 'QA Tester',
    abbreviation: 'QA',
    laneId: 'qa',
    description:
      'Designs and executes tests across browsers, devices, and languages — the safety net before every release.',
    responsibilities: [
      'Create manual test cases: positive, negative, boundary, role-based',
      'Cross-browser & cross-device testing (Android 8+, low RAM, patchy net)',
      'Validate offline sync and multilingual flows (Hindi, Bengali)',
      'Maintain regression suites per module (RCH, NCD, TB); sanity per build',
      'Automation via Selenium, Appium, Playwright',
    ],
    deliverables: [
      'Test cases & regression suites',
      'Test execution reports',
      'Defect tickets',
    ],
    tools: ['Selenium', 'Appium', 'Playwright', 'Postman', 'BrowserStack'],
  },
  {
    id: 'qa-manager',
    name: 'QA Manager',
    abbreviation: 'QA Mgr',
    laneId: 'qa',
    description:
      'Owns quality gates — coverage, automation in CI/CD, and the final sign-off before any deployment.',
    responsibilities: [
      'Manage QA team; own coverage & test matrices',
      'Integrate automation into CI/CD (GitHub Actions, Jenkins)',
      'Track bug rejection rate, escaped defects, coverage trends',
      'Final QA sign-off before staging/production deployments',
      'No critical/high-severity bugs open before greenlighting',
    ],
    deliverables: [
      'QA sign-offs',
      'Quality metrics dashboards',
      'Smoke-test & rollback coordination',
    ],
    tools: ['JIRA', 'GitHub Actions', 'Jenkins', 'JaCoCo'],
  },
  {
    id: 'dba',
    name: 'Database Administrator',
    abbreviation: 'DBA',
    laneId: 'devops-env',
    description:
      'Guards the data layer — schema versioning, performance, backups, and PII/PHI protection.',
    responsibilities: [
      'Schema design/review; version control via Liquibase/Flyway',
      'PostgreSQL/MySQL admin: replication, HA, failover',
      'RBAC + encryption at rest/in transit; PII/PHI audit logs',
      'Query tuning; monitoring (pgAdmin, CloudWatch, Datadog)',
      'Backups + restore testing against RTO/RPO',
    ],
    deliverables: [
      'Versioned schema migrations',
      'ERD documentation',
      'Backup & recovery reports',
    ],
    tools: ['PostgreSQL', 'MySQL', 'Liquibase', 'Flyway', 'pgAdmin', 'dbdiagram.io'],
  },
  {
    id: 'devops-engineer',
    name: 'IT & DevOps Engineer',
    abbreviation: 'DevOps',
    laneId: 'devops-env',
    description:
      'Provisions infrastructure, runs CI/CD, and owns every deployment — from commit to production, with rollback ready.',
    responsibilities: [
      'Provision & manage infra (AWS/GCP/Azure) for staging + production',
      'Infrastructure-as-Code: Terraform, CloudFormation, Ansible',
      'CI/CD pipelines: commit → production; rollback & feature flags',
      'Security hardening, secrets (Vault, AWS Secrets Manager), VPNs',
      'Monitoring & alerting (Prometheus, Grafana, ELK); DR with RPO/RTO',
    ],
    deliverables: [
      'Environments (dev / UAT / prod)',
      'CI/CD pipelines',
      'Deployment & rollback runbooks',
      'Monitoring dashboards & alerts',
    ],
    tools: ['Terraform', 'Jenkins', 'GitHub Actions', 'AWS', 'Prometheus', 'Grafana', 'ELK'],
  },
]

export const roleById = new Map(roles.map((r) => [r.id, r]))
