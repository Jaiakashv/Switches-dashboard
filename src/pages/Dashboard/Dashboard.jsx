import { useMemo, useEffect, useState } from 'react'
import { StatsGrid } from '../../components/StatsGrid'
import { CircularProgressLoader } from '../../components/CircularProgressLoader'
import { useSwitches } from '../../hooks/useSwitches'
import { useCountAnimation } from '../../hooks/useCountAnimation'
import { Activity, Network, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function Dashboard() {
  const { switches, isLoading, reload } = useSwitches()
  const [showContent, setShowContent] = useState(false)

  // Load all switches for dashboard stats (no pagination limit)
  useEffect(() => {
    reload({ limit: 1000, offset: 0 })
  }, [reload])

  useEffect(() => {
    if (isLoading) setShowContent(false)
  }, [isLoading])

  const totalCount = switches.length
  const onlineCount = useMemo(() => switches.filter(s => s.status === 'Online').length, [switches])
  const maintenanceCount = useMemo(() => switches.filter(s => s.status === 'Maintenance').length, [switches])
  const offlineCount = useMemo(() => switches.filter(s => s.status === 'Offline').length, [switches])

  // Animated values for info cards
  const { count: activeClusters, elementRef: clustersRef } = useCountAnimation(12, 1500)
  const { count: globalUptime, elementRef: uptimeRef } = useCountAnimation(99.98, 1500, true)
  const { count: criticalAlerts, elementRef: alertsRef } = useCountAnimation(3, 1500)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">System status and quick metrics</p>
      </div>

      {!showContent ? (
        <CircularProgressLoader loading={isLoading} onComplete={() => setShowContent(true)} />
      ) : (
        <>
          <StatsGrid
            totalCount={totalCount}
            onlineCount={onlineCount}
            maintenanceCount={maintenanceCount}
            offlineCount={offlineCount}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            {/* Quick Actions / Info Cards */}
            <div ref={clustersRef} className="p-4 sm:p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                <Network className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">Active Clusters</p>
                <p className="text-lg sm:text-xl font-semibold">{activeClusters}</p>
              </div>
            </div>
            
            <div ref={uptimeRef} className="p-4 sm:p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-green-500/10 text-green-500 rounded-lg">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">Global Uptime</p>
                <p className="text-lg sm:text-xl font-semibold">{globalUptime}%</p>
              </div>
            </div>

            <div ref={alertsRef} className="p-4 sm:p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-red-500/10 text-red-500 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">Critical Alerts</p>
                <p className="text-lg sm:text-xl font-semibold">{criticalAlerts}</p>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">Security Status</p>
                <p className="text-lg sm:text-xl font-semibold">Optimal</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
