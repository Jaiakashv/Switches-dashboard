import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Navigation/Sidebar'
import Header from '../components/Navigation/Header'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[var(--page-bg)] text-[var(--text)] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
