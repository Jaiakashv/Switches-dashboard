import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { useTheme } from '../hooks/useTheme'

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_34%),linear-gradient(180deg,var(--page-bg)_0%,var(--page-bg-alt)_100%)] flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <Outlet />
    </main>
  )
}
