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
    id: 'gate-brd--open',
    source: 'brd',
    target: 'open',
    title: 'BRD Sign-off',
    short: 'BRD',
    purpose: 'No tickets are cut from an unapproved requirement.',
    owner: 'product-manager',
    criteria: [
      'BRD documents the need: what, who is affected, urgency',
      'As-is → to-be workflows and scope reviewed with stakeholders',
      'Product Manager has reviewed and accepted the BRD',
    ],
    evidence: ['BRD link (Confluence) with sign-off recorded'],
    waiver:
      'Bugs and production defects skip the BRD and enter directly at Open.',
  },
  {
    id: 'gate-open--analysis',
    source: 'open',
    target: 'analysis',
    title: 'Intake Gate',
    short: 'INTAKE',
    purpose: 'Only well-formed tickets enter analysis — no vague one-liners.',
    owner: 'product-manager',
    criteria: [
      'Feature tickets trace back to the signed-off BRD',
      'Module tagged (Facility App, Sakhi App, Admin portal)',
      'Category set: Bug / Enhancement / Infra',
      'Priority assigned in the backlog',
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
    owner: 'project-manager',
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
    owner: 'qa-tester',
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
    owner: 'qa-tester',
    criteria: [
      '100% of planned test cases executed',
      'Zero critical/high-severity defects open',
      'Regression suite for the module passed',
      'Every defect tagged: requirement-gap / design-gap / implementation-gap',
    ],
    evidence: ['Test execution report', 'Defect list with gap tags'],
  },
  {
    id: 'gate-qa-approved--closed',
    source: 'qa-approved',
    target: 'closed',
    title: 'Ticket Closure',
    short: 'CLOSURE',
    purpose: 'Closed means QA-verified with a paper trail — not merely finished.',
    owner: 'project-manager',
    criteria: [
      'QA approval recorded on the ticket',
      'Closing comment names the resolution',
      'Production defects: CAPA document linked — corrective action (fix + data repair) and preventive action (process/test change)',
      'RCA linked if the ticket came from an escalated incident (P1–P4)',
    ],
    evidence: [
      'Closing comment with resolution',
      'CAPA document link (production defects)',
    ],
  },
  {
    id: 'gate-closed--release-uat',
    source: 'closed',
    target: 'release-uat',
    title: 'Release Ready',
    short: 'REL READY',
    purpose: 'The release moves as one unit — only when every ticket in it is closed.',
    owner: 'project-manager',
    criteria: [
      'All tickets in the Fix Version closed',
      'Release ticket created to track progress and approvals',
      'Full ticket list & release notes shared with the Ops team',
      'UAT scenarios ready (BSA); no other release currently under UAT',
    ],
    evidence: [
      'Release ticket link',
      'Ops notification with the ticket list',
    ],
  },
  {
    id: 'gate-release-uat--release-approved',
    source: 'release-uat',
    target: 'release-approved',
    title: 'UAT Sign-off',
    short: 'UAT PASS',
    purpose: 'The Ops team confirms the release does the job before anyone signs.',
    owner: 'l2-support',
    criteria: [
      'BVT passed on the UAT build',
      'Ops executed the UAT scenarios (from BSA)',
      'All UAT feedback resolved or explicitly logged for a later release',
    ],
    evidence: ['UAT feedback log with dispositions on the release ticket'],
  },
  {
    id: 'gate-release-approved--prod-release',
    source: 'release-approved',
    target: 'prod-release',
    title: 'Go-Live Approval',
    short: 'GO LIVE',
    purpose: 'Production is a ceremony: three named approvals and a checklist, not a Friday push.',
    owner: 'qa-manager',
    criteria: [
      'QA Manager, Ops (L1), and Tech Architect approvals on the release ticket',
      'Deployment planned with DevOps & IT — window, owners, rollback',
      'Pre- and post-deployment checklists attached to the release ticket',
      'L1 support briefed: features, fixes, known issues, what to monitor',
    ],
    evidence: [
      'Three approvals on the release ticket',
      'Checklist links',
      'Deployment plan',
    ],
  },
  {
    id: 'gate-reopened--in-development',
    source: 'reopened',
    target: 'in-development',
    title: 'Re-triage Gate',
    short: 'RE-TRIAGE',
    purpose:
      'Reopening is triaged, not tossed back over the wall — and repeat reopens escalate.',
    owner: 'project-manager',
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
]

export const gateByTransition = new Map(
  gates.map((g) => [`${g.source}--${g.target}`, g]),
)

export const gateById = new Map(gates.map((g) => [g.id, g]))
