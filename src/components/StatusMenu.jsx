import { useEffect, useRef } from 'react'

export function StatusMenu({ open, currentStatus, statusOptions, onSelect, onClose }) {
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      ref={menuRef}
      role="menu"
      className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-44 overflow-hidden rounded-2xl border border-(--border) bg-(--surface) p-1 shadow-2xl shadow-slate-950/18 backdrop-blur-xl"
    >
      {statusOptions.map((status) => {
        const isActive = status === currentStatus

        return (
          <button
            key={status}
            type="button"
            role="menuitem"
            onClick={() => onSelect(status)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
              isActive
                ? 'bg-(--accent-soft) text-(--accent)'
                : 'text-(--text) hover:bg-(--surface-muted) hover:text-(--heading)'
            }`}
          >
            <span>{status}</span>
          </button>
        )
      })}
    </div>
  )
}