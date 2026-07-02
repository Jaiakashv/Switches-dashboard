import { useCallback, useEffect, useMemo, useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { StatsGrid } from './components/StatsGrid'
import { SwitchTable } from './components/SwitchTable'
import { Pagination } from './components/Pagination'
import { ThemeToggle } from './components/ThemeToggle'
import { fetchSwitches, updateSwitchStatus } from './api/switchApi'

const THEME_KEY = 'switch-theme'
const STATUS_OPTIONS = ['Online', 'Maintenance', 'Offline']
const PAGE_SIZE = 5

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function getPreferredTheme() {
  if (!canUseStorage()) {
    return 'light'
  }

  const cachedTheme = localStorage.getItem(THEME_KEY)

  if (cachedTheme === 'light' || cachedTheme === 'dark') {
    return cachedTheme
  }

  return 'light'
}

function App() {
  const [switches, setSwitches] = useState([])
  const [search, setSearch] = useState('')
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [theme, setTheme] = useState(getPreferredTheme)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    if (!canUseStorage()) {
      return
    }

    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    let isMounted = true

    async function loadSwitches() {
      setIsLoading(true)
      setLoadError('')

      try {
        const data = await fetchSwitches()
        if (isMounted) {
          setSwitches(data)
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message || 'Failed to load switches.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSwitches()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredSwitches = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return switches
    }

    return switches.filter((device) => {
      return (
        device.model.toLowerCase().includes(query) ||
        device.id.toLowerCase().includes(query)
      )
    })
  }, [search, switches])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filteredSwitches.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages))
  }, [totalPages])

  const paginatedSwitches = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE

    return filteredSwitches.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, filteredSwitches])

  const totalCount = switches.length
  const visibleCount = filteredSwitches.length
  const onlineCount = useMemo(() => switches.filter((device) => device.status === 'Online').length, [switches])
  const maintenanceCount = useMemo(() => switches.filter((device) => device.status === 'Maintenance').length, [switches])
  const offlineCount = useMemo(() => switches.filter((device) => device.status === 'Offline').length, [switches])

  const handleSearchChange = useCallback((value) => {
    setSearch(value)
    setActiveMenuId(null)
  }, [])

  const handleToggleMenu = useCallback((deviceId) => {
    setActiveMenuId((currentValue) => (currentValue === deviceId ? null : deviceId))
  }, [])

  const handleStatusChange = useCallback((deviceId, status) => {
    async function saveStatus() {
      try {
        setActionError('')
        const updatedSwitch = await updateSwitchStatus(deviceId, status)

        setSwitches((currentSwitches) =>
          currentSwitches.map((device) =>
            device.id === deviceId ? updatedSwitch : device,
          ),
        )
      } catch (error) {
        setActionError(error.message || 'Failed to update switch status.')
      } finally {
        setActiveMenuId(null)
      }
    }

    saveStatus()
  }, [])

  const handleCloseMenu = useCallback(() => {
    setActiveMenuId(null)
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    setActiveMenuId(null)
  }, [])

  const handleThemeToggle = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_34%),linear-gradient(180deg,var(--page-bg)_0%,var(--page-bg-alt)_100%)] px-4 py-5 text-(--text) sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-2.5rem)] w-full flex-col gap-6">
        <header className="w-full border-b border-(--border) pb-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex rounded-full border border-(--accent-border) bg-(--accent-soft) px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-(--accent)">
                Switch inventory
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-(--heading) sm:text-4xl lg:text-5xl">
                  Manage network switches
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:items-end">
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
                <StatsGrid
                  totalCount={totalCount}
                  onlineCount={onlineCount}
                  maintenanceCount={maintenanceCount}
                  offlineCount={offlineCount}
                />
            </div>
          </div>
        </header>

        <section className="w-full space-y-5">
          {actionError ? (
            <div className="rounded-2xl border border-(--status-offline-border) bg-(--status-offline-soft) px-4 py-3 text-sm text-(--status-offline)">
              {actionError}
            </div>
          ) : null}

          <SearchBar
            value={search}
            onChange={handleSearchChange}
            resultCount={visibleCount}
          />

          <div className="overflow-hidden rounded-[1.35rem] border border-(--border) bg-(--surface) shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <SwitchTable
              devices={paginatedSwitches}
              activeMenuId={activeMenuId}
              statusOptions={STATUS_OPTIONS}
              onToggleMenu={handleToggleMenu}
              onStatusChange={handleStatusChange}
              onCloseMenu={handleCloseMenu}
              isLoading={isLoading}
              errorMessage={loadError}
            />
            {!isLoading && !loadError ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={visibleCount}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
