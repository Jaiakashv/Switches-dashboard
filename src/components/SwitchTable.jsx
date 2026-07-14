import { memo, useState, useEffect } from 'react'
import { SwitchRow } from './SwitchRow'
import { Download, Plus, X, AlertTriangle } from 'lucide-react'
import { fetchSwitches } from '../api/switchApi'

function SwitchTableComponent({
  devices,
  activeMenuId,
  statusOptions,
  onToggleMenu,
  onStatusChange,
  onCloseMenu,
  isLoading,
  errorMessage,
  addSwitch,
  reload,
  searchTerm,
}) {
  const [isExporting, setIsExporting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    model: '',
    physicalDevice: '',
    id: '',
    config: '',
    status: 'Online'
  })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingIds, setExistingIds] = useState([])

  useEffect(() => {
    if (isModalOpen) {
      const loadAllIds = async () => {
        try {
          const response = await fetchSwitches({ limit: 100000, offset: 0 })
          const allDevices = response.data || response || []
          if (Array.isArray(allDevices)) {
            setExistingIds(allDevices.map(d => d.id || ''))
          }
        } catch (err) {
          console.error('Failed to load existing IDs for validation:', err)
        }
      }
      loadAllIds()
    }
  }, [isModalOpen])

  const isIdDuplicate = formData.id.trim() && existingIds.some(id => id.trim().toLowerCase() === formData.id.trim().toLowerCase())

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const response = await fetchSwitches({
        search: searchTerm?.trim() || undefined,
        limit: 100000,
        offset: 0
      })
      const allDevices = response.data || response || []
      
      if (!Array.isArray(allDevices) || allDevices.length === 0) {
        alert('No data available to export.')
        return
      }

      const headers = ['Model', 'Physical Device', 'ID', 'Config', 'Status']
      const rows = allDevices.map(device => [
        device.model || '',
        device.physicalDevice || '',
        device.id || '',
        device.config || '',
        device.status || ''
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `switches_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to export CSV:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    
    if (!formData.model.trim()) return setFormError('Model is required.')
    if (!formData.physicalDevice.trim()) return setFormError('Physical Device is required.')
    if (!formData.id.trim()) return setFormError('ID is required.')
    if (isIdDuplicate) return setFormError('A switch with this ID already exists.')
    if (!formData.config.trim()) return setFormError('Config is required.')
    if (!statusOptions.includes(formData.status)) return setFormError('Please select a valid status.')

    setIsSubmitting(true)
    try {
      const success = await addSwitch({
        model: formData.model.trim(),
        physicalDevice: formData.physicalDevice.trim(),
        id: formData.id.trim(),
        config: formData.config.trim(),
        status: formData.status
      })

      if (success) {
        setFormData({
          model: '',
          physicalDevice: '',
          id: '',
          config: '',
          status: 'Online'
        })
        setIsModalOpen(false)
        if (reload) reload()
      } else {
        setFormError('Failed to add switch. Please check if ID is unique.')
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border)] p-4 bg-[var(--surface-muted)]">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Devices List
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Switch
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
        <table className="min-w-[600px] w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            <tr>
              <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">Model</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium hidden sm:table-cell">Physical Device</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">ID</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium hidden md:table-cell">Config</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">Status</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {isLoading ? (
              <tr>
                <td className="px-3 sm:px-5 py-8 sm:py-12 text-center text-[var(--muted)]" colSpan={6}>
                  Loading switches from Redis...
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td className="px-3 sm:px-5 py-8 sm:py-12 text-center text-[var(--status-offline)]" colSpan={6}>
                  {errorMessage}
                </td>
              </tr>
            ) : devices.length > 0 ? (
              devices.map((device) => (
                <SwitchRow
                  key={device.id}
                  device={device}
                  isMenuOpen={activeMenuId === device.id}
                  statusOptions={statusOptions}
                  onToggleMenu={onToggleMenu}
                  onStatusChange={onStatusChange}
                  onCloseMenu={onCloseMenu}
                />
              ))
            ) : (
              <tr>
                <td className="px-3 sm:px-5 py-8 sm:py-12 text-center text-[var(--muted)]" colSpan={6}>
                  No switches match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Switch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6 animate-backdrop">
          <div className="w-full max-w-lg rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl flex flex-col max-h-full overflow-hidden animate-modal">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--heading)]">Add New Switch</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Enter details to register a new network switch</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  setFormError('')
                }}
                className="rounded-xl p-2 text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              {formError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs sm:text-sm text-red-500">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">Switch ID / Serial</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleFormChange}
                  placeholder="e.g. SW-009"
                  className={`w-full rounded-xl border ${isIdDuplicate ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20' : 'border-[var(--border)] focus:border-[var(--accent-border)] focus:ring-[var(--accent-soft)]'} bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--heading)] outline-none transition placeholder:text-[var(--muted)] focus:ring-4`}
                  required
                />
                {isIdDuplicate && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-red-500 font-semibold animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>This serial ID already exists</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleFormChange}
                    placeholder="e.g. Cisco Catalyst 9300"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--heading)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">Physical Device</label>
                  <input
                    type="text"
                    name="physicalDevice"
                    value={formData.physicalDevice}
                    onChange={handleFormChange}
                    placeholder="e.g. gi1/0/24"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--heading)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">Config / Description</label>
                <textarea
                  name="config"
                  value={formData.config}
                  onChange={handleFormChange}
                  placeholder="e.g. VLAN 10, Port 1-24 Active"
                  rows={3}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--heading)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[var(--accent-soft)] resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--heading)] outline-none transition focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setFormError('')
                  }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-hover)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isIdDuplicate}
                  className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Adding...' : 'Add Switch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export const SwitchTable = memo(SwitchTableComponent)