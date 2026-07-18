import { useState, useEffect, useMemo } from 'react'
import { fetchAlerts, generateMockAlert, acknowledgeAlert } from '../../api/alertApi'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts()
      setAlerts(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } catch (err) {
      setError('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [])

  const handleGenerateAlert = async () => {
    try {
      await generateMockAlert()
      loadAlerts()
      toast.success('Added mock alert')
    } catch (err) {
      setError('Failed to generate alert')
      toast.error('Failed to generate alert')
    }
  }

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeAlert(id)
      loadAlerts()
    } catch (err) {
      setError('Failed to acknowledge alert')
    }
  }

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchSeverity = filterSeverity === 'All' || alert.severity === filterSeverity
      const matchStatus = filterStatus === 'All' || alert.status === filterStatus
      const matchSearch = searchTerm === '' || 
        alert.switchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.clusterName.toLowerCase().includes(searchTerm.toLowerCase())
      return matchSeverity && matchStatus && matchSearch
    })
  }, [alerts, filterSeverity, filterStatus, searchTerm])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'Low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  if (loading) return <div className="p-8">Loading alerts...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Alerts</h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Monitor and acknowledge cluster events</p>
        </div>
        <button 
          onClick={handleGenerateAlert}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Generate Mock Alert
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by switch ID or cluster..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-blue-500 flex-1"
        />
        <select 
          value={filterSeverity} 
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Severity Explanation */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm">
        <h3 className="font-semibold text-[var(--heading)] mb-2">Severity Levels</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[var(--text-muted)]">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-red-500/10 text-red-500 border-red-500/20 mb-1">Critical</span>
            <p className="text-xs">Immediate attention required - system failure or critical service down</p>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-orange-500/10 text-orange-500 border-orange-500/20 mb-1">High</span>
            <p className="text-xs">Urgent attention needed - service degradation or potential failure</p>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-yellow-500/10 text-yellow-500 border-yellow-500/20 mb-1">Medium</span>
            <p className="text-xs">Warning - performance issues or non-critical errors</p>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-blue-500/10 text-blue-500 border-blue-500/20 mb-1">Low</span>
            <p className="text-xs">Informational - minor issues or system notifications</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--surface-hover)]">
              <tr>
                <th className="px-6 py-4 font-medium text-[var(--text-muted)]">Severity</th>
                <th className="px-6 py-4 font-medium text-[var(--text-muted)]">Cluster</th>
                <th className="px-6 py-4 font-medium text-[var(--text-muted)]">Switch ID</th>
                <th className="px-6 py-4 font-medium text-[var(--text-muted)]">Message</th>
                <th className="px-6 py-4 font-medium text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 font-medium text-[var(--text-muted)]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)]">
                    No alerts found
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{alert.clusterName}</td>
                    <td className="px-6 py-4">{alert.switchId}</td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="truncate" title={alert.message || 'No message'}>
                        {alert.message || 'No message'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {alert.status === 'Resolved' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        )}
                        <span>{alert.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)] flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {format(new Date(alert.timestamp), 'PPpp')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
