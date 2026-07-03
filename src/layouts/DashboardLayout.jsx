import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Navigation/Sidebar'
import Header from '../components/Navigation/Header'
import Footer from '../components/Navigation/Footer'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[var(--page-bg)] text-[var(--text)] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
