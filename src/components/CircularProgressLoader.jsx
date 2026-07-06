import { useState, useEffect, useRef } from 'react'

export function CircularProgressLoader({
  loading,
  onComplete,
  minDuration = 1500,
  size = 120,
  strokeWidth = 8,
  label = 'Loading dashboard...',
}) {
  const [progress, setProgress] = useState(0)
  const loadingRef = useRef(loading)
  const onCompleteRef = useRef(onComplete)

  loadingRef.current = loading
  onCompleteRef.current = onComplete

  useEffect(() => {
    const start = Date.now()
    let rafId
    let finished = false

    const tick = () => {
      const elapsed = Date.now() - start
      const timeProgress = Math.min(90, Math.round((elapsed / minDuration) * 90))
      const dataReady = !loadingRef.current
      const minTimeReached = elapsed >= minDuration

      if (dataReady && minTimeReached) {
        setProgress((prev) => {
          const next = Math.min(100, Math.max(prev, timeProgress) + 3)
          if (next >= 100 && !finished) {
            finished = true
            setTimeout(() => onCompleteRef.current?.(), 150)
          }
          return next
        })
      } else {
        setProgress(timeProgress)
      }

      if (!finished) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [minDuration])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-[var(--heading)]"
          aria-live="polite"
        >
          {progress}%
        </span>
      </div>
      {label && (
        <p className="mt-4 text-sm text-[var(--muted)]">{label}</p>
      )}
    </div>
  )
}
