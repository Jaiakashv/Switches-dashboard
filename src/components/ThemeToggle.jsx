import { memo } from 'react'

function ThemeToggleComponent({ theme, onToggle }) {
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:shadow-[0_14px_30px_rgba(37,99,235,0.12)]"
      style={{
        backgroundColor: 'var(--toggle-bg)',
        borderColor: 'var(--toggle-border)',
        color: 'var(--toggle-text)',
      }}
      aria-label="Toggle theme"
    >
      <span
        className="relative flex h-6 w-10 items-center rounded-full p-0.5"
        style={{ backgroundColor: 'var(--toggle-track)' }}
      >
        <span
          className={`h-4 w-4 rounded-full shadow-sm transition-transform duration-200 ${
            isLight ? 'translate-x-0' : 'translate-x-4'
          }`}
          style={{ backgroundColor: 'var(--toggle-thumb)' }}
        />
      </span>
      <span className="flex items-center gap-1.5">
        {isLight ? <SunIcon /> : <MoonIcon />}
        <span>{isLight ? 'Light' : 'Dark'}</span>
      </span>
    </button>
  )
}

export const ThemeToggle = memo(ThemeToggleComponent)

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        fill="currentColor"
        d="M10 4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 4.25Zm0 8a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0-9.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5A.75.75 0 0 1 10 2.5Zm0 13.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Zm7.25-6a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm-13.5 0a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm11.03-4.78a.75.75 0 0 1 0 1.06l-.35.35a.75.75 0 1 1-1.06-1.06l.35-.35a.75.75 0 0 1 1.06 0ZM4.09 14.16a.75.75 0 0 1 0-1.06l.35-.35a.75.75 0 1 1 1.06 1.06l-.35.35a.75.75 0 0 1-1.06 0Zm0-10.32a.75.75 0 0 1 1.06 0l.35.35A.75.75 0 0 1 4.44 5.25l-.35-.35a.75.75 0 0 1 0-1.06Zm10.32 10.32a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 0 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06Z"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        fill="currentColor"
        d="M12.5 2.75a.75.75 0 0 1 .18.82A6.25 6.25 0 1 0 16.43 6.5a.75.75 0 0 1 .82.18 8.25 8.25 0 1 1-4.75-3.93Z"
      />
    </svg>
  )
}