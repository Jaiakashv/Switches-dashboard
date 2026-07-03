import { useState, useMemo, useCallback } from 'react'
import { SearchBar } from '../../components/SearchBar'
import { SwitchTable } from '../../components/SwitchTable'
import { Pagination } from '../../components/Pagination'
import { useSwitches } from '../../hooks/useSwitches'
import { useDebounce } from '../../hooks/useDebounce'

const STATUS_OPTIONS = ['Online', 'Maintenance', 'Offline']
const PAGE_SIZE = 5

export default function Switches() {
  const { switches, isLoading, error, actionError, handleStatusChange } = useSwitches()
  
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredSwitches = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return switches

    return switches.filter((device) => 
      device.model.toLowerCase().includes(query) ||
      device.id.toLowerCase().includes(query)
    )
  }, [debouncedSearch, switches])

  const totalPages = Math.max(1, Math.ceil(filteredSwitches.length / PAGE_SIZE))
  const visibleCount = filteredSwitches.length

  const paginatedSwitches = useMemo(() => {
    // Make sure current page is valid when filtering changes
    const validPage = Math.min(currentPage, totalPages)
    const startIndex = (validPage - 1) * PAGE_SIZE
    return filteredSwitches.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, totalPages, filteredSwitches])

  const handleSearchChange = useCallback((value) => {
    setSearch(value)
    setCurrentPage(1)
    setActiveMenuId(null)
  }, [])

  const handleToggleMenu = useCallback((deviceId) => {
    setActiveMenuId((current) => (current === deviceId ? null : deviceId))
  }, [])

  const onStatusChange = useCallback(async (deviceId, status) => {
    const success = await handleStatusChange(deviceId, status)
    if (success) {
      setActiveMenuId(null)
    }
  }, [handleStatusChange])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Switches Inventory</h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage and monitor network switches</p>
        </div>
      </div>

      {actionError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {actionError}
        </div>
      )}

      <SearchBar
        value={search}
        onChange={handleSearchChange}
        resultCount={visibleCount}
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <SwitchTable
          devices={paginatedSwitches}
          activeMenuId={activeMenuId}
          statusOptions={STATUS_OPTIONS}
          onToggleMenu={handleToggleMenu}
          onStatusChange={onStatusChange}
          onCloseMenu={() => setActiveMenuId(null)}
          isLoading={isLoading}
          errorMessage={error}
        />
        {!isLoading && !error && visibleCount > 0 && (
          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            totalPages={totalPages}
            totalItems={visibleCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page)
              setActiveMenuId(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
