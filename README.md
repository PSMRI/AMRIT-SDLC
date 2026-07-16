# AMRIT SDLC — Interactive Process Board

A Miro-style, infinite-canvas visualization of the [AMRIT platform](https://github.com/PSMRI)'s
Software Development Lifecycle. Pan, zoom, and click through every stage of the
process — who owns it, what actions happen, what goes in, and what comes out.

Source of truth: the *AMRIT Software Development Lifecycle* SOP on Confluence.

## Views

| View | What it shows |
| --- | --- |
| **Ticket Lifecycle** | The 12-state ticket pipeline (Open → Closed) laid out in four swimlanes — Business & Product, Engineering, QA, IT/DevOps — with animated flow and rework edges. Press **▶ Follow a ticket** to watch a ticket travel the entire journey with camera follow. |
| **Roles** | All 13 roles with responsibilities, deliverables, and tools, grouped by function. |
| **Git & Releases** | Branching model (`main` / `release-X.Y.Z` / `feature|bugfix|hotfix`), the PR pipeline with CI gates, environments (dev/UAT/prod), and the mobile release track. |
| **Incidents** | The L1 → L2 → AMM Engineering escalation flow, P1–P4 handling, and the RCA-before-closure gate. |
| **Agile Cadence** | The 2-week sprint loop: grooming → planning → standups → work → review → retro. |

Every card opens a detail panel with **responsibility · actions · inputs ·
outputs · tools · exit criteria**. Views are deep-linkable (`#/gitflow`,
`#/incident`, …). Dark and light themes.

## Stack

Vite · React 19 · TypeScript · [React Flow](https://reactflow.dev) (@xyflow/react) ·
Framer Motion · Zustand · IBM Plex. Edge animations are pure CSS/SMIL —
zero React renders per frame — and respect `prefers-reduced-motion`.

## Updating the content

All SOP content lives in typed data files under [`src/data/`](src/data) —
components never hardcode process text. When the SOP changes:

1. Edit the relevant file: `lifecycle/stages.ts`, `roles.ts`, `gitflow.ts`,
   `incident.ts`, or `agile.ts`.
2. Run `npm test` — integrity tests verify every reference (stages, roles,
   lanes, edges) still resolves.
3. Push to `main` — GitHub Actions builds and deploys automatically.

## Development

```bash
npm install
npm run dev        # http://localhost:5173/amrit-sdlc-board/
npm run typecheck  # strict TS
npm test           # data integrity tests (vitest)
npm run build && npm run preview
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`: typecheck → tests →
build → publish to GitHub Pages. One-time repo setting:
**Settings → Pages → Source: GitHub Actions**.

---

🤖 Built with [Claude Code](https://claude.com/claude-code)
