import { useAuth } from '../../hooks/useAuth'
import { LogOut } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-[var(--text-muted)]">Welcome,</span>{' '}
          <span className="font-medium">{user?.name}</span>
        </div>
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
