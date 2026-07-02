import { memo } from 'react'

function PaginationComponent({ currentPage, totalPages, totalItems, pageSize, onPageChange }) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const visiblePages = []

  for (let page = 1; page <= totalPages; page += 1) {
    visiblePages.push(page)
  }

  return (
    <div className="flex flex-col gap-4 border-t border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[color:var(--muted)]">
        Showing <span className="font-semibold text-[color:var(--heading)]">{startItem}</span> to{' '}
        <span className="font-semibold text-[color:var(--heading)]">{endItem}</span> of{' '}
        <span className="font-semibold text-[color:var(--heading)]">{totalItems}</span> switches
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm font-medium text-[color:var(--heading)] transition hover:border-[color:var(--accent-border)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-10 rounded-full px-3 py-2 text-sm font-medium transition ${
              page === currentPage
                ? 'bg-(--accent) text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]'
                : 'border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--heading)] hover:border-[color:var(--accent-border)]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm font-medium text-[color:var(--heading)] transition hover:border-[color:var(--accent-border)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export const Pagination = memo(PaginationComponent)