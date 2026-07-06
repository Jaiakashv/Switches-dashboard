import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { ThemeToggle } from '../ThemeToggle'
import { LogOut, Menu } from 'lucide-react'

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

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
