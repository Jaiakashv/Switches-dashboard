import { memo } from 'react'
import { StatusBadge } from './StatusBadge'
import { StatusMenu } from './StatusMenu'
import { Trash2, Edit } from 'lucide-react'

function SwitchRowComponent({
  device,
  isMenuOpen,
  statusOptions,
  onToggleMenu,
  onStatusChange,
  onCloseMenu,
  onUpdateClick,
  onDeleteClick,
}) {
  return (
    <tr className="transition-colors hover:bg-[color:var(--row-hover)]">
      <td className="px-3 sm:px-5 py-3 sm:py-4 align-top font-medium text-[color:var(--heading)]">{device.model}</td>
      <td className="px-3 sm:px-5 py-3 sm:py-4 align-top text-[color:var(--text)] hidden sm:table-cell">{device.physicalDevice}</td>
      <td className="px-3 sm:px-5 py-3 sm:py-4 align-top font-mono text-[color:var(--text)] text-xs sm:text-sm">{device.id}</td>
      <td className="px-3 sm:px-5 py-3 sm:py-4 align-top text-[color:var(--text)] hidden md:table-cell">{device.config}</td>
      <td className="px-3 sm:px-5 py-3 sm:py-4 align-top">
        <StatusBadge status={device.status} />
      </td>
      <td className="px-3 sm:px-5 py-3 sm:py-4 align-top">
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => onToggleMenu(device.id)}
            className="inline-flex items-center gap-1 sm:gap-2 rounded-xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--accent-soft-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--accent-soft)]"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <span className="hidden sm:inline">Update Status</span>
            <span className="sm:hidden">Update</span>
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
      <td className="px-3 sm:px-5 py-3 sm:py-4 align-top">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUpdateClick}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
            title="Edit switch"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDeleteClick}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            title="Delete switch"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export const SwitchRow = memo(SwitchRowComponent)