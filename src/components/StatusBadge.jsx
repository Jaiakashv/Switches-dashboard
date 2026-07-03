import { memo } from 'react'

function StatusBadgeComponent({ status }) {
  const styles =
    status === 'Online'
      ? 'bg-[color:var(--status-online-soft)] text-[color:var(--status-online)] ring-[color:var(--status-online-border)]'
      : status === 'Maintenance'
        ? 'bg-[color:var(--status-maintenance-soft)] text-[color:var(--status-maintenance)] ring-[color:var(--status-maintenance-border)]'
        : 'bg-[color:var(--status-offline-soft)] text-[color:var(--status-offline)] ring-[color:var(--status-offline-border)]'

  const animationClass = status === 'Online' ? 'animate-heartbeat' : ''

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles} ${animationClass}`}>
      {status}
    </span>
  )
}

export const StatusBadge = memo(StatusBadgeComponent)