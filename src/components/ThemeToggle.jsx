import { memo } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './ThemeToggle.css'

function ThemeToggleComponent({ theme, onToggle }) {
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`theme-toggle-pill ${isLight ? 'is-light' : 'is-dark'}`}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={!isLight}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-sun-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
            <path
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
            />
          </svg>
        </span>

        <span className="theme-toggle-stars" aria-hidden="true">
          <span className="theme-toggle-star theme-toggle-star-1" />
          <span className="theme-toggle-star theme-toggle-star-2" />
          <span className="theme-toggle-star theme-toggle-star-3" />
        </span>

        <span className="theme-toggle-thumb" aria-hidden="true">
          <span className="theme-toggle-thumb-face">
            {!isLight && <i className="fa-solid fa-moon" />}
          </span>
        </span>
      </span>
    </button>
  )
}

export const ThemeToggle = memo(ThemeToggleComponent)
