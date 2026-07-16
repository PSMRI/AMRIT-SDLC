import { Panel } from '@xyflow/react'
import { lanes } from '../../data/lifecycle/lanes'

export function Legend() {
  return (
    <Panel position="bottom-left" className="legend">
      <div className="legend__group">
        {lanes.map((lane) => (
          <span key={lane.id} className="legend__item mono">
            <span
              className="legend__swatch"
              style={{ background: `var(${lane.accentVar})` }}
            />
            {lane.title}
          </span>
        ))}
      </div>
      <div className="legend__group">
        <span className="legend__item mono">
          <svg width="26" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="26"
              y2="4"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeDasharray="6 4"
            />
            <circle cx="13" cy="4" r="2.5" fill="var(--accent)" />
          </svg>
          ticket flow
        </span>
        <span className="legend__item mono">
          <svg width="26" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="26"
              y2="4"
              stroke="var(--rework)"
              strokeWidth="1.6"
              strokeDasharray="6 4"
            />
          </svg>
          rework loop
        </span>
      </div>
    </Panel>
  )
}
