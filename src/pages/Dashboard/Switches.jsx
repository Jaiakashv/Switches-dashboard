import { useState, useCallback, useEffect } from 'react'
import { SearchBar } from '../../components/SearchBar'
import { SwitchTable } from '../../components/SwitchTable'
import { Pagination } from '../../components/Pagination'
import { useSwitches } from '../../hooks/useSwitches'
import { useDebounce } from '../../hooks/useDebounce'

const STATUS_OPTIONS = ['Online', 'Maintenance', 'Offline']
const PAGE_SIZE_OPTIONS = [5, 10, 15]

export default function Switches() {
  const [limit, setLimit] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [activeMenuId, setActiveMenuId] = useState(null)

  const offset = (currentPage - 1) * limit

  const { switches, isLoading, error, actionError, handleStatusChange, reload, total } = useSwitches()

  const totalPages = Math.max(1, Math.ceil(total / limit))

  useEffect(() => {
    reload({
      limit,
      offset,
      search: debouncedSearch.trim() || undefined
    })
  }, [limit, offset, debouncedSearch, reload])

  const handleSearchChange = useCallback((value) => {
    setSearch(value)
    setCurrentPage(1)
    setActiveMenuId(null)
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    setActiveMenuId(null)
  }, [])

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit)
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
        resultCount={total}
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <SwitchTable
          devices={switches}
          activeMenuId={activeMenuId}
          statusOptions={STATUS_OPTIONS}
          onToggleMenu={handleToggleMenu}
          onStatusChange={onStatusChange}
          onCloseMenu={() => setActiveMenuId(null)}
          isLoading={isLoading}
          errorMessage={error}
        />
        {!isLoading && !error && total > 0 && (
          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={handlePageChange}
            onPageSizeChange={handleLimitChange}
          />
        )}
      </div>
    </div>
  )
}
