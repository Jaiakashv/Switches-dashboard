import { useMemo } from 'react'
import { StatsGrid } from '../../components/StatsGrid'
import { useSwitches } from '../../hooks/useSwitches'
import { Activity, Network, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function Dashboard() {
  const { switches, isLoading } = useSwitches()

  const totalCount = switches.length
  const onlineCount = useMemo(() => switches.filter(s => s.status === 'Online').length, [switches])
  const maintenanceCount = useMemo(() => switches.filter(s => s.status === 'Maintenance').length, [switches])
  const offlineCount = useMemo(() => switches.filter(s => s.status === 'Offline').length, [switches])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">System status and quick metrics</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-400 rounded"></div>
              <div className="h-4 bg-blue-400 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <StatsGrid
            totalCount={totalCount}
            onlineCount={onlineCount}
            maintenanceCount={maintenanceCount}
            offlineCount={offlineCount}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* Quick Actions / Info Cards */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Active Clusters</p>
                <p className="text-xl font-semibold">12</p>
              </div>
            </div>
            
            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Global Uptime</p>
                <p className="text-xl font-semibold">99.98%</p>
              </div>
            </div>

            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Critical Alerts</p>
                <p className="text-xl font-semibold">3</p>
              </div>
            </div>

            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Security Status</p>
                <p className="text-xl font-semibold">Optimal</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
