import { Panel } from '@xyflow/react'
import { pathStages as stages } from '../../data/lifecycle/stages'
import { useAppStore } from '../../store/useAppStore'

/** Media-scrubber-style playback controls for the lifecycle journey. */
export function PlayControls() {
  const status = useAppStore((s) => s.playStatus)
  const playIndex = useAppStore((s) => s.playIndex)
  const speed = useAppStore((s) => s.playSpeed)
  const setPlay = useAppStore((s) => s.setPlay)
  const setPlayIndex = useAppStore((s) => s.setPlayIndex)
  const setPlaySpeed = useAppStore((s) => s.setPlaySpeed)

  const playing = status === 'playing'

  const start = () => {
    if (status === 'idle') setPlayIndex(0)
    setPlay('playing')
  }

  const step = (dir: 1 | -1) => {
    setPlay('paused')
    setPlayIndex(Math.min(Math.max(playIndex + dir, 0), stages.length - 1))
  }

  return (
    <Panel position="bottom-center" className="play-controls">
      <button
        type="button"
        className="play-controls__btn mono"
        onClick={() => step(-1)}
        disabled={status === 'idle' || playIndex === 0}
        aria-label="Previous stage"
      >
        ⏮
      </button>
      <button
        type="button"
        className="play-controls__btn play-controls__btn--main mono"
        onClick={() => (playing ? setPlay('paused') : start())}
        aria-label={playing ? 'Pause the ticket journey' : 'Play the ticket journey'}
      >
        {playing ? '❚❚' : '▶'}
        <span className="play-controls__label">
          {status === 'idle' ? 'Follow a ticket' : playing ? 'Pause' : 'Resume'}
        </span>
      </button>
      <button
        type="button"
        className="play-controls__btn mono"
        onClick={() => step(1)}
        disabled={status === 'idle' || playIndex >= stages.length - 1}
        aria-label="Next stage"
      >
        ⏭
      </button>
      <div className="play-controls__dots" role="presentation">
        {stages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`play-controls__dot${
              status !== 'idle' && i === playIndex ? ' is-active' : ''
            }${status !== 'idle' && i < playIndex ? ' is-done' : ''}`}
            title={s.title}
            aria-label={`Jump to ${s.title}`}
            onClick={() => {
              setPlay('paused')
              setPlayIndex(i)
            }}
          />
        ))}
      </div>
      <button
        type="button"
        className="play-controls__btn play-controls__speed mono"
        onClick={() => setPlaySpeed(speed === 1 ? 2 : 1)}
        aria-label={`Playback speed ${speed}x`}
      >
        {speed}×
      </button>
    </Panel>
  )
}
