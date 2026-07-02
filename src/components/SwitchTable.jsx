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
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-(--border) bg-(--surface-muted) text-xs uppercase tracking-[0.22em] text-(--muted)">
          <tr>
            <th className="px-5 py-4 font-medium">Model</th>
            <th className="px-5 py-4 font-medium">Physical Device</th>
            <th className="px-5 py-4 font-medium">ID</th>
            <th className="px-5 py-4 font-medium">Config</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {isLoading ? (
            <tr>
              <td className="px-5 py-12 text-center text-(--muted)" colSpan={6}>
                Loading switches from Redis...
              </td>
            </tr>
          ) : errorMessage ? (
            <tr>
              <td className="px-5 py-12 text-center text-(--status-offline)" colSpan={6}>
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
              <td className="px-5 py-12 text-center text-(--muted)" colSpan={6}>
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