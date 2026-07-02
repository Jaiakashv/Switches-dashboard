import { memo } from 'react'

function StatCard({ label, value, accentClassName }) {
  return (
    <article className="min-w-[8.5rem] rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accentClassName}`}>{value}</p>
    </article>
  )
}

function StatsGridComponent({ totalCount, onlineCount, maintenanceCount, offlineCount }) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[34rem] xl:grid-cols-4 xl:justify-end">
      <StatCard label="Total" value={totalCount} accentClassName="text-[color:var(--heading)]" />
      <StatCard label="Online" value={onlineCount} accentClassName="text-[color:var(--status-online)]" />
      <StatCard label="Maintenance" value={maintenanceCount} accentClassName="text-[color:var(--status-maintenance)]" />
      <StatCard label="Offline" value={offlineCount} accentClassName="text-[color:var(--status-offline)]" />
    </div>
  )
}

export const StatsGrid = memo(StatsGridComponent)