import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import type { InfoNodeType } from '../../../types/flow'
import { SideHandles } from './StageNode'

const KIND_LABEL: Record<string, string> = {
  branch: 'branch',
  environment: 'env',
  check: 'gate',
  event: 'step',
  decision: 'route',
  note: 'note',
}

function InfoNodeInner({ data, selected }: NodeProps<InfoNodeType>) {
  const { info } = data
  const accent = info.accentVar ? `var(${info.accentVar})` : 'var(--accent)'

  return (
    <div
      className={`card info-card info-card--${info.kind}${selected ? ' is-selected' : ''}`}
      style={{ '--card-accent': accent } as React.CSSProperties}
    >
      <div className="info-card__head">
        <span className="info-card__kind mono">{KIND_LABEL[info.kind]}</span>
        {info.kind === 'branch' && (
          <span className="info-card__glyph mono" aria-hidden="true">
            ⎇
          </span>
        )}
      </div>
      <h3
        className={`info-card__title${info.kind === 'branch' ? ' mono' : ''}`}
      >
        {info.title}
      </h3>
      {info.subtitle && (
        <p className="info-card__subtitle mono">{info.subtitle}</p>
      )}
      <SideHandles />
    </div>
  )
}

export const InfoNode = memo(InfoNodeInner)
