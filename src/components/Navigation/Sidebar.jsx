import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Network, LineChart, BellRing, Settings, User } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/switches', label: 'Switches', icon: Network },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/alerts', label: 'Alerts', icon: BellRing },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col transition-all">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <Network className="w-6 h-6 text-blue-500 mr-2" />
        <span className="font-semibold text-lg tracking-tight">NMS Pro</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-500 font-medium'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
        v2.0.0 Enterprise
      </div>
    </aside>
  )
}
