import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Gate, InfoNode, Role, RoleId, Stage } from '../../types/content'
import { laneById } from '../../data/lifecycle/lanes'
import { gateById } from '../../data/lifecycle/gates'
import { pathStages, stageById } from '../../data/lifecycle/stages'
import { roleById } from '../../data/roles'
import { agileNodes } from '../../data/agile'
import { gitflowNodes } from '../../data/gitflow'
import { incidentNodes } from '../../data/incident'
import { useAppStore } from '../../store/useAppStore'

const infoById = new Map(
  [...gitflowNodes, ...incidentNodes, ...agileNodes].map((n) => [n.id, n]),
)

type Resolved =
  | { kind: 'stage'; stage: Stage }
  | { kind: 'role'; role: Role }
  | { kind: 'info'; info: InfoNode }
  | { kind: 'gate'; gate: Gate }
  | null

function resolve(id: string | null): Resolved {
  if (!id) return null
  const stage = stageById.get(id as Stage['id'])
  if (stage) return { kind: 'stage', stage }
  if (id.startsWith('role-')) {
    const role = roleById.get(id.slice(5) as RoleId)
    if (role) return { kind: 'role', role }
  }
  const gate = gateById.get(id)
  if (gate) return { kind: 'gate', gate }
  const info = infoById.get(id)
  if (info) return { kind: 'info', info }
  return null
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      className="panel-section"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <h4 className="panel-section__label mono">{label}</h4>
      {children}
    </motion.section>
  )
}

function RoleChips({ ids }: { ids: RoleId[] }) {
  const setActiveView = useAppStore((s) => s.setActiveView)
  const selectNode = useAppStore((s) => s.selectNode)
  return (
    <div className="panel-chips">
      {ids.map((id) => {
        const role = roleById.get(id)
        if (!role) return null
        const accent = `var(${laneById.get(role.laneId)?.accentVar})`
        return (
          <button
            key={id}
            type="button"
            className="panel-chip mono"
            style={{ '--card-accent': accent } as React.CSSProperties}
            title={`Open ${role.name} in the Roles view`}
            onClick={() => {
              setActiveView('roles')
              // select after the view swap so the panel shows the role
              requestAnimationFrame(() => selectNode(`role-${id}`))
            }}
          >
            {role.abbreviation}
            <span className="panel-chip__name">{role.name}</span>
          </button>
        )
      })}
    </div>
  )
}

function StageContent({ stage }: { stage: Stage }) {
  const lane = laneById.get(stage.laneId)
  return (
    <>
      <header className="panel-head">
        <span className="panel-head__eyebrow mono">
          {stage.offPath
            ? `REWORK STATE · ${lane?.title}`
            : `${stage.scope === 'release' ? 'RELEASE STAGE' : 'STAGE'} ${String(stage.order + 1).padStart(2, '0')}/${pathStages.length} · ${lane?.title}`}
        </span>
        <h3 className="panel-head__title">{stage.title}</h3>
        <p className="panel-head__summary">{stage.summary}</p>
      </header>
      <Section label="Responsibility">
        <RoleChips ids={stage.responsibleRoles} />
      </Section>
      <Section label="Actions taken">
        <ul className="panel-list">
          {stage.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Section>
      <Section label="Inputs">
        <ul className="panel-list panel-list--in">
          {stage.inputs.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Section>
      <Section label="Outputs">
        <ul className="panel-artifacts">
          {stage.outputs.map((o) => (
            <li key={o.name}>
              <span className="panel-artifact__name">{o.name}</span>
              <span className="panel-artifact__meta mono">
                {roleById.get(o.ownerRole)?.abbreviation}
                {o.note ? ` · ${o.note}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </Section>
      <Section label="Tools">
        <div className="panel-chips">
          {stage.tools.map((t) => (
            <span key={t} className="panel-tool mono">
              {t}
            </span>
          ))}
        </div>
      </Section>
      <Section label="Exit criteria">
        <ul className="panel-list panel-list--gate">
          {stage.exitCriteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>
    </>
  )
}

function RoleContent({ role }: { role: Role }) {
  const lane = laneById.get(role.laneId)
  return (
    <>
      <header className="panel-head">
        <span className="panel-head__eyebrow mono">
          {role.abbreviation} · {lane?.title}
        </span>
        <h3 className="panel-head__title">{role.name}</h3>
        <p className="panel-head__summary">{role.description}</p>
      </header>
      <Section label="Top responsibilities">
        <ul className="panel-list">
          {role.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>
      <Section label="Deliverables">
        <ul className="panel-artifacts">
          {role.deliverables.map((d) => (
            <li key={d}>
              <span className="panel-artifact__name">{d}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section label="Tools">
        <div className="panel-chips">
          {role.tools.map((t) => (
            <span key={t} className="panel-tool mono">
              {t}
            </span>
          ))}
        </div>
      </Section>
    </>
  )
}

function GateContent({ gate }: { gate: Gate }) {
  const from = stageById.get(gate.source)
  const to = stageById.get(gate.target)
  return (
    <>
      <header className="panel-head">
        <span className="panel-head__eyebrow mono">
          HARD GATE · {from?.title} → {to?.title}
        </span>
        <h3 className="panel-head__title">{gate.title}</h3>
        <p className="panel-head__summary">{gate.purpose}</p>
      </header>
      <Section label="Gate owner — sign-off flips the status">
        <RoleChips ids={[gate.owner]} />
      </Section>
      <Section label="Pass criteria">
        <ul className="panel-list panel-list--gate">
          {gate.criteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>
      <Section label="Evidence on the ticket — no verbal sign-offs">
        <ul className="panel-artifacts">
          {gate.evidence.map((e) => (
            <li key={e}>
              <span className="panel-artifact__name">{e}</span>
            </li>
          ))}
        </ul>
      </Section>
      {gate.waiver && (
        <Section label="Waiver policy">
          <p className="panel-waiver">{gate.waiver}</p>
        </Section>
      )}
    </>
  )
}

function InfoContent({ info }: { info: InfoNode }) {
  return (
    <>
      <header className="panel-head">
        {info.subtitle && (
          <span className="panel-head__eyebrow mono">{info.subtitle}</span>
        )}
        <h3 className="panel-head__title">{info.title}</h3>
      </header>
      {info.detail && info.detail.length > 0 && (
        <Section label="Details">
          <ul className="panel-list">
            {info.detail.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Section>
      )}
      {info.roles && info.roles.length > 0 && (
        <Section label="Who's involved">
          <RoleChips ids={info.roles} />
        </Section>
      )}
      {info.tools && info.tools.length > 0 && (
        <Section label="Tools">
          <div className="panel-chips">
            {info.tools.map((t) => (
              <span key={t} className="panel-tool mono">
                {t}
              </span>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

export function DetailPanel() {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId)
  const selectNode = useAppStore((s) => s.selectNode)
  const resolved = resolve(selectedNodeId)

  useEffect(() => {
    if (!resolved) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectNode(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resolved, selectNode])

  return (
    <AnimatePresence>
      {resolved && (
        <motion.aside
          key={selectedNodeId}
          className="detail-panel nowheel"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          aria-label="Details"
        >
          <button
            type="button"
            className="detail-panel__close icon-btn"
            onClick={() => selectNode(null)}
            aria-label="Close details"
          >
            ×
          </button>
          <motion.div
            className="detail-panel__scroll"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.045 } } }}
          >
            {resolved.kind === 'stage' && (
              <StageContent stage={resolved.stage} />
            )}
            {resolved.kind === 'role' && <RoleContent role={resolved.role} />}
            {resolved.kind === 'gate' && <GateContent gate={resolved.gate} />}
            {resolved.kind === 'info' && <InfoContent info={resolved.info} />}
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
