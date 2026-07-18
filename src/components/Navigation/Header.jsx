import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { ThemeToggle } from '../ThemeToggle'
import { LogOut, Menu, Bell, X } from 'lucide-react'
import { fetchAlerts } from '../../api/alertApi'
import { format } from 'date-fns'

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [alerts, setAlerts] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts()
        setAlerts(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
      } catch (err) {
        console.error('Failed to load alerts for notification')
      }
    }
    loadAlerts()
    
    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const openAlerts = alerts.filter(a => a.status === 'Open')
  const alertCount = openAlerts.length

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
          title="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:block text-sm">
          <span className="text-[var(--text-muted)]">Welcome,</span>{' '}
          <span className="font-medium">{user?.name}</span>
        </div>
        
        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg z-50">
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-semibold text-[var(--heading)]">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {openAlerts.length === 0 ? (
                  <div className="p-4 text-center text-[var(--text-muted)] text-sm">
                    No open alerts
                  </div>
                ) : (
                  openAlerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="p-4 border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.severity === 'Critical' ? 'bg-red-500' :
                          alert.severity === 'High' ? 'bg-orange-500' :
                          alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--heading)] truncate">
                            {alert.clusterName} - {alert.severity}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
                            {alert.message}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            Switch: {alert.switchId}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {format(new Date(alert.timestamp), 'PPpp')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {openAlerts.length > 5 && (
                <div className="p-3 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
                  And {openAlerts.length - 5} more alerts...
                </div>
              )}
            </div>
          )}
        </div>

        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
