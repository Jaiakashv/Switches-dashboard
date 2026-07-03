import { memo } from 'react'

function PaginationComponent({ currentPage, totalPages, totalItems, pageSize, pageSizeOptions = [5, 10, 15], onPageChange, onPageSizeChange }) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Show limited page numbers on mobile
  const visiblePages = []
  const maxVisiblePages = window.innerWidth < 640 ? 3 : 7 // 3 on mobile, 7 on desktop
  
  if (totalPages <= maxVisiblePages) {
    for (let page = 1; page <= totalPages; page += 1) {
      visiblePages.push(page)
    }
  } else {
    if (currentPage <= 2) {
      for (let page = 1; page <= 3; page += 1) visiblePages.push(page)
      visiblePages.push('...')
      visiblePages.push(totalPages)
    } else if (currentPage >= totalPages - 1) {
      visiblePages.push(1)
      visiblePages.push('...')
      for (let page = totalPages - 2; page <= totalPages; page += 1) visiblePages.push(page)
    } else {
      visiblePages.push(1)
      visiblePages.push('...')
      visiblePages.push(currentPage)
      visiblePages.push('...')
      visiblePages.push(totalPages)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 border-t border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 sm:px-4 py-3 sm:py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs sm:text-sm text-[color:var(--muted)]">
          Showing <span className="font-semibold text-[color:var(--heading)]">{startItem}</span> to{' '}
          <span className="font-semibold text-[color:var(--heading)]">{endItem}</span> of{' '}
          <span className="font-semibold text-[color:var(--heading)]">{totalItems}</span> switches
        </p>
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-[color:var(--muted)]">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-[color:var(--heading)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[color:var(--heading)] transition hover:border-[color:var(--accent-border)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        {visiblePages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-2 text-[color:var(--muted)]">...</span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-8 sm:min-w-10 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition ${
                page === currentPage
                  ? 'bg-(--accent) text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]'
                  : 'border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--heading)] hover:border-[color:var(--accent-border)]'
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[color:var(--heading)] transition hover:border-[color:var(--accent-border)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export const Pagination = memo(PaginationComponent)