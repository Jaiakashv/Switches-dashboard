import { memo } from 'react'
import { StatusBadge } from './StatusBadge'
import { StatusMenu } from './StatusMenu'

function SwitchRowComponent({
  device,
  isMenuOpen,
  statusOptions,
  onToggleMenu,
  onStatusChange,
  onCloseMenu,
}) {
  return (
    <tr className="transition-colors hover:bg-[color:var(--row-hover)]">
      <td className="px-5 py-4 align-top font-medium text-[color:var(--heading)]">{device.model}</td>
      <td className="px-5 py-4 align-top text-[color:var(--text)]">{device.physicalDevice}</td>
      <td className="px-5 py-4 align-top font-mono text-[color:var(--text)]">{device.id}</td>
      <td className="px-5 py-4 align-top text-[color:var(--text)]">{device.config}</td>
      <td className="px-5 py-4 align-top">
        <StatusBadge status={device.status} />
      </td>
      <td className="px-5 py-4 align-top">
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => onToggleMenu(device.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--accent-soft-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--accent-soft)]"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            Update Status
            <span className="text-xs opacity-75">▾</span>
          </button>

          <StatusMenu
            open={isMenuOpen}
            currentStatus={device.status}
            statusOptions={statusOptions}
            onSelect={(status) => onStatusChange(device.id, status)}
            onClose={onCloseMenu}
          />
        </div>
      </td>
    </tr>
  )
}

export const SwitchRow = memo(SwitchRowComponent)