import { Link } from 'react-router-dom'
import { Network } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Network className="w-16 h-16 text-blue-500 mb-6 opacity-80" />
      <h1 className="text-6xl font-bold tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-[var(--text-muted)] max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. Check the URL or navigate back to the dashboard.
      </p>
      <Link 
        to="/dashboard"
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
