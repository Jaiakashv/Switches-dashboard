import { memo } from 'react'
import { SwitchRow } from './SwitchRow'

function SwitchTableComponent({
  devices,
  activeMenuId,
  statusOptions,
  onToggleMenu,
  onStatusChange,
  onCloseMenu,
  isLoading,
  errorMessage,
}) {
  return (
    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
      <table className="min-w-[600px] w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          <tr>
            <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">Model</th>
            <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium hidden sm:table-cell">Physical Device</th>
            <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">ID</th>
            <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium hidden md:table-cell">Config</th>
            <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">Status</th>
            <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {isLoading ? (
            <tr>
              <td className="px-3 sm:px-5 py-8 sm:py-12 text-center text-[var(--muted)]" colSpan={6}>
                Loading switches from Redis...
              </td>
            </tr>
          ) : errorMessage ? (
            <tr>
              <td className="px-3 sm:px-5 py-8 sm:py-12 text-center text-[var(--status-offline)]" colSpan={6}>
                {errorMessage}
              </td>
            </tr>
          ) : devices.length > 0 ? (
            devices.map((device) => (
              <SwitchRow
                key={device.id}
                device={device}
                isMenuOpen={activeMenuId === device.id}
                statusOptions={statusOptions}
                onToggleMenu={onToggleMenu}
                onStatusChange={onStatusChange}
                onCloseMenu={onCloseMenu}
              />
            ))
          ) : (
            <tr>
              <td className="px-3 sm:px-5 py-8 sm:py-12 text-center text-[var(--muted)]" colSpan={6}>
                No switches match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export const SwitchTable = memo(SwitchTableComponent)