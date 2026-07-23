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
 *
 * Criteria may carry a `guide` — what the gate owner actually checks (ⓘ in
 * the panel).
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
      {
        text: 'BRD documents the need: what, who is affected, urgency',
        guide: [
          'The problem statement stands on its own — a new reader understands what hurts and why',
          'Affected users are quantified, not "many users"',
          'Urgency is justified by program deadlines or field impact, not by who asked',
        ],
      },
      {
        text: 'As-is → to-be workflows and scope reviewed with stakeholders',
        guide: [
          'The as-is diagram shows today’s reality, pain points marked',
          'Every pain point on the as-is is visibly addressed (or explicitly deferred) in the to-be',
          'Out-of-scope items are written down — that list is the scope-creep firewall',
        ],
      },
      {
        text: 'Product Manager has reviewed and accepted the BRD',
        guide: [
          'Review happened as a walkthrough, not a silent document share',
          'Open questions have named owners and dates',
          'Acceptance is recorded on the BRD page itself',
        ],
      },
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
      {
        text: 'Feature tickets trace back to the signed-off BRD',
        guide: [
          'The ticket links its BRD/FRD source section',
          'A ticket that maps to nothing in the BRD is either scope creep or a missing BRD update — resolve which',
        ],
      },
      'Module tagged (Facility App, Sakhi App, Admin portal)',
      'Category set: Bug / Enhancement / Infra',
      {
        text: 'Priority assigned in the backlog',
        guide: [
          'Priority reflects user impact and program deadlines',
          'Stories carry Given/When/Then acceptance criteria before entering Analysis — engineers design against AC, not vibes',
        ],
      },
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
      {
        text: 'FRD / user stories signed off by Product Manager',
        guide: [
          'Every story has AC in Given/When/Then, including negative and permission cases',
          'The FRD version linked is the one that was signed off — not a draft',
        ],
      },
      {
        text: 'Acceptance criteria written and testable — QA has reviewed them',
        guide: [
          '"Testable" means QA can decide pass/fail without asking anyone',
          'QA review is recorded — a comment or review note, not a hallway conversation',
        ],
      },
      {
        text: 'HLD/LLD linked on the ticket and design review completed',
        guide: [
          'The design covers failure paths, security, and the offline-sync impact',
          'Architect approval is recorded on the design page with a date',
          'Alternatives considered are documented — a design with no alternatives wasn’t designed, it was assumed',
        ],
      },
      {
        text: 'Impacted modules, APIs, and DB changes listed in the design doc',
        guide: [
          'Every consumer of a changed API is named — including older mobile builds in the field',
          'Backward compatibility is stated explicitly, not implied',
        ],
      },
      {
        text: 'DB schema changes reviewed by the DBA (when the ticket touches the schema)',
        guide: [
          'Naming, types, keys, and indexes checked against AMRIT conventions',
          'Migration is expand → migrate → contract with a tested rollback',
          'PII/PHI encryption, RBAC access, and audit columns verified',
          'Offline-sync schema (mobile SQLite ↔ server) stays consistent',
        ],
      },
      {
        text: 'QA test cases drafted from AC; developer has reviewed them',
        guide: [
          'At least one case per AC plus negative/boundary/role-based coverage',
          'Dev review recorded — it catches technical edges (races, sync conflicts) before code exists',
        ],
      },
      {
        text: 'Three Amigos held (BSA + Dev + QA) — intent, approach, and proof agreed',
        guide: [
          'All three perspectives in one conversation — intent (BSA), approach (dev), proof (QA)',
          'Outcome noted on the ticket: what was agreed, what changed',
        ],
      },
    ],
    evidence: [
      'FRD link (Confluence)',
      'HLD/LLD link with architect approval recorded',
      'DBA review note (schema changes)',
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
      {
        text: 'Story pointed (1–3 / 5–8 / 13+) and pulled in sprint planning',
        guide: [
          'Estimated by the team together, not by the lead alone',
          '13+ stories are split before they enter the sprint',
          'The pull respects sprint capacity — including the buffer for support work',
        ],
      },
      {
        text: 'Assignee set; no unresolved dependencies',
        guide: [
          'One named assignee — shared ownership is no ownership',
          'Blocking tickets are done or scheduled earlier in the same sprint',
        ],
      },
      {
        text: 'Branch created from release-X.Y.Z with the JIRA ID in its name',
        guide: [
          'feature/AMM-123-short-description, branched from the release branch — never from main',
        ],
      },
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
      {
        text: 'PR squash-merged to release branch; CI green (lint, unit tests, static analysis, build)',
        guide: [
          'The merged commit message carries the JIRA ID',
          'CI green on the final commit, not an earlier one',
        ],
      },
      {
        text: 'Unit tests cover the change',
        guide: [
          'New logic has tests for happy AND failure paths',
          'No tests skipped or marked "temporarily" disabled in the diff',
        ],
      },
      {
        text: 'Desk check done: dev walks QA through the feature against each AC',
        guide: [
          '10–15 minutes, dev drives, QA (and BSA when the flow is business-heavy) watches',
          'Walk each AC one by one on a real build — not a code walkthrough',
          'Gaps found here cost minutes; the same gap found In QA costs a cycle',
          'Note the desk check on the ticket, naming the QA participant',
        ],
      },
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
      {
        text: 'Build deployed to the test environment and sanity-checked',
        guide: [
          'Build number recorded on the ticket before testing starts',
          'Sanity = login + core screens load — five minutes that saves a wasted day',
        ],
      },
      {
        text: 'Test cases finalized (positive, negative, boundary, role-based)',
        guide: [
          'The Analysis-stage draft is reconciled against the final AC and build',
          'Every case has its test data and preconditions ready',
        ],
      },
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
      {
        text: '100% of planned test cases executed',
        guide: [
          'Executed means a recorded result per case — sampling is how escapes happen',
          'The execution report is attached, with build number',
        ],
      },
      {
        text: 'Zero critical/high-severity defects open',
        guide: [
          'Critical = data loss, security, core flow blocked · High = major function broken, no workaround',
          'Anything deferred is a recorded decision with PM agreement and a Fix Version',
        ],
      },
      'Regression suite for the module passed',
      {
        text: 'Every defect tagged: requirement-gap / design-gap / implementation-gap',
        guide: [
          'The tag decides who learns from it: BSA/PM, architect, or dev',
          'Honest tagging is what makes the Monthly Quality Review worth holding',
        ],
      },
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
      {
        text: 'Closing comment names the resolution',
        guide: [
          'What changed, verification evidence, PR & build links',
          'Resolution field set correctly — it feeds the metrics',
        ],
      },
      {
        text: 'Production defects: CAPA document linked — corrective action (fix + data repair) and preventive action (process/test change)',
        guide: [
          'Corrective = the fix itself PLUS repair of any data the defect corrupted',
          'Preventive = the process/test/gate change that stops the CLASS of defect, not just this one',
          'Blameless: name causes and processes, never people',
          'CAPAs are reviewed in the Monthly Quality Review — recurring classes escalate',
        ],
      },
      'RCA linked if the ticket came from an escalated incident',
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
      {
        text: 'All tickets in the Fix Version closed',
        guide: [
          'Check via JQL on the Fix Version — not from memory',
          'A ticket that won’t make it is descoped explicitly (Fix Version removed, with a comment)',
        ],
      },
      {
        text: 'Release ticket created to track progress and approvals',
        guide: [
          'One release ticket per release-X.Y.Z — approvals, checklists, and comms all live on it',
        ],
      },
      {
        text: 'Full ticket list & release notes shared with the Ops team',
        guide: [
          'Notes split: features · fixes · known issues · config/data changes',
          'Written in business language (BSA input) — Ops briefs L1 from this document',
          'Anything that changes support scripts or needs training is called out',
        ],
      },
      {
        text: 'UAT scenarios ready (BSA); no other release currently under UAT',
        guide: [
          'Scenarios trace to BRD outcomes — UAT proves the need is met',
          'One release in UAT at a time; a queued release waits',
        ],
      },
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
      {
        text: 'BVT passed on the UAT build',
        guide: [
          'BVT = login, core patient flows, sync — a fast go/no-go, run before deep testing',
        ],
      },
      {
        text: 'Ops executed the UAT scenarios (from BSA)',
        guide: [
          'Every scenario has a recorded result with tester name and date',
          'Scenarios were run on realistic data, at realistic (throttled) network speeds',
        ],
      },
      {
        text: 'All UAT feedback resolved or explicitly logged for a later release',
        guide: [
          'Every item dispositioned: fixed / deferred with Fix Version / rejected with reason',
          '"We’ll look at it" is not a disposition',
        ],
      },
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
      {
        text: 'QA Manager, Ops (L1), and Tech Architect approvals on the release ticket',
        guide: [
          'Three named, dated approvals ON the release ticket — chat messages don’t count',
          'QA Manager: aggregate quality & deferred list · Ops: support readiness · Architect: migrations, rollback, security posture',
        ],
      },
      {
        text: 'Deployment planned with DevOps & IT — window, owners, rollback',
        guide: [
          'Low-usage window agreed with state ops',
          'Named deploy owner and rollback owner; halt criteria decided in advance',
        ],
      },
      {
        text: 'Pre- and post-deployment checklists attached to the release ticket',
        guide: [
          'Per-release documents to be ticked in real time — see the checklist template on the Release Approved stage',
        ],
      },
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
      {
        text: 'Defect gap-tagged: requirement-gap / design-gap / implementation-gap',
        guide: [
          'requirement-gap → BSA/PM fix the AC · design-gap → architect revisits the design · implementation-gap → dev fixes the code',
          'The tag routes the learning, not just the ticket',
        ],
      },
      'Reproduction steps and failed AC attached',
      {
        text: 'Developer root-cause note recorded',
        guide: [
          'One or two lines on what actually caused it — written before the fix, not after',
        ],
      },
      'Priority set: Blocker/Highest into the current sprint, else next sprint',
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
