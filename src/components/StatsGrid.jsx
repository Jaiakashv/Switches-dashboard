import { memo } from 'react'
import { useCountAnimation } from '../hooks/useCountAnimation'

function StatCard({ label, value, accentClassName }) {
  const { count, elementRef } = useCountAnimation(value, 1500)

  return (
    <article ref={elementRef} className="min-w-[6rem] sm:min-w-[8.5rem] rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 sm:px-4 py-3 sm:py-4 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">{label}</p>
      <p className={`mt-2 text-xl sm:text-2xl font-semibold ${accentClassName}`}>{count}</p>
    </article>
  )
}

function StatsGridComponent({ totalCount, onlineCount, maintenanceCount, offlineCount }) {
  return (
    <div className="grid w-full gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 xl:w-[34rem] xl:grid-cols-4 xl:justify-end">
      <StatCard label="Total" value={totalCount} accentClassName="text-[color:var(--heading)]" />
      <StatCard label="Online" value={onlineCount} accentClassName="text-[color:var(--status-online)]" />
      <StatCard label="Maintenance" value={maintenanceCount} accentClassName="text-[color:var(--status-maintenance)]" />
      <StatCard label="Offline" value={offlineCount} accentClassName="text-[color:var(--status-offline)]" />
    </div>
  )
}

export const StatsGrid = memo(StatsGridComponent)