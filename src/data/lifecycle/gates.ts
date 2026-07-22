import type { Gate } from '../../types/content'

/**
 * Hard transition gates. Each forward hop in the ticket lifecycle has one:
 * criteria (what must be true), evidence (links on the ticket — never a
 * verbal yes), and a single owning role whose sign-off flips the status.
 *
 * Designed to close two recurring failure modes:
 *  1. Development starting without HLD/LLD  → Definition of Ready gate
 *  2. QA discovering requirement/implementation gaps late → shift-left
 *     criteria (QA-reviewed AC, test cases before code, dev desk-check)
 */
export const gates: Gate[] = [
  {
    id: 'gate-open--analysis',
    source: 'open',
    target: 'analysis',
    title: 'Intake Gate',
    short: 'INTAKE',
    purpose: 'Only well-formed tickets enter analysis — no vague one-liners.',
    owner: 'project-manager',
    criteria: [
      'Problem statement captured: what, who is affected, urgency',
      'Module tagged (Facility App, Sakhi App, Admin portal)',
      'Category set: Bug / Enhancement / Infra',
      'Priority assigned',
    ],
    evidence: ['JIRA ticket with all intake fields filled'],
  },
  {
    id: 'gate-analysis--ready-for-dev',
    source: 'analysis',
    target: 'ready-for-dev',
    title: 'Definition of Ready',
    short: 'DoR',
    purpose:
      'The heavyweight gate: no ticket reaches development without approved design and testable, QA-reviewed requirements.',
    owner: 'tech-architect',
    criteria: [
      'FRD / user stories signed off by Product Manager',
      'Acceptance criteria written and testable — QA has reviewed them',
      'HLD/LLD linked on the ticket and design review completed',
      'Impacted modules, APIs, and DB changes listed in the design doc',
      'QA test cases drafted from AC; developer has reviewed them',
      'Three Amigos held (BSA + Dev + QA) — intent, approach, and proof agreed',
    ],
    evidence: [
      'FRD link (Confluence)',
      'HLD/LLD link with architect approval recorded',
      'Test case link (reviewed by dev)',
    ],
    waiver:
      'Small bugfixes (1–3 pts) may waive HLD/LLD with the architect’s recorded approval. QA-reviewed acceptance criteria are NEVER waived.',
  },
  {
    id: 'gate-ready-for-dev--in-development',
    source: 'ready-for-dev',
    target: 'in-development',
    title: 'Sprint Commit',
    short: 'COMMIT',
    purpose: 'Work starts only inside a sprint, with a clear owner and branch.',
    owner: 'scrum-master',
    criteria: [
      'Story pointed (1–3 / 5–8 / 13+) and pulled in sprint planning',
      'Assignee set; no unresolved dependencies',
      'Branch created from release-X.Y.Z with the JIRA ID in its name',
    ],
    evidence: ['Sprint assignment in JIRA', 'Branch link on the ticket'],
  },
  {
    id: 'gate-in-development--pending-qa',
    source: 'in-development',
    target: 'pending-qa',
    title: 'Dev Done · Desk Check',
    short: 'DESK CHECK',
    purpose:
      'Ten minutes that kill "that’s not what was asked": the developer demos against acceptance criteria with QA before handoff.',
    owner: 'senior-developer',
    criteria: [
      'PR squash-merged to release branch; CI green (lint, unit tests, static analysis, build)',
      'Unit tests cover the change',
      'Desk check done: dev walks QA through the feature against each AC',
      'No debug code, secrets, or commented-out blocks in the diff',
    ],
    evidence: [
      'PR link + green CI run',
      'Desk-check note on the ticket (QA participant named)',
    ],
  },
  {
    id: 'gate-pending-qa--in-qa',
    source: 'pending-qa',
    target: 'in-qa',
    title: 'Test Readiness',
    short: 'TEST READY',
    purpose: 'QA never waits on a broken or missing build.',
    owner: 'qa-manager',
    criteria: [
      'Build deployed to the test environment and sanity-checked',
      'Test cases finalized (positive, negative, boundary, role-based)',
      'Test data and devices/browsers ready',
    ],
    evidence: ['Build number on the ticket', 'Final test case link'],
  },
  {
    id: 'gate-in-qa--qa-approved',
    source: 'in-qa',
    target: 'qa-approved',
    title: 'Quality Gate',
    short: 'QA PASS',
    purpose: 'The classic hard gate: nothing critical stays open.',
    owner: 'qa-manager',
    criteria: [
      '100% of planned test cases executed',
      'Zero critical/high-severity defects open',
      'Regression suite for the module passed',
      'Every defect tagged: requirement-gap / design-gap / implementation-gap',
    ],
    evidence: ['Test execution report', 'Defect list with gap tags'],
  },
  {
    id: 'gate-qa-approved--dev-deployed',
    source: 'qa-approved',
    target: 'dev-deployed',
    title: 'Deploy Readiness',
    short: 'DEPLOY READY',
    purpose: 'Deployments are boring: reviewed config, reviewed migrations, rollback ready.',
    owner: 'devops-engineer',
    criteria: [
      'CI/CD pipeline green for the release branch',
      'Config and environment changes documented',
      'DB migrations reviewed by the DBA',
      'Rollback plan written',
    ],
    evidence: ['Pipeline run link', 'Migration review note'],
  },
  {
    id: 'gate-dev-deployed--uat-deployed',
    source: 'dev-deployed',
    target: 'uat-deployed',
    title: 'UAT Entry',
    short: 'UAT ENTRY',
    purpose: 'Only one release occupies UAT — and it arrives validated.',
    owner: 'product-manager',
    criteria: [
      'Stakeholders validated the feature in the dev environment',
      'No other release-X.Y.Z currently under test on UAT',
      'BVT checklist prepared',
    ],
    evidence: ['Dev validation note', 'BVT checklist link'],
  },
  {
    id: 'gate-uat-deployed--uat-approved',
    source: 'uat-deployed',
    target: 'uat-approved',
    title: 'UAT Sign-off',
    short: 'UAT PASS',
    purpose: 'Real end users confirm the build does the job.',
    owner: 'product-manager',
    criteria: [
      'BVT passed on the UAT build',
      'UAT scenarios (from BSA) executed by end users / stakeholders',
      'All UAT feedback resolved or explicitly logged for a later release',
    ],
    evidence: ['BVT result', 'UAT feedback log with dispositions'],
  },
  {
    id: 'gate-uat-approved--prod-deployed',
    source: 'uat-approved',
    target: 'prod-deployed',
    title: 'Release Gate',
    short: 'RELEASE',
    purpose: 'Production is a ceremony with a checklist, not a Friday push.',
    owner: 'l2-support',
    criteria: [
      'QA Manager’s final sign-off recorded',
      'Release notes generated from JIRA (Fix Version)',
      'L1 support notified: features, fixes, known issues, what to monitor',
      'Rollback plan confirmed; deployment window agreed',
    ],
    evidence: ['Release notes link', 'L1 notification', 'Sign-off record'],
  },
  {
    id: 'gate-reopened--in-development',
    source: 'reopened',
    target: 'in-development',
    title: 'Re-triage Gate',
    short: 'RE-TRIAGE',
    purpose:
      'Reopening is triaged, not tossed back over the wall — and repeat reopens escalate.',
    owner: 'scrum-master',
    criteria: [
      'Defect gap-tagged: requirement-gap / design-gap / implementation-gap',
      'Reproduction steps and failed AC attached',
      'Developer root-cause note recorded',
      'Priority set: P1/P2 into the current sprint, else next sprint',
      '≥2 reopens on the same ticket → escalated to Tech Architect and logged for the Monthly Quality Review',
    ],
    evidence: [
      'Defect report link with gap tag',
      'Reopen comment naming cause and priority',
    ],
  },
  {
    id: 'gate-prod-deployed--closed',
    source: 'prod-deployed',
    target: 'closed',
    title: 'Closure Gate',
    short: 'CLOSURE',
    purpose: 'Closed means verified in the field — not merely deployed.',
    owner: 'project-manager',
    criteria: [
      'Production smoke test passed',
      'Monitoring clean for the agreed observation window',
      'Reporter / field team confirmed the resolution',
      'RCA linked if the ticket came from an escalated incident (P1–P4)',
      'Production defects: CAPA document linked — corrective action (fix + data repair) and preventive action (process/test change)',
    ],
    evidence: [
      'Smoke test result',
      'Closing comment with verification',
      'CAPA document link (production defects)',
    ],
  },
]

export const gateByTransition = new Map(
  gates.map((g) => [`${g.source}--${g.target}`, g]),
)

export const gateById = new Map(gates.map((g) => [g.id, g]))
