import type { Stage } from '../../types/content'

/**
 * The AMRIT lifecycle, from the AMRIT SDLC SOP (Confluence: AMRIT space,
 * "AMRIT Software Development Lifecycle", §4a "Ticket Movement").
 * Two segments on one board: the per-ticket workflow (BRD → Closed — tickets
 * close right after QA approval) and the release-level workflow (Release UAT
 * → Release Approved → Production Release), tracked on a release ticket.
 * REOPENED is off-path.
 *
 * Bullets may carry a `guide` (good practices — ⓘ in the panel); outputs may
 * carry a `guide` template (what the artifact must contain).
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
      {
        text: 'Capture the business need from govt partners, field teams, or support',
        guide: [
          'Talk to the people who raised it — record who asked, their program context (RCH, NCD, TB…), and geography',
          'Capture the problem, not a proposed solution — "ANMs re-enter the same beneficiary twice" beats "add a dedupe button"',
          'Quantify it: how many users, how often, what does it cost when it goes wrong',
          'Attach field evidence — screenshots, register photos, call-center transcripts',
          'Separate must-have from nice-to-have at the source, before anything is promised',
        ],
      },
      {
        text: 'Document as-is → to-be workflows, scope, and affected users',
        guide: [
          'Diagram the current flow first — including the manual/paper steps around the app',
          'Mark the pain points on the as-is diagram so the to-be visibly addresses each one',
          'Keep the to-be flow aligned with the govt program guidelines it digitizes',
          'Name every role the workflow touches — if a swimlane has no owner, the process will stall there',
          'State what is OUT of scope explicitly — unstated exclusions become scope creep later',
        ],
      },
      {
        text: 'Produce functional specs, data mapping sheets, report formulas',
        guide: [
          'Map every form field to its database home: table.column, data type, max length',
          'Define validations per field: mandatory/optional, ranges, formats, cross-field rules',
          'Write report formulas with a worked example — a filled-in row beats a formula alone',
          'Flag PII/PHI fields so encryption and masking decisions happen at design time',
          'Version the sheets and log changes — silent edits break dev and QA alignment',
        ],
      },
      {
        text: 'Review the BRD with the Product Manager and stakeholders',
        guide: [
          'Walk the PM through it live — a document sent is not a document read',
          'Get an early feasibility signal from the Tech Architect before sign-off, not after',
          'Record open questions with a named owner and a date — "TBD" without an owner never resolves',
          'Capture the sign-off as a recorded approval on the page, not a verbal yes',
        ],
      },
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
        guide: [
          'Problem statement: what hurts, who is affected, how badly, evidence',
          'Stakeholders & affected users, with their roles in the workflow',
          'As-is and to-be workflows (diagrams linked)',
          'Scope — explicitly in AND explicitly out',
          'Success metrics: how we will know it worked',
          'Dependencies, assumptions, and risks',
          'Open questions with owners; sign-off record at the bottom',
        ],
      },
      {
        name: 'FRD',
        ownerRole: 'bsa',
        note: 'Functional Requirement Document',
        guide: [
          'Numbered functional requirements, each traceable back to a BRD item',
          'Field-level specs: labels, types, validations, defaults, error messages',
          'Business rules and calculations, with worked examples',
          'User roles & permissions matrix — who can see/do what',
          'Report formats and formulas',
          'Edge-case behaviour: empty states, offline, partial data',
        ],
      },
      {
        name: 'Use case & workflow diagrams',
        ownerRole: 'bsa',
        guide: [
          'An actor for every role the flow touches',
          'Happy path plus alternate and failure paths — not just the sunny day',
          'Trigger and end-state for each flow',
          'Swimlanes that match the real-world handoffs',
        ],
      },
      {
        name: 'Mapping sheets',
        ownerRole: 'bsa',
        note: 'Form fields → database',
        guide: [
          'Every form field → table.column with data type and length',
          'Mandatory/optional flag and validation rule per field',
          'Source of truth for derived/calculated fields',
          'PII/PHI flag per field (drives encryption & masking)',
          'Version number and change log',
        ],
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
      {
        text: 'Create epics, stories, and tasks in JIRA from the signed-off BRD',
        guide: [
          'One epic per BRD outcome — if an epic maps to nothing in the BRD, ask why it exists',
          'Stories are vertical slices a user can see working, deliverable within one sprint',
          'Link every ticket back to the BRD/FRD page — traceability is what makes the Intake gate checkable',
          'Consistent naming: module prefix + verb + object ("Facility App: validate ANC visit date")',
          'Attach mockups and spec links directly on the ticket, not in chat',
        ],
      },
      {
        text: 'Write INVEST-compliant user stories with acceptance criteria',
        guide: [
          'INVEST: Independent · Negotiable · Valuable · Estimable · Small · Testable',
          'Story format: "As a <role> I want <capability> so that <outcome>"',
          'AC in Given/When/Then — each one independently verifiable by QA',
          'Cover the unhappy paths: invalid input, no permission, offline, empty data',
          'Describe WHAT, not HOW — solution design belongs to Analysis',
        ],
      },
      'Tag module (Facility App, Sakhi App, Admin portal) and category',
      {
        text: 'Prioritize into the backlog',
        guide: [
          'Order by user impact and program deadlines, not by who asked loudest',
          'Respect dependencies — a story blocked by another cannot sit above it',
          'Keep the top of the backlog 1–2 sprints deep and analysis-ready; below that, order is cheap',
          'Re-check priorities at every grooming — a backlog that never reorders is not being managed',
        ],
      },
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
        guide: [
          'Title: module prefix + clear verb phrase',
          'Description links the BRD/FRD source section',
          'Acceptance criteria on the ticket itself (not only in the PRD)',
          'Module + category labels; priority set',
          'Epic link and dependencies declared',
        ],
      },
      {
        name: 'PRD & user stories',
        ownerRole: 'product-manager',
        note: 'INVEST, with acceptance criteria',
        guide: [
          'Goal & non-goals — one paragraph each',
          'User stories grouped by epic, INVEST-checked',
          'Given/When/Then acceptance criteria incl. negative & permission cases',
          'Priority and dependency notes per story',
          'Mockup / wireframe links',
          'KPIs the release should move',
        ],
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
    responsibleRoles: ['tech-architect', 'senior-developer', 'qa-tester', 'dba'],
    actions: [
      {
        text: 'Feasibility & impact analysis: impacted modules, APIs, DB changes',
        guide: [
          'List every module, screen, and API the change touches — and every consumer of those APIs',
          'Check backward compatibility: older app versions in the field will call the new backend',
          'Identify data migrations early — they dominate deployment risk',
          'Estimate the effect on low-end devices and patchy networks (sync payload size, query cost)',
          'Time-box a spike for genuine unknowns instead of guessing an estimate',
        ],
      },
      {
        text: 'Write HLD/LLD; Tech Architect reviews and approves the design',
        guide: [
          'Design for the failure paths first: timeout, retry, partial sync, concurrent edits',
          'State security explicitly — authZ per endpoint, input validation, audit logging',
          'Record the alternatives considered and why they lost — future-you will ask',
          'Small enough to review in 30 minutes; link it on the ticket, never bury it in chat',
          'The architect approval is recorded on the design page — that record is what DoR checks',
        ],
      },
      {
        text: 'DBA reviews proposed DB schema changes (when the ticket touches the schema)',
        guide: [
          'Naming & consistency: tables/columns follow AMRIT conventions; no reserved words',
          'Types & sizes: smallest sufficient type; UTF-8 for multilingual text (Hindi, Bengali)',
          'Keys & indexes: PK/FK integrity; indexes match the query patterns; no redundant indexes',
          'Migrations: Liquibase/Flyway changesets, backward compatible (expand → migrate → contract), rollback tested',
          'Performance: locking impact of ALTERs on large tables; query plans for new queries',
          'Security & compliance: PII/PHI encrypted at rest, RBAC-limited access, audit columns (created/updated by/at)',
          'Offline sync: mobile SQLite schema and conflict-resolution fields stay in step with the server schema',
        ],
      },
      {
        text: 'QA drafts test cases from the acceptance criteria; dev reviews them',
        guide: [
          'At least one case per AC, then negative, boundary, and role-based cases on top',
          'Define test data and preconditions up front — hunting data later stalls In QA',
          'Include offline and multilingual scenarios for any mobile-touching flow',
          'The dev review catches missing technical edges (race conditions, sync conflicts) while fixing is cheap',
          'Store cases in the suite (TestLink/Zephyr) linked to the ticket, not in a personal sheet',
        ],
      },
      {
        text: 'Three Amigos (BSA + Dev + QA) — intent, approach, and proof agreed',
        guide: [
          'BSA brings the intent, dev brings the approach, QA brings the proof — all three must line up',
          'Time-box ~30 minutes per story; walk the AC one by one',
          'Every disagreement resolved here is a defect that never reaches In QA',
          'Close with a one-line note on the ticket: what was agreed, what changed',
        ],
      },
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
        guide: [
          'HLD — system context: where the change sits in AMRIT’s architecture',
          'HLD — component & sequence diagrams for the main flows',
          'HLD — API contracts touched: endpoints, payloads, versioning approach',
          'HLD — data flow including the mobile offline-sync path',
          'HLD — integration points and their failure modes',
          'LLD — module/class-level design and the patterns used',
          'LLD — endpoint specs: request/response, status codes, validation rules',
          'LLD — DB changes: tables, columns, indexes, migration plan',
          'LLD — error handling & logging strategy',
          'Security section: authN/authZ, data protection, audit logging',
          'Alternatives considered and why they were rejected',
          'Review record: architect approval with date',
        ],
      },
      {
        name: 'Impact analysis',
        ownerRole: 'senior-developer',
        note: 'Impacted modules, APIs, and DB changes',
        guide: [
          'Modules & screens touched, with owners',
          'APIs changed + every known consumer (web, mobile versions in the field)',
          'DB objects affected and migration needs',
          'Backward-compatibility statement for older app builds',
          'Performance implications: sync payloads, query cost, low-end devices',
          'The riskiest area, called out for extra QA attention',
        ],
      },
      {
        name: 'Test cases drafted from AC',
        ownerRole: 'qa-tester',
        note: 'Reviewed by the developer',
        guide: [
          'Traceability: every AC covered by at least one case',
          'Sections: positive · negative · boundary · role-based',
          'Preconditions and test data spelled out per case',
          'Offline & multilingual scenarios where the flow touches mobile',
          'Expected result phrased so pass/fail is unambiguous',
          'Dev review recorded (who, when)',
        ],
      },
      {
        name: 'DBA schema review',
        ownerRole: 'dba',
        note: 'Required when the ticket changes the DB schema',
        guide: [
          'Verdict (approved / changes requested) + link to the reviewed changeset',
          'Naming and data-type convention check',
          'Keys, indexes, and query-plan impact',
          'Migration strategy (expand → migrate → contract) and tested rollback',
          'PII/PHI handling and audit columns',
          'Offline-sync schema impact (mobile SQLite ↔ server)',
        ],
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
      {
        text: 'Verify all DoR artifacts are linked: FRD, HLD/LLD, QA-reviewed test cases',
        guide: [
          'Links live on the ticket — not attachments in chat, not "ask so-and-so"',
          'Schema-touching tickets also carry the DBA review note',
          'Anything missing sends the ticket back to Analysis — never "we’ll finish it during dev"',
        ],
      },
      {
        text: 'Estimate with story points (1–3 small · 5–8 medium · 13+ large)',
        guide: [
          'The team estimates together (planning poker) — a lead’s solo number anchors everyone',
          'A 13+ story gets split before it enters a sprint, not after it overruns one',
          'Re-estimate if scope changed since grooming — stale points corrupt velocity',
          'Points measure complexity + uncertainty, not hours',
        ],
      },
      {
        text: 'Prioritize within the release; pull into sprint at sprint planning',
        guide: [
          'Respect dependency order — an integration story before its API lands wastes a sprint',
          'Balance the sprint across modules so QA isn’t flooded by one area at once',
          'Leave capacity buffer for support and hotfix work — a 100%-planned sprint spills',
        ],
      },
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
      {
        text: 'Branch from release-X.Y.Z (feature/ABC-123-…), commit regularly',
        guide: [
          'Branch name carries the JIRA ID: feature/AMM-123-short-description',
          'Small, frequent commits with imperative messages referencing the ticket',
          'Sync with the release branch regularly — a week-old branch is a merge conflict factory',
          'Never commit directly to release-X.Y.Z or main',
        ],
      },
      {
        text: 'Write clean modular code per functional specs & wireframes',
        guide: [
          'Follow the module’s existing patterns — consistency beats personal preference',
          'Handle the failure paths: timeouts, offline, empty states, permission denied',
          'No hardcoded secrets, URLs, or environment values — config only',
          'User-facing strings go through i18n — Hindi/Bengali are first-class, not afterthoughts',
          'If the implementation must deviate from the LLD, update the LLD and tell the architect',
        ],
      },
      {
        text: 'Write unit tests; verify manually in the dev environment',
        guide: [
          'Tests cover the new logic including the negative paths — not just the happy line',
          'Run the whole impacted flow by hand, not only the changed screen',
          'Mobile: test offline and on a throttled network before calling it done',
          'Check the logs while testing — silent errors in ELK are still errors',
        ],
      },
      {
        text: 'Open PR to the release branch; address code review feedback',
        guide: [
          'PR description: what changed, why, how it was tested — screenshots for UI',
          'Keep PRs small (aim < 400 lines changed) — big PRs get rubber-stamped, not reviewed',
          'Call out migrations and config changes prominently in the description',
          'Respond to every review comment — resolve or discuss, never ignore',
        ],
      },
    ],
    inputs: [
      'Sprint-ready ticket with acceptance criteria',
      'Functional specs & wireframes',
      'release-X.Y.Z branch',
    ],
    outputs: [
      {
        name: 'Code + unit tests',
        ownerRole: 'developer',
        guide: [
          'Tests cover happy + failure paths of the new logic',
          'All CI checks green: lint, unit tests, static analysis, build',
          'No debug code, commented-out blocks, or secrets in the diff',
        ],
      },
      {
        name: 'Pull request',
        ownerRole: 'developer',
        note: 'JIRA ID in branch & PR title; squash-merged after review',
        guide: [
          'Title: JIRA ID + one-line summary',
          'Description: what & why, how tested, screenshots for UI',
          'Migration / config / breaking-change callouts',
          'Linked ticket; reviewers assigned',
        ],
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
    responsibleRoles: ['qa-tester'],
    actions: [
      {
        text: 'Queue ticket for testing; assign QA owner',
        guide: [
          'Assign at standup — an unowned ticket in Pending QA is invisible work',
          'One named owner per ticket, balanced across modules',
        ],
      },
      {
        text: 'Prepare test cases: positive, negative, boundary, role-based',
        guide: [
          'Finalize the cases drafted at Analysis against the actual build — AC may have evolved',
          'Role-based = one pass per user role, including the role that should be denied',
          'Boundary = limits, empty values, max lengths, date edges (month/year rollovers)',
        ],
      },
      {
        text: 'Confirm build availability in the test environment',
        guide: [
          'Record the build number on the ticket — results are meaningless without it',
          'Sanity-check the environment (login, core screens) before starting the clock',
          'Seed the test data defined in the cases',
        ],
      },
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
    responsibleRoles: ['qa-tester'],
    actions: [
      {
        text: 'Execute manual & automated tests against acceptance criteria',
        guide: [
          'Execute every planned case — sampling is how escapes happen',
          'Record a result per case with evidence, as you go, not from memory at the end',
          'Finish with an exploratory pass — scripted cases only catch what was predicted',
          'Automate the stable, repetitive flows so regression stays affordable',
        ],
      },
      {
        text: 'Cross-browser & cross-device runs (Android 8+, low RAM, patchy net)',
        guide: [
          'Minimum matrix: Chrome + Firefox desktop; one Android 8 low-RAM device; one modern device',
          'Throttle the network (2G/3G profile) — field connectivity is the real environment',
          'Mobile interruptions: incoming call, app killed & restored, storage nearly full',
        ],
      },
      {
        text: 'Validate offline sync and multilingual flows',
        guide: [
          'Create records offline → reconnect → verify nothing duplicated, nothing lost',
          'Force a conflict (same record edited on two devices) and verify resolution',
          'Hindi/Bengali: rendering, truncation on small screens, input, and search',
        ],
      },
      {
        text: 'Log defects in JIRA with severity (Critical/Major/Minor/Trivial)',
        guide: [
          'Numbered reproduction steps + expected vs actual + evidence (screenshot/video/logs)',
          'Severity reflects user impact, not fix effort',
          'One defect per issue — bundled defects come back half-fixed',
          'Link the failing AC and record build + device/browser',
        ],
      },
    ],
    inputs: [
      'Test cases & regression suite (per module: RCH, NCD, TB)',
      'Build deployed to test environment',
    ],
    outputs: [
      {
        name: 'Test execution report',
        ownerRole: 'qa-tester',
        guide: [
          'Case-by-case pass/fail with evidence links',
          'Build number and environment tested',
          'Defects raised, with links and severities',
          'Coverage vs plan — deviations explained, not hidden',
        ],
      },
      {
        name: 'Defect tickets',
        ownerRole: 'qa-tester',
        note: 'Rework loop back to development',
        guide: [
          'Numbered steps to reproduce',
          'Expected vs actual behaviour',
          'Severity by user impact + priority',
          'Environment: build, device/browser, network state',
          'Evidence attached: screenshots, video, ELK log excerpt',
          'Failed AC linked',
        ],
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
      'QA certifies the ticket meets quality standards — the tester approves it for deployment.',
    responsibleRoles: ['qa-tester'],
    actions: [
      {
        text: 'Verify all planned test cases executed and passed',
        guide: [
          'The execution report shows 100% of planned cases run — no silent skips',
          'Failures are either fixed and retested, or explicitly deferred with PM agreement recorded',
          'The module regression suite is green on the final build',
        ],
      },
      {
        text: 'Confirm no critical/high-severity defects remain open',
        guide: [
          'Critical = data loss, security issue, core flow blocked; High = major function broken, no workaround',
          'Deferred low-severity defects carry a Fix Version — deferral is a decision, not a shrug',
        ],
      },
      {
        text: 'Approve the ticket for deployment',
        guide: [
          'Approval comment carries the build number and the execution-report link',
          'Anything discovered after approval goes through Reopened — never silently patched',
        ],
      },
    ],
    inputs: ['Test execution report', 'Defect status & regression results'],
    outputs: [
      {
        name: 'QA approval',
        ownerRole: 'qa-tester',
        note: 'Per ticket — the QA Manager signs off at release level, not on individual tickets',
      },
    ],
    tools: ['JIRA', 'GitHub Actions', 'Jenkins'],
    exitCriteria: ['Ticket QA-approved for deployment'],
  },
  {
    id: 'closed',
    order: 8,
    title: 'Closed',
    laneId: 'business-product',
    summary:
      'QA approved — the ticket is closed. Once every ticket in the release is closed, the release moves on.',
    responsibleRoles: ['project-manager'],
    actions: [
      {
        text: 'Close the JIRA ticket with closing comments once QA approves',
        guide: [
          'Closing comment: what changed, verification evidence, PR & build links',
          'Set the resolution field correctly — Fixed / Won’t Fix / Duplicate feed the metrics',
          'For bugs, name the root cause in one line — it powers the quality review',
        ],
      },
      {
        text: 'Link CAPA for production defects; RCA for escalated incidents',
        guide: [
          'CAPA: corrective action (the fix + repair of affected data) AND preventive action (the process/test/gate change)',
          'RCA format: root cause · trigger · impact · fix · preventive measures',
          'Blameless language throughout — name causes and processes, not people',
        ],
      },
      {
        text: 'Ticket counts toward its release (Fix Version) readiness',
        guide: [
          'Keep the Fix Version accurate — it drives release notes and the Release Ready gate',
          'Descoping a ticket = removing the Fix Version with a comment saying why',
        ],
      },
    ],
    inputs: ['QA approval on the ticket', 'Defect status (all clear)'],
    outputs: [
      {
        name: 'Closed ticket',
        ownerRole: 'project-manager',
        guide: [
          'Resolution comment: what changed + verification evidence',
          'Correct resolution field (Fixed / Won’t Fix / Duplicate)',
          'PR and build links',
          'Accurate Fix Version',
          'CAPA / RCA links where applicable',
        ],
      },
      {
        name: 'Retro learnings',
        ownerRole: 'project-manager',
        note: 'Escalated incidents additionally require an RCA before closure',
      },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: [
      'Ticket closed with resolution comments',
      'All tickets in the Fix Version closed → release ready for UAT',
    ],
  },
  {
    id: 'release-uat',
    order: 9,
    scope: 'release',
    title: 'Release UAT',
    laneId: 'devops-env',
    summary:
      'All tickets closed — a release ticket is cut and the release goes to the Ops team for UAT.',
    responsibleRoles: ['project-manager', 'l2-support', 'devops-engineer'],
    actions: [
      {
        text: 'Create the release ticket — tracks progress and captures every approval',
        guide: [
          'One release ticket per release-X.Y.Z — the single source of truth for the release',
          'Everything lives here: ticket list, notes, approvals, checklists, deployment plan',
          'If an approval or checklist isn’t on the release ticket, it didn’t happen',
        ],
      },
      {
        text: 'Project Manager shares the full ticket list & release notes with Ops',
        guide: [
          'Notes split into: features · fixes · known issues · config/data changes',
          'Business-language summaries from the BSA — Ops briefs L1 from this, not from JIRA jargon',
          'Call out anything that changes L1 support scripts or needs field training',
          'Share before the UAT build lands so Ops can plan their testing window',
        ],
      },
      {
        text: 'Deploy release-X.Y.Z to UAT (one release under test at a time)',
        guide: [
          'One release occupies UAT at a time — parallel releases contaminate each other’s results',
          'Deploy through the pipeline, never hand-copied artifacts',
          'Note any config differences from production — surprises belong here, not at go-live',
          'Smoke-check immediately after deploy so Ops never starts on a dead build',
        ],
      },
      {
        text: 'Ops runs BVT on core flows, then the UAT scenarios from the BSA',
        guide: [
          'BVT first: login, core patient flows, sync — minutes, not hours; fail fast on a bad build',
          'UAT scenarios trace back to BRD outcomes — UAT proves the need is met, not just that buttons work',
          'Log every result with tester name and date; blockers escalate immediately, not at the end',
        ],
      },
    ],
    inputs: [
      'All tickets in the Fix Version closed',
      'Release notes (from JIRA Fix Version + BSA business notes)',
      'UAT test scenarios (BSA)',
    ],
    outputs: [
      {
        name: 'Release ticket',
        ownerRole: 'project-manager',
        note: 'Single place for progress, approvals, and checklists',
        guide: [
          'Release name + Fix Version link (JQL for the full ticket list)',
          'Release notes: features · fixes · known issues · config/data changes',
          'UAT scenario results and feedback log',
          'Approval checklist: QA Manager · Ops (L1) · Tech Architect',
          'Pre- and post-deployment checklists',
          'Deployment window, deploy owner, rollback owner',
          'Comms log: what was sent to Ops/L1 and when',
        ],
      },
      { name: 'UAT build', ownerRole: 'devops-engineer' },
      {
        name: 'UAT feedback log',
        ownerRole: 'l2-support',
        guide: [
          'Every scenario result with tester name and date',
          'Each feedback item dispositioned: fixed / deferred (with Fix Version) / rejected (with reason)',
          'Blockers flagged and escalated the moment they were found',
          'Closing summary: ready / not ready, in Ops’ words',
        ],
      },
    ],
    tools: ['JIRA', 'Firebase App Distribution', 'AWS'],
    exitCriteria: [
      'BVT passed; Ops completes UAT scenarios',
      'UAT feedback resolved or explicitly logged for a later release',
    ],
  },
  {
    id: 'release-approved',
    order: 10,
    scope: 'release',
    title: 'Release Approved',
    laneId: 'qa',
    summary:
      'Final approvals on the release ticket — QA Manager, Ops (L1), and Tech Architect sign off.',
    responsibleRoles: ['qa-manager', 'l2-support', 'tech-architect'],
    actions: [
      {
        text: 'QA Manager records the release-level QA sign-off',
        guide: [
          'Reviews the aggregate, not individual tickets: coverage, escaped-defect trend, deferred list',
          'Checks every ticket in the Fix Version carries its QA approval',
          'Sign-off is a recorded approval on the release ticket — never a verbal yes in a meeting',
        ],
      },
      {
        text: 'Ops (L1) and Tech Architect record their approvals',
        guide: [
          'Ops approval = support readiness: KB updated, L1 briefed on known issues and what to monitor',
          'Architect approval = technical posture: migrations sane, rollback real, security posture unchanged or improved',
          'Each approval is named and dated on the release ticket',
        ],
      },
      {
        text: 'Plan the deployment with DevOps & IT: window, owners, rollback',
        guide: [
          'Window in low-usage hours, agreed with state ops — field workers mid-visit must not lose sync',
          'Named deploy owner AND named rollback owner — decision authority is explicit before, not during',
          'DB migration timing and backup point in the plan',
          'Halt/rollback criteria decided in advance: what error rate or failure triggers abort',
        ],
      },
      {
        text: 'Attach pre- and post-deployment checklists to the release ticket',
        guide: [
          'Checklists are per-release documents, ticked in real time — not a generic page nobody opens',
          'Pre: backups, migrations staged, config diffs, alerts armed, rollback tested',
          'Post: smoke suite, watch window on dashboards, sync health, L1 confirmation',
        ],
      },
    ],
    inputs: ['UAT-approved release', 'UAT feedback log with dispositions'],
    outputs: [
      {
        name: 'Release approvals',
        ownerRole: 'qa-manager',
        note: 'QA Manager + Ops (L1) + Tech Architect, captured on the release ticket',
        guide: [
          'Three named approvals with dates, on the release ticket',
          'Scope frozen at approval — a scope change afterwards restarts UAT',
          'Deferred-defect list acknowledged by all three approvers',
        ],
      },
      {
        name: 'Pre/post-deployment checklists',
        ownerRole: 'devops-engineer',
        note: 'Attached to the release ticket',
        guide: [
          'PRE — database backup verified, restore point named',
          'PRE — migrations staged and rollback tested on a prod-like copy',
          'PRE — config/environment diffs reviewed against production',
          'PRE — monitoring dashboards and alerts armed; rollback owner on standby',
          'POST — smoke suite on core flows with a production account',
          'POST — error rates & dashboards watched for the agreed window',
          'POST — mobile sync health verified from a field device',
          'POST — L1 confirms no incident spike; checklist signed on the release ticket',
        ],
      },
      {
        name: 'Deployment plan & window',
        ownerRole: 'project-manager',
        guide: [
          'Date/time window in low-usage hours',
          'Named deploy owner and rollback owner',
          'Step-by-step sequence including DB migration timing',
          'Comms plan: who is informed before, during, after',
          'Halt / rollback criteria agreed in advance',
        ],
      },
    ],
    tools: ['JIRA', 'Confluence'],
    exitCriteria: [
      'All three approvals recorded on the release ticket',
      'Deployment scheduled with DevOps & IT',
    ],
  },
  {
    id: 'prod-release',
    order: 11,
    scope: 'release',
    title: 'Production Release',
    laneId: 'devops-env',
    summary:
      'Live for end users — deployed against the checklist, verified, and monitored.',
    responsibleRoles: ['devops-engineer', 'senior-developer', 'l2-support'],
    actions: [
      {
        text: 'Execute the pre-deployment checklist; deploy with rollback ready',
        guide: [
          'Tick checklist items on the release ticket as they happen — not retroactively',
          'Rollback is a tested procedure with a named owner, not an intention',
          'Deploy through the pipeline; the artifact is the one CI built and UAT tested',
        ],
      },
      {
        text: 'Merge release-X.Y.Z into main after deployment',
        guide: [
          'Merge the exact deployed commit — main and production must be the same code',
          'The release-X.Y.Z branch name is the version of record — no git tags used',
          'Mobile: version name/code matches the Play Console build',
        ],
      },
      {
        text: 'Smoke-test in production; complete the post-deployment checklist',
        guide: [
          'Smoke the core flows with a real production account, not just a health endpoint',
          'Watch dashboards and error rates for the agreed window before declaring success',
          'L2 confirms no new incident spike from the field',
          'Sign the post-deployment checklist on the release ticket — that closes the release',
        ],
      },
      {
        text: 'Mobile: promote from Play internal testing track to production',
        guide: [
          'Staged rollout: 5% → 10% → 50% → 100%, watching Crashlytics between steps',
          'Halt criteria defined before the rollout starts (crash-rate threshold)',
          'Remember field devices update slowly — the backend must keep serving the previous app version',
        ],
      },
    ],
    inputs: [
      'Approved release ticket (all sign-offs)',
      'Pre/post-deployment checklists',
      'Deployment & rollback runbook',
    ],
    outputs: [
      {
        name: 'Production release',
        ownerRole: 'devops-engineer',
        guide: [
          'Deployed from release-X.Y.Z; the branch name is the version of record (no git tags)',
          'Merged into main after the deployment is verified',
          'Artifact provenance: built by CI, promoted from UAT — never a local build',
          'Mobile: Play Console rollout status recorded',
        ],
      },
      {
        name: 'Completed deployment checklists',
        ownerRole: 'devops-engineer',
        note: 'On the release ticket',
      },
      {
        name: 'Post-release monitoring report',
        ownerRole: 'l2-support',
        guide: [
          'Error and crash rates vs pre-release baseline',
          'Sync success rates from field devices',
          'New incidents raised during the watch window, with links',
          'Verdict at window end: healthy / watching / rolled back',
        ],
      },
    ],
    tools: ['GitHub', 'Jenkins', 'AWS', 'Prometheus', 'Grafana', 'Play Console'],
    exitCriteria: [
      'Deployment verified healthy in production',
      'Release ticket closed with checklists complete',
    ],
  },
  {
    id: 'reopened',
    order: 12,
    offPath: true,
    gridCol: 4,
    title: 'Reopened',
    laneId: 'qa',
    summary:
      'The grave state: defects or requirement gaps sent the ticket back. Watched, measured, never routine.',
    responsibleRoles: ['qa-tester', 'senior-developer', 'project-manager'],
    actions: [
      {
        text: 'Reopen with the failed acceptance criteria and evidence attached',
        guide: [
          'Name the exact AC that failed — "doesn’t work" is not reopenable state',
          'Attach the failing evidence: test run, screenshot, log excerpt',
          'Reassign with context, not just a status flip',
        ],
      },
      {
        text: 'Tag the gap: requirement-gap / design-gap / implementation-gap',
        guide: [
          'requirement-gap → the AC was wrong or missing → goes back to BSA/PM',
          'design-gap → the HLD/LLD had the flaw → architect reviews the design',
          'implementation-gap → code defect → developer fixes',
          'The tag is what makes the Monthly Quality Review actionable — tag honestly',
        ],
      },
      {
        text: 'Developer records a root-cause note before picking the fix up',
        guide: [
          'One or two lines: what actually caused it, not what will be done',
          'Written before the fix — root-causing after the fix rationalizes',
        ],
      },
      'Reprioritize: Blocker/Highest into the current sprint, else next sprint',
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
        guide: [
          'Gap tag with a one-line justification',
          'Failed AC and evidence links',
          'Developer root-cause note',
          'Reopen count visible on the ticket',
        ],
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

/** The 12 happy-path stages (BRD → Production Release) — drives the forward chain, counts, play mode. */
export const pathStages = stages.filter((s) => !s.offPath)
